/**
 * ==========================================================================
 * Inside Ketan's Dev Space — Interactive Architecture & Terminal Engine
 * Author: Ketan Sapkale | IT Engineering & Backend Developer
 * Profiles:
 *   - GitHub: https://github.com/ketan380
 *   - CodeChef: https://www.codechef.com/users/rcp_cc_774
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  initThemeSwitch();
  initCommandBar();
  initHeroAnimation();
  initInteractiveTerminal();
  initMobileMenu();
  initScrollObserver();
  initContactTerminal();
  initModals();
  initCopyActions();
  initCustomCursor();
  initBackToTop();
  initCardInteractions();
});

/* ==========================================================================
   1. THEME SWITCHER (Dark Default / Light Mode)
   ========================================================================== */
function initThemeSwitch() {
  const switchBtn = document.getElementById('theme-switch-btn');
  if (!switchBtn) return;

  const savedTheme = localStorage.getItem('ketan-portfolio-theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);

  switchBtn.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme') || 'dark';
    const nextTheme = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', nextTheme);
    localStorage.setItem('ketan-portfolio-theme', nextTheme);
    triggerTelemetryToast(`Theme switched to: ${nextTheme.toUpperCase()}`);
  });
}

/* ==========================================================================
   2. COMMAND BAR STICKY & ACTIVE NAVIGATION TRACKING
   ========================================================================== */
function initCommandBar() {
  const bar = document.getElementById('command-bar');
  const navLinks = document.querySelectorAll('.cmd-nav-link');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      bar.classList.add('scrolled');
    } else {
      bar.classList.remove('scrolled');
    }
  }, { passive: true });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, {
    rootMargin: '-20% 0px -65% 0px',
    threshold: 0
  });

  sections.forEach(sec => observer.observe(sec));
}

/* ==========================================================================
   3. HERO CINEMATIC ANIMATED TEXT REVEAL
   ========================================================================== */
function initHeroAnimation() {
  const heroTitle = document.getElementById('hero-title');
  if (!heroTitle) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    heroTitle.classList.add('revealed');
    return;
  }

  // Smooth staggered reveal quickly after page loads so content is immediately accessible
  setTimeout(() => {
    heroTitle.classList.add('revealed');
  }, 100);
}

/* ==========================================================================
   4. INTERACTIVE DEVELOPER TERMINAL ("Inside Ketan's Dev Space")
   ========================================================================== */
function initInteractiveTerminal() {
  const terminalScreen = document.getElementById('terminal-output');
  const terminalInput = document.getElementById('terminal-input');
  const terminalForm = document.getElementById('terminal-form');
  const terminalContainer = document.getElementById('interactive-terminal-box');
  const suggestionButtons = document.querySelectorAll('.term-chip-btn');

  if (!terminalScreen || !terminalInput || !terminalForm) return;

  // Command History tracking
  const commandHistory = [];
  let historyIndex = -1;

  // Focus input when user clicks anywhere in the terminal container
  if (terminalContainer) {
    terminalContainer.addEventListener('click', (e) => {
      // Don't steal focus if clicking links or chip buttons
      if (!e.target.closest('a') && !e.target.closest('button')) {
        terminalInput.focus();
      }
    });
  }

  // Handle command submission
  terminalForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const rawCmd = terminalInput.value.trim();
    if (!rawCmd) return;

    // Record in history
    commandHistory.push(rawCmd);
    historyIndex = commandHistory.length;

    // Process & clear input
    executeTerminalCommand(rawCmd);
    terminalInput.value = '';
    scrollToTerminalBottom();
  });

  // History navigation with Up / Down arrow keys
  terminalInput.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (historyIndex > 0) {
        historyIndex--;
        terminalInput.value = commandHistory[historyIndex] || '';
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex < commandHistory.length - 1) {
        historyIndex++;
        terminalInput.value = commandHistory[historyIndex] || '';
      } else {
        historyIndex = commandHistory.length;
        terminalInput.value = '';
      }
    }
  });

  // Suggestion chips click-to-run
  suggestionButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const cmd = btn.getAttribute('data-cmd');
      if (cmd) {
        terminalInput.value = cmd;
        commandHistory.push(cmd);
        historyIndex = commandHistory.length;
        executeTerminalCommand(cmd);
        terminalInput.value = '';
        terminalInput.focus();
        scrollToTerminalBottom();
      }
    });
  });

  function scrollToTerminalBottom() {
    setTimeout(() => {
      terminalScreen.scrollTop = terminalScreen.scrollHeight;
    }, 50);
  }

  // Safe Text Rendering Command Engine
  function executeTerminalCommand(cmdString) {
    const cleanCmd = cmdString.trim().toLowerCase();

    // 1. Echo the user's typed command safely
    const echoLine = document.createElement('div');
    echoLine.className = 'term-line term-user-echo';
    
    const promptSpan = document.createElement('span');
    promptSpan.className = 'term-prompt';
    promptSpan.textContent = 'ketan@dev-space:~$ ';

    const cmdSpan = document.createElement('span');
    cmdSpan.className = 'term-entered-cmd';
    cmdSpan.textContent = cmdString;

    echoLine.appendChild(promptSpan);
    echoLine.appendChild(cmdSpan);
    terminalScreen.appendChild(echoLine);

    // 2. Dispatch response block
    const resBlock = document.createElement('div');
    resBlock.className = 'term-response-block';

    switch (cleanCmd) {
      case 'help':
        resBlock.innerHTML = `
          <div class="term-help-grid">
            <div><span class="term-key">help</span><span class="term-val">— Display list of all available commands</span></div>
            <div><span class="term-key">about</span><span class="term-val">— Summary of role, education &amp; engineering interests</span></div>
            <div><span class="term-key">projects</span><span class="term-val">— Explore featured applications &amp; architecture</span></div>
            <div><span class="term-key">skills</span><span class="term-val">— Technical stack, languages &amp; frameworks</span></div>
            <div><span class="term-key">github</span><span class="term-val">— Launch GitHub profile (https://github.com/ketan380)</span></div>
            <div><span class="term-key">codechef</span><span class="term-val">— Launch CodeChef profile (rcp_cc_774)</span></div>
            <div><span class="term-key">contact</span><span class="term-val">— Jump directly to contact form &amp; email</span></div>
            <div><span class="term-key">clear</span><span class="term-val">— Clear the terminal session screen</span></div>
          </div>
        `;
        break;

      case 'about':
        resBlock.innerHTML = `
          <div class="term-card-response">
            <div class="term-badge">ABOUT KETAN SAPKALE</div>
            <p><strong>Role:</strong> Information Technology Engineering Student</p>
            <p><strong>Foundation:</strong> Completed Diploma in Computer Engineering at KCE Society's College of Engineering &amp; Management.</p>
            <p><strong>Technical Focus:</strong> Python, Django, Django REST Framework, backend systems, database schemas, and REST APIs.</p>
            <p style="color: var(--text-muted); font-size: 0.88rem; margin-top: 6px;">
              "I enjoy building practical web applications, developing backend systems, and learning technologies that solve real-world problems."
            </p>
          </div>
        `;
        break;

      case 'projects':
        resBlock.innerHTML = `
          <div class="term-card-response">
            <div class="term-badge">FEATURED APPLICATIONS</div>
            <div class="term-project-row">
              <span class="term-proj-num">01.</span>
              <div>
                <strong>Personal Digital Content Organizer</strong> <span class="term-highlight">[FLAGSHIP]</span>
                <p>Web app to organize, categorize, search, and manage multimodal personal content. (Python, Django, DRF, SQLite)</p>
              </div>
            </div>
            <div class="term-project-row">
              <span class="term-proj-num">02.</span>
              <div>
                <strong>Prime Plus Event Planner</strong>
                <p>Event management web application supporting event schedules, workflows, and budgets. (Python, Django, SQLite, Bootstrap)</p>
              </div>
            </div>
            <div class="term-project-row">
              <span class="term-proj-num">03.</span>
              <div>
                <strong>RCPIT College Website</strong>
                <p>Responsive college website interface with departmental navigation, admissions, and syllabus notes. (HTML, CSS, JS)</p>
              </div>
            </div>
            <div style="margin-top: 8px;">
              <a href="#projects" class="term-link-action">Inspect Projects Section ↓</a>
            </div>
          </div>
        `;
        break;

      case 'skills':
        resBlock.innerHTML = `
          <div class="term-card-response">
            <div class="term-badge">TOOLS I WORK WITH</div>
            <div style="line-height: 1.7; font-size: 0.9rem;">
              <p><strong>Programming:</strong> Python, JavaScript, HTML5, CSS3</p>
              <p><strong>Backend:</strong> Django, Django REST Framework, REST API development</p>
              <p><strong>Database:</strong> SQLite, MySQL</p>
              <p><strong>Tools:</strong> Git, GitHub, VS Code</p>
            </div>
          </div>
        `;
        break;

      case 'github':
        resBlock.innerHTML = `
          <div class="term-action-response">
            <span style="color: var(--cyan);">⚡ Opening GitHub in new browser tab...</span>
            <p><a href="https://github.com/ketan380" target="_blank" rel="noopener noreferrer" class="term-link-action">https://github.com/ketan380 ↗</a></p>
          </div>
        `;
        window.open('https://github.com/ketan380', '_blank', 'noopener,noreferrer');
        break;

      case 'codechef':
        resBlock.innerHTML = `
          <div class="term-action-response">
            <span style="color: var(--violet);">⚡ Opening CodeChef profile in new browser tab...</span>
            <p><a href="https://www.codechef.com/users/rcp_cc_774" target="_blank" rel="noopener noreferrer" class="term-link-action">https://www.codechef.com/users/rcp_cc_774 ↗</a></p>
          </div>
        `;
        window.open('https://www.codechef.com/users/rcp_cc_774', '_blank', 'noopener,noreferrer');
        break;

      case 'contact':
        resBlock.innerHTML = `
          <div class="term-action-response">
            <span style="color: var(--emerald);">⚡ Navigating to contact section...</span>
            <p>Direct Email: <a href="mailto:ketansapkale2004@gmail.com" class="term-link-action">ketansapkale2004@gmail.com</a></p>
          </div>
        `;
        const contactSec = document.getElementById('contact');
        if (contactSec) {
          contactSec.scrollIntoView({ behavior: 'smooth' });
        }
        break;

      case 'clear':
        terminalScreen.innerHTML = '';
        const welcomeNotice = document.createElement('div');
        welcomeNotice.className = 'term-welcome-msg';
        welcomeNotice.innerHTML = `
          <div class="term-welcome-title">Inside Ketan's Dev Space · Shell v2.4</div>
          <div class="term-welcome-sub">Type <span class="term-cmd-hint">help</span> to view available commands, or click the suggested buttons above.</div>
        `;
        terminalScreen.appendChild(welcomeNotice);
        return;

      default:
        // Unknown command handling with safe textContent
        const errText = document.createElement('div');
        errText.className = 'term-err-line';
        errText.textContent = `zsh: command not recognized: "${cmdString}". Type "help" to display all valid commands.`;
        resBlock.appendChild(errText);
        break;
    }

    terminalScreen.appendChild(resBlock);
  }
}

/* ==========================================================================
   5. MOBILE DRAWER NAVIGATION
   ========================================================================== */
function initMobileMenu() {
  const toggleBtn = document.getElementById('mobile-cmd-toggle');
  const drawer = document.getElementById('mobile-cmd-drawer');
  const links = document.querySelectorAll('.mobile-cmd-link');
  if (!toggleBtn || !drawer) return;

  function toggle(open) {
    const isNowOpen = open !== undefined ? open : !drawer.classList.contains('open');
    if (isNowOpen) {
      drawer.classList.add('open');
      toggleBtn.classList.add('active');
      toggleBtn.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    } else {
      drawer.classList.remove('open');
      toggleBtn.classList.remove('active');
      toggleBtn.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  }

  toggleBtn.addEventListener('click', () => toggle());
  links.forEach(l => l.addEventListener('click', () => toggle(false)));

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('open')) {
      toggle(false);
    }
  });
}

/* ==========================================================================
   6. SCROLL ENTRY OBSERVER & STORYTELLING TRANSITIONS
   ========================================================================== */
function initScrollObserver() {
  const revealElements = document.querySelectorAll('.reveal-entry, .reveal-on-scroll');
  if (!revealElements.length) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    revealElements.forEach(el => el.classList.add('revealed'));
    return;
  }

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        obs.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.08,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => observer.observe(el));
}

/* ==========================================================================
   7. ON-PAGE CONTACT FORM WITH EMAILJS INTEGRATION
   ========================================================================== */
function initContactTerminal() {
  const form = document.getElementById('contact-cmd-form');
  const alertEl = document.getElementById('cmd-form-alert');
  const sendBtn = document.getElementById('cmd-submit-btn');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (sendBtn.disabled) return;

    const name = form.elements['name'].value.trim();
    const email = form.elements['email'].value.trim();
    const subject = form.elements['subject'] ? form.elements['subject'].value.trim() : '';
    const message = form.elements['message'].value.trim();

    // Check honeypot if present
    const hp = form.elements['_contact_hp'];
    if (hp && hp.value.trim() !== '') {
      showAlert('Transmission acknowledged.', 'success');
      form.reset();
      return;
    }

    if (!name || !email || !message) {
      showAlert('All required fields (Name, Email, Message) must be filled.', 'error');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showAlert('Please enter a valid email address (e.g., name@example.com).', 'error');
      return;
    }

    if (message.length < 5) {
      showAlert('Please write a message with at least 5 characters.', 'error');
      return;
    }

    const originalBtnContent = sendBtn.innerHTML;
    sendBtn.innerHTML = `<span>Transmitting message...</span>`;
    sendBtn.disabled = true;

    // Check if EmailJS is configured
    const isConfigured = typeof isEmailJSConfigured === 'function' && isEmailJSConfigured();

    if (isConfigured && window.emailjs) {
      const templateParams = {
        name: name,
        email: email,
        reply_to: email,
        subject: subject || 'Portfolio Contact Inquiry',
        message: message,
        submission_date: new Date().toLocaleString(),
        portfolio_source: window.location.href
      };

      try {
        const response = await emailjs.send(
          EMAILJS_CONFIG.SERVICE_ID,
          EMAILJS_CONFIG.TEMPLATE_ID,
          templateParams,
          EMAILJS_CONFIG.PUBLIC_KEY
        );

        if (response && (response.status === 200 || response.text === 'OK')) {
          showAlert('Thank you for contacting me! Your message has been sent successfully.', 'success');
          form.reset();
          triggerTelemetryToast('Message dispatched successfully.');
        } else {
          throw new Error('EmailJS dispatch failed');
        }
      } catch (err) {
        console.error('[Transmission Error]', err);
        const fallback = (typeof EMAILJS_CONFIG !== 'undefined' && EMAILJS_CONFIG.FALLBACK_EMAIL) || 'ketansapkale2004@gmail.com';
        showAlert(`Message transmission could not be completed. Please email directly at ${fallback}.`, 'error');
      } finally {
        sendBtn.innerHTML = originalBtnContent;
        sendBtn.disabled = false;
      }
    } else {
      // Configuration notice
      setTimeout(() => {
        sendBtn.innerHTML = originalBtnContent;
        sendBtn.disabled = false;
        showAlert('⚠️ EmailJS credentials not set yet. Configure "js/email-config.js" with your EmailJS keys to enable live delivery.', 'warning');
      }, 600);
    }
  });

  function showAlert(msg, status) {
    if (!alertEl) return;
    alertEl.textContent = msg;
    alertEl.className = `form-feedback-alert ${status}`;
    setTimeout(() => {
      alertEl.className = 'form-feedback-alert';
    }, 8000);
  }
}

/* ==========================================================================
   8. MODALS (RESUME & PROJECT ARCHITECTURE DETAILS)
   ========================================================================== */
function initModals() {
  // Resume Modal
  const resumeModal = document.getElementById('resume-modal');
  const openResumeTriggers = document.querySelectorAll('.open-resume-modal');
  const closeResumeTriggers = document.querySelectorAll('.close-resume-modal');

  openResumeTriggers.forEach(b => {
    b.addEventListener('click', (e) => {
      e.preventDefault();
      if (resumeModal) {
        resumeModal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  closeResumeTriggers.forEach(b => {
    b.addEventListener('click', () => {
      if (resumeModal) {
        resumeModal.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  });

  if (resumeModal) {
    resumeModal.addEventListener('click', (e) => {
      if (e.target === resumeModal) {
        resumeModal.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }

  // Project Details Modal
  const projectModal = document.getElementById('project-modal');
  const openProjTriggers = document.querySelectorAll('.open-project-modal');
  const closeProjTriggers = document.querySelectorAll('.close-project-modal');

  const projectCatalog = {
    'organizer': {
      title: 'Personal Digital Content Organizer',
      meta: 'Flagship Project · Full-Stack Django & DRF',
      image: 'assets/images/project-organizer.jpg',
      overview: 'A web application designed to help users organize, categorize, search, and manage personal digital content such as documents, images, videos, notes, and links from a unified interface.',
      status: 'Active Development / Portfolio Showcase',
      contribution: 'Backend development, database schema integration, and RESTful API development.',
      architecture: [
        'Relational data models in SQLite with hierarchical category classification and multi-tag indexing.',
        'Django REST Framework serialization layer powering high-speed asynchronous search and filter queries.',
        'File validation pipeline preventing oversized payloads and restricting dangerous MIME types.',
        'Responsive client interface designed with vanilla JavaScript, modern CSS, and dark mode.'
      ],
      stack: ['Python', 'Django', 'Django REST Framework', 'SQLite', 'HTML5', 'CSS3', 'JavaScript'],
      github: 'https://github.com/ketan380'
    },
    'event-planner': {
      title: 'Prime Plus Event Planner',
      meta: 'Event Architecture & Coordination · Django & JS',
      image: 'assets/images/project-event-planner.jpg',
      overview: 'An event management web application designed to organize event-related information and support administrative and user workflows including scheduling, RSVP management, and budget ledgers.',
      status: 'Completed Prototype Showcase',
      contribution: 'Event scheduling state machine, relational database models, and dashboard interface.',
      architecture: [
        'Event scheduling state machine with automated status transitions and timeline conflict detection.',
        'Relational database models structuring event tiers, guest RSVP confirmations, and budget ledgers.',
        'Interactive client-side dashboards for timeline tracking and real-time expense calculations.',
        'Role-separated dashboard for event organizers, venue coordinators, and attendee RSVPs.'
      ],
      stack: ['Python', 'Django', 'HTML5', 'CSS3', 'Bootstrap', 'SQLite', 'JavaScript'],
      github: 'https://github.com/ketan380'
    },
    'rcpit': {
      title: 'RCPIT College Website',
      meta: 'Academic Resource Engine · HTML, CSS & JavaScript',
      image: 'assets/images/project-academic.jpg',
      overview: 'A responsive college website interface featuring navigation, institutional information, admissions, departmental resources, and contact sections.',
      status: 'Web Interface Showcase',
      contribution: 'Responsive frontend architecture, institutional navigation, and academic resource discovery.',
      architecture: [
        'Organized information hierarchy for departments, semesters, syllabus guidelines, and course resources.',
        'High-speed search and categorization index allowing students to find semester resources quickly.',
        'Accessible, mobile-first responsive layout optimized for fast document retrieval on all screen sizes.',
        'Standard semantic HTML5 markup and modern CSS without heavy framework dependencies.'
      ],
      stack: ['HTML5', 'CSS3', 'JavaScript'],
      github: 'https://github.com/ketan380'
    }
  };

  openProjTriggers.forEach(b => {
    b.addEventListener('click', (e) => {
      e.preventDefault();
      const projId = b.getAttribute('data-project');
      const data = projectCatalog[projId];
      if (!data || !projectModal) return;

      document.getElementById('pm-title').textContent = data.title;
      document.getElementById('pm-meta').textContent = data.meta;
      document.getElementById('pm-image').src = data.image;
      document.getElementById('pm-overview').textContent = data.overview;

      const contribEl = document.getElementById('pm-contrib');
      if (contribEl) {
        contribEl.textContent = data.contribution;
      }

      const statusEl = document.getElementById('pm-status');
      if (statusEl) {
        statusEl.textContent = data.status;
      }

      const archList = document.getElementById('pm-arch');
      archList.innerHTML = data.architecture.map(i => `<li>${i}</li>`).join('');

      const stackBox = document.getElementById('pm-stack');
      stackBox.innerHTML = data.stack.map(s => `<span class="proj-tech-pill">${s}</span>`).join('');

      const ghLink = document.getElementById('pm-gh-link');
      if (ghLink) ghLink.href = data.github;

      projectModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  closeProjTriggers.forEach(b => {
    b.addEventListener('click', () => {
      if (projectModal) {
        projectModal.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  });

  if (projectModal) {
    projectModal.addEventListener('click', (e) => {
      if (e.target === projectModal) {
        projectModal.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }

  // Escape key listener for modals
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (resumeModal && resumeModal.classList.contains('active')) {
        resumeModal.classList.remove('active');
        document.body.style.overflow = '';
      }
      if (projectModal && projectModal.classList.contains('active')) {
        projectModal.classList.remove('active');
        document.body.style.overflow = '';
      }
    }
  });
}

/* ==========================================================================
   9. ONE-CLICK CLIPBOARD ACTIONS
   ========================================================================== */
function initCopyActions() {
  const copyButtons = document.querySelectorAll('.copy-email-trigger');
  copyButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const email = btn.getAttribute('data-email') || 'ketansapkale2004@gmail.com';
      navigator.clipboard.writeText(email).then(() => {
        triggerTelemetryToast(`Copied to clipboard: ${email}`);
      }).catch(() => {
        triggerTelemetryToast('Clipboard access unavailable.');
      });
    });
  });
}

/* ==========================================================================
   10. CUSTOM GLOW CURSOR (Fine Pointer Devices Only)
   ========================================================================== */
function initCustomCursor() {
  const hasFinePointer = window.matchMedia('(pointer: fine)').matches;
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!hasFinePointer || prefersReduced) return;

  const cursorDot = document.createElement('div');
  cursorDot.className = 'custom-cursor-dot';
  const cursorFollower = document.createElement('div');
  cursorFollower.className = 'custom-cursor-follower';

  document.body.appendChild(cursorDot);
  document.body.appendChild(cursorFollower);

  let mouseX = -100, mouseY = -100;
  let followerX = -100, followerY = -100;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorDot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
  }, { passive: true });

  function renderFollower() {
    followerX += (mouseX - followerX) * 0.18;
    followerY += (mouseY - followerY) * 0.18;
    cursorFollower.style.transform = `translate3d(${followerX}px, ${followerY}px, 0)`;
    requestAnimationFrame(renderFollower);
  }
  requestAnimationFrame(renderFollower);

  // Hover state detection on interactive elements
  const interactives = document.querySelectorAll('a, button, input, textarea, .term-chip-btn, .destination-card');
  interactives.forEach(el => {
    el.addEventListener('mouseenter', () => cursorFollower.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => cursorFollower.classList.remove('cursor-hover'));
  });
}

/* ==========================================================================
   11. BACK-TO-TOP FLOATING TRIGGER
   ========================================================================== */
function initBackToTop() {
  const backToTopBtn = document.getElementById('back-to-top-btn');
  if (!backToTopBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  }, { passive: true });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ==========================================================================
   12. INTERACTIVE 3D TILT MICRO-MOTION
   ========================================================================== */
function initCardInteractions() {
  const cards = document.querySelectorAll('.destination-card, .project-view-window');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion || window.innerWidth < 1024) return;

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -4;
      const rotateY = ((x - centerX) / centerX) * 4;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

/* ==========================================================================
   13. TELEMETRY TOAST NOTIFICATION
   ========================================================================== */
function triggerTelemetryToast(message) {
  let toast = document.getElementById('telemetry-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'telemetry-toast';
    toast.className = 'telemetry-toast';
    document.body.appendChild(toast);
  }

  toast.innerHTML = `
    <span style="color: var(--cyan); font-weight: 700;">[DEV-SPACE]</span>
    <span>${message}</span>
  `;

  toast.classList.add('visible');
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => {
    toast.classList.remove('visible');
  }, 3200);
}
