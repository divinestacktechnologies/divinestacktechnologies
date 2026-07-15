// src/pages/Contact.jsx
import { useState } from 'react';
import { submitEnquiry } from '../api';
import useReveal from '../hooks/useReveal';
import SEO from '../components/SEO';
import FAQ, { getFAQSchema } from '../components/FAQ';
import '../styles/Contact.css';

const SERVICES = ['Web Development','Mobile App Development','UI/UX Design','SEO & Digital Marketing','Cloud & DevOps','AI & Automation','Other'];
const BUDGETS  = ['₹25,000 – ₹50,000','₹50,000 – ₹1,00,000','₹1,00,000 – ₹5,00,000','₹5,00,000+','Let\'s Discuss'];

const INIT = { full_name:'', email:'', phone:'', service:SERVICES[0], budget:BUDGETS[0], message:'' };

const CONTACT_FAQS = [
  { q:'How long does a website project take?', a:'A standard website takes 2–4 weeks. Complex web apps can take 6–12 weeks depending on scope.' },
  { q:'Do you offer ongoing support?', a:'Yes, we offer monthly maintenance plans covering updates, security patches, and performance monitoring.' },
  { q:'Can you work with clients outside India?', a:'Absolutely. We serve clients globally and are experienced with remote collaboration across time zones.' },
  { q:'What is your payment process?', a:'We typically work with 50% upfront and 50% on delivery, with milestones for larger projects.' },
  { q:'How quickly will you respond to my enquiry?', a:'We respond to all enquiries within 24 hours, often much sooner during business hours (Mon–Sat, 9 AM–7 PM IST).' },
  { q:'Is the initial consultation really free?', a:'Yes, the first consultation call is completely free with no obligation. We use it to understand your needs and provide an accurate quote.' },
];

export default function Contact() {
  const [form, setForm]     = useState(INIT);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError]   = useState('');

  useReveal();

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.full_name.trim() || !form.email.trim() || !form.message.trim()) {
      setError('Name, Email, and Message are required.'); return;
    }
    setError(''); setLoading(true);
    try {
      await submitEnquiry({ ...form, source:'contact' });
      setSuccess(true); setForm(INIT);
    } catch {
      setError('Something went wrong. Please try again or email us directly.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <SEO
        title="Contact Us — Get a Free Consultation"
        description="Get in touch with Divine Stack Technologies for web development, mobile apps, SEO, and digital marketing. Free consultation, response within 24 hours."
        path="/contact"
        breadcrumbs={[{name:'Home',path:'/'},{name:'Contact',path:'/contact'}]}
        schema={[
          {
            '@context': 'https://schema.org',
            '@type': 'ContactPage',
            name: 'Contact Divine Stack Technologies',
            about: {
              '@type': 'Organization',
              name: 'Divine Stack Technologies',
              email: 'divinestacktechnologies@gmail.com',
              telephone: '+91-81261-96064',
              address: { '@type': 'PostalAddress', addressLocality: 'Uttar Pradesh', addressCountry: 'IN' },
            },
          },
          getFAQSchema(CONTACT_FAQS),
        ]}
      />
      {/* Hero */}
      <section className="page-hero reveal">
        <span className="section-tag">Let's Talk</span>
        <h1 className="page-hero-title">Get In <span className="highlight">Touch</span></h1>
        <p className="page-hero-desc">Tell us about your project. We respond within 24 hours.</p>
      </section>

      {/* Contact grid */}
      <section className="section">
        <div className="section-inner contact-grid">

          {/* Left — Info */}
          <div className="contact-info reveal">
            <h2 style={{ fontFamily:'Orbitron,sans-serif', fontSize:'1.5rem', marginBottom:'1rem' }}>
              Let's Build Something <span className="highlight">Great Together</span>
            </h2>
            <p style={{ color:'#9CA3AF', lineHeight:1.8, marginBottom:'2rem' }}>
              Whether you have a clear brief or just an idea — reach out. We'll help you figure out the best path forward.
            </p>

            {[
              { icon:'📧', label:'Email',    val:'divinestacktechnologies@gmail.com', href:'mailto:divinestacktechnologies@gmail.com' },
              { icon:'📞', label:'Phone',    val:'+91 81261 96064', href:'tel:+918126196064' },
              { icon:'📍', label:'Location', val:'Uttar Pradesh, India', href:'#' },
              { icon:'🕐', label:'Hours',    val:'Mon–Sat: 9:00 AM – 7:00 PM IST', href:'#' },
            ].map(item => (
              <a href={item.href} className="contact-item" key={item.label}>
                <div className="contact-item-icon">{item.icon}</div>
                <div>
                  <div className="contact-item-label">{item.label}</div>
                  <div className="contact-item-val">{item.val}</div>
                </div>
              </a>
            ))}

            {/* Social */}
            <div className="social-row">
              {['LinkedIn','Twitter / X','Instagram','GitHub'].map(s => (
                <a href="#!" className="social-chip" key={s}>{s}</a>
              ))}
            </div>
          </div>

          {/* Right — Form */}
          <div className="card contact-form-card reveal">
            {success ? (
              <div className="success-msg">
                <div style={{ fontSize:'3.5rem', marginBottom:'1rem' }}>🎉</div>
                <h3 style={{ fontFamily:'Orbitron,sans-serif', color:'var(--cyan)', marginBottom:'.5rem' }}>Message Sent!</h3>
                <p style={{ color:'var(--gray)' }}>We'll get back to you within 24 hours.</p>
                <button className="btn-primary" style={{ marginTop:'1.5rem' }} onClick={() => setSuccess(false)}>
                  Send Another
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate>
                <h3 style={{ fontFamily:'Orbitron,sans-serif', fontSize:'1.1rem', marginBottom:'1.5rem' }}>
                  Send Us a Message
                </h3>

                {error && <p className="form-error">{error}</p>}

                <div className="form-row">
                  <div className="form-group"><label>Full Name *</label><input value={form.full_name} onChange={set('full_name')} placeholder="Your name" /></div>
                  <div className="form-group"><label>Email *</label><input type="email" value={form.email} onChange={set('email')} placeholder="your@email.com" /></div>
                </div>
                <div className="form-row">
                  <div className="form-group"><label>Phone</label><input type="tel" value={form.phone} onChange={set('phone')} placeholder="+91 xxxxx xxxxx" /></div>
                  <div className="form-group"><label>Service Needed</label>
                    <select value={form.service} onChange={set('service')}>
                      {SERVICES.map(s => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
                <div className="form-group"><label>Budget Range</label>
                  <select value={form.budget} onChange={set('budget')}>
                    {BUDGETS.map(b => <option key={b}>{b}</option>)}
                  </select>
                </div>
                <div className="form-group"><label>Project Details *</label>
                  <textarea value={form.message} onChange={set('message')} placeholder="Tell us about your project, goals, and timeline..." style={{ minHeight:130 }} />
                </div>
                <button type="submit" className="btn-primary" style={{ width:'100%', justifyContent:'center' }} disabled={loading}>
                  {loading ? '⏳ Sending...' : '🚀 Send Message'}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <FAQ items={CONTACT_FAQS} tag="FAQ" title="Common Questions Before You Reach Out" />
    </div>
  );
}
