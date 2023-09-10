import { createModeration } from '#lib/openai';
import { ApplyOptions } from '@sapphire/decorators';
import { Command } from '@sapphire/framework';
import { PermissionFlagsBits } from 'discord.js';

@ApplyOptions<Command.Options>({
	description: 'A basic slash command'
})
export class UserCommand extends Command {
	public override registerApplicationCommands(registry: Command.Registry) {
		registry.registerChatInputCommand((builder) =>
			builder //
				.setName(this.name)
				.setDescription(this.description)
				.addStringOption((option) => option.setName('input').setDescription('The text you want to moderate').setRequired(true))
				.setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
		);
	}

	public override async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
		const input = interaction.options.getString('input', true);

		const output = await createModeration(input);

		interaction.reply({ content: `\`\`\`json\n${JSON.stringify(output, null, 2)}\`\`\`` });
	}
}
