// src/pages/Portfolio.jsx
import { useState } from 'react';
import useReveal from '../hooks/useReveal';
import SEO from '../components/SEO';
import FAQ, { getFAQSchema } from '../components/FAQ';
import '../styles/Portfolio.css';

// Live screenshot preview for projects with a real URL (WordPress mshots — free, no API key)
const shot = (url) => `https://s.wordpress.com/mshots/v1/${encodeURIComponent(url)}?w=600`;

const PROJECTS = [
  {
    cat:'Education', icon:'🏫', name:'Metro School Website',
    tech:['React','Node.js','Responsive Design'],
    desc:'Official school website with admissions info, academics overview, faculty details, and an easy-to-navigate parent/student portal.',
    result:'Live Website',
    link:'https://metro-school-website.onrender.com/',
  },
  {
    cat:'Coaching & EdTech', icon:'📚', name:'Prashasti IAS',
    tech:['Web Design','SEO','Content-Driven'],
    desc:'Coaching institute website for UPSC/IAS exam preparation — course listings, faculty profiles, results showcase, and lead capture forms.',
    result:'Live Website',
    link:'https://www.prashastiias.com/',
  },
  {
    cat:'Manufacturing', icon:'🏭', name:'Arhant Metal Industries',
    tech:['Business Website','Product Catalog'],
    desc:'Corporate website for a metal manufacturing company — product catalog, company profile, certifications, and enquiry-driven lead generation.',
    result:'Live Website',
    link:'https://arhantmetalindusties.in/',
  },
  {
    cat:'Food & Beverage', icon:'🥐', name:'Reliable Bakery',
    tech:['React','Netlify','E-Commerce'],
    desc:'Bakery brand website showcasing product menu with an inviting, appetite-driving visual layout built for fast deployment.',
    result:'Live Website',
    link:'https://reliable-queijadas-4fc1d2.netlify.app/',
  },
  {
    cat:'Food & Beverage', icon:'🍔', name:'CPR Foodies',
    tech:['React','Vercel','Menu Ordering'],
    desc:'Restaurant/food ordering website with digital menu browsing and a clean, mobile-first ordering experience.',
    result:'Live Website',
    link:'https://cpr-foodies.vercel.app/',
  },
  {
    cat:'Web App', icon:'🧩', name:'Custom Business Web App',
    tech:['React','Node.js','REST API'],
    desc:'Custom internal web application built for streamlined business operations, currently in active development and testing.',
    result:'In Development',
    link:'https://4jsl9kph-8000.inc1.devtunnels.ms/',
  },
  {
    cat:'SaaS Tools', icon:'🎯', name:'Lead Generation Tool',
    tech:['React','Node.js','PostgreSQL','Automation'],
    desc:'In-house lead capture and management tool — web forms, popup capture, source tracking, and a dashboard to monitor every enquiry in real time.',
    result:'Divine Stack Product',
  },
  {
    cat:'SaaS Tools', icon:'🤝', name:'CRM Tool',
    tech:['React','Node.js','PostgreSQL','JWT Auth'],
    desc:'Lightweight CRM for managing customer relationships — contact records, status pipelines, admin roles, and activity tracking.',
    result:'Divine Stack Product',
  },
];

const CATS = ['All', ...new Set(PROJECTS.map(p => p.cat))];

const PORTFOLIO_FAQS = [
  { q:'Can I see examples of your previous work?', a:'Yes, this portfolio page showcases real projects we\'ve built across education, coaching, manufacturing, food & beverage, and internal SaaS tools.' },
  { q:'Do you build custom internal tools, not just websites?', a:'Yes. Alongside client websites, we also build internal tools like lead generation systems and CRM platforms tailored to how a business actually operates.' },
  { q:'Have you worked with businesses in my industry?', a:'We\'ve delivered projects across education, coaching institutes, manufacturing, and food & beverage. If your industry isn\'t listed, we\'re happy to discuss your specific needs.' },
];

export default function Portfolio({ onOpenPopup }) {
  const [active, setActive] = useState('All');
  const filtered = active === 'All' ? PROJECTS : PROJECTS.filter(p => p.cat === active);
  useReveal();

  return (
    <div className="page">
      <SEO
        title="Portfolio — Our Featured Projects"
        description="See real projects delivered by Divine Stack Technologies across education, coaching, manufacturing, food & beverage, and in-house SaaS tools."
        path="/portfolio"
        breadcrumbs={[{name:'Home',path:'/'},{name:'Portfolio',path:'/portfolio'}]}
        schema={[getFAQSchema(PORTFOLIO_FAQS)]}
      />
      {/* Hero */}
      <section className="page-hero reveal">
        <span className="section-tag">Our Work</span>
        <h1 className="page-hero-title">Featured <span className="highlight">Projects</span></h1>
        <p className="page-hero-desc">Real solutions, real results — a curated look at what we've built for our clients.</p>
      </section>

      {/* Filter + Grid */}
      <section className="section">
        <div className="section-inner">
          {/* Filter tabs */}
          <div className="filter-tabs reveal">
            {CATS.map(c => (
              <button
                key={c}
                className={`filter-tab ${active === c ? 'active' : ''}`}
                onClick={() => setActive(c)}
              >{c}</button>
            ))}
          </div>

          {/* Grid */}
          <div className="portfolio-grid">
            {filtered.map(p => {
              const Card = (
                <div className="port-card reveal" key={p.name}>
                  <div className="port-img">
                    {p.link ? (
                      <img src={shot(p.link)} alt={p.name} loading="lazy" />
                    ) : (
                      <div className="port-emoji">{p.icon}</div>
                    )}
                    <div className="port-result">{p.result}</div>
                    {p.link && <div className="port-visit">Visit Site ↗</div>}
                  </div>
                  <div className="port-body">
                    <div className="port-cat">{p.icon} {p.cat}</div>
                    <h3 className="port-name">{p.name}</h3>
                    <p className="port-desc">{p.desc}</p>
                    <div className="port-techs">
                      {p.tech.map(t => <span className="tag" key={t}>{t}</span>)}
                    </div>
                  </div>
                </div>
              );
              return p.link ? (
                <a href={p.link} target="_blank" rel="noopener noreferrer" className="port-link" key={p.name}>
                  {Card}
                </a>
              ) : Card;
            })}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <FAQ items={PORTFOLIO_FAQS} tag="Portfolio FAQs" title="Questions About Our Work" />

      {/* CTA */}
      <section className="cta-strip reveal">
        <h2>Have a project in mind? <span className="highlight">Let's build it.</span></h2>
        <div style={{ display:'flex', gap:'1rem', flexWrap:'wrap', justifyContent:'center', marginTop:'1.5rem' }}>
          <button className="btn-primary" onClick={onOpenPopup}>🚀 Start Your Project</button>
        </div>
      </section>
    </div>
  );
}
