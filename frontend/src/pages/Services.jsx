// src/pages/Services.jsx
import { Link } from 'react-router-dom';
import useReveal from '../hooks/useReveal';
import SEO from '../components/SEO';
import FAQ, { getFAQSchema } from '../components/FAQ';
import '../styles/Services.css';

const SERVICES = [
  {
    icon:'🌐', name:'Web Development',
    desc:'We craft high-performance websites and web apps using React, Next.js, and Node.js. Every project is mobile-first, SEO-optimised, and built to convert visitors into customers.',
    tags:['React','Next.js','Node.js','TypeScript','REST APIs'],
    features:['Custom Design & Development','E-Commerce Solutions','CMS Integration','Performance Optimisation','SSL & Security Hardening'],
    faq:{ q:'How much does web development cost?', a:'A simple business website starts around ₹25,000–₹50,000. E-commerce or custom web applications range from ₹1,00,000 to ₹5,00,000+ depending on features.' },
  },
  {
    icon:'📱', name:'Mobile App Development',
    desc:'From concept to App Store — we build native iOS/Android apps and cross-platform solutions using React Native and Flutter that deliver exceptional user experiences.',
    tags:['React Native','Flutter','iOS','Android','Firebase'],
    features:['Cross-Platform Development','Push Notifications','Offline Support','App Store Submission','Post-Launch Support'],
    faq:{ q:'Do you build apps for both iOS and Android?', a:'Yes, we build cross-platform apps using React Native and Flutter that work on both iOS and Android from a single codebase, saving you time and cost.' },
  },
  {
    icon:'🎨', name:'UI/UX Design',
    desc:'User-centred design that balances beauty with function. We create design systems, Figma prototypes, and pixel-perfect interfaces that users love.',
    tags:['Figma','Adobe XD','Design Systems','Prototyping','Wireframing'],
    features:['User Research & Personas','Wireframes & Prototypes','Design System Creation','Usability Testing','Handoff to Dev'],
    faq:{ q:'What is included in your UI/UX design service?', a:'Our UI/UX service includes user research, wireframing, interactive Figma prototypes, a complete design system, and usability testing before handoff to development.' },
  },
  {
    icon:'📈', name:'SEO, AEO & GEO',
    desc:'We optimise for traditional search (SEO), AI-generated answers (AEO), and location-based discovery (GEO) to maximise your visibility everywhere your customers search.',
    tags:['On-Page SEO','Schema Markup','AEO','GEO','Content Strategy'],
    features:['Technical SEO Audit','Structured Data (JSON-LD)','AI Answer Optimisation','Local & Geo Targeting','Monthly Reporting'],
    faq:{ q:'What is the difference between SEO, AEO, and GEO?', a:'SEO optimises your site for traditional search engines like Google. AEO (Answer Engine Optimisation) optimises content so AI tools like ChatGPT and Google SGE can find and cite you. GEO (Generative Engine Optimisation / Geo-targeting) ensures your business shows up for location-based searches.' },
  },
  {
    icon:'☁️', name:'Cloud & DevOps',
    desc:'Scalable cloud infrastructure on AWS, GCP, or Azure. We set up CI/CD pipelines, Docker containers, and 24/7 monitoring so your app stays fast and reliable.',
    tags:['AWS','Docker','Kubernetes','CI/CD','Terraform'],
    features:['Cloud Architecture Design','Containerisation','CI/CD Pipelines','Auto-Scaling','Security & Compliance'],
    faq:{ q:'Which cloud providers do you work with?', a:'We work with AWS, Google Cloud Platform, and Microsoft Azure. AWS is our most common recommendation for cost-efficiency and scalability for small to mid-size businesses.' },
  },
  {
    icon:'🤖', name:'AI & Automation',
    desc:'Leverage the power of AI — chatbots, recommendation engines, process automation, and custom ML integrations that give your business a competitive edge.',
    tags:['OpenAI API','LangChain','Python','n8n','Zapier'],
    features:['AI Chatbots & Assistants','Workflow Automation','Data Analytics Dashboards','ML Model Integration','Custom AI Tools'],
    faq:{ q:'Can you add an AI chatbot to my existing website?', a:'Yes, we can integrate an AI chatbot using the OpenAI API or similar tools into your existing website or app, trained on your business data to answer customer questions automatically.' },
  },
];

const SERVICES_FAQS = [
  { q:'Which service is right for my business?', a:'It depends on your goals. If you need an online presence, start with Web Development. If you want to reach customers on mobile, consider Mobile App Development. Most clients combine Web Development with SEO/AEO/GEO for maximum visibility. Book a free consultation and we will recommend the right mix.' },
  { q:'Can you handle multiple services together, like web design plus SEO?', a:'Yes, most of our clients bundle services. A common combination is Web Development + UI/UX Design + SEO & AEO, which ensures the site is beautiful, fast, and discoverable from day one.' },
  { q:'Do you build websites that are optimised for AI search engines (AEO)?', a:'Yes. Every website we build includes structured data (JSON-LD schema), FAQ markup, and content formatted for AI answer engines like Google SGE, ChatGPT, and Perplexity, in addition to traditional SEO.' },
  { q:'What technologies do you use for web and app development?', a:'We primarily use React, Next.js, and Node.js for web development, and React Native or Flutter for mobile apps. For cloud and DevOps, we use AWS, Docker, and Kubernetes.' },
  { q:'Do you offer custom pricing for combined service packages?', a:'Yes, we offer discounted bundle pricing when you combine two or more services, such as Web Development with SEO, or Mobile App Development with Cloud & DevOps support.' },
];

export default function Services({ onOpenPopup }) {
  useReveal();

  return (
    <div className="page">
      <SEO
        title="Our Services — Web, App, SEO & Cloud Solutions"
        description="Explore Divine Stack Technologies' full range of services: web development, mobile apps, UI/UX design, SEO & AEO, cloud & DevOps, and AI automation."
        path="/services"
        breadcrumbs={[{name:'Home',path:'/'},{name:'Services',path:'/services'}]}
        schema={[
          ...SERVICES.map(s => ({
            '@context': 'https://schema.org',
            '@type': 'Service',
            serviceType: s.name,
            provider: { '@type': 'Organization', name: 'Divine Stack Technologies' },
            areaServed: 'IN',
            description: s.desc,
          })),
          getFAQSchema([
            ...SERVICES.filter(s => s.faq).map(s => s.faq),
            ...SERVICES_FAQS,
          ]),
        ]}
      />
      {/* Page Hero */}
      <section className="page-hero reveal">
        <span className="section-tag">What We Do</span>
        <h1 className="page-hero-title">Our <span className="highlight">Services</span></h1>
        <p className="page-hero-desc">Comprehensive digital solutions tailored to accelerate your business growth — delivered by a passionate team of experts.</p>
      </section>

      {/* Services List */}
      <section className="section">
        <div className="section-inner">
          {SERVICES.map((s, i) => (
            <div className={`svc-block reveal ${i % 2 === 1 ? 'svc-block--reverse' : ''}`} key={s.name}>
              <div className="svc-block-icon-wrap">
                <div className="svc-block-icon">{s.icon}</div>
                <div className="svc-tags">
                  {s.tags.map(t => <span className="tag" key={t}>{t}</span>)}
                </div>
              </div>
              <div className="svc-block-info">
                <h3 className="svc-block-name">{s.name}</h3>
                <p className="svc-block-desc">{s.desc}</p>
                <ul className="svc-features">
                  {s.features.map(f => (
                    <li key={f}><span className="feat-dot" />  {f}</li>
                  ))}
                </ul>
                {s.faq && (
                  <div className="svc-mini-faq">
                    <div className="svc-mini-faq-q">❓ {s.faq.q}</div>
                    <p className="svc-mini-faq-a">{s.faq.a}</p>
                  </div>
                )}
                <button className="btn-primary" onClick={onOpenPopup} style={{ marginTop:'1.5rem' }}>
                  Get a Quote →
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Process */}
      <section className="section" style={{ background:'var(--dark)' }}>
        <div className="section-inner">
          <div className="reveal">
            <span className="section-tag">How We Work</span>
            <h2 className="section-title">Our <span className="highlight">Process</span></h2>
            <p className="section-desc">A structured, transparent approach that keeps you informed every step of the way.</p>
          </div>
          <div className="process-steps">
            {[
              { n:'01', title:'Discovery',    desc:'We deeply understand your goals, audience, and technical requirements.' },
              { n:'02', title:'Strategy',     desc:'We plan architecture, design direction, and project milestones together.' },
              { n:'03', title:'Design & Build', desc:'Our team designs and develops in sprints with regular demos and feedback.' },
              { n:'04', title:'Test & Launch', desc:'Rigorous QA, performance testing, then a smooth production deployment.' },
              { n:'05', title:'Support & Grow', desc:'Post-launch monitoring, updates, and ongoing growth strategy.' },
            ].map(step => (
              <div className="process-step card reveal" key={step.n}>
                <div className="step-num">{step.n}</div>
                <div className="step-title">{step.title}</div>
                <p className="step-desc">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <FAQ items={SERVICES_FAQS} tag="Service FAQs" title="Common Questions About Our Services" />

      {/* CTA */}
      <section className="cta-strip reveal">
        <h2>Ready to get started? <span className="highlight">Let's talk.</span></h2>
        <div style={{ display:'flex', gap:'1rem', flexWrap:'wrap', justifyContent:'center', marginTop:'1.5rem' }}>
          <button className="btn-primary" onClick={onOpenPopup}>🚀 Free Consultation</button>
          <Link to="/contact" className="btn-outline">Contact Us</Link>
        </div>
      </section>
    </div>
  );
}
