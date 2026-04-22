// suprememaster.js v14.1 - AUTO ORCHESTRATOR + MODE SWITCH + RAG
const readline = require('readline');
const http = require('http');
const fs = require('fs');
const path = require('path');

// Load Config
const CONFIG = require('./config.json');
const MODEL = CONFIG.ollama.model;
const ROOT_DIR = __dirname;
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

// Output target from command line or default
const OUTPUT_TARGET = process.argv[2] || 'project1';

console.log("👑 SUPREME MASTER AGENT v14.1 [MODE SWITCH + RAG]");
console.log(`🧠 Model: ${MODEL} | RAG: ENABLED`);
console.log(`📁 Output Target: ${OUTPUT_TARGET}`);
console.log("💡 Commands: /mode mono|sep | /status | exit");
console.log("💡 Press ENTER for Auto-Next Step.\n");

// Mode State: 'mono' = monolithic HTML, 'sep' = separate files
let currentMode = 'mono';

// 1. Select Project
async function selectProject() {
    const targetPath = path.join(ROOT_DIR, OUTPUT_TARGET);
    if (fs.existsSync(targetPath) && fs.statSync(targetPath).isDirectory()) {
        console.log(`🎯 Using target folder: ${OUTPUT_TARGET}`);
        return OUTPUT_TARGET;
    }
    const projects = fs.readdirSync(ROOT_DIR).filter(file => fs.statSync(path.join(ROOT_DIR, file)).isDirectory());
    if (projects.length === 0) { console.log("⚠️ No projects found."); return null; }
    console.log("📁 Available Projects:");
    projects.forEach((p, i) => console.log(`   ${i + 1}. ${p}`));
    const choice = await new Promise(resolve => rl.question('\n👑 Select Project Number: ', resolve));
    const index = parseInt(choice) - 1;
    if (index >= 0 && index < projects.length) return projects[index];
    return selectProject();
}

// 2. Read Project Context (RAG)
function readProjectContext(projectPath) {
    let context = "";
    const filesToRead = ['index.html', 'style.css', 'game.js', 'script.js'];
    filesToRead.forEach(file => {
        const filePath = path.join(projectPath, file);
        if (fs.existsSync(filePath)) {
            try {
                const content = fs.readFileSync(filePath, 'utf8');
                const shortContent = content.length > 1000 ? content.substring(0, 1000) + "\n... (truncated)" : content;
                context += `\n--- FILE: ${file} ---\n${shortContent}\n`;
            } catch (e) {}
        }
    });
    return context ? context : "Project folder is empty.";
}

// 3. Send to Ollama (Stream)
function sendToOllamaStream(messages, projectName, projectPath) {
    return new Promise((resolve, reject) => {
        const currentContext = readProjectContext(projectPath);
        
        // Mode-aware system prompt
        const modeInstruction = currentMode === 'mono' 
            ? "For simple pages, output MONOLITHIC HTML with inline <style> and <script>." 
            : "ALWAYS output SEPARATE files: HTML links to external .css and .js files.";
        
        const systemPrompt = `${CONFIG.ollama.system_code}
        
        OUTPUT MODE: ${currentMode.toUpperCase()}
        ${modeInstruction}
        
        PROJECT CONTEXT:
        ${currentContext}
        
        INSTRUCTION:
        Output ONLY raw code. No markdown.`;

        let finalMessages = [{ role: 'system', content: systemPrompt }];
        messages.forEach(m => { if (m.role !== 'system') finalMessages.push(m); });

        const postData = JSON.stringify({
            model: MODEL,
            messages: finalMessages,
            stream: true,
            options: {
                num_predict: CONFIG.ollama.num_predict,
                temperature: CONFIG.ollama.temperature,
                stop: CONFIG.ollama.stop
            }
        });

        const req = http.request({
            hostname: 'localhost', port: 11434, path: '/api/chat', method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        }, (res) => {
            let fullResponse = '';
            res.on('data', (chunk) => {
                const lines = chunk.toString().split('\n').filter(l => l.trim() !== '');
                for (const line of lines) {
                    try {
                        const json = JSON.parse(line);
                        if (json.message && json.message.content) {
                            fullResponse += json.message.content;
                            process.stdout.write(json.message.content);
                        }
                        if (json.done) resolve(fullResponse);
                    } catch (e) {}
                }
            });
            res.on('end', () => resolve(fullResponse));
        });
        req.on('error', reject);
        req.write(postData);
        req.end();
    });
}

// 4. Smart Save
function saveRawCode(text, projectPath) {
    let cleanCode = text.replace(/```[a-z]*\n?/gi, '').replace(/```/g, '').trim();
    if (cleanCode.length < 50) return null;

    let filename = null;
    if (cleanCode.startsWith('<!DOCTYPE') || cleanCode.startsWith('<html')) filename = 'index.html';
    else if (cleanCode.includes('body {') || cleanCode.includes('canvas {')) filename = 'style.css';
    else if (cleanCode.includes('function ') || cleanCode.includes('document.')) filename = 'script.js';

    if (filename) {
        const fullPath = path.join(projectPath, filename);
        fs.writeFileSync(fullPath, cleanCode);
        return `\n✅ Saved as: ${filename}`;
    }
    return null;
}

// 5. Main Orchestrator Loop
async function startChat(projectName) {
    const projectPath = path.join(ROOT_DIR, projectName);
    if (!fs.existsSync(projectPath)) {
        fs.mkdirSync(projectPath, { recursive: true });
        console.log(`📁 Created target folder: ${projectName}`);
    }
    
    console.log(`\n🚀 Working in: ${projectName}`);
    console.log(`📦 Current Mode: ${currentMode === 'mono' ? 'Monolithic HTML' : 'Separate Files'}`);
    
    let history = [];
    let step = 0; // 0: HTML, 1: CSS, 2: JS

    while (true) {
        // Mode-aware auto prompts
        let autoPrompt = "";
        if (step === 0) {
            autoPrompt = currentMode === 'mono'
                ? "Create a complete monolithic index.html with inline <style> and <script> for a business landing page."
                : "Create index.html for a business site. Link to external style.css and script.js files.";
        } else if (step === 1) {
            autoPrompt = "Create style.css with neon green theme. Make it responsive.";
        } else if (step === 2) {
            autoPrompt = "Create script.js with smooth scroll and simple form validation.";
        } else {
            console.log("🏁 Project Complete! Run assemble.js to bundle.");
            break;
        }

        const userInput = await new Promise(resolve => rl.question(`\n👤 You [Step ${step+1}] (Press Enter for Auto): `, resolve));
        
        // Exit command
        if (userInput.toLowerCase() === 'exit') { rl.close(); process.exit(0); }
        
        // MODE SWITCH COMMAND
        if (userInput.startsWith('/mode ')) {
            const mode = userInput.split(' ')[1]?.toLowerCase();
            if (mode === 'mono') {
                currentMode = 'mono';
                console.log("📦 Mode: Monolithic HTML (inline CSS/JS)");
            } else if (mode === 'sep') {
                currentMode = 'sep';
                console.log("📁 Mode: Separate Files (external CSS/JS)");
            } else {
                console.log("⚠️  Unknown mode. Use: /mode mono  or  /mode sep");
            }
            continue; // Skip to next input without advancing step
        }
        
        // Status command
        if (userInput.toLowerCase() === '/status') {
            console.log(`📊 Status: Mode=${currentMode} | Step=${step+1}/3 | Target=${projectName}`);
            continue;
        }
        
        const finalPrompt = userInput.trim() !== "" ? userInput : autoPrompt;
        history.push({ role: 'user', content: finalPrompt });
        
        console.log(`🤖 Qwen (Generating ${step === 0 ? 'HTML' : step === 1 ? 'CSS' : 'JS'}): `);
        const rawReply = await sendToOllamaStream(history, projectName, projectPath);
        
        const saveMsg = saveRawCode(rawReply, projectPath);
        if (saveMsg) console.log(saveMsg);

        history.push({ role: 'assistant', content: rawReply });
        
        // Auto-advance step only if user pressed Enter (not a command)
        if (userInput.trim() === "") {
            step++;
        }
    }
}

selectProject().then(project => { if (project) startChat(project); });