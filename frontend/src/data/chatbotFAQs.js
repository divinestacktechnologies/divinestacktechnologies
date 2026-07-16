// src/data/chatbotFAQs.js
// Simple keyword-matching FAQ data for the rule-based chatbot.
// Order matters — more specific topics should come before generic ones.

const FAQS = [
  {
    keywords: ['price', 'pricing', 'cost', 'charge', 'budget', 'quote', 'expensive', 'cheap'],
    answer: "Pricing depends on what you need — a simple website costs less than a full web app with a database and admin panel. Share your requirements via our Contact page and we'll give you an accurate, free quote.",
  },
  {
    keywords: ['service', 'services', 'what do you do', 'offer', 'work on'],
    answer: "We build websites, web apps, CRMs, lead-generation tools, and admin dashboards — for education, coaching institutes, manufacturing, food & beverage, real estate, and e-commerce businesses. Check our Services page for full details!",
  },
  {
    keywords: ['portfolio', 'projects', 'examples', 'clients', 'shown', 'previous work', 'past work'],
    answer: "We've built projects for schools, coaching institutes, manufacturers, restaurants, and e-commerce stores. Check our Portfolio page to see live examples of our work!",
  },
  {
    keywords: ['time', 'long', 'duration', 'deliver', 'timeline', 'how fast', 'how quickly'],
    answer: "Timelines depend on project complexity — a simple website can take 1-2 weeks, while a custom web app with a database typically takes 3-6 weeks. We'll give you an exact timeline after understanding your requirements.",
  },
  {
    keywords: ['technology', 'tech stack', 'react', 'node', 'built with', 'framework', 'programming'],
    answer: "We primarily build with React, Node.js, and PostgreSQL — modern, reliable, and fully yours (no page-builder lock-in, you own the complete source code).",
  },
  {
    keywords: ['location', 'where are you', 'based', 'office', 'address', 'city'],
    answer: "We're based in Uttar Pradesh, India, and work with clients across the country remotely.",
  },
  {
    keywords: ['contact', 'phone', 'email', 'number', 'call', 'reach you', 'talk to'],
    answer: "You can reach us at +91 81261 96064 or divinestacktechnologies@gmail.com — or just leave your number below and we'll call you back!",
  },
  {
    keywords: ['crm'],
    answer: "Yes! We build lightweight, custom CRM systems — contact records, status pipelines, admin roles, and activity tracking, tailored to how your business actually operates.",
  },
  {
    keywords: ['lead generation', 'leads', 'enquiry system', 'enquiry tool'],
    answer: "We build custom lead generation tools — web forms, popup capture, source tracking, and a dashboard to monitor every enquiry in real time.",
  },
  {
    keywords: ['hi', 'hello', 'hey', 'namaste'],
    answer: "Hi there! 👋 I'm the Divine Stack Assistant. Ask me about our services, pricing, portfolio, or how to reach us.",
  },
  {
    keywords: ['thank', 'thanks', 'thankyou'],
    answer: "You're welcome! Anything else you'd like to know?",
  },
];

export function matchFAQ(userText) {
  const text = userText.toLowerCase();
  for (const faq of FAQS) {
    if (faq.keywords.some(k => text.includes(k))) return faq.answer;
  }
  return null;
}

export const QUICK_REPLIES = ['Our Services', 'Pricing', 'Portfolio', 'Contact Info'];

export const GREETING = "Hi there! 👋 I'm the Divine Stack Assistant. Ask me about our services, pricing, portfolio, or how to reach us — or tap a quick option below.";

export const FALLBACK = "I don't have an exact answer for that yet, but I can have our team call you back personally. Want to leave your name & number?";
