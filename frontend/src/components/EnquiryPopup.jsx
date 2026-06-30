// src/components/EnquiryPopup.jsx
import { useState } from 'react';
import { submitEnquiry } from '../api';

const SERVICES = [
  'Web Development','Mobile App Development','UI/UX Design',
  'SEO & Digital Marketing','Cloud & DevOps','AI & Automation',
];

export default function EnquiryPopup({ onClose }) {
  const [form, setForm]       = useState({ full_name:'', email:'', phone:'', service: SERVICES[0], message:'' });
  const [loading, setLoading] = useState(false);
  const [done, setDone]       = useState(false);
  const [error, setError]     = useState('');

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.full_name.trim() || !form.email.trim()) {
      setError('Name and Email are required.'); return;
    }
    setError(''); setLoading(true);
    try {
      await submitEnquiry({ ...form, source: 'popup' });
      setDone(true);
      setTimeout(onClose, 2800);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="popup-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="popup-box">
        <button className="popup-close" onClick={onClose}>✕</button>

        {done ? (
          <div style={{ textAlign:'center', padding:'2rem 0' }}>
            <div style={{ fontSize:'3rem', marginBottom:'1rem' }}>🎉</div>
            <h3 style={{ fontFamily:'Orbitron,sans-serif', color:'var(--cyan)', marginBottom:'.5rem' }}>
              Thank You!
            </h3>
            <p style={{ color:'var(--gray)' }}>We'll reach out within 2 hours.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate>
            <div className="popup-badge">✨ FREE CONSULTATION</div>
            <h2 className="popup-title">Let's Build<br/>Something <span className="highlight">Great</span></h2>
            <p className="popup-subtitle">Fill in details — our team contacts you within 2 hours.</p>

            {error && (
              <p style={{ color:'#f87171', fontSize:'.85rem', marginBottom:'1rem' }}>{error}</p>
            )}

            <div className="form-group">
              <label>Full Name *</label>
              <input value={form.full_name} onChange={set('full_name')} placeholder="Your full name" />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Email *</label>
                <input type="email" value={form.email} onChange={set('email')} placeholder="your@email.com" />
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input type="tel" value={form.phone} onChange={set('phone')} placeholder="+91 xxxxx xxxxx" />
              </div>
            </div>

            <div className="form-group">
              <label>Service Needed</label>
              <select value={form.service} onChange={set('service')}>
                {SERVICES.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label>Brief Requirement</label>
              <textarea value={form.message} onChange={set('message')} placeholder="Tell us about your project..." style={{ minHeight:'80px' }} />
            </div>

            <button type="submit" className="btn-primary" style={{ width:'100%', justifyContent:'center' }} disabled={loading}>
              {loading ? '⏳ Submitting...' : '🚀 Request Free Consultation'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
