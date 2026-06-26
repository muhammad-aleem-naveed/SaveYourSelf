/**
 * save_yourself — AI Shield Content Script v1.0
 * Injected into every page to kill embedded AI UI elements.
 * Targets: Google Colab, GitHub, Notion, Replit, VS Code Web, 
 *          Hugging Face Spaces, W3Schools, Khan Academy AI, Slack AI, etc.
 */

(function () {
    'use strict';

    let shieldActive = false;

    // ═══════════════════════════════════════════════════════════
    // PLATFORM DETECTION & AI ELEMENT TARGETS
    // ═══════════════════════════════════════════════════════════
    const PLATFORM_RULES = [

        // ── Google Colab ──────────────────────────────────────
        {
            match: 'colab.research.google.com',
            css: `
                /* Gemini AI Panel and sidebar */
                .colab-ai-divider,
                .colab-ai-generate-code-button,
                colab-ai-panel,
                .assistive-ml,
                [id*="colab-ai"],
                [class*="colab-ai"],
                [class*="gemini"],
                [id*="gemini"],
                /* AI Assistant chat bubble */
                .notebook-assistant-panel,
                .notebook-assistant,
                [data-view-component="true"][aria-label*="AI"],
                /* AI toolbar buttons */
                colab-toolbar-button[title*="Gemini"],
                colab-toolbar-button[title*="AI"],
                colab-toolbar-button[title*="Generate"],
                /* Autocomplete AI suggestions */
                .monaco-editor .suggest-widget[aria-label*="AI"],
                /* Colab AI side panel */
                .assistant-pane,
                .colab-assistant,
                /* Generate code above/below cell */
                [data-testid*="ai-"],
                [aria-label*="Generate code"],
                [aria-label*="AI assistance"],
                [tooltip*="Gemini"] { display: none !important; }

                /* Prevent AI panel from taking space */
                .notebook-content { right: 0 !important; }
            `,
            js: () => {
                // Remove Gemini button from toolbar by watching mutations
                const killColabAI = () => {
                    // Kill any buttons with AI-related titles
                    document.querySelectorAll('colab-toolbar-button, button').forEach(btn => {
                        const title = (btn.getAttribute('title') || btn.textContent || '').toLowerCase();
                        if (title.includes('gemini') || title.includes('generate code') || 
                            title.includes('ai assist') || title.includes('notebook ai')) {
                            btn.style.display = 'none';
                            btn.disabled = true;
                        }
                    });
                    // Hide AI panel elements
                    document.querySelectorAll('[class*="ai-panel"], [id*="ai-panel"], colab-ai-panel').forEach(el => {
                        el.style.display = 'none';
                    });
                };
                return killColabAI;
            }
        },

        // ── GitHub ────────────────────────────────────────────
        {
            match: 'github.com',
            css: `
                /* GitHub Copilot Chat */
                .copilot-chat,
                .js-copilot-chat,
                [data-testid="copilot-chat"],
                [aria-label*="Copilot"],
                .copilot-panel,
                /* Copilot inline suggestions indicator */
                .copilot-inline,
                /* Copilot button in toolbar */
                [data-hotkey*="copilot"],
                .js-slash-command-copilot,
                /* GitHub Spark (AI app builder) */
                [href*="/spark"],
                /* Copilot for PRs summary */
                .copilot-pr-summary,
                copilot-diff-entry,
                /* Copilot docs / explain button */
                [data-target*="copilot"],
                .copilot-explain-btn,
                /* Actions AI suggestions */
                .js-actions-ai { display: none !important; }
            `,
            js: () => {
                const killGitHubAI = () => {
                    document.querySelectorAll('button, a').forEach(el => {
                        const text = (el.textContent || el.getAttribute('aria-label') || '').toLowerCase();
                        if (text.includes('copilot') || text.includes('ask ai') || text.includes('explain with')) {
                            el.style.display = 'none';
                        }
                    });
                };
                return killGitHubAI;
            }
        },

        // ── Notion ────────────────────────────────────────────
        {
            match: 'notion.so',
            css: `
                /* Notion AI button in toolbar */
                [data-block-id*="notion-ai"],
                .notion-ai-trigger,
                /* AI menu item */
                [role="menuitem"]:has([src*="ai"]),
                /* Ask AI / Notion AI blocks */
                [placeholder*="Ask AI"],
                [placeholder*="AI write"],
                .notion-ai-autocomplete { display: none !important; }
            `,
            js: () => {
                const killNotionAI = () => {
                    document.querySelectorAll('[class*="notion"]').forEach(el => {
                        if ((el.textContent || '').trim() === 'Ask AI' ||
                            (el.textContent || '').trim() === 'AI') {
                            el.closest('[role="menuitem"]')?.remove();
                        }
                    });
                };
                return killNotionAI;
            }
        },

        // ── Replit ────────────────────────────────────────────
        {
            match: 'replit.com',
            css: `
                /* Replit AI chat panel */
                [data-cy="ai-chat"],
                .ai-chat-panel,
                [class*="GhostWriter"],
                [class*="ghostwriter"],
                [class*="AiChat"],
                .replit-ai,
                /* AI generate button */
                [data-cy="generate-code"],
                [aria-label*="AI"],
                [aria-label*="Generate"] { display: none !important; }
            `,
            js: () => null
        },

        // ── VS Code Web (vscode.dev / github.dev) ────────────
        {
            match: ['vscode.dev', 'github.dev', 'idx.google.com'],
            css: `
                /* GitHub Copilot extension panel */
                .extension-copilot,
                [id*="copilot"],
                [class*="copilot"],
                /* Inline AI chat */
                .monaco-inline-chat,
                .inline-chat-widget,
                /* AI sidebar */
                [aria-label*="Copilot"],
                [aria-label*="AI Chat"],
                /* Copilot status bar item */
                .statusbar-item[aria-label*="Copilot"] { display: none !important; }
            `,
            js: () => null
        },

        // ── Google Workspace (Docs, Sheets, Slides) ──────────
        {
            match: ['docs.google.com', 'sheets.google.com', 'slides.google.com'],
            css: `
                /* Google Duet AI / Gemini in Workspace */
                [class*="docs-ml"],
                [class*="duet-ai"],
                .ai-gen-button,
                [data-tooltip*="Gemini"],
                [data-tooltip*="Help me write"],
                [aria-label*="Help me write"],
                [aria-label*="Gemini"],
                /* Smart compose / autocomplete */
                .smart-compose-promo { display: none !important; }
            `,
            js: () => null
        },

        // ── Hugging Face ─────────────────────────────────────
        {
            match: 'huggingface.co',
            css: `
                /* Inference widgets / playground */
                .inference-widget,
                .model-inference,
                [class*="inference"],
                /* Chat interfaces in spaces */
                .chat-container { display: none !important; }
            `,
            js: () => null
        },

        // ── Stack Overflow (AI responses) ────────────────────
        {
            match: 'stackoverflow.com',
            css: `
                /* Stack Overflow Overflow AI */
                .js-overflow-ai,
                [class*="overflow-ai"],
                .ai-answer-banner,
                [data-testid*="ai"] { display: none !important; }
            `,
            js: () => null
        },

        // ── Bing Search (AI results) ─────────────────────────
        {
            match: 'bing.com',
            css: `
                /* Bing Copilot / AI chat section */
                #b_sydanchor,
                .syd_qs,
                #sydconv,
                .copilot-panel,
                [aria-label*="Copilot"],
                .ai_generated,
                .ai-response { display: none !important; }
            `,
            js: () => null
        },

        // ── DuckDuckGo (AI Chat) ─────────────────────────────
        {
            match: 'duckduckgo.com',
            css: `
                /* DuckDuckGo AI Chat tab */
                [data-testid="ai-chat-intro"],
                .ddg-ai-chat,
                [href*="/chat"],
                .module--ai-chat { display: none !important; }
            `,
            js: () => null
        },

        // ── YouTube (AI summary) ─────────────────────────────
        {
            match: 'youtube.com',
            css: `
                /* YouTube AI Summary panel */
                ytd-transcript-search-panel-renderer,
                [class*="ai-summary"],
                [class*="gemini"],
                .ytd-engagement-panel-section-list-renderer[target-id*="engagement-panel-structured-description"] { display: none !important; }
            `,
            js: () => null
        },

        // ── Canvas / LMS AI tools ────────────────────────────
        {
            match: ['canvas.instructure.com', 'instructure.com'],
            css: `
                [class*="ai-"], [id*="ai-assist"], .ai-button { display: none !important; }
            `,
            js: () => null
        },
    ];

    // ═══════════════════════════════════════════════════════════
    // ENGINE: Inject CSS + Run JS observers
    // ═══════════════════════════════════════════════════════════

    function getCurrentHostname() {
        return window.location.hostname;
    }

    function injectCSS(cssText) {
        const existing = document.getElementById('sy-ai-shield-style');
        if (existing) { existing.textContent = cssText; return; }
        const style = document.createElement('style');
        style.id = 'sy-ai-shield-style';
        style.textContent = cssText;
        (document.head || document.documentElement).appendChild(style);
    }

    function removeCSS() {
        const el = document.getElementById('sy-ai-shield-style');
        if (el) el.remove();
    }

    function setupMutationObserver(callback) {
        const observer = new MutationObserver(() => {
            try { callback(); } catch (e) {}
        });
        observer.observe(document.body || document.documentElement, {
            childList: true,
            subtree: true
        });
        return observer;
    }

    let activeObserver = null;

    function applyShield() {
        const host = getCurrentHostname();

        PLATFORM_RULES.forEach(rule => {
            const matchHosts = Array.isArray(rule.match) ? rule.match : [rule.match];
            const isMatch = matchHosts.some(m => host === m || host.endsWith('.' + m));

            if (isMatch) {
                // Inject CSS to hide AI elements
                injectCSS(rule.css);

                // Set up JS mutation observer to continuously remove AI elements
                if (rule.js) {
                    const jsCallback = rule.js();
                    if (jsCallback) {
                        jsCallback(); // Run immediately
                        if (activeObserver) activeObserver.disconnect();
                        activeObserver = setupMutationObserver(jsCallback);
                    }
                }
            }
        });
    }

    function removeShield() {
        removeCSS();
        if (activeObserver) {
            activeObserver.disconnect();
            activeObserver = null;
        }
    }

    // ═══════════════════════════════════════════════════════════
    // INITIALIZATION
    // ═══════════════════════════════════════════════════════════

    // Check initial state from storage
    chrome.storage.local.get({ aiBlockingEnabled: false }, ({ aiBlockingEnabled }) => {
        shieldActive = aiBlockingEnabled;
        if (shieldActive) applyShield();
    });

    // Listen for real-time toggle from background script.
    // SECURITY: Validate sender.id matches this extension's own ID.
    // This prevents any web page from sending a spoofed 'shieldUpdate' message.
    chrome.runtime.onMessage.addListener((message, sender) => {
        // Only accept messages from our own extension background (no sender.tab = background)
        if (sender.id !== chrome.runtime.id) return;
        if (sender.tab) return; // Reject messages from content scripts / web pages

        if (message.action === 'shieldUpdate' && typeof message.aiEnabled === 'boolean') {
            shieldActive = message.aiEnabled;
            if (shieldActive) {
                applyShield();
            } else {
                removeShield();
            }
        }
    });

    // Re-apply on page navigation (for SPAs)
    let lastUrl = location.href;
    new MutationObserver(() => {
        const url = location.href;
        if (url !== lastUrl) {
            lastUrl = url;
            if (shieldActive) {
                setTimeout(applyShield, 500);
            }
        }
    }).observe(document.documentElement, { subtree: true, childList: true });

})();
