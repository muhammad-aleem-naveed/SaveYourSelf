/**
 * SaveYourself — Popup Controller
 * Security: SHA-256 hashed passwords, no plaintext secrets, XSS-safe DOM,
 *           rate-limited auth, first-run setup flow.
 */

// ═══════════════════════════════════════════════════════════════
// SECURITY UTILITIES
// ═══════════════════════════════════════════════════════════════

/**
 * Hashes a password string with a salt using SHA-256 via the Web Crypto API.
 * No plaintext password is ever stored or compared.
 */
async function hashPassword(password, salt) {
    const encoder = new TextEncoder();
    const data = encoder.encode(salt + password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/** Generates a cryptographically random 32-char hex salt. */
function generateSalt() {
    const array = new Uint8Array(16);
    crypto.getRandomValues(array);
    return Array.from(array).map(b => b.toString(16).padStart(2, '0')).join('');
}

/** Sanitizes domain input — strips protocol, www, paths. Validates length & characters. */
function sanitizeDomain(raw) {
    if (!raw || typeof raw !== 'string') return null;
    if (raw.length > 253) return null; // Max valid domain length (RFC 1035)

    let clean = raw.trim().toLowerCase();
    // Strip protocol and www
    clean = clean.replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0].split('?')[0];

    // Only allow valid domain/keyword characters
    if (!/^[a-z0-9.\-_]+$/.test(clean)) return null;
    if (clean.length === 0 || clean.length > 253) return null;

    return clean;
}

// ═══════════════════════════════════════════════════════════════
// MAIN CONTROLLER
// ═══════════════════════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', async () => {

    // ── DOM References ──────────────────────────────────────────
    const targetDomainInput  = document.getElementById('targetDomainInput');
    const commitRuleBtn      = document.getElementById('commitRuleBtn');
    const activeDomainList   = document.getElementById('activeDomainList');
    const lockBanner         = document.getElementById('lockBanner');
    const lockExpirationTime = document.getElementById('lockExpirationTime');
    const lockDurationInput  = document.getElementById('lockDurationInput');
    const activateLockBtn    = document.getElementById('activateLockBtn');
    const protectionStatus   = document.getElementById('protectionStatus');
    const aiShieldToggle     = document.getElementById('aiShieldToggle');
    const temporalLockCard   = document.getElementById('temporalLockCard');

    // Auth overlays
    const passwordOverlay    = document.getElementById('passwordOverlay');
    const passwordInput      = document.getElementById('passwordInput');
    const unlockBtn          = document.getElementById('unlockBtn');
    const setupOverlay       = document.getElementById('setupOverlay');
    const setupPasswordInput = document.getElementById('setupPasswordInput');
    const setupConfirmInput  = document.getElementById('setupConfirmInput');
    const setupSaveBtn       = document.getElementById('setupSaveBtn');
    const setupError         = document.getElementById('setupError');

    // ── Load State ──────────────────────────────────────────────
    let systemState = await chrome.storage.local.get({
        blockedDomains: [],
        lockUntil: 0,
        aiBlockingEnabled: false,
        isSessionUnlocked: false,
        adminPasswordHash: null,   // SHA-256 hash of admin password
        adminPasswordSalt: null,   // Random salt used in hashing
    });

    // ── Rate Limiter ────────────────────────────────────────────
    // In-memory only — resets per popup session (intentional: no storage pollution)
    let failedAttempts = 0;
    const MAX_ATTEMPTS = 5;
    const LOCKOUT_MS = 30_000; // 30 seconds
    let lockedOut = false;

    function applyLockout() {
        lockedOut = true;
        unlockBtn.disabled = true;
        passwordInput.disabled = true;
        unlockBtn.textContent = 'Too many attempts (30s)';
        setTimeout(() => {
            lockedOut = false;
            failedAttempts = 0;
            unlockBtn.disabled = false;
            passwordInput.disabled = false;
            unlockBtn.textContent = 'Unlock';
        }, LOCKOUT_MS);
    }

    // ═══════════════════════════════════════════════════════════
    // FIRST-RUN SETUP (No password configured yet)
    // ═══════════════════════════════════════════════════════════

    if (!systemState.adminPasswordHash) {
        // First time — show setup screen to choose a password
        setupOverlay.classList.add('active');

        setupSaveBtn.onclick = async () => {
            const pw = setupPasswordInput.value;
            const confirm = setupConfirmInput.value;

            if (pw.length < 4) {
                setupError.textContent = 'Password must be at least 4 characters.';
                return;
            }
            if (pw !== confirm) {
                setupError.textContent = 'Passwords do not match.';
                return;
            }

            const salt = generateSalt();
            const hash = await hashPassword(pw, salt);

            await chrome.storage.local.set({ adminPasswordHash: hash, adminPasswordSalt: salt });
            systemState.adminPasswordHash = hash;
            systemState.adminPasswordSalt = salt;

            setupOverlay.classList.remove('active');
            renderActiveRules();
        };

        // Allow Enter key in setup form
        [setupPasswordInput, setupConfirmInput].forEach(el => {
            el.onkeydown = (e) => { if (e.key === 'Enter') setupSaveBtn.click(); };
        });
    }

    // ═══════════════════════════════════════════════════════════
    // UNLOCK FLOW (Password already configured)
    // ═══════════════════════════════════════════════════════════

    async function verifyAdministrativeAccess() {
        if (lockedOut) return;

        const inputHash = await hashPassword(
            passwordInput.value,
            systemState.adminPasswordSalt
        );

        if (inputHash === systemState.adminPasswordHash) {
            systemState.isSessionUnlocked = true;
            failedAttempts = 0;
            passwordOverlay.classList.remove('active');
            renderActiveRules();
        } else {
            failedAttempts++;
            // Flash red border
            passwordInput.style.borderColor = '#f43f5e';
            setTimeout(() => { passwordInput.style.borderColor = ''; }, 600);

            if (failedAttempts >= MAX_ATTEMPTS) {
                applyLockout();
            }
        }
    }

    unlockBtn.onclick = verifyAdministrativeAccess;
    passwordInput.onkeydown = (e) => { if (e.key === 'Enter') verifyAdministrativeAccess(); };

    // Show lock overlay if a time lock is active and password is set
    if (systemState.adminPasswordHash &&
        !systemState.isSessionUnlocked &&
        Date.now() < systemState.lockUntil) {
        passwordOverlay.classList.add('active');
    }

    // ═══════════════════════════════════════════════════════════
    // AI SHIELD TOGGLE
    // ═══════════════════════════════════════════════════════════

    aiShieldToggle.checked = systemState.aiBlockingEnabled;

    aiShieldToggle.onchange = async () => {
        systemState.aiBlockingEnabled = aiShieldToggle.checked;
        await chrome.storage.local.set({ aiBlockingEnabled: systemState.aiBlockingEnabled });
        chrome.runtime.sendMessage({ action: 'syncRules' });
    };

    // ═══════════════════════════════════════════════════════════
    // TIME LOCK STATE EVALUATOR
    // ═══════════════════════════════════════════════════════════

    function evaluateTemporalState() {
        const isLocked = Date.now() < systemState.lockUntil;

        if (isLocked) {
            lockBanner.style.display = 'block';
            lockExpirationTime.textContent = new Date(systemState.lockUntil)
                .toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            temporalLockCard.style.opacity = '0.3';
            temporalLockCard.style.pointerEvents = 'none';
            aiShieldToggle.disabled = true;
            commitRuleBtn.disabled = true;
            targetDomainInput.disabled = true;
            protectionStatus.textContent = 'LOCKED';
            protectionStatus.style.background = 'rgba(244, 63, 94, 0.1)';
            protectionStatus.style.color = '#f43f5e';
        } else {
            lockBanner.style.display = 'none';
            temporalLockCard.style.opacity = '1';
            temporalLockCard.style.pointerEvents = 'auto';
            aiShieldToggle.disabled = false;
            commitRuleBtn.disabled = false;
            targetDomainInput.disabled = false;
            // Use textContent — never innerHTML for user-influenced content
            protectionStatus.textContent = '● ACTIVE';
            protectionStatus.style.background = 'rgba(16, 185, 129, 0.12)';
            protectionStatus.style.color = '#10b981';
        }

        return isLocked;
    }

    // ═══════════════════════════════════════════════════════════
    // RULE RENDERER (XSS-safe — uses textContent everywhere)
    // ═══════════════════════════════════════════════════════════

    function renderActiveRules() {
        // Clear safely
        while (activeDomainList.firstChild) {
            activeDomainList.removeChild(activeDomainList.firstChild);
        }

        const isLocked = evaluateTemporalState();

        if (systemState.blockedDomains.length === 0) {
            const empty = document.createElement('div');
            empty.className = 'empty-state';
            empty.textContent = 'No blocked sites yet.';
            activeDomainList.appendChild(empty);
            return;
        }

        systemState.blockedDomains.forEach(domain => {
            const row = document.createElement('div');
            row.className = 'rule-item';

            // ✅ XSS-safe: textContent, not innerHTML
            const label = document.createElement('span');
            label.textContent = domain;
            row.appendChild(label);

            if (!isLocked) {
                const removeBtn = document.createElement('button');
                removeBtn.className = 'btn-delete';
                removeBtn.setAttribute('aria-label', `Remove ${domain}`);
                // SVG is safe here — it's a static string with no user data
                removeBtn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2.5">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>`;
                removeBtn.onclick = () => removeDomainRule(domain);
                row.appendChild(removeBtn);
            }

            activeDomainList.appendChild(row);
        });
    }

    // ═══════════════════════════════════════════════════════════
    // RULE CRUD
    // ═══════════════════════════════════════════════════════════

    async function commitDomainRule() {
        const raw = targetDomainInput.value;
        const sanitized = sanitizeDomain(raw);

        if (!sanitized || systemState.blockedDomains.includes(sanitized)) {
            targetDomainInput.closest('.card').style.borderColor = '#f43f5e';
            setTimeout(() => {
                targetDomainInput.closest('.card').style.borderColor = '';
            }, 1000);
            return;
        }

        systemState.blockedDomains.push(sanitized);
        await chrome.storage.local.set({ blockedDomains: systemState.blockedDomains });
        targetDomainInput.value = '';
        renderActiveRules();
        chrome.runtime.sendMessage({ action: 'syncRules' });
    }

    async function removeDomainRule(domain) {
        systemState.blockedDomains = systemState.blockedDomains.filter(d => d !== domain);
        await chrome.storage.local.set({ blockedDomains: systemState.blockedDomains });
        renderActiveRules();
        chrome.runtime.sendMessage({ action: 'syncRules' });
    }

    commitRuleBtn.onclick = commitDomainRule;
    targetDomainInput.onkeydown = (e) => { if (e.key === 'Enter') commitDomainRule(); };
    // Enforce max length at input level
    targetDomainInput.addEventListener('input', () => {
        if (targetDomainInput.value.length > 253) {
            targetDomainInput.value = targetDomainInput.value.slice(0, 253);
        }
    });

    // ═══════════════════════════════════════════════════════════
    // TIME LOCK ACTIVATION
    // ═══════════════════════════════════════════════════════════

    activateLockBtn.onclick = async () => {
        const minutes = parseInt(lockDurationInput.value, 10);
        if (isNaN(minutes) || minutes <= 0 || minutes > 1440) return; // Max 24 hours

        const expiry = Date.now() + minutes * 60 * 1000;
        systemState.lockUntil = expiry;
        await chrome.storage.local.set({ lockUntil: expiry });
        renderActiveRules();
        chrome.runtime.sendMessage({ action: 'syncRules' });
    };

    // ── Initial render ──────────────────────────────────────────
    if (systemState.adminPasswordHash) {
        renderActiveRules();
    }
});