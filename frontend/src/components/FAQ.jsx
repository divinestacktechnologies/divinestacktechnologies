// src/components/FAQ.jsx
// Renders an accordion of FAQs AND returns matching FAQPage JSON-LD schema
// Use getFAQSchema(items) to pass schema into <SEO schema={...} />
import { useState } from 'react';
import '../styles/FAQ.css';

export function getFAQSchema(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  };
}

export default function FAQ({ items, title = 'Frequently Asked Questions', highlightWords = 2, tag = 'FAQ' }) {
  const [open, setOpen] = useState(0);
  const words = title.split(' ');
  const plainPart = words.slice(0, Math.max(words.length - highlightWords, 0)).join(' ');
  const highlightPart = words.slice(Math.max(words.length - highlightWords, 0)).join(' ');

  return (
    <section className="section faq-section">
      <div className="section-inner">
        <div className="reveal" style={{ textAlign: 'center' }}>
          <span className="section-tag" style={{ justifyContent: 'center' }}>{tag}</span>
          <h2 className="section-title">
            {plainPart && `${plainPart} `}<span className="highlight">{highlightPart}</span>
          </h2>
        </div>

        <div className="faq-accordion reveal">
          {items.map((item, i) => (
            <div className={`faq-item ${open === i ? 'faq-item--open' : ''}`} key={item.q}>
              <button className="faq-q-btn" onClick={() => setOpen(open === i ? -1 : i)}>
                <span>{item.q}</span>
                <span className="faq-icon">{open === i ? '−' : '+'}</span>
              </button>
              <div className="faq-a-wrap">
                <p className="faq-a-text">{item.a}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
