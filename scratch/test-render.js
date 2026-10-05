const fs = require('fs');
const path = require('path');
const React = require('react');
const ReactDOMServer = require('react-dom/server');

async function checkFile(filePath) {
    const matter = (await import('gray-matter')).default;
    const ReactMarkdown = (await import('react-markdown')).default;
    const remarkGfm = (await import('remark-gfm')).default;
    const remarkBreaks = (await import('remark-breaks')).default;
    const remarkMath = (await import('remark-math')).default;
    const rehypeRaw = (await import('rehype-raw')).default;
    const rehypeKatex = (await import('rehype-katex')).default;

    const fileContent = fs.readFileSync(filePath, 'utf8');
    const { content } = matter(fileContent);

    const element = React.createElement(ReactMarkdown, {
        remarkPlugins: [remarkGfm, remarkBreaks, remarkMath],
        rehypePlugins: [rehypeRaw, rehypeKatex],
        children: content
    });

    const html = ReactDOMServer.renderToStaticMarkup(element);
    const noCode = html.replace(/<pre[\s\S]*?<\/pre>/g, '').replace(/<code[\s\S]*?<\/code>/g, '');

    const regex = /\*\*[^*]+\*\*/g;
    let match;
    const unrendered = [];
    while ((match = regex.exec(noCode)) !== null) {
        unrendered.push(match[0]);
    }
    return unrendered;
}

async function main() {
    const f = 'content/posts/PaperReview/2026-06-22-ESM-2-and-ESMFold-atomic-level-protein-structure-prediction.md';
    const p = path.join(process.cwd(), f);
    const list = await checkFile(p);
    console.log(`\n=== File: ${path.basename(f)} ===`);
    if (list.length === 0) {
        console.log('All bold text rendered correctly!');
    } else {
        console.log(`Found ${list.length} unrendered bold items:`);
        list.forEach(item => console.log(' - ' + item));
    }
}

main().catch(console.error);
