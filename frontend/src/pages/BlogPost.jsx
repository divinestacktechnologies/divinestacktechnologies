// src/pages/BlogPost.jsx
import { useParams, Link, Navigate } from 'react-router-dom';
import useReveal from '../hooks/useReveal';
import SEO from '../components/SEO';
import blogPosts, { getPostBySlug } from '../data/blogPosts';
import '../styles/Blog.css';

const SITE_URL = 'https://divinestacktechnologies.com';

export default function BlogPost() {
  const { slug } = useParams();
  const post = getPostBySlug(slug);
  useReveal();

  if (!post) return <Navigate to="/blog" replace />;

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    dateModified: post.date,
    author: { '@type': 'Organization', name: 'Divine Stack Technologies' },
    publisher: {
      '@type': 'Organization',
      name: 'Divine Stack Technologies',
      logo: { '@type': 'ImageObject', url: `${SITE_URL}/logo.png` },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE_URL}/blog/${post.slug}` },
  };

  const related = blogPosts.filter(p => p.slug !== post.slug).slice(0, 2);

  return (
    <div className="page">
      <SEO
        title={post.title}
        description={post.excerpt}
        path={`/blog/${post.slug}`}
        type="article"
        breadcrumbs={[{name:'Home',path:'/'},{name:'Blog',path:'/blog'},{name:post.title,path:`/blog/${post.slug}`}]}
        schema={[articleSchema]}
      />

      <article className="section blog-post reveal">
        <div className="section-inner blog-post-inner">
          <Link to="/blog" className="blog-back">← Back to Blog</Link>

          <div className="blog-post-cat">{post.category}</div>
          <h1 className="blog-post-title">{post.title}</h1>
          <div className="blog-card-meta" style={{ marginBottom:'2.5rem' }}>
            <span>{new Date(post.date).toLocaleDateString('en-IN', { year:'numeric', month:'long', day:'numeric' })}</span>
            <span>·</span>
            <span>{post.readTime}</span>
          </div>

          <div className="blog-post-body">
            {post.content.map((block, i) => {
              if (block.type === 'h2') return <h2 key={i}>{block.text}</h2>;
              if (block.type === 'ul') return (
                <ul key={i}>
                  {block.items.map((item, j) => <li key={j}>{item}</li>)}
                </ul>
              );
              return <p key={i}>{block.text}</p>;
            })}
          </div>

          {related.length > 0 && (
            <div className="blog-related">
              <h3>Read Next</h3>
              <div className="blog-grid">
                {related.map(p => (
                  <Link to={`/blog/${p.slug}`} className="blog-card" key={p.slug}>
                    <div className="blog-card-cat">{p.category}</div>
                    <h2 className="blog-card-title">{p.title}</h2>
                    <p className="blog-card-excerpt">{p.excerpt}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </article>
    </div>
  );
}
