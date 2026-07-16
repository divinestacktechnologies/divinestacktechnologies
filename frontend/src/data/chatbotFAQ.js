// src/data/chatbotFAQ.js
// Simple keyword-matched FAQ rules for the free rule-based chatbot.
// Each rule: array of trigger keywords (matched as substrings, case-insensitive) + a reply.
// First matching rule (top to bottom) wins.

const CHATBOT_FAQ = [
  {
    keywords: ['service', 'services', 'what do you do', 'offer'],
    reply: "We offer Web Development, Mobile App Development, UI/UX Design, SEO/AEO/GEO, Cloud & DevOps, and AI & Automation. Want details on any of these, or should I show you our Services page?",
  },
  {
    keywords: ['price', 'pricing', 'cost', 'charge', 'budget', 'quote'],
    reply: "Pricing depends on what you need — a simple website, a custom web app, or an internal tool all cost differently. The best way to get an accurate number is a quick free consultation. Want me to connect you with the team?",
  },
  {
    keywords: ['portfolio', 'work', 'projects', 'clients', 'examples'],
    reply: "We've built projects across education, coaching institutes, manufacturing, real estate, food & beverage, and e-commerce. Check out our Portfolio page to see live examples!",
  },
  {
    keywords: ['contact', 'phone', 'number', 'call', 'reach'],
    reply: "You can reach us at +91 81261 96064 or divinestacktechnologies@gmail.com. Or just tap the WhatsApp button on this page for a quick chat!",
  },
  {
    keywords: ['location', 'where', 'address', 'based', 'city'],
    reply: "We're based in Uttar Pradesh, India (Meerut/Noida region), and we work with clients across India.",
  },
  {
    keywords: ['time', 'timeline', 'how long', 'duration', 'deliver'],
    reply: "Timelines depend on project complexity — a simple website can take 1-2 weeks, while a custom web app with a database and admin panel usually takes 3-6 weeks. We'll give you an exact estimate after understanding your requirements.",
  },
  {
    keywords: ['crm', 'lead generation', 'lead gen'],
    reply: "Yes! Alongside client websites, we also build custom Lead Generation tools and CRM systems in-house — tailored exactly to how your business operates, not a generic off-the-shelf platform. Check our Portfolio page for more.",
  },
  {
    keywords: ['website', 'web app', 'web application', 'difference'],
    reply: "A website is mainly for showcasing information (like a brochure), while a web app involves logins, databases, and interactive features (like a CRM or booking system). Not sure which one you need? Happy to help you figure that out — just share a bit about your business.",
  },
  {
    keywords: ['seo', 'rank', 'google', 'search engine'],
    reply: "Yes, we offer SEO, AEO (Answer Engine Optimization), and GEO (Generative Engine Optimization) as part of our services — helping your site show up in Google, AI search assistants, and more.",
  },
  {
    keywords: ['mobile', 'app', 'android', 'ios'],
    reply: "We build mobile apps for both Android and iOS. Tell me a bit about what you're looking to build, or I can connect you with the team for a detailed discussion.",
  },
  {
    keywords: ['hello', 'hi', 'hey', 'namaste'],
    reply: "Hey there! 👋 I'm the Divine Stack Assistant. Ask me about our services, pricing, timelines, or portfolio — or tap below to talk to our team directly.",
  },
  {
    keywords: ['thank', 'thanks'],
    reply: "You're welcome! Let us know if there's anything else you'd like to know. 😊",
  },
];

export const QUICK_REPLIES = ['Our Services', 'Pricing', 'Portfolio', 'Talk to a Human'];

export function matchFAQ(input) {
  const text = input.toLowerCase();
  for (const rule of CHATBOT_FAQ) {
    if (rule.keywords.some(k => text.includes(k))) return rule.reply;
  }
  return null;
}

export default CHATBOT_FAQ;
