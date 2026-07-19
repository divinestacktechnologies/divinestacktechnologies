// src/components/Footer.jsx
import { Link } from 'react-router-dom';
import '../styles/Footer.css';

export default function Footer() {
  return (
    <footer style={{
      position:'relative', zIndex:1,
      background:'#060912',
      borderTop:'1px solid rgba(0,212,255,.15)',
      padding:'4rem 5vw 2rem',
    }}>
      <div className="footer-grid">
        <div>
          <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
            <img src="/logo-small.png" alt="Divine Stack Technologies" style={{ width:34, height:34, objectFit:'contain' }} />
            <div style={{ fontFamily:'Orbitron,sans-serif', fontSize:'1.35rem', fontWeight:700,
              background:'linear-gradient(90deg,#00D4FF,#2563EB)',
              WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
              Divine<span style={{ fontWeight:400 }}>Stack</span>
            </div>
          </div>
          <p style={{ color:'var(--gray)', fontSize:'.9rem', lineHeight:1.8, margin:'1rem 0 1.5rem', maxWidth:300 }}>
            Building world-class digital solutions that drive real business results. Your vision, our expertise.
          </p>
          <div style={{ display:'flex', gap:'12px' }}>
            {[
              {
                name: 'Instagram',
                href: 'https://www.instagram.com/divinestacktechnologies/',
                icon: (
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                  </svg>
                ),
              },
              {
                name: 'X (Twitter)',
                href: 'https://x.com/divinestacktech',
                icon: (
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                ),
              },
            ].map(s => (
              <a key={s.name} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.name}
                style={{ width:36, height:36, borderRadius:8,
                border:'1px solid rgba(0,212,255,.2)',
                display:'flex', alignItems:'center', justifyContent:'center',
                color:'var(--gray)', transition:'all .2s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor='#00D4FF'; e.currentTarget.style.color='#00D4FF'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor='rgba(0,212,255,.2)'; e.currentTarget.style.color='var(--gray)'; }}
              >{s.icon}</a>
            ))}
          </div>
        </div>

        {[
          { title:'Services', links:[
            ['Web Development','/services'],
            ['Mobile Apps','/services'],
            ['UI/UX Design','/services'],
            ['SEO & Marketing','/services'],
            ['Cloud Solutions','/services'],
          ]},
          { title:'Company', links:[
            ['About Us','/about'],
            ['Portfolio','/portfolio'],
            ['Blog','/blog'],
            ['Contact','/contact'],
          ]},
          { title:'Contact', links:[
            ['divinestacktechnologies@gmail.com','mailto:divinestacktechnologies@gmail.com'],
            ['+91 81261 96064','tel:+918126196064'],
            ['Uttar Pradesh, India','#'],
          ]},
        ].map(col => (
          <div key={col.title}>
            <div style={{ fontFamily:'Orbitron,sans-serif', fontSize:'.72rem',
              letterSpacing:'.15em', color:'var(--cyan)', marginBottom:'1.2rem', textTransform:'uppercase' }}>
              {col.title}
            </div>
            <ul style={{ listStyle:'none' }}>
              {col.links.map(([label, href]) => {
                const isExternal = /^(mailto:|tel:|#)/.test(href);
                const linkStyle = { color:'var(--gray)', fontSize:'.9rem', transition:'color .2s' };
                const hoverProps = {
                  onMouseEnter: e => e.currentTarget.style.color = '#00D4FF',
                  onMouseLeave: e => e.currentTarget.style.color = 'var(--gray)',
                };
                return (
                  <li key={label} style={{ marginBottom:'.65rem' }}>
                    {isExternal ? (
                      <a href={href} style={linkStyle} {...hoverProps}>{label}</a>
                    ) : (
                      <Link to={href} style={linkStyle} {...hoverProps}>{label}</Link>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      <div style={{ borderTop:'1px solid rgba(0,212,255,.12)', paddingTop:'1.5rem',
        display:'flex', justifyContent:'space-between', alignItems:'center',
        maxWidth:1200, margin:'0 auto', fontSize:'.82rem', color:'var(--gray)', flexWrap:'wrap', gap:'1rem' }}>
        <span>© {new Date().getFullYear()} Divine Stack Technologies. All rights reserved.</span>
        <span>Made with ❤️ in India</span>
      </div>
    </footer>
  );
}
