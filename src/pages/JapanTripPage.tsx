import "@esri/calcite-components"
import { useState } from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { getAllPosts } from "../../blog/posts"
import "../../blog/blog.css"

const POSTS_PER_PAGE = 5

function JapanBlogs () {
  const posts = getAllPosts().filter((p) => p.tags.includes("Japan"))
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null)
  const [page, setPage] = useState(0)
  const selectedPost = posts.find((p) => p.slug === selectedSlug)
  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE)
  const pagePosts = posts.slice(page * POSTS_PER_PAGE, (page + 1) * POSTS_PER_PAGE)

  return (
    <div className="blog-container">
      <calcite-list label="Japan blog posts">
        {pagePosts.map((post) => (
          <calcite-list-item
            key={post.slug}
            label={post.title}
            description={`${post.date} — ${post.summary}`}
            oncalciteListItemSelect={() => setSelectedSlug(post.slug)}
          ></calcite-list-item>
        ))}
      </calcite-list>
      {posts.length > POSTS_PER_PAGE && (
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
          <span>Page {page + 1} of {totalPages}</span>
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
      )}
      <calcite-dialog
        modal
        open={selectedPost ? true : undefined}
        heading={selectedPost?.title}
        oncalciteDialogClose={() => setSelectedSlug(null)}
      >
        {selectedPost && (
          <article className="blog-post">
            <p className="blog-date">{selectedPost.date}</p>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{selectedPost.content}</ReactMarkdown>
          </article>
        )}
      </calcite-dialog>
    </div>
  )
}

export default function JapanTripPage () {
  return (
    <section style={{ gap: "1rem", display: "flex", flexDirection: "column" }}>
      <h2 className="header-text">Japan Trip</h2>
      <p className="body-text">I'm going on a trip to Japan! I decided to go on short notice, but I hope to keep a record of the trip through this site, and a few other resources.</p>
      <h3 className="header-text" style={{ marginTop: "1rem" }}>Rough Itinerary</h3>
      <p className="body-text">I'll be taking a motorcycle across Kyushu, a Triumph Speed 400 off of <calcite-link href="https://www.rental819.com/">Rental819</calcite-link> in Fukuoka. I will be documenting the trip in blog form, video form, and map form, all here! Watch my pre-trip video below, for an overview of what I'm planning to do. Would love to see you along for the ride in the comments!</p>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <calcite-link href="https://earth.google.com/earth/d/1eqJLGbZCd7G-oq5weAs1BhMqwFuO7uHm?usp=sharing">
          View Japan Itinerary
        </calcite-link>
      </div>
      <JapanBlogs />
      <h3 className="header-text">Keep in touch!</h3>
      <div style={{ display: "flex", justifyContent: "Center", gap: "1rem" }}>
        <calcite-button href="https://line.me/ti/p/aWfh_g38U-" iconStart="plus-circle">
          Line
        </calcite-button>
        <calcite-button id="whatsapp-button">
          WhatsApp
        </calcite-button>
        <calcite-tooltip
          referenceElement="whatsapp-button"
          placement="top"
        >
          Add me at<br />
          @sunshinelucius
        </calcite-tooltip>
      </div>
      <iframe style={{ margin: "auto" }} width="560" height="315" src="https://www.youtube.com/embed/jEdBT50TJ4A?si=mJey1hvj-JG-gWEC" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
    </section>
  );
}