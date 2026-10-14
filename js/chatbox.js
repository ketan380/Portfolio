/**
 * ==========================================================================
 * Floating Chatbox & Contact Messaging Architecture
 * For Ketan Sapkale | Developer Command Center Portfolio
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  initChatbox();
});

function initChatbox() {
  const triggerBtn = document.getElementById('chat-toggle-btn');
  const chatWindow = document.getElementById('chat-window');
  const minimizeBtn = document.getElementById('chat-minimize-btn');
  const closeBtn = document.getElementById('chat-close-btn');
  const chatForm = document.getElementById('chat-contact-form');
  const alertEl = document.getElementById('chat-form-alert');
  const submitBtn = document.getElementById('chat-submit-btn');
  const quickChips = document.querySelectorAll('.chat-chip-btn');
  const subjectInput = document.getElementById('chat-sender-subject');
  const nameInput = document.getElementById('chat-sender-name');
  const emailInput = document.getElementById('chat-sender-email');
  const messageInput = document.getElementById('chat-sender-message');
  const honeypotInput = document.getElementById('chat-hp-field');
  const chatBadge = document.getElementById('chat-unread-badge');

  if (!triggerBtn || !chatWindow || !chatForm) return;

  // Initialize EmailJS browser SDK if public key is available
  if (window.emailjs && typeof isEmailJSConfigured === 'function' && isEmailJSConfigured()) {
    try {
      emailjs.init({
        publicKey: EMAILJS_CONFIG.PUBLIC_KEY,
      });
    } catch (err) {
      console.warn('[EmailJS] Initialization notice:', err);
    }
  }

  /* ------------------------------------------------------------------------
     1. WINDOW TOGGLE & ACCESSIBILITY CONTROLS
     ------------------------------------------------------------------------ */
  function openChat() {
    chatWindow.classList.add('active');
    triggerBtn.classList.add('chat-open');
    triggerBtn.setAttribute('aria-expanded', 'true');
    chatWindow.setAttribute('aria-hidden', 'false');

    // Hide unread badge once opened
    if (chatBadge) {
      chatBadge.style.display = 'none';
    }

    // Smooth focus management: focus name input on desktop, or keep view friendly
    setTimeout(() => {
      if (window.innerWidth > 600 && nameInput) {
        nameInput.focus();
      } else if (closeBtn) {
        closeBtn.focus();
      }
    }, 150);
  }

  function closeChat() {
    chatWindow.classList.remove('active');
    triggerBtn.classList.remove('chat-open');
    triggerBtn.setAttribute('aria-expanded', 'false');
    chatWindow.setAttribute('aria-hidden', 'true');
    triggerBtn.focus();
  }

  triggerBtn.addEventListener('click', () => {
    if (chatWindow.classList.contains('active')) {
      closeChat();
    } else {
      openChat();
    }
  });

  if (minimizeBtn) {
    minimizeBtn.addEventListener('click', closeChat);
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', closeChat);
  }

  // Keyboard accessibility: ESC closes chat window
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && chatWindow.classList.contains('active')) {
      closeChat();
    }
  });

  /* ------------------------------------------------------------------------
     2. QUICK CONTACT CHIPS (Fill Subject Automatically)
     ------------------------------------------------------------------------ */
  quickChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const topic = chip.getAttribute('data-topic');
      if (subjectInput && topic) {
        subjectInput.value = topic;
        
        // Visual indicator on active chip
        quickChips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');

        // Move focus to message area to facilitate quick typing
        if (messageInput) {
          messageInput.focus();
        }
      }
    });
  });

  // If user clears or types custom subject, unselect quick chips if no match
  if (subjectInput) {
    subjectInput.addEventListener('input', () => {
      const val = subjectInput.value.trim().toLowerCase();
      quickChips.forEach(chip => {
        const topic = (chip.getAttribute('data-topic') || '').toLowerCase();
        if (val === topic) {
          chip.classList.add('active');
        } else {
          chip.classList.remove('active');
        }
      });
    });
  }

  /* ------------------------------------------------------------------------
     3. FORM SUBMISSION, VALIDATION & EMAILJS DISPATCH
     ------------------------------------------------------------------------ */
  chatForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Prevent duplicate clicks if submission already in flight
    if (submitBtn.disabled) return;

    // Check honeypot spam trap
    if (honeypotInput && honeypotInput.value.trim() !== '') {
      console.warn('[Security] Bot transmission dropped via honeypot.');
      showFeedback('Transmission received. Thank you.', 'success');
      chatForm.reset();
      return;
    }

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const subject = subjectInput ? subjectInput.value.trim() : '';
    const message = messageInput.value.trim();

    // Validation 1: Required fields
    if (!name || !email || !message) {
      showFeedback('Please fill out all required fields (Name, Email, Message).', 'error');
      return;
    }

    // Validation 2: Valid email pattern
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showFeedback('Please provide a valid email address (e.g., name@example.com).', 'error');
      emailInput.focus();
      return;
    }

    // Validation 3: Message length
    if (message.length < 5) {
      showFeedback('Please write a message with at least 5 characters.', 'error');
      messageInput.focus();
      return;
    }

    // Validation 4: Client-side rate limiting
    const lastSent = sessionStorage.getItem('portfolio_last_chat_sent');
    const cooldown = (EMAILJS_CONFIG && EMAILJS_CONFIG.RATE_LIMIT_SECONDS) || 30;
    const now = Date.now();

    if (lastSent && (now - parseInt(lastSent, 10)) < (cooldown * 1000)) {
      const secondsLeft = Math.ceil((cooldown * 1000 - (now - parseInt(lastSent, 10))) / 1000);
      showFeedback(`Please wait ${secondsLeft} second(s) before sending another message.`, 'warning');
      return;
    }

    // Check if EmailJS configuration is ready
    const isConfigured = typeof isEmailJSConfigured === 'function' && isEmailJSConfigured();

    if (!isConfigured) {
      showFeedback(
        '⚠️ EmailJS is not configured yet. Please configure your Service ID, Template ID, and Public Key in "js/email-config.js". See developer guide below.',
        'warning'
      );
      console.info(
        '%c[EmailJS Setup Notice]%c Please set your actual credentials in %cjs/email-config.js%c.\n1. SERVICE_ID\n2. TEMPLATE_ID\n3. PUBLIC_KEY\nVisit https://www.emailjs.com to get your free credentials.',
        'background: #00f0ff; color: #000; font-weight: bold; padding: 2px 6px; border-radius: 3px;',
        'color: inherit;',
        'color: #00f0ff; font-weight: bold;',
        'color: inherit;'
      );
      return;
    }

    // Update UI state for transmission
    const originalBtnContent = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = `
      <span class="chat-btn-spinner" aria-hidden="true"></span>
      <span>Transmitting message...</span>
    `;
    showFeedback('Connecting to email dispatch service...', 'loading');

    // Build payload matching required template variables
    const templateParams = {
      name: name,
      email: email,
      reply_to: email, // Configures visitor's email as the reply-to address
      subject: subject || 'Portfolio Contact Inquiry',
      message: message,
      submission_date: new Date().toLocaleString('en-US', {
        dateStyle: 'medium',
        timeStyle: 'short'
      }),
      portfolio_source: window.location.href
    };

    try {
      // Send message via official EmailJS browser SDK
      const response = await emailjs.send(
        EMAILJS_CONFIG.SERVICE_ID,
        EMAILJS_CONFIG.TEMPLATE_ID,
        templateParams,
        EMAILJS_CONFIG.PUBLIC_KEY
      );

      if (response && (response.status === 200 || response.text === 'OK')) {
        // Required exact success message
        showFeedback('Thank you for contacting me! Your message has been sent successfully.', 'success');
        chatForm.reset();
        quickChips.forEach(c => c.classList.remove('active'));
        sessionStorage.setItem('portfolio_last_chat_sent', Date.now().toString());

        if (typeof triggerTelemetryToast === 'function') {
          triggerTelemetryToast('Message payload dispatched successfully.');
        }
      } else {
        throw new Error(`EmailJS responded with status: ${response ? response.status : 'Unknown'}`);
      }
    } catch (error) {
      console.error('[EmailJS Transmission Error]', error);
      const fallback = (EMAILJS_CONFIG && EMAILJS_CONFIG.FALLBACK_EMAIL) || 'ketansapkale2004@gmail.com';
      showFeedback(
        `Message transmission could not be completed. Please try again or reach out directly at ${fallback}.`,
        'error'
      );
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnContent;
    }
  });

  /* ------------------------------------------------------------------------
     4. FEEDBACK ALERT HELPER
     ------------------------------------------------------------------------ */
  let alertTimer = null;
  function showFeedback(text, type) {
    if (!alertEl) return;
    clearTimeout(alertTimer);

    alertEl.textContent = text;
    alertEl.className = `chat-form-alert ${type}`;

    if (type === 'success') {
      alertTimer = setTimeout(() => {
        alertEl.className = 'chat-form-alert';
        alertEl.textContent = '';
      }, 7000);
    } else if (type === 'warning' || type === 'error') {
      alertTimer = setTimeout(() => {
        // Keep error visible for 9 seconds so the user can read guidance
        alertEl.className = 'chat-form-alert';
        alertEl.textContent = '';
      }, 9000);
    }
  }
}
