// clean-chat.js
const readline = require('readline');
const http = require('http');

const MODEL = 'qwen3.5:0.8b';
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

console.log("🟢 Qwen 3.5 (0.8b) Local Chat Started.");
console.log("💡 Type 'exit' to quit.\n");

// Conversation History
let messages = [
    { role: 'system', content: 'You are Qwen, a helpful and friendly AI assistant.' }
];

function sendToOllama(msgHistory) {
    return new Promise((resolve, reject) => {
        const postData = JSON.stringify({
            model: MODEL,
            messages: msgHistory,
            stream: false // Get full response at once
        });

        const req = http.request({
            hostname: 'localhost',
            port: 11434,
            path: '/api/chat',
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        }, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    const json = JSON.parse(data);
                    resolve(json.message.content);
                } catch (e) { reject(e); }
            });
        });

        req.on('error', reject);
        req.write(postData);
        req.end();
    });
}

async function chatLoop() {
    const userInput = await new Promise(resolve => rl.question('👤 You: ', resolve));

    if (userInput.toLowerCase().trim() === 'exit') {
        console.log('👋 Goodbye!');
        rl.close();
        process.exit(0);
    }

    // Add user message to history
    messages.push({ role: 'user', content: userInput });

    console.log('🤖 Qwen is thinking...');
    
    try {
        const reply = await sendToOllama(messages);
        console.log(`\n🤖 Qwen: ${reply}\n`);
        
        // Add AI response to history so it remembers context
        messages.push({ role: 'assistant', content: reply });
        
        chatLoop(); // Continue the loop
    } catch (err) {
        console.error('❌ Error:', err.message);
        chatLoop();
    }
}

chatLoop();