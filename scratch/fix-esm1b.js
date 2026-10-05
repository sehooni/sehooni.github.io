const fs = require('fs');
const path = require('path');

const filePath = path.join(process.cwd(), 'content/posts/PaperReview/2026-06-07-ESM-1b-biological-structure-and-function-from-unsupervised-learning.md');
let text = fs.readFileSync(filePath, 'utf8');

// 1. Fix pipe inside table cells: |i-j| -> \vert i-j \vert
text = text.replace(/\|i-j\|/g, '\\vert i-j \\vert');

// 2. Fix punctuation-bold patterns: **...[punct]**[korean] -> <strong>...[punct]</strong>[korean]
text = text.replace(/\*\*([^*\n]+[\)"'%?!])\*\*([가-힣])/g, '<strong>$1</strong>$2');

fs.writeFileSync(filePath, text, 'utf8');
console.log('Fixed table pipes and bold patterns in ESM-1b.');
