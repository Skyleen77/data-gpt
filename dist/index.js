'use strict';

const embeddingStore$1 = {};
const MIN_WORDS_IN_PARAGRAPH = 5;
const embedding = async ({ openai, source, debug = false, storagePrefix = 'embeds:', model = 'text-embedding-ada-002', }) => {
    if (debug) {
        console.log('Generating Embedding');
    }
    const paragraphs = source
        .split(/\n\s*\n/)
        .map((para) => para.trim().replaceAll('\n', ' ').replace(/\r/g, ''))
        .filter((para) => para.charAt(para.length - 1) !== '?' &&
        para.split(/\s+/).length >= MIN_WORDS_IN_PARAGRAPH);
    const totalParagraphs = paragraphs.length;
    const startTime = Date.now();
    try {
        if (debug) {
            console.log('Sent file over to OpenAI');
        }
        const response = await openai.createEmbedding({
            input: paragraphs,
            model,
        });
        const completionTime = Date.now();
        if (response.data.data.length >= totalParagraphs) {
            for (let i = 0; i < totalParagraphs; i++) {
                embeddingStore$1[`${storagePrefix}${paragraphs[i]}`] = JSON.stringify({
                    embedding: response.data.data[i].embedding,
                    created: startTime,
                });
            }
        }
        if (debug) {
            console.log('Embedding finished');
            console.log(`Time taken : ${(completionTime - startTime) / 1000} seconds`);
        }
        return {
            status: 200,
            data: embeddingStore$1,
        };
    }
    catch (error) {
        if (debug) {
            console.error(error);
        }
        if (error.response) {
            return {
                status: error.response.status,
                error: error.response.data,
            };
        }
        else {
            return {
                status: 500,
                error: `Error generating embedding: ${error.message}`,
            };
        }
    }
};

let embeddingStore = {};
let embeddedQuestion;
const createPrompt = (question, paragraphs) => `Answer the following question, also use your own knowledge when necessary :

Context :
${paragraphs.join('\n\n')}

Question :
${question}?

Answer :`;
const extractParagraphFromKey = (key, storagePrefix) => key.substring(storagePrefix.length);
const calculateDotProduct = (embedding1, embedding2) => embedding1
    .slice(0, embedding2.length)
    .reduce((dotProduct, val, index) => dotProduct + val * embedding2[index], 0);
const findClosestParagraphs = (questionEmbedding, count, storagePrefix) => {
    const scores = Object.keys(embeddingStore).map((key) => ({
        paragraph: extractParagraphFromKey(key, storagePrefix),
        score: calculateDotProduct(questionEmbedding, JSON.parse(embeddingStore[key]).embedding),
    }));
    return scores
        .sort((a, b) => b.score - a.score)
        .slice(0, count)
        .map((item) => item.paragraph);
};
const completion = async ({ openai, prompt, embed, maxTokens = 100, debug = false, storagePrefix = 'embeds:', embeddingModel = 'text-embedding-ada-002', completionModel = 'gpt-3.5-turbo', }) => {
    if (debug) {
        console.log(`Start completion with prompt : ${prompt}`);
    }
    const startTime = Date.now();
    embeddingStore = JSON.parse(embed);
    try {
        const embeddedQuestionResponse = await openai.createEmbedding({
            input: prompt,
            model: embeddingModel,
        });
        if (embeddedQuestionResponse.data.data.length) {
            embeddedQuestion = embeddedQuestionResponse.data.data[0].embedding;
        }
        else {
            return {
                status: 500,
                error: `Question not embedded properly`,
            };
        }
        const closestParagraphs = findClosestParagraphs(embeddedQuestion, 5, storagePrefix);
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
        const completionTime = Date.now();
        const choice = completionData.data.choices?.[0]?.message;
        if (!choice) {
            return {
                status: 500,
                error: `No answer gotten`,
            };
        }
        if (debug) {
            console.log(`Completion finished`);
            console.log(`Time taken : ${(completionTime - startTime) / 1000} seconds`);
        }
        return {
            status: 200,
            data: choice.content.trim(),
        };
    }
    catch (error) {
        if (debug) {
            console.error(error);
        }
        if (error.response) {
            return {
                status: error.response.status,
                error: error.response.data,
            };
        }
        else {
            return {
                status: 500,
                error: `Error with OpenAI API request: ${error.message}`,
            };
        }
    }
};

exports.completion = completion;
exports.embedding = embedding;
//# sourceMappingURL=index.js.map
