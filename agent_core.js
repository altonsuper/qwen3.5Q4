// agent_core.js - UNIVERSAL AGENT CORE
const readline = require('readline');
const http = require('http');
const fs = require('fs');
const path = require('path');

// Dynamic Config & Target Loading
const CONFIG_FILE = process.argv[2] || 'config_coder.json';
const PROJECT_TARGET = process.argv[3] || 'project1';

let CONFIG;
try {
    CONFIG = require(`./${CONFIG_FILE}`);
} catch(e) {
    console.error(`⚠️ Config '${CONFIG_FILE}' not found. Using default.`);
    try { CONFIG = require('./config_coder.json'); } catch(err) { process.exit(1); }
}

const MODEL = CONFIG.ollama.model;
const ROOT_DIR = __dirname;
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

console.log(`👑 UNIVERSAL AGENT CORE`);
console.log(`📁 Config: ${CONFIG_FILE} | Target: ${PROJECT_TARGET}`);
console.log(`🧠 Model: ${MODEL} | RAG: ENABLED`);
console.log("💡 Commands: /mode mono|sep | /status | exit");
console.log("💡 Press ENTER for Auto-Next Step.\n");

let currentMode = 'mono';

// 1. Project Selector (Fallback)
async function selectProject() {
    const projects = fs.readdirSync(ROOT_DIR).filter(f => fs.statSync(path.join(ROOT_DIR, f)).isDirectory());
    if (projects.length === 0) { console.log("⚠️ No projects found."); return null; }
    console.log("📁 Available Projects:");
    projects.forEach((p, i) => console.log(`   ${i + 1}. ${p}`));
    const choice = await new Promise(r => rl.question('\n👑 Select Project Number: ', r));
    const idx = parseInt(choice) - 1;
    return (idx >= 0 && idx < projects.length) ? projects[idx] : selectProject();
}

// 2. RAG Context Reader
function readProjectContext(projectPath) {
    let context = "";
    const files = ['index.html', 'style.css', 'game.js', 'script.js', 'data.json'];
    files.forEach(file => {
        const fp = path.join(projectPath, file);
        if (fs.existsSync(fp)) {
            try {
                const content = fs.readFileSync(fp, 'utf8');
                const short = content.length > 1000 ? content.substring(0, 1000) + "\n... (truncated)" : content;
                context += `\n--- FILE: ${file} ---\n${short}\n`;
            } catch(e) {}
        }
    });
    return context || "Project folder is empty.";
}

// 3. Ollama Streamer
function sendToOllamaStream(messages, projectName, projectPath) {
    return new Promise((resolve, reject) => {
        const ctx = readProjectContext(projectPath);
        const modeInstr = currentMode === 'mono' 
            ? "For simple pages, output MONOLITHIC HTML with inline <style> and <script>." 
            : "ALWAYS output SEPARATE files: HTML links to external .css and .js files.";
        
        const systemPrompt = `${CONFIG.ollama.system_code}\n\nOUTPUT MODE: ${currentMode.toUpperCase()}\n${modeInstr}\n\nPROJECT CONTEXT:\n${ctx}\n\nINSTRUCTION: Output ONLY raw code. No markdown.`;
        const finalMsgs = [{ role: 'system', content: systemPrompt }, ...messages.filter(m => m.role !== 'system')];

        const postData = JSON.stringify({
            model: MODEL, messages: finalMsgs, stream: true,
            options: { num_predict: CONFIG.ollama.num_predict, temperature: CONFIG.ollama.temperature, stop: CONFIG.ollama.stop || [] }
        });

        const req = http.request({ hostname: 'localhost', port: 11434, path: '/api/chat', method: 'POST', headers: { 'Content-Type': 'application/json' } }, (res) => {
            let full = '';
            res.on('data', chunk => {
                chunk.toString().split('\n').filter(l => l.trim()).forEach(line => {
                    try {
                        const j = JSON.parse(line);
                        if (j.message?.content) { full += j.message.content; process.stdout.write(j.message.content); }
                        if (j.done) resolve(full);
                    } catch(e) {}
                });
            });
            res.on('end', () => resolve(full));
        });
        req.on('error', reject);
        req.write(postData);
        req.end();
    });
}

// 4. Smart Saver
function saveRawCode(text, projectPath) {
    let clean = text.replace(/```[a-z]*\n?/gi, '').replace(/```/g, '').trim();
    if (clean.length < 50) return null;
    let fname = null;
    if (clean.startsWith('<!DOCTYPE') || clean.startsWith('<html')) fname = 'index.html';
    else if (clean.includes('body {') || clean.includes('canvas {') || clean.includes('.class')) fname = 'style.css';
    else if (clean.includes('function ') || clean.includes('document.') || clean.includes('const ')) fname = 'script.js';
    else if (clean.startsWith('{') && clean.endsWith('}')) fname = 'data.json';

    if (fname) {
        fs.writeFileSync(path.join(projectPath, fname), clean);
        return `\n✅ Saved as: ${fname}`;
    }
    return null;
}

// 5. Main Loop
async function startChat(projectName) {
    const projectPath = path.join(ROOT_DIR, projectName);
    if (!fs.existsSync(projectPath)) fs.mkdirSync(projectPath, { recursive: true });
    console.log(`\n🚀 Working in: ${projectName} | Mode: ${currentMode.toUpperCase()}`);
    
    let history = [], step = 0;
    while (true) {
        let auto = "";
        if (step === 0) auto = currentMode === 'mono' 
            ? "Create monolithic index.html with inline CSS/JS for a business site." 
            : "Create index.html linking to external style.css and script.js.";
        else if (step === 1) auto = "Create professional style.css. Responsive, modern.";
        else if (step === 2) auto = "Create script.js with smooth scroll & basic validation.";
        else { console.log("🏁 Complete! Run assemble.js if needed."); break; }

        const inp = await new Promise(r => rl.question(`\n👤 You [Step ${step+1}] (Press Enter for Auto): `, r));
        if (inp.toLowerCase() === 'exit') { rl.close(); process.exit(0); }

        if (inp.startsWith('/mode ')) {
            const m = inp.split(' ')[1]?.toLowerCase();
            if (m === 'mono') { currentMode = 'mono'; console.log("📦 Mode: Monolithic"); } 
            else if (m === 'sep') { currentMode = 'sep'; console.log("📁 Mode: Separate Files"); }
            else console.log("⚠️ Use: /mode mono or /mode sep");
            continue;
        }
        if (inp.toLowerCase() === '/status') {
            console.log(`📊 Config: ${CONFIG_FILE} | Mode: ${currentMode} | Step: ${step+1}/3`);
            continue;
        }

        const prompt = inp.trim() !== "" ? inp : auto;
        history.push({ role: 'user', content: prompt });
        console.log(`🤖 Qwen (${step===0?'HTML':step===1?'CSS':'JS'}): `);
        const reply = await sendToOllamaStream(history, projectName, projectPath);
        const msg = saveRawCode(reply, projectPath);
        if (msg) console.log(msg);
        history.push({ role: 'assistant', content: reply });
        if (inp.trim() === "") step++;
    }
}

// Init
const target = path.join(ROOT_DIR, PROJECT_TARGET);
if (fs.existsSync(target) && fs.statSync(target).isDirectory()) startChat(PROJECT_TARGET);
else selectProject().then(p => p ? startChat(p) : process.exit(0));