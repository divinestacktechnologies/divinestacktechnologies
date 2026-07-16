// src/App.jsx
import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import CircuitCanvas  from './components/CircuitCanvas';
import Navbar         from './components/Navbar';
import Footer         from './components/Footer';
import EnquiryPopup   from './components/EnquiryPopup';
import WhatsAppButton from './components/WhatsAppButton';
import ChatBot        from './components/ChatBot';
import Home           from './pages/Home';
import Services       from './pages/Services';
import About          from './pages/About';
import Portfolio      from './pages/Portfolio';
import Contact        from './pages/Contact';
import Blog           from './pages/Blog';
import BlogPost       from './pages/BlogPost';
import Admin          from './pages/Admin';
import './index.css';

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
