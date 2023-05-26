<div align="center">
<h1>DataGPT</h1>

<p>Use the power of ChatGPT with your own data</p>
</div>

## Table of Contents

- [Getting started](#getting-started)
  - [Install](#install)
  - [Import](#import)
  - [Use](#use)
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

## Issues

Please file an issue for bugs, missing documentation, or unexpected behavior.

[File an issue](https://github.com/Skyleen77/data-gpt/issues)

## LICENSE

MIT
