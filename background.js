/**
 * save_yourself — Firewall Engine v3.0
 * Academic Integrity Shield: 150+ AI Domains + Embedded AI Blocker
 * Covers: USA, China, Europe, API Endpoints, Coding Assistants, Image/Video AI
 */

// ═══════════════════════════════════════════════════════════════
// SECTION 1: ADULT CONTENT BLOCKLIST
// ═══════════════════════════════════════════════════════════════
const HARDCORE_BLOCKLIST = [
    "pornhub.com", "xvideos.com", "xnxx.com", "xhamster.com", "youporn.com",
    "redtube.com", "porn.com", "chaturbate.com", "bongacams.com", "livejasmin.com",
    "brazzers.com", "spankbang.com", "eporner.com", "fuq.com", "onlyfans.com",
    "tube8.com", "thumbzilla.com", "anyporn.com", "adultfriendfinder.com", "beeg.com",
    "tnaflix.com", "vporn.com", "youjizz.com", "motherless.com", "txxx.com",
    "heavy-r.com", "porntube.com", "xtube.com", "slutload.com", "4tube.com",
];

// ═══════════════════════════════════════════════════════════════
// SECTION 2: AI MEGA BLOCKLIST — 150+ DOMAINS
// ═══════════════════════════════════════════════════════════════

// ── 2A: MAJOR USA AI CHATBOTS & PLATFORMS ──────────────────────
const AI_CHATBOTS_USA = [
    // OpenAI
    "openai.com", "chatgpt.com", "chat.openai.com",
    // Anthropic
    "anthropic.com", "claude.ai",
    // Google AI
    "gemini.google.com", "bard.google.com", "aistudio.google.com",
    "notebooklm.google", "notebooklm.google.com", "labs.google.com",
    // Microsoft / Bing
    "copilot.microsoft.com", "bing.com/chat", "sydney.bing.com",
    "edgeservices.bing.com",
    // xAI (Elon Musk)
    "grok.com", "x.ai",
    // Meta AI
    "meta.ai", "ai.meta.com",
    // Perplexity
    "perplexity.ai", "labs.perplexity.ai",
    // Mistral (French but USA-accessible)
    "mistral.ai", "chat.mistral.ai", "le.chat.mistral.ai",
    // Inflection AI
    "pi.ai", "inflection.ai",
    // Character AI
    "character.ai", "beta.character.ai",
    // Poe (Quora)
    "poe.com",
    // You.com
    "you.com",
    // Phind
    "phind.com",
    // Andi
    "andi.so",
    // HuggingChat
    "huggingface.co", "huggingface.com",
    // Together AI
    "together.ai", "together.xyz",
    // Cohere
    "cohere.ai", "cohere.com", "coral.cohere.com",
    // AI21 Labs
    "ai21.com", "jamba.ai",
    // Aleph Alpha
    "aleph-alpha.com",
    // Nvidia AI
    "build.nvidia.com",
    // Groq
    "groq.com",
    // Replicate
    "replicate.com",
    // Forefront AI
    "forefront.ai",
    // NLP Cloud
    "nlpcloud.io",
    // Fireworks AI
    "fireworks.ai",
    // Cerebras
    "cerebras.ai",
    // SambaNova
    "sambanova.ai",
    // Ollama (online inference)
    "ollama.ai", "ollama.com",
    // Lmsys / FastChat
    "lmsys.org", "chat.lmsys.org",
    // OpenRouter
    "openrouter.ai",
    // Kagi AI
    "kagi.com",
];

// ── 2B: CHINESE AI TOOLS ──────────────────────────────────────
const AI_CHATBOTS_CHINA = [
    // Baidu Ernie / Wenxin
    "yiyan.baidu.com", "wenxin.baidu.com", "qianfan.baidu.com",
    // Alibaba Qwen (Tongyi)
    "tongyi.aliyun.com", "qwen.ai", "qwenlm.ai", "dashscope.aliyuncs.com",
    // ByteDance Doubao
    "doubao.com", "www.doubao.com",
    // ByteDance Coze
    "coze.com", "coze.cn",
    // Moonshot Kimi
    "kimi.moonshot.cn", "kimi.ai", "moonshot.cn",
    // Zhipu AI (ChatGLM)
    "chatglm.cn", "zhipuai.cn", "zhipuai.com", "bigmodel.cn", "open.bigmodel.cn",
    // DeepSeek
    "deepseek.com", "chat.deepseek.com",
    // iFlytek Spark
    "xinghuo.xfyun.cn", "xfyun.cn", "iflytek.com",
    // Tiangong AI (Kunlun Tech)
    "tiangong.cn",
    // MiniMax (Hailuo)
    "hailuoai.com", "minimax.chat", "minimax.io",
    // 360 AI
    "ai.360.cn", "360.ai",
    // Baichuan AI
    "baichuan-ai.com", "baichuan.chat",
    // 01.ai (Yi model - Kai-Fu Lee)
    "01.ai", "yi.01.ai",
    // ModelScope (Alibaba community)
    "modelscope.cn",
    // Tencent Hunyuan / Yuanbao
    "yuanbao.tencent.com", "hunyuan.tencent.com",
    // StepFun
    "stepfun.com", "step.fun",
    // SenseTime
    "sensechat.com", "sensetime.com",
    // Manus AI
    "manus.im",
    // Spark by iFlytek (English)
    "spark.xfyun.cn",
];

// ── 2C: AI CODING ASSISTANTS ──────────────────────────────────
const AI_CODING_TOOLS = [
    // GitHub Copilot
    "copilot.github.com", "githubnext.com",
    // Cursor IDE
    "cursor.sh", "cursor.com",
    // Codeium / Windsurf
    "codeium.com", "windsurf.com",
    // Tabnine
    "tabnine.com",
    // Replit (AI Ghostwriter)
    "replit.com",
    // Blackbox AI
    "blackbox.ai", "www.blackbox.ai",
    // Sourcegraph Cody
    "sourcegraph.com",
    // Devin AI (Cognition)
    "devin.ai", "cognition.ai",
    // Amazon CodeWhisperer / Q Developer
    "q.developer.aws", "aws.amazon.com/q",
    // Supermaven
    "supermaven.com",
    // Aider
    "aider.chat",
    // Continue.dev
    "continue.dev",
    // Codestral (Mistral coding)
    "codestral.mistral.ai",
];

// ── 2D: AI WRITING & PRODUCTIVITY TOOLS ───────────────────────
const AI_WRITING_TOOLS = [
    // Jasper
    "jasper.ai",
    // Copy.ai
    "copy.ai",
    // Writesonic
    "writesonic.com",
    // QuillBot (paraphraser)
    "quillbot.com",
    // Grammarly (AI features)
    "grammarly.com",
    // Jenni AI
    "jenni.ai",
    // Rytr
    "rytr.me",
    // HyperWrite
    "hyperwriteai.com",
    // Sudowrite
    "sudowrite.com",
    // Paragraph AI
    "paragraph.ai",
    // Wordtune
    "wordtune.com",
    // Lex (AI editor)
    "lex.page",
    // Simplified
    "simplified.com",
    // LongShot AI
    "longshot.ai",
    // Scalenut
    "scalenut.com",
    // Anyword
    "anyword.com",
    // TextCortex
    "textcortex.com",
    // Neuroflash
    "neuroflash.com",
    // Smodin
    "smodin.io",
    // EssayBot / Essay typer AI
    "essaybot.com", "essaytyper.com",
    // Paperpal
    "paperpal.com",
    // Spinbot
    "spinbot.com",
    // Paraphrasing Tool
    "paraphrasingtool.ai",
    // Scribbr AI
    "scribbr.com",
];

// ── 2E: AI RESEARCH TOOLS ─────────────────────────────────────
const AI_RESEARCH_TOOLS = [
    // Consensus
    "consensus.app",
    // Research Rabbit
    "researchrabbit.ai",
    // Elicit
    "elicit.org",
    // Scholar AI
    "scholarai.io",
    // Scite.ai
    "scite.ai",
    // Iris AI
    "iris.ai",
    // Paper Digest
    "paperdigest.org",
    // Genei
    "genei.io",
    // SciSpace (Typeset)
    "typeset.io", "scispace.com",
    // R Discovery
    "rdiscovery.com",
    // Semantic Scholar (API-driven)
    "semanticscholar.org",
    // Connected Papers
    "connectedpapers.com",
    // chatpdf / ask pdf AI
    "chatpdf.com", "askyourpdf.com",
    // NotebookLM
    "notebooklm.google.com",
    // Gamma (AI presentations)
    "gamma.app",
];

// ── 2F: AI IMAGE & VIDEO GENERATORS ──────────────────────────
const AI_IMAGE_VIDEO = [
    // Midjourney
    "midjourney.com",
    // Stable Diffusion
    "stability.ai", "dreamstudio.ai", "stablediffusionweb.com",
    // Leonardo AI
    "leonardo.ai",
    // Runway ML
    "runwayml.com", "runway.ml",
    // Sora
    "sora.com",
    // Pika Art  
    "pika.art",
    // Kling AI
    "kling.ai",
    // Ideogram
    "ideogram.ai",
    // Adobe Firefly
    "firefly.adobe.com",
    // Playground AI
    "playground.ai",
    // NightCafe
    "nightcafe.studio", "creator.nightcafe.studio",
    // Artbreeder
    "artbreeder.com",
    // Dream AI (Wombo)
    "dream.ai", "wombo.ai",
    // GetIMG
    "getimg.ai",
    // Stablecog
    "stablecog.com",
    // Civitai (SD models)
    "civitai.com",
    // SeaArt
    "seaart.ai",
    // Tensor Art
    "tensor.art",
    // D-ID
    "d-id.com",
    // Synthesia
    "synthesia.io",
    // HeyGen
    "heygen.com",
    // InVideo AI
    "invideo.ai",
    // Pictory
    "pictory.ai",
    // Lumen5
    "lumen5.com",
];

// ── 2G: AI VOICE & AUDIO ──────────────────────────────────────
const AI_VOICE_TOOLS = [
    // ElevenLabs
    "elevenlabs.io",
    // Murf AI
    "murf.ai",
    // Play.ht
    "play.ht",
    // Descript
    "descript.com",
    // Resemble AI
    "resemble.ai",
    // Speechify
    "speechify.com",
    // WellSaid Labs
    "wellsaidlabs.com",
    // LOVO AI
    "lovo.ai",
    // Replica Studios
    "replicastudios.com",
    // Otter.ai (transcription)
    "otter.ai",
    // AssemblyAI
    "assemblyai.com",
];

// ── 2H: CRITICAL — API ENDPOINTS ──────────────────────────────
// These are the BACKEND endpoints that power AI inside third-party tools.
// Blocking these kills AI even when embedded in Colab, GitHub, IDEs, etc.
const AI_API_ENDPOINTS = [
    // ─ Google AI APIs (CRITICAL for Colab) ─
    "generativelanguage.googleapis.com",   // Gemini API → kills Gemini in Colab
    "aiplatform.googleapis.com",           // Vertex AI
    "ml.googleapis.com",                   // Google ML platform
    "aistudio.googleapis.com",             // AI Studio backend
    "firebaseml.googleapis.com",           // Firebase ML
    "automl.googleapis.com",               // AutoML
    "discoveryengine.googleapis.com",      // Discovery Engine AI
    "cloudaicompanion.googleapis.com",     // Google Duet AI (Workspace AI)

    // ─ OpenAI APIs ─
    "api.openai.com",                      // Kills any app using ChatGPT API
    "oai.azure.com",                       // Azure OpenAI Service

    // ─ Anthropic APIs ─
    "api.anthropic.com",                   // Kills any app using Claude API

    // ─ GitHub Copilot Backend ─
    "api.githubcopilot.com",               // Copilot completions
    "copilot-proxy.githubusercontent.com", // Copilot proxy
    "copilot-telemetry.githubusercontent.com",

    // ─ Hugging Face Inference ─
    "api-inference.huggingface.co",
    "router.huggingface.co",
    "api.huggingface.co",

    // ─ Mistral APIs ─
    "api.mistral.ai",
    "codestral.mistral.ai",

    // ─ Cohere APIs ─
    "api.cohere.ai", "api.cohere.com",

    // ─ Together AI ─
    "api.together.xyz", "api.together.ai",

    // ─ Groq ─
    "api.groq.com",

    // ─ Replicate ─
    "api.replicate.com",

    // ─ AI21 Labs ─
    "api.ai21.com",

    // ─ Perplexity ─
    "api.perplexity.ai",

    // ─ DeepSeek ─
    "api.deepseek.com",

    // ─ Fireworks AI ─
    "api.fireworks.ai",

    // ─ Cerebras ─
    "api.cerebras.ai",

    // ─ SambaNova ─
    "api.sambanova.ai",

    // ─ Amazon CodeWhisperer / Q Developer ─
    "codewhisperer.us-east-1.amazonaws.com",
    "q.us-east-1.amazonaws.com",

    // ─ Notion AI ─
    "ai.notion.so",

    // ─ Microsoft Copilot Backend ─
    "sydney.bing.com",
    "edgeservices.bing.com",

    // ─ Chinese AI APIs ─
    "aip.baidubce.com",                    // Baidu Ernie API
    "qianfan.baidubce.com",
    "dashscope.aliyuncs.com",             // Alibaba Qwen API
    "api.deepseek.com",
    "api.moonshot.cn",                     // Kimi API
    "open.bigmodel.cn",                    // Zhipu ChatGLM API
    "api.minimaxi.com", "api.minimax.chat",
    "spark-api.xf-yun.com",              // iFlytek Spark API
    "api.doubao.com",                      // ByteDance Doubao API

    // ─ Other APIs ─
    "api.openrouter.ai",
    "openrouter.ai/api",
    "api.forefront.ai",
    "nlpcloud.io",
];

// ─── SAFE SEARCH ENGINES ──────────────────────────────────────
const PROTECTED_SEARCH_ENGINES = [
    { name: 'google', filter: '||google.com/search*', params: ['safe=active', 'ssui=on'] },
    { name: 'bing',   filter: '||bing.com/search*',   params: ['adlt=strict'] },
    { name: 'duck',   filter: '||duckduckgo.com/*',   params: ['kp=1'] },
    { name: 'yahoo',  filter: '||search.yahoo.com/search*', params: ['vm=p'] }
];

// ─── COMBINED AI MEGA LIST ────────────────────────────────────
const AI_BLOCKLIST = [
    ...AI_CHATBOTS_USA,
    ...AI_CHATBOTS_CHINA,
    ...AI_CODING_TOOLS,
    ...AI_WRITING_TOOLS,
    ...AI_RESEARCH_TOOLS,
    ...AI_IMAGE_VIDEO,
    ...AI_VOICE_TOOLS,
];

// ═══════════════════════════════════════════════════════════════
// SECTION 3: FIREWALL ENGINE
// ═══════════════════════════════════════════════════════════════

async function synchronizeFirewallRules() {
    try {
        console.log('[SaveYourself Firewall]: Synchronizing rules...');

        const settings = await chrome.storage.local.get({
            blockedDomains: [],
            hardcoreFilters: true,
            aiBlockingEnabled: false,
            lockUntil: 0
        });

        const existingRules = await chrome.declarativeNetRequest.getDynamicRules();
        const existingRuleIds = existingRules.map(r => r.id);

        let rules = [];
        let id = 1;

        const makeBlockRule = (domain, resourceTypes, priority = 1) => ({
            id: id++,
            priority,
            action: { type: 'block' },
            condition: { urlFilter: `||${domain}`, resourceTypes }
        });

        // All resource types (full page block)
        const ALL_RESOURCES = [
            'main_frame', 'sub_frame', 'stylesheet', 'script', 'image',
            'font', 'object', 'xmlhttprequest', 'ping', 'media', 'websocket', 'other'
        ];

        // API resource types (for endpoint blocking — no need to block images)
        const API_RESOURCES = [
            'main_frame', 'sub_frame', 'script', 'xmlhttprequest', 'websocket', 'other'
        ];

        // ── User-defined rules ──
        settings.blockedDomains.forEach(domain => {
            rules.push(makeBlockRule(domain, ALL_RESOURCES));
        });

        // ── Adult content ──
        if (settings.hardcoreFilters) {
            HARDCORE_BLOCKLIST.forEach(domain => {
                rules.push(makeBlockRule(domain, ['main_frame', 'sub_frame', 'image', 'media', 'websocket']));
            });
        }

        // ── AI Shield: Block all AI sites + API endpoints ──
        if (settings.aiBlockingEnabled) {
            // Block AI websites (full page)
            AI_BLOCKLIST.forEach(domain => {
                rules.push(makeBlockRule(domain, ALL_RESOURCES));
            });

            // Block API endpoints with highest priority
            // This is what kills AI INSIDE tools like Colab, GitHub, Notion
            AI_API_ENDPOINTS.forEach(domain => {
                rules.push({
                    id: id++,
                    priority: 10, // Highest priority — override any allow rules
                    action: { type: 'block' },
                    condition: {
                        urlFilter: `||${domain}`,
                        resourceTypes: API_RESOURCES
                    }
                });
            });
        }

        // ── SafeSearch enforcement ──
        PROTECTED_SEARCH_ENGINES.forEach(engine => {
            rules.push({
                id: id++,
                priority: 2,
                action: {
                    type: 'redirect',
                    redirect: {
                        transform: {
                            queryTransform: {
                                addOrReplaceParams: engine.params.map(p => {
                                    const [key, value] = p.split('=');
                                    return { key, value };
                                })
                            }
                        }
                    }
                },
                condition: {
                    urlFilter: engine.filter,
                    resourceTypes: ['main_frame']
                }
            });
        });

        // ── Commit to Chrome ──
        await chrome.declarativeNetRequest.updateDynamicRules({
            removeRuleIds: existingRuleIds,
            addRules: rules
        });

        console.log(`[SaveYourself Firewall]: ${rules.length} rules active.`);

    } catch (err) {
        console.error('[SaveYourself Firewall] Error:', err);
    }
}

// ── Notify all content scripts when AI shield changes ──
async function broadcastShieldStatus() {
    const { aiBlockingEnabled } = await chrome.storage.local.get({ aiBlockingEnabled: false });
    const tabs = await chrome.tabs.query({});
    tabs.forEach(tab => {
        if (tab.id) {
            chrome.tabs.sendMessage(tab.id, {
                action: 'shieldUpdate',
                aiEnabled: aiBlockingEnabled
            }).catch(() => {}); // Ignore tabs without content script
        }
    });
}

// ── Lifecycle ──
chrome.runtime.onInstalled.addListener(synchronizeFirewallRules);
chrome.runtime.onStartup.addListener(synchronizeFirewallRules);

chrome.runtime.onMessage.addListener((message) => {
    if (message.action === 'syncRules') {
        synchronizeFirewallRules();
        broadcastShieldStatus();
    }
});