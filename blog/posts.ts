// Uses Vite's glob import to load all markdown files as raw strings
const postModules = import.meta.glob<string>('./posts/*.md', { eager: true, query: '?raw', import: 'default' });

import fm from 'front-matter';

export interface Post {
    slug: string;
    title: string;
    date: string;
    tags: string[];
    summary: string;
    content: string;
}

interface PostAttributes {
    title?: string;
    date?: string;
    summary?: string;
    tags?: string[]
}

export function getAllPosts (): Post[] {
    const posts = Object.entries(postModules).map(([filepath, raw]) => {
        const { attributes, body } = fm<PostAttributes>(raw);
        const slug = filepath.replace('./posts/', '').replace('.md', '');
        return {
            slug,
            title: attributes.title || slug,
            date: attributes.date || '',
            summary: attributes.summary || '',
            tags: attributes.tags || [],
            content: body,
        };
    });
    // Sort by date descending
    posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    return posts;
}