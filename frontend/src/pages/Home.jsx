// src/pages/Home.jsx
import { Link } from 'react-router-dom';
import useReveal from '../hooks/useReveal';
import SEO from '../components/SEO';
import FAQ, { getFAQSchema } from '../components/FAQ';
import '../styles/Home.css';

const STATS = [
  { num:'150+', label:'Projects Delivered' },
  { num:'50+',  label:'Happy Clients'       },
  { num:'5★',   label:'Average Rating'      },
  { num:'5+',   label:'Years Experience'    },
];

const TECH = [
  { icon:'⚛️', name:'React'    },
  { icon:'🟩', name:'Node.js'  },
  { icon:'🐍', name:'Python'   },
  { icon:'☁️', name:'AWS'      },
  { icon:'📱', name:'Flutter'  },
  { icon:'🎨', name:'Figma'    },
  { icon:'🔒', name:'Security' },
  { icon:'🗄️', name:'MySQL'    },
];

const SKILLS = [
  { label:'Web Development',   pct: 98 },
  { label:'Mobile Apps',       pct: 92 },
  { label:'SEO & Marketing',   pct: 95 },
  { label:'UI/UX Design',      pct: 90 },
];

const SERVICE_AREAS = ['Noida','Lucknow','Ghaziabad','Kanpur','Agra','Greater Noida','Meerut','Varanasi'];

const HOME_FAQS = [
  { q:'What does Divine Stack Technologies do?', a:'Divine Stack Technologies is a full-service digital agency based in Uttar Pradesh, India. We build websites, mobile apps, and provide SEO, AEO, GEO, cloud, and AI automation services for businesses of all sizes.' },
  { q:'How much does it cost to build a website with Divine Stack Technologies?', a:'Pricing depends on scope. Simple websites start around ₹25,000, while complex web applications range from ₹1,00,000 to ₹5,00,000+. We offer a free consultation to give you an accurate quote.' },
  { q:'Does Divine Stack Technologies work with clients outside India?', a:'Yes. While we are based in Uttar Pradesh, India, we serve clients globally and are experienced with remote collaboration across different time zones.' },
  { q:'How long does it take to build a website or app?', a:'A standard website takes 2–4 weeks. Mobile apps and complex web applications typically take 6–12 weeks depending on features and scope.' },
  { q:'Do you provide ongoing support after launch?', a:'Yes, we offer monthly maintenance plans that include updates, security patches, performance monitoring, and priority support.' },
];

export default function Home({ onOpenPopup }) {
  useReveal();

  return (
    <div className="page">
      <SEO
        title="Web Development, App & Digital Solutions Company"
        description="Divine Stack Technologies — expert web development, mobile app development, UI/UX design, and SEO services in Uttar Pradesh, India. Get a free consultation today."
        path="/"
        schema={[
          {
            '@context': 'https://schema.org',
            '@type': 'LocalBusiness',
            name: 'Divine Stack Technologies',
            image: 'https://divinestacktechnologies.com/og-image.jpg',
            url: 'https://divinestacktechnologies.com',
            telephone: '+91-81261-96064',
            address: {
              '@type': 'PostalAddress',
              addressLocality: 'Uttar Pradesh',
              addressCountry: 'IN',
            },
            geo: { '@type': 'GeoCoordinates', latitude: 28.5706, longitude: 77.5835 },
            priceRange: '₹₹',
            openingHoursSpecification: {
              '@type': 'OpeningHoursSpecification',
              dayOfWeek: ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'],
              opens: '09:00',
              closes: '19:00',
            },
            areaServed: { '@type': 'Country', name: 'India' },
          },
          getFAQSchema(HOME_FAQS),
        ]}
      />
      {/* ── Hero ── */}
      <section className="hero-section">
        <div className="hero-inner">

          {/* Left */}
          <div className="hero-left reveal">
            <p className="hero-eyebrow">Innovating Since Day One</p>
            <h1>
              We Build <em>Digital</em><br />
              Experiences That<br />
              <em>Perform</em>
            </h1>
            <p className="hero-desc">
              Divine Stack Technologies delivers end-to-end digital solutions —
              blazing-fast websites, powerful mobile apps, and data-driven SEO strategies
              that grow your business.
            </p>
            <div className="hero-btns">
              <button className="btn-primary" onClick={onOpenPopup}>🚀 Free Consultation</button>
              <Link to="/portfolio" className="btn-outline">View Our Work →</Link>
            </div>

            {/* Stats */}
            <div className="hero-stats">
              {STATS.map(s => (
                <div className="stat" key={s.label}>
                  <div className="stat-num">{s.num}</div>
                  <div className="stat-label">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — Animated Tech Card */}
          <div className="hero-right reveal">
            <div className="tech-card">
              <p className="tech-card-label">// OUR TECH STACK</p>
              <div className="tech-grid">
                {TECH.map(t => (
                  <div className="tech-icon-box" key={t.name} title={t.name}>
                    <span>{t.icon}</span>
                    <small>{t.name}</small>
                  </div>
                ))}
              </div>
              <div className="skill-bars">
                {SKILLS.map(s => (
                  <div className="skill-item" key={s.label}>
                    <div className="skill-label">
                      <span>{s.label}</span>
                      <span>{s.pct}%</span>
                    </div>
                    <div className="skill-track">
                      <div className="skill-fill" style={{ width: `${s.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Trusted By (Logo bar) ── */}
      <section className="trust-bar reveal">
        <p className="trust-label">TRUSTED BY BUSINESSES ACROSS INDUSTRIES</p>
        <div className="trust-logos">
          {['E-Commerce','FinTech','HealthCare','EdTech','Real Estate','SaaS'].map(b => (
            <div className="trust-chip" key={b}>{b}</div>
          ))}
        </div>
      </section>

      {/* ── Areas We Serve (GEO) ── */}
      <section className="trust-bar reveal" style={{ borderTop:'none' }}>
        <p className="trust-label">WEB & APP DEVELOPMENT SERVICES ACROSS UTTAR PRADESH</p>
        <div className="trust-logos">
          {SERVICE_AREAS.map(city => (
            <div className="trust-chip" key={city}>📍 {city}</div>
          ))}
        </div>
      </section>

      {/* ── Services Preview ── */}
      <section className="section" style={{ background:'var(--dark)' }}>
        <div className="section-inner">
          <div className="reveal">
            <span className="section-tag">What We Offer</span>
            <h2 className="section-title">Core <span className="highlight">Services</span></h2>
            <p className="section-desc">From concept to deployment — we cover every layer of the digital stack.</p>
          </div>
          <div className="home-services-grid">
            {[
              { icon:'🌐', name:'Web Development',      desc:'Custom, responsive, SEO-ready websites built for performance.' },
              { icon:'📱', name:'Mobile Apps',           desc:'Native & cross-platform apps that users love.' },
              { icon:'📈', name:'SEO & AEO & GEO',       desc:'Rank higher on search engines and AI assistants.' },
              { icon:'🎨', name:'UI/UX Design',          desc:'Beautiful, user-centered interfaces that convert.' },
              { icon:'☁️', name:'Cloud & DevOps',         desc:'Scalable cloud infra with CI/CD and monitoring.' },
              { icon:'🤖', name:'AI & Automation',        desc:'Smart tools that save time and scale your operations.' },
            ].map(s => (
              <div className="card home-svc-card reveal" key={s.name}>
                <div className="svc-icon">{s.icon}</div>
                <div className="svc-name">{s.name}</div>
                <p className="svc-desc">{s.desc}</p>
              </div>
            ))}
          </div>
          <div style={{ textAlign:'center', marginTop:'2.5rem' }}>
            <Link to="/services" className="btn-outline">Explore All Services →</Link>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <FAQ items={HOME_FAQS} tag="Got Questions?" title="Frequently Asked Questions" />

      {/* ── CTA Banner ── */}
      <section className="cta-banner reveal">
        <div className="cta-inner">
          <h2 className="cta-title">Ready to Transform Your <span className="highlight">Business?</span></h2>
          <p className="cta-sub">Let's talk about your next big project. Free consultation, no commitment.</p>
          <div style={{ display:'flex', gap:'1rem', flexWrap:'wrap', justifyContent:'center' }}>
            <button className="btn-primary" onClick={onOpenPopup}>🚀 Get Started Today</button>
            <Link to="/contact" className="btn-outline">Contact Us</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
