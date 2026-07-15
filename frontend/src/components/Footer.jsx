// src/components/Footer.jsx
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer style={{
      position:'relative', zIndex:1,
      background:'#060912',
      borderTop:'1px solid rgba(0,212,255,.15)',
      padding:'4rem 5vw 2rem',
    }}>
      <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr 1fr 1fr', gap:'3rem', maxWidth:1200, margin:'0 auto 3rem' }}>
        <div>
          <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
            <img src="/logo.png" alt="Divine Stack Technologies" style={{ width:34, height:34, objectFit:'contain' }} />
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
            {['LinkedIn','Twitter','Instagram','GitHub'].map(s => (
              <a key={s} href="#!" style={{ width:36, height:36, borderRadius:8,
                border:'1px solid rgba(0,212,255,.2)',
                display:'flex', alignItems:'center', justifyContent:'center',
                fontSize:'.75rem', color:'var(--gray)', transition:'all .2s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor='#00D4FF'; e.currentTarget.style.color='#00D4FF'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor='rgba(0,212,255,.2)'; e.currentTarget.style.color='var(--gray)'; }}
              >{s[0]}</a>
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
              {col.links.map(([label, href]) => (
                <li key={label} style={{ marginBottom:'.65rem' }}>
                  <Link to={href} style={{ color:'var(--gray)', fontSize:'.9rem', transition:'color .2s' }}
                    onMouseEnter={e => e.currentTarget.style.color='#00D4FF'}
                    onMouseLeave={e => e.currentTarget.style.color='var(--gray)'}
                  >{label}</Link>
                </li>
              ))}
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
