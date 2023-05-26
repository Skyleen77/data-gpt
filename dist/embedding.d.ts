import type { OpenAIApi } from 'openai';
interface EmbeddingResponse {
    status: number;
    error?: string;
    data?: Record<string, any>;
}
export declare const embedding: (openai: OpenAIApi, source: string, { debug, storagePrefix, model, }?: {
    debug?: boolean | undefined;
    storagePrefix?: string | undefined;
    model?: string | undefined;
}) => Promise<EmbeddingResponse>;
export {};
