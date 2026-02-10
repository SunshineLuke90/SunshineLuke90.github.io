// Uses Vite's glob import to load all markdown files as raw strings
const postModules = import.meta.glob('./posts/*.md', { eager: true, query: '?raw', import: 'default' });

import fm from 'front-matter';

export function getAllPosts() {
    const posts = Object.entries(postModules).map(([filepath, raw]) => {
        const { attributes, body } = fm(raw);
        const slug = filepath.replace('./posts/', '').replace('.md', '');
        return {
            slug,
            title: attributes.title || slug,
            date: attributes.date || '',
            summary: attributes.summary || '',
            content: body,
        };
    });
    // Sort by date descending
    posts.sort((a, b) => new Date(b.date) - new Date(a.date));
    return posts;
}