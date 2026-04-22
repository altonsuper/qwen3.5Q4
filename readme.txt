👑 Supreme Master Agent
A local, private, and robust AI development environment powered by Qwen 3.5-0.8B and Ollama. Designed for rapid prototyping of web games, music tools, and automated workflows without leaving your machine.
🚀 Features
100% Local & Private: No data leaves your computer. Runs on localhost:11434.
Dual Interface:
CLI (suprememaster.js): A terminal-based agent for quick code generation and file management.
Web UI (supreme-ui.js): A futuristic, neon-themed web interface with real-time streaming and a "Magic Save" button.
Smart Parser: Automatically detects and saves index.html, style.css, and game.js from raw AI output.
Config-Driven: Easy-to-tune config.json for model parameters (temperature, stop sequences, system prompts).
Project Management: Built-in project selection and folder organization.
Utilities: Includes scan.ps1 for directory indexing and assemble.js for bundling projects.
📂 Project Structure
text
12345678910111213
C:\ALLAI\ANY\real\├── config.json           # Core configuration for Ollama and Agent├── suprememaster.js      # CLI Agent (Terminal)├── supreme-ui.js         # Web Server for the UI├── scan.ps1              # Directory Scanner Utility├── assemble.js           # Project Bundler (HTML/CSS/JS -> Single File)├── startui.bat           # Launcher for Web UI├── stopui.bat            # Stopper for Web UI├── public/               # Web UI Frontend Assets│   └── index.html        # Neon-themed Chat Interface├── project1/             # Active Development Folder├── assemble/             # Finished/Bundled Projects└── node_modules/         # Dependencies (Express)
🛠️ Setup & Installation
1. Prerequisites
Node.js: Installed and added to PATH.
Ollama: Installed and running (ollama serve).
Model: Pull Qwen 3.5-0.8B:
powershell
1
ollama pull qwen3.5:0.8b
2. Install Dependencies
Open PowerShell in C:\ALLAI\ANY\real and run:
powershell
1
npm install express
3. Configuration
Ensure your config.json is set for optimal performance:
json
1234567891011
{  "ollama": {    "model": "qwen3.5:0.8b",    "baseUrl": "http://localhost:11434",    "num_predict": -1,    "temperature": 0.2,    "stop": [],    "system_code": "You are an expert Senior Developer. Output ONLY raw code. No markdown. No thinking tags.",    "system_chat": "You are a helpful local assistant."  }}
🎮 Usage
Option A: The Web UI (Recommended)
Double-click startui.bat.
Open your browser to http://localhost:3000.
Select Project and Mode (Chat or Code).
Type your prompt. When code is generated, click the 💾 Save button.
Option B: The CLI Agent
Open PowerShell.
Run:
powershell
1
node suprememaster.js
Select your project number.
Type your prompt. The agent will auto-save detected files to the project folder.
Option C: Directory Scan
Place scan.ps1 in any folder.
Right-click -> Run with PowerShell.
Find the report in C:\Crawler\.
💡 Pro Tips
Chunking: For complex projects, ask for files one by one (e.g., "Create index.html", then "Create style.css"). Qwen 0.8B performs best with small, focused tasks.
Raw Code: The agent is tuned to output raw code. If you see markdown blocks, the parser will strip them automatically.
Stopping: Use stopui.bat or press Ctrl+C in the terminal to stop the agents.
🤝 Contributing
This project is a personal orchestration of local AI tools. Feel free to modify suprememaster.js or public/index.html to fit your workflow.
Built with ❤️ using Qwen 3.5, Ollama, and Node.js.