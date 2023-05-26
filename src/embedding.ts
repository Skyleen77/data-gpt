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

const embeddingStore: Record<string, any> = {};
const MIN_WORDS_IN_PARAGRAPH = 5;

export const embedding = async ({
  openai,
  source,
  debug = false,
  storagePrefix = 'embeds',
  model = 'text-embedding-ada-002',
}: EmbeddingOptions): Promise<EmbeddingResponse> => {
  if (debug) {
    console.log('Generating Embedding');
  }

  const paragraphs: string[] = source
    .split(/\n\s*\n/)
    .map((para) => para.trim().replaceAll('\n', ' ').replace(/\r/g, ''))
    .filter(
      (para) =>
        para.charAt(para.length - 1) !== '?' &&
        para.split(/\s+/).length >= MIN_WORDS_IN_PARAGRAPH,
    );

  const totalParagraphs: number = paragraphs.length;
  const startTime: number = Date.now();

  try {
    if (debug) {
      console.log('Sent file over to OpenAI');
    }

    const response = await openai.createEmbedding({
      input: paragraphs,
      model,
    });

    const completionTime: number = Date.now();

    if (response.data.data.length >= totalParagraphs) {
      for (let i = 0; i < totalParagraphs; i++) {
        embeddingStore[`${storagePrefix}:${paragraphs[i]}`] = JSON.stringify({
          embedding: response.data.data[i].embedding,
          created: startTime,
        });
      }
    }

    if (debug) {
      console.log('Embedding finished');
      console.log(
        `Time taken : ${(completionTime - startTime) / 1000} seconds`,
      );
    }

    return {
      status: 200,
      data: embeddingStore,
    };
  } catch (error: any) {
    if (debug) {
      console.error(error);
    }

    if (error.response) {
      return {
        status: error.response.status,
        error: error.response.data,
      };
    } else {
      return {
        status: 500,
        error: `Error generating embedding: ${error.message}`,
      };
    }
  }
};
