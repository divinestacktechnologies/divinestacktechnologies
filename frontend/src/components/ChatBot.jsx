// src/components/ChatBot.jsx
import { useState, useRef, useEffect } from 'react';
import { matchFAQ, QUICK_REPLIES } from '../data/chatbotFAQ';
import { submitEnquiry } from '../api';
import '../styles/ChatBot.css';

const WHATSAPP_LINK = 'https://wa.me/918126196064?text=' + encodeURIComponent("Hi! I'd like to know more about your services.");

const GREETING = "Hey there! 👋 I'm the Divine Stack Assistant. Ask me about our services, pricing, timelines, or portfolio — or tap a quick option below.";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([{ from:'bot', text: GREETING }]);
  const [input, setInput] = useState('');
  const [leadStep, setLeadStep] = useState(null); // null | 'name' | 'email' | 'phone' | 'message'
  const [leadData, setLeadData] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const bodyRef = useRef(null);

  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [messages, open]);

  const addBot  = (text) => setMessages(m => [...m, { from:'bot', text }]);
  const addUser = (text) => setMessages(m => [...m, { from:'user', text }]);

  const startLeadCapture = () => {
    setLeadStep('name');
    addBot("Sure! Could you share your name?");
  };

  const handleLeadStep = async (text) => {
    if (leadStep === 'name') {
      setLeadData(d => ({ ...d, full_name: text }));
      setLeadStep('email');
      addBot(`Thanks, ${text}! What's your email address so our team can reach you?`);
      return;
    }
    if (leadStep === 'email') {
      if (!EMAIL_RE.test(text.trim())) {
        addBot("That doesn't look like a valid email — could you double check and re-enter it?");
        return;
      }
      setLeadData(d => ({ ...d, email: text.trim() }));
      setLeadStep('phone');
      addBot("Got it! And a phone number? (optional — type \"skip\" to continue)");
      return;
    }
    if (leadStep === 'phone') {
      setLeadData(d => ({ ...d, phone: text.trim().toLowerCase() === 'skip' ? null : text.trim() }));
      setLeadStep('message');
      addBot("Last thing — anything specific you'd like us to know? (optional — type \"skip\" to send now)");
      return;
    }
    if (leadStep === 'message') {
      const finalMsg = text.trim().toLowerCase() === 'skip' ? '' : text.trim();
      const payload = {
        ...leadData,
        message: `[Via Website Chatbot] ${finalMsg || 'No additional message.'}`,
        source: 'contact',
      };
      setSubmitting(true);
      try {
        await submitEnquiry(payload);
        addBot("Thanks! 🎉 Our team will reach out to you soon. For a faster response, you can also message us directly on WhatsApp.");
      } catch (err) {
        addBot("Hmm, something went wrong sending that. Please reach us directly on WhatsApp instead — tap the green button on this page.");
      } finally {
        setSubmitting(false);
        setLeadStep(null);
        setLeadData({});
      }
    }
  };

  const handleSend = async (rawText) => {
    const text = (rawText ?? input).trim();
    if (!text || submitting) return;
    addUser(text);
    setInput('');

    if (leadStep) {
      await handleLeadStep(text);
      return;
    }

    if (/talk to a human|human|team|agent/i.test(text)) {
      startLeadCapture();
      return;
    }

    const reply = matchFAQ(text);
    if (reply) {
      addBot(reply);
    } else {
      addBot("I don't have a specific answer for that, but I can connect you with our team — want to leave your details, or chat on WhatsApp?");
    }
  };

  const handleQuickReply = (label) => {
    if (label === 'Talk to a Human') {
      addUser(label);
      startLeadCapture();
      return;
    }
    handleSend(label);
  };

  return (
    <>
      <button
        className="chatbot-fab"
        onClick={() => setOpen(o => !o)}
        aria-label={open ? 'Close chat' : 'Open chat'}
      >
        {open ? '✕' : '💬'}
      </button>

      {open && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <div>
              <div className="chatbot-title">Divine Stack Assistant</div>
              <div className="chatbot-subtitle">Usually replies instantly</div>
            </div>
          </div>

          <div className="chatbot-body" ref={bodyRef}>
            {messages.map((m, i) => (
              <div key={i} className={`chatbot-msg ${m.from}`}>{m.text}</div>
            ))}
            {submitting && <div className="chatbot-msg bot">Sending...</div>}
          </div>

          {!leadStep && messages.length <= 1 && (
            <div className="chatbot-quickreplies">
              {QUICK_REPLIES.map(q => (
                <button key={q} onClick={() => handleQuickReply(q)}>{q}</button>
              ))}
            </div>
          )}

          <div className="chatbot-input-row">
            <input
              type="text"
              placeholder="Type your message…"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              disabled={submitting}
            />
            <button onClick={() => handleSend()} disabled={submitting}>➤</button>
          </div>

          <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer" className="chatbot-whatsapp-link">
            Prefer WhatsApp? Chat with us there →
          </a>
        </div>
      )}
    </>
  );
}
