const fs = require('fs');
const path = require('path');

const filePath = path.join(process.cwd(), 'content/posts/PaperReview/2026-06-12-Transformer-protein-language-models-unsupervised-structure-learners.md');
let text = fs.readFileSync(filePath, 'utf8');

// Fix punctuation bold
text = text.replace(/\*\*([^*\n]+[\)"'%?!])\*\*([가-힣])/g, '<strong>$1</strong>$2');

fs.writeFileSync(filePath, text, 'utf8');
console.log('Fixed bold in Post 2.');
