const { embedding } = require('../dist');
const { openai } = require('../lib');
const fs = require('fs');

const rawText = fs.readFileSync('./demo/sourceFile.txt', {
  encoding: 'utf-8',
  flag: 'r',
});

embedding({
  openai,
  source: rawText,
  debug: true,
}).then((embed) => {
  if (embed.status === 200) {
    fs.writeFileSync('./demo/embeddedFile.txt', JSON.stringify(embed.data));
  } else {
    console.log('Error: ', embed.status, embed.error || '');
  }
});
