// src/pages/Portfolio.jsx
import { useState } from 'react';
import useReveal from '../hooks/useReveal';
import SEO from '../components/SEO';
import FAQ, { getFAQSchema } from '../components/FAQ';
import '../styles/Portfolio.css';

const PROJECTS = [
  { cat:'E-Commerce',  icon:'🛒', name:'ShopNova Platform',     tech:['React','Node.js','MySQL','Stripe'],    desc:'Full-stack e-commerce with AI recommendations, real-time inventory, and Stripe payment integration. 3x conversion rate increase for the client.', result:'3× Conversion Rate' },
  { cat:'Healthcare',  icon:'🏥', name:'MediConnect App',        tech:['React Native','Firebase','WebRTC'],   desc:'Telemedicine platform connecting patients with doctors. Video consultation, prescriptions, and appointment booking in one app.', result:'10K+ Daily Users' },
  { cat:'FinTech',     icon:'📊', name:'WealthTracker Dashboard', tech:['React','Python','PostgreSQL','D3.js'],desc:'Real-time investment analytics dashboard with AI-powered insights, portfolio risk analysis, and automated reporting.', result:'₹50Cr+ AUM Tracked' },
  { cat:'EdTech',      icon:'🏫', name:'LearnSphere LMS',         tech:['Next.js','Node.js','MongoDB'],        desc:'Complete learning management system with live classes, assignments, progress tracking, and gamification features.', result:'25K+ Learners' },
  { cat:'Automotive',  icon:'🚗', name:'AutoDeal Portal',         tech:['React','Express','MySQL','AWS'],      desc:'Car dealership management system with CRM, inventory tracking, financing calculator, and customer self-service portal.', result:'200+ Dealers Onboarded' },
  { cat:'Hospitality', icon:'🏨', name:'StayEase Booking',        tech:['React','Node.js','Redis','Stripe'],   desc:'Hotel booking platform with dynamic pricing, loyalty programs, channel manager, and multi-property management dashboard.', result:'₹2Cr+ Monthly Bookings' },
  { cat:'SaaS',        icon:'⚙️', name:'TaskFlow Pro',            tech:['React','GraphQL','PostgreSQL'],      desc:'Project management SaaS with kanban boards, time tracking, invoicing, and team collaboration features for agencies.', result:'5K+ Active Teams' },
  { cat:'Real Estate', icon:'🏠', name:'PropFinder Platform',     tech:['Next.js','Node.js','Maps API'],      desc:'Property listing platform with AI-powered valuation, virtual tours, mortgage calculator, and agent CRM integration.', result:'20K+ Property Listings' },
];

const CATS = ['All', ...new Set(PROJECTS.map(p => p.cat))];

const TESTIMONIALS = [
  { name:'Amit Kapoor',   co:'ShopNova',         txt:'Divine Stack transformed our online store completely. Sales tripled in 3 months after the new site launched.', stars:5 },
  { name:'Dr. Ritu Singh', co:'MediConnect',     txt:'Professional team, on-time delivery, and the app quality is exceptional. Our patients love it.', stars:5 },
  { name:'Vikram Mehta',  co:'WealthTracker',    txt:'The dashboard they built handles complex financial data beautifully. Exactly what we envisioned.', stars:5 },
];

const PORTFOLIO_FAQS = [
  { q:'Can I see examples of your previous work?', a:'Yes, this portfolio page showcases 8+ real projects across e-commerce, healthcare, fintech, edtech, automotive, hospitality, SaaS, and real estate industries.' },
  { q:'Do you have case studies with measurable results?', a:'Yes. For example, our ShopNova e-commerce project achieved a 3x conversion rate increase, and our StayEase booking platform now processes over ₹2 crore in monthly bookings.' },
  { q:'Have you worked with businesses in my industry?', a:'We have delivered projects across e-commerce, healthcare, fintech, edtech, automotive, hospitality, SaaS, and real estate. If your industry is not listed, we are happy to discuss your specific needs.' },
];

export default function Portfolio({ onOpenPopup }) {
  const [active, setActive] = useState('All');
  const filtered = active === 'All' ? PROJECTS : PROJECTS.filter(p => p.cat === active);
  useReveal();

  return (
    <div className="page">
      <SEO
        title="Portfolio — Our Featured Projects"
        description="See real projects delivered by Divine Stack Technologies across e-commerce, healthcare, fintech, edtech, and more. Proven results for our clients."
        path="/portfolio"
        breadcrumbs={[{name:'Home',path:'/'},{name:'Portfolio',path:'/portfolio'}]}
        schema={[
          {
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: 'Divine Stack Technologies',
            review: TESTIMONIALS.map(t => ({
              '@type': 'Review',
              author: { '@type': 'Person', name: t.name },
              reviewRating: { '@type': 'Rating', ratingValue: t.stars, bestRating: 5 },
              reviewBody: t.txt,
            })),
            aggregateRating: {
              '@type': 'AggregateRating',
              ratingValue: '5.0',
              reviewCount: TESTIMONIALS.length,
            },
          },
          getFAQSchema(PORTFOLIO_FAQS),
        ]}
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
            {filtered.map(p => (
              <div className="port-card reveal" key={p.name}>
                <div className="port-img">
                  <div className="port-emoji">{p.icon}</div>
                  <div className="port-result">{p.result}</div>
                </div>
                <div className="port-body">
                  <div className="port-cat">{p.cat}</div>
                  <h3 className="port-name">{p.name}</h3>
                  <p className="port-desc">{p.desc}</p>
                  <div className="port-techs">
                    {p.tech.map(t => <span className="tag" key={t}>{t}</span>)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section" style={{ background:'var(--dark)' }}>
        <div className="section-inner">
          <div className="reveal" style={{ textAlign:'center' }}>
            <span className="section-tag" style={{ justifyContent:'center' }}>Client Love</span>
            <h2 className="section-title">What Our <span className="highlight">Clients Say</span></h2>
          </div>
          <div className="testimonials-grid">
            {TESTIMONIALS.map(t => (
              <div className="card testimonial-card reveal" key={t.name}>
                <div className="t-stars">{'★'.repeat(t.stars)}</div>
                <p className="t-text">"{t.txt}"</p>
                <div className="t-author">
                  <div className="t-name">{t.name}</div>
                  <div className="t-co">{t.co}</div>
                </div>
              </div>
            ))}
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
