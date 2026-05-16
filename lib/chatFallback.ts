export const welcomeReplies = [
  "Welcome to Saabi Labs. Ask a quick question about our services, or visit the contact page to speak with a project manager.",
  "Hi, this is Saabi Assist. I can answer simple questions, and our project managers can help with consultations on the contact page.",
  "Hello from Saabi Labs. For project consultations, please use the contact page to reach us on WhatsApp, Telegram, or X."
];

export const fallbackConsultationReply =
  "Please use the contact page to reach one of our project managers for a consultation on WhatsApp, Telegram, or X.";

export function getWelcomeReply(seed = Date.now()) {
  return welcomeReplies[Math.abs(seed) % welcomeReplies.length];
}
