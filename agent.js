// agent.js
const http = require('http');

const MODEL = 'qwen3.5:0.8b'; // The model we are waking up
const HOST = 'localhost';
const PORT = 11434;

console.log("⚡ Initializing Local Qwen Link...");

const postData = JSON.stringify({
  model: MODEL,
  messages: [
    { role: 'user', content: 'PING. Respond with "PONG! I am alive and ready." and nothing else.' }
  ],
  stream: false // We want the full answer at once for the ping
});

const options = {
  hostname: HOST,
  port: PORT,
  path: '/api/chat',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData)
  }
};

const req = http.request(options, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    try {
      const response = JSON.parse(data);
      const reply = response.message?.content || "No response received.";
      
      console.log("\n----------------------------------------");
      console.log(`🟢 SYSTEM STATUS: ONLINE`);
      console.log(`🤖 QWEN RESPONSE: ${reply.trim()}`);
      console.log("----------------------------------------\n");
      console.log("✅ Ready for input. You can now interact.");
      
      // Optional: Keep process alive if you want to extend later, 
      // but for a ping test, we exit here.
      process.exit(0); 
    } catch (e) {
      console.error("❌ Error parsing response:", e.message);
      process.exit(1);
    }
  });
});

req.on('error', (e) => {
  console.error(`❌ Connection Failed: Is Ollama running? (Error: ${e.message})`);
  console.log("💡 Tip: Run 'ollama serve' in another terminal if needed.");
  process.exit(1);
});

req.write(postData);
req.end();