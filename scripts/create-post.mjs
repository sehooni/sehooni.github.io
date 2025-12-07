import fs from 'fs';
import path from 'path';
import readline from 'readline';

const POSTS_DIR = path.join(process.cwd(), 'content/posts');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

async function createPost() {
    console.log('📝 Create a New Blog Post');
    console.log('-------------------------');

    const title = await question('Enter post title: ');
    if (!title) {
        console.error('Title is required!');
        rl.close();
        return;
    }

    const category = await question('Enter category (default: "Blog"): ') || 'Blog';

    // Create date string YYYY-MM-DD
    const date = new Date().toISOString().split('T')[0];

    // Create slug from title
    const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');

    // Filename: YYYY-MM-DD-slug.md
    const filename = `${date}-${slug}.md`;

    // Ensure category directory exists
    const categoryDir = path.join(POSTS_DIR, category);
    if (!fs.existsSync(categoryDir)) {
        fs.mkdirSync(categoryDir, { recursive: true });
        console.log(`Created new category directory: ${category}`);
    }

    const filePath = path.join(categoryDir, filename);

    const content = `---
title: "${title}"
date: "${date}"
category: "${category}"
---

Write your content here...
`;

    fs.writeFileSync(filePath, content);

    console.log('\n✅ Post created successfully!');
    console.log(`File: content/posts/${category}/${filename}`);

    rl.close();
}

createPost();
