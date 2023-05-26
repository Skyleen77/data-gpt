<div align="center">
<h1>DataGPT</h1>

<p>Use the power of ChatGPT with your own data</p>
</div>

## Table of Contents

- [Getting started](#getting-started)
  - [Install](#install)
  - [Import](#import)
  - [Use](#use)
- [Options](#options)
  - [embedding()](#embedding)
  - [completion()](#completion)
- [Issues](#issues)
- [LICENSE](#license)

## Getting started

### Install

```bash
npm install data-gpt
```

or

```bash
yarn add data-gpt
```

### Import

```typescript
import { embedding, completion } from 'data-gpt';
```

or

```typescript
const { embedding, completion } = require('data-gpt');
```

### Use

First configure your OpenAI API instance.

```typescript
import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

export const openai = new OpenAIApi(configuration);
```

Then, pass it as the first parameter of the functions.

```typescript
import { openai } from './your-openai-config-file';

const source = 'your-text-to-embed';

const embed = embedding({ openai, source });

const prompt = 'your-prompt';

const complete = completion({ openai, prompt, embed });
```

## Options

### embedding()

#### openai _(required)_ - OpenAIApi

Your OpenAI API instance.

#### source _(required)_ - string

The text to embed.

#### debug _(optional)_ - boolean

Set to true to enable the debug mode.
**Default: false**

#### storagePrefix _(optional)_ - string

The prefix to use for the storage key.
**Default: 'embeds'**

#### model _(optional)_ - string

The OpenAI model to use for embedding.
**Default: 'text-embedding-ada-002'**

### completion()

#### openai _(required)_ - OpenAIApi

Your OpenAI API instance.

#### prompt _(required)_ - string

The prompt to complete.

#### embed _(required)_ - string

The embedded text (the result of the embedding function).

#### maxTokens _(optional)_ - number

The maximum number of tokens to generate.
**Default: 100**

#### debug _(optional)_ - boolean

Set to true to enable the debug mode.
**Default: false**

#### storagePrefix _(optional)_ - string

The prefix to use for the storage key.
**Default: 'embeds'**
_(/!\ Use the same storagePrefix as used in the embedding function)_

#### embeddingModel _(optional)_ - string

The OpenAI model to use for embedding.
**Default: 'text-embedding-ada-002'**
_(/!\ Use the same model as used in the embedding function)_

#### completionModel _(optional)_ - string

The OpenAI model to use for chat completion.
**Default: 'gpt-3.5-turbo'**

## Issues

Please file an issue for bugs, missing documentation, or unexpected behavior.

[File an issue](https://github.com/Skyleen77/data-gpt/issues)

## LICENSE

MIT
