const fs = require('fs');
const path = require('path');

const start = Date.now();

//Generate a words.js file of all words that are n letters from words.txt
const n = 5;

//Filter all words so that it only contains words with a length of n
const text = fs.readFileSync(path.join(__dirname, 'words.txt'), 'utf8');
let words = text.split(/\n/g);
words = words.filter(w => w.length === n);

//Wrap each text in single quotes
words = words.map(w => `'${w.toLowerCase()}'`);

//Put it into the template string
const final = `module.exports=[${words.join(',')}];`;
const outPath = path.join(__dirname, 'words.js');
fs.writeFileSync(outPath, final, 'utf8');
const end = Date.now();
console.log(`Wrote ${words.length} words to ${outPath} in ${end-start}ms`)