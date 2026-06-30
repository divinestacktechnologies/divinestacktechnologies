// src/hooks/useReveal.js
import { useEffect } from 'react';

export default function useReveal(selector = '.reveal') {
  useEffect(() => {
    const els = document.querySelectorAll(selector);
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); } }),
      { threshold: 0.1 }
    );
    els.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, [selector]);
}
