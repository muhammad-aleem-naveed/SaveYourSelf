# SaveYourself — Privacy-First Research & Focus Shield

SaveYourself is a robust, security-hardened Chrome extension designed to enforce academic integrity and combat digital distraction. It provides a multi-layer defense against AI-assisted cheating, adult content, and impulsive browsing.

---

## 🛡️ Key Security Features (Secure Edition)

This version has been professionally audited and hardened for public use:
- **Zero-Secret Architecture**: No hardcoded passwords. Uses a first-run setup to create a unique password.
- **SHA-256 Hashing**: Passwords are never stored in plain text. Uses salted SHA-256 hashing via the Web Crypto API.
- **Strict CSP**: A rigid Content Security Policy prevents unauthorized script execution and external data leakage.
- **XSS-Protected**: Uses safe DOM APIs (`textContent`) to prevent script injection from malicious domain names.
- **Anti-Spoofing**: Validates internal extension messaging to prevent web pages from tampering with the protection state.

---

## 🚀 Capabilities

### 1. AI Mega-Shield (180+ Domains)
Blocks access to major AI platforms across USA, China, and Europe:
- **Chatbots**: ChatGPT, Claude, Gemini, DeepSeek, Kimi, etc.
- **Coding**: GitHub Copilot, Cursor, Codeium, Tabnine.
- **Writing**: Grammarly AI, QuillBot, Jasper, Writesonic.
- **APIs**: Blocks the underlying API endpoints that power AI in Google Colab, Notion, and more.

### 2. Embedded AI Killer
A specialized content script that removes AI UI elements directly from the pages you use:
- Hides **Gemini in Google Colab**.
- Removes **Copilot Chat from GitHub**.
- Strips **AI writing prompts from Notion and Google Docs**.

### 3. Temporal State Lock
Set a countdown (e.g., 60 minutes) to freeze your settings. During the lock:
- Rules cannot be added or deleted.
- The AI Shield cannot be toggled off.
- Dashboard access is gated by a secure password.

### 4. Enterprise-Grade Locking (Optional)
Includes PowerShell scripts for Windows administrators to:
- Disable the "Remove Extension" button.
- Prevent disabling the extension via Chrome settings.
- Enforce "Managed by Organization" status.

---

## 🛠️ Installation

1. Clone the repository.
2. Open Chrome and go to `chrome://extensions/`.
3. Enable **Developer mode**.
4. Click **Load unpacked** and select the SaveYourself folder.
5. On the first run, click the extension icon and **set your admin password**.

---

## 📂 Project Structure

- `background.js`: Core firewall engine (declarativeNetRequest).
- `popup.js`: Secure UI controller and auth logic.
- `ai_shield_content.js`: Advanced UI-level AI blocking.
- `scripts/`: Implementation and lock-down scripts for administrators.
- `assets/`: UI iconography.

---

## ⚖️ License & Disclaimer

This project is intended for educational and personal focus purposes. It is provided "as is" without warranty.

*Designed for Academic Integrity and Digital Well-being.*
