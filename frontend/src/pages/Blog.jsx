// src/pages/Blog.jsx
import { Link } from 'react-router-dom';
import useReveal from '../hooks/useReveal';
import SEO from '../components/SEO';
import blogPosts from '../data/blogPosts';
import '../styles/Blog.css';

export default function Blog() {
  useReveal();
  const sorted = [...blogPosts].sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div className="page">
      <SEO
        title="Blog — Web Development, SEO & Business Tech Insights"
        description="Practical, no-fluff articles on web development costs, SEO basics, choosing an agency, and building the right tools for your business."
        path="/blog"
        breadcrumbs={[{name:'Home',path:'/'},{name:'Blog',path:'/blog'}]}
      />

      <section className="page-hero reveal">
        <span className="section-tag">Insights</span>
        <h1 className="page-hero-title">Our <span className="highlight">Blog</span></h1>
        <p className="page-hero-desc">Practical guides on web development, SEO, and business tools — no fluff, just what actually helps.</p>
      </section>

      <section className="section">
        <div className="section-inner">
          <div className="blog-grid">
            {sorted.map(post => (
              <Link to={`/blog/${post.slug}`} className="blog-card reveal" key={post.slug}>
                <div className="blog-card-cat">{post.category}</div>
                <h2 className="blog-card-title">{post.title}</h2>
                <p className="blog-card-excerpt">{post.excerpt}</p>
                <div className="blog-card-meta">
                  <span>{new Date(post.date).toLocaleDateString('en-IN', { year:'numeric', month:'long', day:'numeric' })}</span>
                  <span>·</span>
                  <span>{post.readTime}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
