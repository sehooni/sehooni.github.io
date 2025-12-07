const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const POSTS_DIR = path.join(__dirname, '../content/posts');

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

(async () => {
    try {
        const title = await question('Post Title: ');
        const category = await question('Category (default: General): ') || 'General';

        const date = new Date();
        const dateStr = date.toISOString().split('T')[0]; // YYYY-MM-DD
        const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
        const filename = `${dateStr}-${slug}.md`;

        // Create category directory if it doesn't exist
        const categoryDir = path.join(POSTS_DIR, category);
        if (!fs.existsSync(categoryDir)) {
            fs.mkdirSync(categoryDir, { recursive: true });
        }

        const filePath = path.join(categoryDir, filename);

        const template = `---
title: "${title}"
date: "${date.toISOString()}"
category: ${category}
---

Write your content here...

![Image Description](/assets/images/example.png)
`;

        fs.writeFileSync(filePath, template);
        console.log(`\n✅ Post created successfully at:\n${filePath}`);

    } catch (error) {
        console.error('Error creating post:', error);
    } finally {
        rl.close();
    }
})();
