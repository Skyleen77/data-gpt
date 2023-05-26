import type { OpenAIApi } from 'openai';
interface CompletionResponse {
    status: number;
    error?: string;
    data?: string;
}
interface CompletionOptions {
    openai: OpenAIApi;
    prompt: string;
    embed: string;
    maxTokens?: number;
    debug?: boolean;
    storagePrefix?: string;
    embeddingModel?: string;
    completionModel?: string;
}
export declare const completion: ({ openai, prompt, embed, maxTokens, debug, storagePrefix, embeddingModel, completionModel, }: CompletionOptions) => Promise<CompletionResponse>;
export {};
