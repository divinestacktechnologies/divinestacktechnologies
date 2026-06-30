// src/components/Navbar.jsx
import { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import '../styles/Navbar.css';

export default function Navbar({ onOpenPopup }) {
  const [scrolled, setScrolled]   = useState(false);
  const [menuOpen, setMenuOpen]   = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const close = () => setMenuOpen(false);

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="navbar-logo" onClick={() => { navigate('/'); close(); }}>
        <img src="/logo.png" alt="Divine Stack Technologies" className="navbar-logo-img" />
        <span>Divine<em>Stack</em></span>
      </div>

      <ul className={`nav-links ${menuOpen ? 'open' : ''}`}>
        <li><NavLink to="/"          onClick={close}>Home</NavLink></li>
        <li><NavLink to="/services"  onClick={close}>Services</NavLink></li>
        <li><NavLink to="/about"     onClick={close}>About</NavLink></li>
        <li><NavLink to="/portfolio" onClick={close}>Portfolio</NavLink></li>
        <li><NavLink to="/contact"   onClick={close}>Contact</NavLink></li>
        <li>
          <button className="nav-cta" onClick={() => { close(); onOpenPopup(); }}>
            Get Free Quote
          </button>
        </li>
      </ul>

      <button
        className={`hamburger ${menuOpen ? 'active' : ''}`}
        onClick={() => setMenuOpen(v => !v)}
        aria-label="Toggle menu"
      >
        <span /><span /><span />
      </button>
    </nav>
  );
}
