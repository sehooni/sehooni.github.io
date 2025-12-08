const fs = require('fs');
const path = require('path');

const postsDirectory = path.join(process.cwd(), 'content/posts');

function getAllSlugs() {
    const slugs = [];
    function traverse(dir) {
        const files = fs.readdirSync(dir);
        for (const file of files) {
            const fullPath = path.join(dir, file);
            if (fs.statSync(fullPath).isDirectory()) {
                traverse(fullPath);
            } else if (file.endsWith('.md')) {
                const relativeDir = path.relative(postsDirectory, dir);
                // Simulate slug generation logic
                const category = relativeDir || 'uncategorized';
                const fileName = file.replace(/\.md$/, '');
                const titleMatch = fileName.match(/^\d{4}-\d{2}-\d{2}-(.*)$/);
                const titleSlug = titleMatch ? titleMatch[1] : fileName;

                const categorySegments = category !== 'uncategorized' ? category.split(path.sep) : ['uncategorized'];
                const slug = [...categorySegments, titleSlug].join('/');
                slugs.push(slug);
            }
        }
    }
    traverse(postsDirectory);
    return slugs;
}

console.log("Detected Slugs:");
const slugs = getAllSlugs();
slugs.forEach(s => console.log(s));
console.log(`Total: ${slugs.length}`);
