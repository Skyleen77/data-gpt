import type { OpenAIApi } from 'openai';

interface CompletionResponse {
  status: number;
  error?: string;
  data?: string;
}

let embeddingStore: Record<string, any> = {};
let embeddedQuestion: any;

const createPrompt = (question: string, paragraphs: string[]): string =>
  `Answer the following question, also use your own knowledge when necessary :

Context :
${paragraphs.join('\n\n')}

Question :
${question}?

Answer :`;

const extractParagraphFromKey = (key: string, storagePrefix: string): string =>
  key.substring(storagePrefix.length);

const calculateDotProduct = (
  embedding1: number[],
  embedding2: number[],
): number =>
  embedding1
    .slice(0, embedding2.length)
    .reduce(
      (dotProduct, val, index) => dotProduct + val * embedding2[index],
      0,
    );

const findClosestParagraphs = (
  questionEmbedding: number[],
  count: number,
  storagePrefix: string,
): string[] => {
  const scores = Object.keys(embeddingStore).map((key) => ({
    paragraph: extractParagraphFromKey(key, storagePrefix),
    score: calculateDotProduct(
      questionEmbedding,
      JSON.parse(embeddingStore[key]).embedding,
    ),
  }));

  return scores
    .sort((a, b) => b.score - a.score)
    .slice(0, count)
    .map((item) => item.paragraph);
};

export const completion = async (
  openai: OpenAIApi,
  prompt: string,
  embeddedFile: string,
  {
    maxTokens = 100,
    debug = false,
    storagePrefix = 'embeds:',
    embeddingModel = 'text-embedding-ada-002',
    completionModel = 'gpt-3.5-turbo',
  } = {},
): Promise<CompletionResponse> => {
  if (debug) {
    console.log(`Start completion with prompt : ${prompt}`);
  }

  const startTime: number = Date.now();

  embeddingStore = JSON.parse(embeddedFile);

  try {
    const embeddedQuestionResponse = await openai.createEmbedding({
      input: prompt,
      model: embeddingModel,
    });

    if (embeddedQuestionResponse.data.data.length) {
      embeddedQuestion = embeddedQuestionResponse.data.data[0].embedding;
    } else {
      return {
        status: 500,
        error: `Question not embedded properly`,
      };
    }

    const closestParagraphs = findClosestParagraphs(
      embeddedQuestion,
      5,
      storagePrefix,
    );

    const completionData = await openai.createChatCompletion({
      model: completionModel,
      messages: [
        {
          role: 'user',
          content: createPrompt(prompt, closestParagraphs),
        },
      ],
      max_tokens: maxTokens,
      temperature: 0,
    });

    const completionTime: number = Date.now();

    const choice = completionData.data.choices?.[0]?.message;

    if (!choice) {
      return {
        status: 500,
        error: `No answer gotten`,
      };
    }

    if (debug) {
      console.log(`Completion finished`);
      console.log(
        `Time taken : ${(completionTime - startTime) / 1000} seconds`,
      );
    }

    return {
      status: 200,
      data: choice.content.trim(),
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
        error: `Error with OpenAI API request: ${error.message}`,
      };
    }
  }
};
