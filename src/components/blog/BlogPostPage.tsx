import { Link, useParams } from 'react-router-dom';
import PageSEO from '../../seo/PageSEO';
import {
  findBlogPostBySlug,
  computeReadingMinutes as estimateReadingMinutes,
  type StaticBlogPost,
} from '../../blog/posts';

function formatDate(dateString: string | null) {
  if (!dateString) return null;
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(date);
  } catch (error) {
    console.error('formatDate error', error);
    return null;
  }
}

type ContentBlock = {
  type: 'paragraph' | 'heading' | 'list';
  level?: 2 | 3 | 4;
  content: string[];
};

function parseContent(raw: string): ContentBlock[] {
  const blocks = raw.split(/\n{2,}/).map(block => block.trim()).filter(Boolean);
  const result: ContentBlock[] = [];

  blocks.forEach(block => {
    if (/^#{2,6}\s/.test(block)) {
      const hashes = block.match(/^#+/);
      const level = Math.min(hashes ? hashes[0].length + 1 : 2, 4) as 2 | 3 | 4;
      const text = block.replace(/^#{1,6}\s+/, '').trim();
      result.push({ type: 'heading', level, content: [text] });
      return;
    }

    if (/^-\s+/m.test(block)) {
      const items = block
        .split(/\n+/)
        .map(line => line.replace(/^[-*]\s+/, '').trim())
        .filter(Boolean);
      if (items.length > 0) {
        result.push({ type: 'list', content: items });
        return;
      }
    }

    result.push({ type: 'paragraph', content: [block] });
  });

  return result;
}

function computeReadingMinutes(post: StaticBlogPost | null) {
  if (!post) return null;
  return estimateReadingMinutes(post.content, post.readingMinutes);
}

export default function BlogPostPage() {
  const { slug = '' } = useParams();
  const post = findBlogPostBySlug(slug) ?? null;

  const readingMinutes = computeReadingMinutes(post);
  const publishedLabel = formatDate(post?.publishedAt ?? null);
  const blocks = post ? parseContent(post.content) : [];
  const seoTitle = post?.seoTitle ?? post?.title ?? 'Blog article';
  const seoDescription = post?.seoDescription ?? post?.summary ?? undefined;

  const notFound = !post;

  return (
    <>
      <PageSEO
        title={seoTitle}
        description={seoDescription}
        canonicalPath={post ? `/blog/${post.slug}` : `/blog/${slug}`}
        noindex={notFound}
      />
      <main className="mx-auto mt-28 max-w-3xl px-6 pb-24">
        <nav className="mb-6 text-sm text-gray-500">
          <Link to="/" className="text-gray-500 hover:text-gray-700">Home</Link>
          <span className="mx-2 text-gray-400">/</span>
          <Link to="/blog" className="text-gray-500 hover:text-gray-700">Blog</Link>
          {post ? (
            <>
              <span className="mx-2 text-gray-400">/</span>
              <span className="text-gray-700">{post.title}</span>
            </>
          ) : null}
        </nav>

        {notFound ? (
          <section className="rounded-xl border border-red-200 bg-red-50 p-8 text-center text-red-700">
            <h1 className="text-2xl font-semibold">Article not found</h1>
            <p className="mt-3 text-base text-red-600">Check the URL or return to the blog index to keep reading.</p>
            <Link
              to="/blog"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-emerald-700 px-5 py-2 text-sm font-semibold text-white transition hover:bg-emerald-800"
            >
              View all articles
            </Link>
          </section>
        ) : (
          <article className="bg-white">
            <header className="mb-8">
              <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">CaseroOk Blog</p>
              <h1 className="mt-4 text-4xl font-bold text-gray-900">{post.title}</h1>
              <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-gray-500">
                {publishedLabel ? <span>Published on {publishedLabel}</span> : null}
                {readingMinutes ? <span>• {readingMinutes} min read</span> : null}
                {post.sourceUrl ? (
                  <a
                    href={post.sourceUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 text-emerald-700 hover:text-emerald-800"
                  >
                    Source article
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 11l3-3m0 0l-3-3m3 3H8a4 4 0 00-4 4v8" />
                    </svg>
                  </a>
                ) : null}
              </div>
            </header>

            {post.heroImageUrl ? (
              <figure className="mb-8 overflow-hidden rounded-3xl bg-gray-100">
                <img src={post.heroImageUrl} alt={post.title} className="w-full object-cover" />
              </figure>
            ) : null}

            <section className="text-lg leading-relaxed text-gray-800">
              {post.summary ? <p className="text-xl leading-relaxed text-gray-600">{post.summary}</p> : null}
              {blocks.map((block, index) => {
                if (block.type === 'heading') {
                  const Tag = block.level === 2 ? 'h2' : block.level === 3 ? 'h3' : 'h4';
                  return (
                    <Tag
                      key={`heading-${index}`}
                      className={
                        block.level === 2
                          ? 'mt-10 text-3xl font-semibold text-gray-900'
                          : block.level === 3
                            ? 'mt-8 text-2xl font-semibold text-gray-900'
                            : 'mt-6 text-xl font-semibold text-gray-900'
                      }
                    >
                      {block.content[0]}
                    </Tag>
                  );
                }
                if (block.type === 'list') {
                  return (
                    <ul key={`list-${index}`} className="my-6 list-disc pl-6 text-gray-800">
                      {block.content.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  );
                }
                return block.content.map((paragraph, idx) => (
                  <p key={`paragraph-${index}-${idx}`} className="mt-6 whitespace-pre-line">
                    {paragraph}
                  </p>
                ));
              })}
            </section>

            <footer className="mt-12 rounded-3xl bg-emerald-50 p-8 text-gray-800">
              <h2 className="text-xl font-semibold text-emerald-900">Want to share your experience?</h2>
              <p className="mt-2 text-gray-700">
                At CaseroOk we turn real stories and housing news into practical resources for riders. If you want to contribute, you can publish an anonymous review in minutes.
              </p>
              <Link
                to="/add-review"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-emerald-700 px-5 py-2 text-sm font-semibold text-white transition hover:bg-emerald-800"
              >
                Share a review
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
              </Link>
            </footer>
          </article>
        )}
      </main>
    </>
  );
}
