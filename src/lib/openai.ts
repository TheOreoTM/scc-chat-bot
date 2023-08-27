import { OpenAI } from 'openai';
import { envParseString } from '@skyra/env-utilities';
import type { CompletionCreateParamsNonStreaming } from 'openai/resources/chat/completions';
import type { RequestOptions } from 'openai/core';

const openai = new OpenAI({
	apiKey: envParseString('API_KEY')
});

export const createCompletion = async (body: CompletionCreateParamsNonStreaming, options?: RequestOptions) =>
	openai.chat.completions.create(body, options);

export const createModeration = async (input: string) => openai.moderations.create({ input });
