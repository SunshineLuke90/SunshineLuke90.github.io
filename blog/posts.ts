// Uses Vite's glob import to load all markdown files as raw strings
const postModules = import.meta.glob<string>('./posts/*.md', { eager: true, query: '?raw', import: 'default' });

import fm from 'front-matter';
import type { Post } from '../src/types/appTypes';

interface PostFrontMatter {
    title?: string;
    date?: string;
    summary?: string;
}

export function getAllPosts(): Post[] {
    const posts: Post[] = Object.entries(postModules).map(([filepath, raw]) => {
        const { attributes, body } = fm<PostFrontMatter>(raw);
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
    posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    return posts;
}