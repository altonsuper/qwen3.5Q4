// supreme-ui.js - WITH MAGIC SAVE BUTTON
const express = require('express');
const http = require('http');
const path = require('path');
const fs = require('fs');
const app = express();
const port = 3000;

app.use(express.json({ limit: '50mb' })); // Increase limit for large code files
app.use(express.static('public'));

const CONFIG = require('./config.json');
const MODEL = CONFIG.ollama.model;

// API Endpoint: Chat with Ollama
app.post('/api/chat', async (req, res) => {
    const { message, mode, project } = req.body;
    
    let systemPrompt = CONFIG.ollama.system_chat;
    if (mode === 'code') {
        systemPrompt = `${CONFIG.ollama.system_code} Context: Project "${project}".`;
    }

    const postData = JSON.stringify({
        model: MODEL,
        messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: message }
        ],
        stream: true,
        options: {
            num_predict: CONFIG.ollama.num_predict,
            temperature: CONFIG.ollama.temperature,
            stop: CONFIG.ollama.stop
        }
    });

    const options = {
        hostname: 'localhost',
        port: 11434,
        path: '/api/chat',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
    };

    const proxyReq = http.request(options, (proxyRes) => {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        proxyRes.on('data', (chunk) => res.write(chunk));
        proxyRes.on('end', () => res.end());
    });

    proxyReq.on('error', (e) => {
        console.error(`Problem with request: ${e.message}`);
        res.status(500).send(e.message);
    });

    proxyReq.write(postData);
    proxyReq.end();
});

// API Endpoint: Magic Save Button
app.post('/api/save', (req, res) => {
    const { project, filename, content } = req.body;
    const projectPath = path.join(__dirname, project);
    const fullPath = path.join(projectPath, filename);
    
    const dir = path.dirname(fullPath);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(fullPath, content);
    console.log(`✅ Saved: ${fullPath}`);
    res.json({ success: true, path: fullPath });
});

app.listen(port, () => {
    console.log(`👑 Supreme UI running at http://localhost:${port}`);
});