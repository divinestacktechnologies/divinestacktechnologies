// src/pages/About.jsx
import { Link } from 'react-router-dom';
import useReveal from '../hooks/useReveal';
import SEO from '../components/SEO';
import FAQ, { getFAQSchema } from '../components/FAQ';
import '../styles/About.css';

const TEAM = [
  { name:'Chirag Gupta', role:'Founder & CEO', photo:'/chirag-gupta.jpg', phone:'+91 81261 96064', bio:'Passionate about building digital products that help businesses grow. Leading Divine Stack Technologies with a focus on quality and client success.' },
];

const VALUES = [
  { icon:'💡', title:'Innovation',   desc:'We stay ahead of the curve — adopting new technologies that give our clients a real edge.' },
  { icon:'🤝', title:'Transparency', desc:'Open communication, honest timelines, and no hidden charges. Ever.' },
  { icon:'🎯', title:'Results First', desc:'Every decision we make is tied back to your business goals and measurable outcomes.' },
  { icon:'❤️', title:'Client Love',  desc:'Your success is our success. We build long-term partnerships, not one-off projects.' },
];

const ABOUT_FAQS = [
  { q:'When was Divine Stack Technologies founded?', a:'Divine Stack Technologies was founded over 5 years ago, starting as a two-person web studio in Uttar Pradesh, India, and has since grown into a full-service digital agency.' },
  { q:'Who is behind Divine Stack Technologies?', a:'Divine Stack Technologies is led by Chirag Gupta, who personally oversees every project to ensure quality, clear communication, and timely delivery for every client.' },
  { q:'Where is Divine Stack Technologies based?', a:'We are headquartered in Uttar Pradesh, India, and serve clients across India as well as internationally through remote collaboration.' },
  { q:'What industries does Divine Stack Technologies work with?', a:'We have delivered projects across e-commerce, healthcare, fintech, edtech, real estate, hospitality, and SaaS industries.' },
];

export default function About({ onOpenPopup }) {
  useReveal();

  return (
    <div className="page">
      <SEO
        title="About Us — Our Story, Team & Values"
        description="Learn about Divine Stack Technologies — a full-service digital agency in Uttar Pradesh with 5+ years of experience and 150+ projects delivered."
        path="/about"
        breadcrumbs={[{name:'Home',path:'/'},{name:'About',path:'/about'}]}
        schema={getFAQSchema(ABOUT_FAQS)}
      />
      {/* Hero */}
      <section className="page-hero reveal">
        <span className="section-tag">Who We Are</span>
        <h1 className="page-hero-title">Building <span className="highlight">Tomorrow's</span><br />Digital World Today</h1>
        <p className="page-hero-desc">Divine Stack Technologies is a full-service digital agency driven by passion, precision, and performance.</p>
      </section>

      {/* Story */}
      <section className="section">
        <div className="section-inner about-story reveal">
          <div className="about-ring-wrap">
            <div className="about-ring">
              <div className="about-ring-mid">
                <div className="about-core">
                  <div className="core-num">5+</div>
                  <div className="core-lbl">YEARS</div>
                </div>
              </div>
            </div>
          </div>
          <div>
            <span className="section-tag">Our Story</span>
            <h2 className="section-title">From a Small <span className="highlight">Idea</span> to a Full Digital Agency</h2>
            <p style={{ color:'#9CA3AF', lineHeight:1.8, marginBottom:'1rem' }}>
              Divine Stack Technologies was founded with one goal: to help Indian businesses compete on the global digital stage. We started as a two-person web studio and have grown into a full-service agency with expertise across web, mobile, design, SEO, and cloud.
            </p>
            <p style={{ color:'#9CA3AF', lineHeight:1.8, marginBottom:'2rem' }}>
              Today we serve 50+ clients across India and beyond — from early-stage startups to established enterprises — delivering solutions that are as robust under the hood as they are beautiful on the surface.
            </p>
            <div className="about-stats-row">
              {[['150+','Projects'],['50+','Clients'],['5+','Years'],['100%','Dedication']].map(([n,l]) => (
                <div className="about-stat" key={l}>
                  <div className="about-stat-num">{n}</div>
                  <div className="about-stat-lbl">{l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section" style={{ background:'var(--dark)' }}>
        <div className="section-inner">
          <div className="reveal" style={{ textAlign:'center' }}>
            <span className="section-tag" style={{ justifyContent:'center' }}>Our DNA</span>
            <h2 className="section-title">What We <span className="highlight">Stand For</span></h2>
            <p className="section-desc" style={{ margin:'0 auto 3rem' }}>The principles that guide every decision we make.</p>
          </div>
          <div className="values-grid">
            {VALUES.map(v => (
              <div className="card reveal" key={v.title} style={{ textAlign:'center' }}>
                <div style={{ fontSize:'2.5rem', marginBottom:'.8rem' }}>{v.icon}</div>
                <div style={{ fontFamily:'Orbitron,sans-serif', fontWeight:600, marginBottom:'.6rem' }}>{v.title}</div>
                <p style={{ color:'#9CA3AF', fontSize:'.9rem', lineHeight:1.7 }}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="section">
        <div className="section-inner">
          <div className="reveal" style={{ textAlign:'center' }}>
            <span className="section-tag" style={{ justifyContent:'center' }}>The People</span>
            <h2 className="section-title">Meet the <span className="highlight">Team</span></h2>
            <p className="section-desc" style={{ margin:'0 auto 3rem' }}>Talented individuals united by a love for technology and great work.</p>
          </div>
          <div className="team-grid">
            {TEAM.map(m => (
              <div className="card team-card reveal" key={m.name}>
                {m.photo
                  ? <img src={m.photo} alt={m.name} className="team-avatar team-avatar-photo" />
                  : <div className="team-avatar">{m.emoji}</div>
                }
                <div className="team-name">{m.name}</div>
                <div className="team-role">{m.role}</div>
                <p className="team-bio">{m.bio}</p>
                {m.phone && (
                  <a href={`tel:${m.phone.replace(/\s/g,'')}`} className="team-phone">
                    📞 {m.phone}
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <FAQ items={ABOUT_FAQS} tag="About Us FAQs" title="Questions About Our Company" />

      {/* CTA */}
      <section className="cta-strip reveal">
        <h2>Want to <span className="highlight">work with us?</span></h2>
        <div style={{ display:'flex', gap:'1rem', flexWrap:'wrap', justifyContent:'center', marginTop:'1.5rem' }}>
          <button className="btn-primary" onClick={onOpenPopup}>🚀 Start a Project</button>
          <Link to="/contact" className="btn-outline">Get in Touch</Link>
        </div>
      </section>
    </div>
  );
}
