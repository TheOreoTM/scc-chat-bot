import { ApplyOptions } from '@sapphire/decorators';
import { Events, Listener } from '@sapphire/framework';
import { type Message } from 'discord.js';
import { BotPrefix, ChannelIDs, SystemPrompt } from '#constants';
import { createCompletion } from '#lib/openai';
import type { CreateChatCompletionRequestMessage } from 'openai/resources/chat/completions';

@ApplyOptions<Listener.Options>({ event: Events.MessageCreate })
export class UserEvent extends Listener {
	public override async run(message: Message) {
		if (message.author.bot || !ChannelIDs.includes(message.channel.id) || message.content.startsWith(BotPrefix)) return;

		const conversationLog: CreateChatCompletionRequestMessage[] = [
			{
				role: 'system',
				content: SystemPrompt
			}
		];

		await message.channel.sendTyping();

		const prevMessages = (await message.channel.messages.fetch({ limit: 8 })).reverse();

		prevMessages.forEach((msg) => {
			if (msg.content.startsWith(BotPrefix)) return;
			if (msg.author.id !== message.client.user.id && msg.author.bot) return;

			const isBot = msg.author.id === message.client.user.id;

			conversationLog.push({
				role: isBot ? 'assistant' : 'user',
				name: isBot ? 'me' : message.author.username,
				content: msg.content.slice(0, 200)
			});
		});

		const completion = await createCompletion({ messages: conversationLog, model: 'gpt-3.5-turbo', max_tokens: 50 });

		message.reply({
			content: completion.choices[0].message.content?.toLowerCase()?.replace('skittle-chan:', '') || 'Hey',
			// embeds: [
			// 	new EmbedBuilder().setFooter({
			// 		text: `DEBUG: Used ${completion.usage?.total_tokens} total_tokens, ${completion.usage?.prompt_tokens} prompt_tokens and ${completion.usage?.completion_tokens} completion_tokens`
			// 	})
			// ],
			allowedMentions: {
				parse: []
			}
		});
	}
}
