const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const postsDirectory = path.join(process.cwd(), 'content/posts');
const publicDirectory = path.join(process.cwd(), 'public');
const mapFile = path.join(publicDirectory, 'post-map.json');

// Mappings: lowercase key -> canonical path (e.g., "/Category/Title")
// We will map:
// 1. Title slug only (lowercase) -> canonical URL
// 2. Full legacy path match (lowercase) -> canonical URL
// 3. Last segment of path (lowercase) -> canonical URL
const postMap = {};

function traverseDirectory(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            traverseDirectory(fullPath);
        } else if (file.endsWith('.md')) {
            const relativeDir = path.relative(postsDirectory, dir);
            // Relative dir might be empty, or "Proteomics", or "DL_ML/NLP"

            // Canonical Category segments
            // Use path separators to split and rejoin to ensure consistency? 
            // On Windows path.sep is \, we want URL /
            const categorySegments = relativeDir ? relativeDir.split(path.sep) : [];
            const categoryUrl = categorySegments.join('/');

            // Filename processing
            const fileName = file.replace(/\.md$/, '');
            const titleMatch = fileName.match(/^\d{4}-\d{2}-\d{2}-(.*)$/);
            const titleSlug = titleMatch ? titleMatch[1] : fileName;

            const canonicalSlug = categoryUrl ? `${categoryUrl}/${titleSlug}` : titleSlug;
            const canonicalUrl = `/${canonicalSlug}`;

            // Add mappings

            // 1. Exact lowercase title match (useful for /year/month/day/title legacy URLs where we extract title)
            // e.g. "percolator" -> "/Proteomics/Percolator"
            postMap[titleSlug.toLowerCase()] = canonicalUrl;

            // 2. Lowercase full path match
            // e.g. "proteomics/percolator" -> "/Proteomics/Percolator"
            postMap[canonicalSlug.toLowerCase()] = canonicalUrl;

            // 3. Handle specific legacy logic if needed (e.g. nested categories flattened?)
            // If legacy URL is /proteomics/Percolator, extracted slug is "proteomics/percolator".
            // If new URL is /Proteomics/Percolator.
            // map["proteomics/percolator"] works.
        }
    }
}

console.log("Generating post map...");
traverseDirectory(postsDirectory);

if (!fs.existsSync(publicDirectory)) {
    fs.mkdirSync(publicDirectory);
}

fs.writeFileSync(mapFile, JSON.stringify(postMap, null, 2));
console.log(`Post map generated at ${mapFile} with ${Object.keys(postMap).length} entries.`);
