// src/App.jsx
import { useState, useEffect, Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import CircuitCanvas  from './components/CircuitCanvas';
import Navbar         from './components/Navbar';
import Footer         from './components/Footer';
import EnquiryPopup   from './components/EnquiryPopup';
import WhatsAppButton from './components/WhatsAppButton';
import ChatBot        from './components/ChatBot';
import Home           from './pages/Home'; // eager — this is the primary landing page
import './index.css';

// Everything else loads on demand (code-splitting) — trims the initial JS bundle
// significantly, since e.g. the Admin panel's code never needs to be downloaded
// by a visitor who only looks at the public marketing pages.
const Services  = lazy(() => import('./pages/Services'));
const About     = lazy(() => import('./pages/About'));
const Portfolio = lazy(() => import('./pages/Portfolio'));
const Contact   = lazy(() => import('./pages/Contact'));
const Blog      = lazy(() => import('./pages/Blog'));
const BlogPost  = lazy(() => import('./pages/BlogPost'));
const Admin     = lazy(() => import('./pages/Admin'));

// Minimal, brand-matching fallback shown while a lazy chunk is downloading
function RouteLoader() {
  return (
    <div style={{ minHeight:'60vh', display:'flex', alignItems:'center', justifyContent:'center', paddingTop:70 }}>
      <div style={{ width:36, height:36, border:'3px solid rgba(0,212,255,.2)', borderTopColor:'#00D4FF', borderRadius:'50%', animation:'spin .8s linear infinite' }} />
      <style>{'@keyframes spin{to{transform:rotate(360deg)}}'}</style>
    </div>
  );
}

// Scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

// Hide nav/footer on admin page
function Layout({ children, onOpenPopup }) {
  const { pathname } = useLocation();
  const isAdmin = pathname.startsWith('/admin');
  return (
    <>
      {!isAdmin && <Navbar onOpenPopup={onOpenPopup} />}
      {children}
      {!isAdmin && <Footer />}
    </>
  );
}

// Everything that needs route awareness lives here, inside <BrowserRouter>,
// so useLocation() always reflects the current route (including client-side
// navigation, not just full page loads).
function AppContent() {
  const [popupOpen, setPopupOpen] = useState(false);
  const { pathname } = useLocation();
  const isAdminPage = pathname.startsWith('/admin');

  // Auto-open popup after 30 seconds — once per session, never on /admin
  useEffect(() => {
    if (isAdminPage) return;
    if (sessionStorage.getItem('dst_popup_shown')) return;
    const timer = setTimeout(() => {
      setPopupOpen(true);
      sessionStorage.setItem('dst_popup_shown', '1');
    }, 30000);
    return () => clearTimeout(timer);
  }, [isAdminPage]);

  const openPopup  = () => setPopupOpen(true);
  const closePopup = () => setPopupOpen(false);

  return (
    <>
      <CircuitCanvas />
      <ScrollToTop />
      <Layout onOpenPopup={openPopup}>
        <Suspense fallback={<RouteLoader />}>
          <Routes>
            <Route path="/"          element={<Home      onOpenPopup={openPopup} />} />
            <Route path="/services"  element={<Services  onOpenPopup={openPopup} />} />
            <Route path="/about"     element={<About     onOpenPopup={openPopup} />} />
            <Route path="/portfolio" element={<Portfolio onOpenPopup={openPopup} />} />
            <Route path="/contact"   element={<Contact />} />
            <Route path="/blog"      element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/admin"     element={<Admin />} />
            <Route path="*"          element={
              <div style={{ minHeight:'80vh', display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', gap:'1rem', paddingTop:70 }}>
                <div style={{ fontFamily:'Orbitron,sans-serif', fontSize:'5rem', color:'var(--cyan)' }}>404</div>
                <p style={{ color:'var(--gray)' }}>Page not found.</p>
                <a href="/" className="btn-primary">← Go Home</a>
              </div>
            } />
          </Routes>
        </Suspense>
      </Layout>

      {/* Global Enquiry Popup — never on /admin */}
      {popupOpen && !isAdminPage && <EnquiryPopup onClose={closePopup} />}

      {/* WhatsApp Chat Button — never on /admin */}
      {!isAdminPage && <WhatsAppButton />}

      {/* Rule-based FAQ Chatbot — never on /admin */}
      {!isAdminPage && <ChatBot />}
    </>
  );
}

export default function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </HelmetProvider>
  );
}
