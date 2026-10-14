# Inside Ketan's Dev Space — Signature Developer Portfolio

A distinctive, premium personal developer portfolio engineered for **Ketan Sapkale**, an Information Technology Engineering student and backend developer transitioning from a Diploma in Computer Engineering at KCE Society's College of Engineering & Management.

---

## ⚡ Verified Coding Profiles

- **GitHub**: [https://github.com/ketan380](https://github.com/ketan380)
- **CodeChef**: [https://www.codechef.com/users/rcp_cc_774](https://www.codechef.com/users/rcp_cc_774)

---

## 🎯 Creative Concept: "Inside Ketan's Dev Space"

- **Visual Direction**: Deep midnight blue and void surfaces (`#05070d`, `#070913`, `#0a0e1c`) with electric cyan (`#38bdf8`), indigo (`#6366f1`), and ultraviolet (`#a855f7`) gradients.
- **Cinematic Hero**:
  - Name: **Ketan Sapkale**
  - Headline: *"I build. I learn. I improve."*
  - Supporting Headline: *IT Engineering Student | Python & Django Developer | Backend Development Enthusiast*
  - Authentic Portrait Card with live status beacon.
- **Interactive Developer Terminal (`#dev-space`)**:
  - Prompt: `ketan@dev-space:~$`
  - Real safe text-rendering command engine.
  - Commands supported: `help`, `about`, `projects`, `skills`, `github`, `codechef`, `contact`, `clear`.
  - Arrow key history navigation (<kbd>↑</kbd> / <kbd>↓</kbd>) and clickable command suggestion chips.
- **Code. Build. Solve. (Coding Identities)**:
  - Dedicated showcase cards for GitHub and CodeChef with platform-specific branding accents and new-tab navigation.
- **Tools I Work With**:
  - Clean capabilities grid for Programming (Python, JS, HTML5, CSS3), Backend (Django, DRF, REST APIs), Databases (SQLite, MySQL), and Tools (Git, GitHub, VS Code).
- **Currently Becoming Better At... (Development Journal)**:
  - 5-part engineering notebook covering reliable REST APIs, relational schemas, problem-solving, full-stack applications, and clean architecture.
- **Featured Project Presentations**:
  1. *Personal Digital Content Organizer* (Flagship Case Study — Python, Django, DRF, SQLite, HTML, CSS, JavaScript)
  2. *Prime Plus Event Planner* (Python, Django, HTML, CSS, Bootstrap, SQLite)
  3. *RCPIT College Website* (HTML, CSS, JavaScript)
- **Education Timeline**:
  - Degree in Information Technology Engineering (Currently Pursuing)
  - Diploma in Computer Engineering from KCE Society's College of Engineering & Management (Completed)
- **Preserved Contact & Chatbox Architecture**:
  - Full client-side validation, rate limiting, and honeypot spam protection.
  - Direct inbox delivery via EmailJS (configurable in `js/email-config.js`) with fallback to `ketansapkale2004@gmail.com`.
- **System Interactions**:
  - Dark / Light mode toggle with `localStorage` persistence.
  - Interactive Project Architecture modal.
  - Interactive Resume overview modal with Print/Save PDF support.
  - Fine pointer custom glow cursor (automatically disabled on touch devices and reduced-motion mode).

---

## 🚀 Running Locally in VS Code

The local server is already running in your project directory:
```bash
python -m http.server 8000
```
Open **`http://localhost:8000`** in your browser.

Alternatively, you can open `index.html` directly or use the VS Code "Live Server" extension.

---

## ⚙️ Configuring EmailJS for Live Inbox Delivery

To receive contact messages directly in your personal email inbox:
1. Register for a free account at [https://www.emailjs.com/](https://www.emailjs.com/)
2. Open `js/email-config.js` in your editor.
3. Replace the placeholder values with your credentials:
   ```javascript
   const EMAILJS_CONFIG = {
     SERVICE_ID: 'your_service_id',
     TEMPLATE_ID: 'your_template_id',
     PUBLIC_KEY: 'your_public_key',
     FALLBACK_EMAIL: 'ketansapkale2004@gmail.com'
   };
   ```

---

## 🌐 Deploying to GitHub Pages

To publish your portfolio online for free:
```bash
git init
git add .
git commit -m "feat: launch Inside Ketan's Dev Space portfolio"
git branch -M main
git remote add origin https://github.com/ketan380/portfolio.git
git push -u origin main
```
Then navigate to **Repository Settings > Pages** > select `main` branch root `/` and save.
Your portfolio will be live at `https://ketan380.github.io/portfolio`!
