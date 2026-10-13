import { useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { getAllPosts } from './posts';

const SHARE_PLATFORMS = [
    { name: 'X', icon: '𝕏', buildUrl: (url: string, title: string) => `https://x.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}` },
    { name: 'Facebook', icon: 'f', buildUrl: (url: string) => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}` },
    { name: 'Reddit', icon: 'r', buildUrl: (url: string, title: string) => `https://www.reddit.com/submit?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}` },
    { name: 'LinkedIn', icon: 'in', buildUrl: (url: string, title: string) => `https://www.linkedin.com/shareArticle?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}` },
];

const POSTS_PER_PAGE = 5;

export default function Blog () {
    const allPosts = getAllPosts();
    const { slug: selectedSlug = null } = useParams();
    const navigate = useNavigate();
    const [page, setPage] = useState(0);

    const selectPost = useCallback((slug: string | null) => {
        navigate(slug ? `/blog/${encodeURIComponent(slug)}` : '/blog');
    }, [navigate]);

    const selectedPost = selectedSlug
        ? allPosts.find((p) => p.slug === selectedSlug)
        : null;

    const totalPages = Math.ceil(allPosts.length / POSTS_PER_PAGE);
    const paginatedPosts = allPosts.slice(
        page * POSTS_PER_PAGE,
        (page + 1) * POSTS_PER_PAGE
    );

    const getShareUrl = () => {
        return `${window.location.origin}/blog/${encodeURIComponent(selectedSlug ?? '')}`;
    };

    const openShareLink = useCallback((url: string) => {
        window.open(url, '_blank', 'noopener,noreferrer');
    }, []);

    if (selectedPost) {
        return (
            <div className="blog-container">
                <div className="blog-post-header">
                    <calcite-button
                        kind="neutral"
                        className="back-button"
                        appearance="outline"
                        icon-start="arrow-left"
                        onClick={() => selectPost(null)}
                    >
                        Back to posts
                    </calcite-button>
                    <div>
                        <calcite-popover
                            label="Share post"
                            className="share-popover"
                            referenceElement="share-button"
                            autoClose={true}
                            pointerDisabled={true}
                            placement='bottom'
                        >
                            <div className="share-popover-content">
                                <calcite-list className="share-list" label="Share platforms">
                                    {SHARE_PLATFORMS.map((platform) => (
                                        <calcite-list-item
                                            key={platform.name}
                                            label={platform.name}
                                            value={platform.name}
                                            oncalciteListItemSelect={() => openShareLink(platform.buildUrl(getShareUrl(), selectedPost.title))}
                                        >
                                            <span slot="content-start" className="share-icon" aria-hidden="true">
                                                {platform.icon}
                                            </span>
                                        </calcite-list-item>
                                    ))}
                                </calcite-list>
                            </div>
                        </calcite-popover>
                        <calcite-button
                            id="share-button"
                            kind="neutral"
                            className="share-button"
                            appearance="outline"
                            icon-start="share"
                        >
                            Share
                        </calcite-button>
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
            <calcite-card-group
                className="blog-card-group"
                label="Blog posts"
            >
                {paginatedPosts.map((post) => (
                    <calcite-card
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
                    </calcite-card>
                ))}
            </calcite-card-group>
            <div className="blog-pagination">
                <calcite-button
                    kind="neutral"
                    appearance="outline"
                    icon-start="chevron-left"
                    disabled={page === 0 ? true : undefined}
                    onClick={() => setPage((p) => Math.max(0, p - 1))}
                >
                    Previous
                </calcite-button>
                <span>
                    Page {page + 1} of {totalPages}
                </span>
                <calcite-button
                    kind="neutral"
                    appearance="outline"
                    icon-end="chevron-right"
                    disabled={page >= totalPages - 1 ? true : undefined}
                    onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                >
                    Next
                </calcite-button>
            </div>
        </div>
    );
}