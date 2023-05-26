import type { OpenAIApi } from 'openai';
interface CompletionResponse {
    status: number;
    error?: string;
    data?: string;
}
export declare const completion: (openai: OpenAIApi, prompt: string, embeddedFile: string, { maxTokens, debug, storagePrefix, embeddingModel, completionModel, }?: {
    maxTokens?: number | undefined;
    debug?: boolean | undefined;
    storagePrefix?: string | undefined;
    embeddingModel?: string | undefined;
    completionModel?: string | undefined;
}) => Promise<CompletionResponse>;
export {};
