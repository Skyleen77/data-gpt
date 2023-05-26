import type { OpenAIApi } from 'openai';
interface EmbeddingResponse {
    status: number;
    error?: string;
    data?: Record<string, any>;
}
interface EmbeddingOptions {
    openai: OpenAIApi;
    source: string;
    debug?: boolean;
    storagePrefix?: string;
    model?: string;
}
export declare const embedding: ({ openai, source, debug, storagePrefix, model, }: EmbeddingOptions) => Promise<EmbeddingResponse>;
export {};
