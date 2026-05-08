import React, { useState, useEffect, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { getAllPosts } from './posts';
import { CalciteCard, CalciteButton, CalciteCardGroup, CalcitePopover, CalciteList, CalciteListItem } from '@esri/calcite-components-react';

const SHARE_PLATFORMS = [
    { name: 'X', icon: '𝕏', buildUrl: (url, title) => `https://x.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}` },
    { name: 'Facebook', icon: 'f', buildUrl: (url) => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}` },
    { name: 'Reddit', icon: 'r', buildUrl: (url, title) => `https://www.reddit.com/submit?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}` },
    { name: 'LinkedIn', icon: 'in', buildUrl: (url, title) => `https://www.linkedin.com/shareArticle?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}` },
];

const POSTS_PER_PAGE = 5;

function getSlugFromURL () {
    return new URLSearchParams(window.location.search).get('post') || null;
}

function buildBlogSearch (slug) {
    return slug ? `?blog&post=${encodeURIComponent(slug)}` : '?blog';
}

export default function Blog () {
    const allPosts = getAllPosts();
    const [selectedSlug, setSelectedSlug] = useState(getSlugFromURL);
    const [page, setPage] = useState(0);

    const selectPost = useCallback((slug) => {
        setSelectedSlug(slug);
        const url = new URL(window.location);
        url.search = buildBlogSearch(slug);
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

    const getShareUrl = () => {
        const url = new URL(window.location);
        url.search = buildBlogSearch(selectedSlug);
        return url.toString();
    };

    const openShareLink = useCallback((url) => {
        window.open(url, '_blank', 'noopener,noreferrer');
    }, []);

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
                    <div>
                        <CalcitePopover
                            className="share-popover"
                            referenceElement="share-button"
                            autoClose={true}
                            pointerDisabled={true}
                            placement='bottom'
                        >
                            <div className="share-popover-content">
                                <CalciteList className="share-list">
                                    {SHARE_PLATFORMS.map((platform) => (
                                        <CalciteListItem
                                            key={platform.name}
                                            label={platform.name}
                                            value={platform.name}
                                            onCalciteListItemSelect={() => openShareLink(platform.buildUrl(getShareUrl(), selectedPost.title))}
                                        >
                                            <span slot="content-start" className="share-icon" aria-hidden="true">
                                                {platform.icon}
                                            </span>
                                        </CalciteListItem>
                                    ))}
                                </CalciteList>
                            </div>
                        </CalcitePopover>
                        <CalciteButton
                            id="share-button"
                            kind="neutral"
                            className="share-button"
                            appearance="outline"
                            icon-start="share"
                        >
                            Share
                        </CalciteButton>
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