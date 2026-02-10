import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { getAllPosts } from './posts';
import { CalciteCard, CalciteButton, CalciteCardGroup } from '@esri/calcite-components-react';

const POSTS_PER_PAGE = 5;

export default function Blog() {
    const allPosts = getAllPosts();
    const [selectedSlug, setSelectedSlug] = useState(null);
    const [page, setPage] = useState(0);

    const selectedPost = selectedSlug
        ? allPosts.find((p) => p.slug === selectedSlug)
        : null;

    const totalPages = Math.ceil(allPosts.length / POSTS_PER_PAGE);
    const paginatedPosts = allPosts.slice(
        page * POSTS_PER_PAGE,
        (page + 1) * POSTS_PER_PAGE
    );

    if (selectedPost) {
        return (
            <div className="blog-container">
                <CalciteButton
                    kind="neutral"
                    className="back-button"
                    appearance="outline"
                    icon-start="arrow-left"
                    onClick={() => setSelectedSlug(null)}
                >
                    Back to posts
                </CalciteButton>
                <article className="blog-post">
                    <h2 className="blog-post-title">{selectedPost.title}</h2>
                    <p className="blog-date">{selectedPost.date}</p>
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {selectedPost.content}
                    </ReactMarkdown>
                </article>
            </div>
        );
    }

    return (
        <div className="blog-container">
            <CalciteCardGroup
                className="blog-card-group"
            >
            {paginatedPosts.map((post) => (
                <CalciteCard
                    key={post.slug}
                    className="card blog-card"
                    onClick={() => setSelectedSlug(post.slug)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            setSelectedSlug(post.slug);
                        }
                    }}
                    //calciteCardSelect={() =>setSelectedSlug(post.slug)}
                    style={{ cursor: 'pointer' }}
                >
                    <span slot="heading">{post.title}</span>
                    <span slot="description">
                        <p className="blog-date">{post.date}</p>
                        <p>{post.summary}</p>
                    </span>
                </CalciteCard>
            ))}
            </CalciteCardGroup>
            <div className="blog-pagination">
                <CalciteButton
                    kind="neutral"
                    appearance="outline"
                    icon-start="chevron-left"
                    disabled={page === 0 ? true : undefined}
                    onClick={() => setPage((p) => Math.max(0, p - 1))}
                >
                    Previous
                </CalciteButton>
                <span>
                    Page {page + 1} of {totalPages}
                </span>
                <CalciteButton
                    kind="neutral"
                    appearance="outline"
                    icon-end="chevron-right"
                    disabled={page >= totalPages - 1 ? true : undefined}
                    onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                >
                    Next
                </CalciteButton>
            </div>
        </div>
    );
}