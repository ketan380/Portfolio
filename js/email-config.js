/**
 * ==========================================================================
 * EmailJS Configuration for Ketan Sapkale's Portfolio Chatbox
 * ==========================================================================
 * 
 * To activate live email transmission to your inbox:
 * 1. Create a free account at https://www.emailjs.com/
 * 2. Connect your email service under "Email Services" (e.g., Gmail)
 * 3. Create an email template under "Email Templates"
 * 4. Obtain your Public Key from "Account" > "Public Key"
 * 5. Replace the placeholder values below with your real keys.
 * 
 * SECURITY NOTE:
 * Never put private email passwords, SMTP passwords, or secret API keys in
 * frontend code. EmailJS Public Key is designed for client-side browser use.
 */

const EMAILJS_CONFIG = {
  // Replace these placeholders with your actual EmailJS credentials:
  SERVICE_ID: 'YOUR_SERVICE_ID',       // e.g. "service_xxxxxxx"
  TEMPLATE_ID: 'YOUR_TEMPLATE_ID',     // e.g. "template_xxxxxxx"
  PUBLIC_KEY: 'YOUR_PUBLIC_KEY',       // e.g. "xxxxxxxxxxxxxxxx"

  // Anti-spam cooldown (seconds) between submissions from the same browser session
  RATE_LIMIT_SECONDS: 30,

  // Fallback email shown to visitor if email service experiences an outage
  FALLBACK_EMAIL: 'ketansapkale2004@gmail.com'
};

/**
 * Checks whether the user has replaced placeholder credentials with real keys.
 * @returns {boolean}
 */
function isEmailJSConfigured() {
  return (
    Boolean(EMAILJS_CONFIG.SERVICE_ID) &&
    EMAILJS_CONFIG.SERVICE_ID !== 'YOUR_SERVICE_ID' &&
    Boolean(EMAILJS_CONFIG.TEMPLATE_ID) &&
    EMAILJS_CONFIG.TEMPLATE_ID !== 'YOUR_TEMPLATE_ID' &&
    Boolean(EMAILJS_CONFIG.PUBLIC_KEY) &&
    EMAILJS_CONFIG.PUBLIC_KEY !== 'YOUR_PUBLIC_KEY'
  );
}

// Bind to window/global scope for seamless browser access
if (typeof window !== 'undefined') {
  window.EMAILJS_CONFIG = EMAILJS_CONFIG;
  window.isEmailJSConfigured = isEmailJSConfigured;
} else if (typeof global !== 'undefined') {
  global.EMAILJS_CONFIG = EMAILJS_CONFIG;
  global.isEmailJSConfigured = isEmailJSConfigured;
}
