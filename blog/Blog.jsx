import React, { useState, useEffect, useCallback, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { getAllPosts } from './posts';
import { CalciteCard, CalciteButton, CalciteCardGroup } from '@esri/calcite-components-react';

const SHARE_PLATFORMS = [
    { name: 'X', icon: '𝕏', buildUrl: (url, title) => `https://x.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}` },
    { name: 'Facebook', icon: 'f', buildUrl: (url) => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}` },
    { name: 'Reddit', icon: 'r', buildUrl: (url, title) => `https://www.reddit.com/submit?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}` },
    { name: 'LinkedIn', icon: 'in', buildUrl: (url) => `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}` },
];

const POSTS_PER_PAGE = 5;

function getSlugFromURL() {
    return new URLSearchParams(window.location.search).get('post') || null;
}

export default function Blog() {
    const allPosts = getAllPosts();
    const [selectedSlug, setSelectedSlug] = useState(getSlugFromURL);
    const [page, setPage] = useState(0);

    const selectPost = useCallback((slug) => {
        setSelectedSlug(slug);
        const url = new URL(window.location);
        if (slug) {
            url.searchParams.set('post', slug);
        } else {
            url.searchParams.delete('post');
        }
        window.history.pushState({}, '', url);
    }, []);

    // Handle browser back/forward navigation
    useEffect(() => {
        const onPopState = () => setSelectedSlug(getSlugFromURL());
        window.addEventListener('popstate', onPopState);
        return () => window.removeEventListener('popstate', onPopState);
    }, []);

    const selectedPost = selectedSlug
        ? allPosts.find((p) => p.slug === selectedSlug)
        : null;

    const totalPages = Math.ceil(allPosts.length / POSTS_PER_PAGE);
    const paginatedPosts = allPosts.slice(
        page * POSTS_PER_PAGE,
        (page + 1) * POSTS_PER_PAGE
    );

    const [shareOpen, setShareOpen] = useState(false);
    const shareRef = useRef(null);

    // Close share menu when clicking outside
    useEffect(() => {
        if (!shareOpen) return;
        const handleClick = (e) => {
            if (shareRef.current && !shareRef.current.contains(e.target)) {
                setShareOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, [shareOpen]);

    const getShareUrl = () => {
        const url = new URL(window.location);
        url.searchParams.set('post', selectedSlug);
        return url.toString();
    };

    if (selectedPost) {
        return (
            <div className="blog-container">
                <div className="blog-post-header">
                    <CalciteButton
                        kind="neutral"
                        className="back-button"
                        appearance="outline"
                        icon-start="arrow-left"
                        onClick={() => selectPost(null)}
                    >
                        Back to posts
                    </CalciteButton>
                    <div className="share-wrapper" ref={shareRef}>
                        <CalciteButton
                            kind="neutral"
                            className="share-button"
                            appearance="outline"
                            icon-start="share"
                            onClick={() => setShareOpen((o) => !o)}
                        >
                            Share
                        </CalciteButton>
                        {shareOpen && (
                            <div
                                className="share-menu"
                                onKeyDown={(e) => {
                                    if (e.key === 'Escape') {
                                        setShareOpen(false);
                                        shareRef.current?.querySelector('.share-button, calcite-button')?.focus();
                                    }
                                }}
                            >                                {SHARE_PLATFORMS.map((platform) => (
                                    <a
                                        key={platform.name}
                                        className="share-menu-item"
                                        href={platform.buildUrl(getShareUrl(), selectedPost.title)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        onClick={() => setShareOpen(false)}
                                    >
                                        <span className="share-icon">{platform.icon}</span>
                                        {platform.name}
                                    </a>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
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
                    onClick={() => selectPost(post.slug)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            selectPost(post.slug);
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