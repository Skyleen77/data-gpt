const { completion } = require('../dist');
const { openai } = require('../lib');
const fs = require('fs');

const embed = fs.readFileSync('./demo/embeddedFile.txt', {
  encoding: 'utf-8',
  flag: 'r',
});

completion({
  openai,
  prompt: 'How much is OpenAI valued at?',
  embed,
  debug: true,
}).then((complete) => {
  if (complete.status === 200) {
    console.log(complete.data);
  } else {
    console.log('Error: ', complete.status, complete.error || '');
  }
});
