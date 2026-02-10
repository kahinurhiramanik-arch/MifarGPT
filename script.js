// --- Configuration & State ---
const chatContainer = document.getElementById('chatContainer');
const userInput = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');
const welcomeScreen = document.getElementById('welcomeScreen');
const sidebar = document.getElementById('sidebar');

let apiKey = localStorage.getItem('gemini_api_key') || '';
let currentMode = 'standard'; // standard, deep, code

// --- Initialization ---
window.onload = () => {
    // Check if API key exists, if not open settings
    if (!apiKey) {
        setTimeout(() => openSettings(), 1000);
    } else {
        document.getElementById('apiKeyInput').value = apiKey;
    }
    
    // Auto resize textarea
    userInput.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = (this.scrollHeight) + 'px';
        sendBtn.disabled = this.value.trim() === '';
    });
};

// --- Settings Logic ---
function openSettings() {
    document.getElementById('settingsModal').style.display = 'flex';
}

function closeSettings() {
    document.getElementById('settingsModal').style.display = 'none';
}

function saveSettings() {
    const key = document.getElementById('apiKeyInput').value.trim();
    const instruction = document.getElementById('systemInstruction').value;
    
    if (key.length < 10) {
        alert("Please enter a valid API Key!");
        return;
    }

    localStorage.setItem('gemini_api_key', key);
    localStorage.setItem('system_instruction', instruction);
    apiKey = key;
    
    alert("Connected! You can now chat.");
    closeSettings();
}

// --- Theme & Mode Logic ---
function toggleTheme() {
    const body = document.body;
    if (body.getAttribute('data-theme') === 'light') {
        body.setAttribute('data-theme', 'dark');
    } else {
        body.setAttribute('data-theme', 'light');
    }
}

function setMode(mode) {
    currentMode = mode;
    document.querySelectorAll('.tool-btn').forEach(btn => btn.classList.remove('active'));
    event.currentTarget.classList.add('active');
    
    const modeLabels = {
        'standard': 'Standard Mode',
        'deep': 'Deep Thinking Mode',
        'code': 'Coding Mode'
    };
    document.getElementById('currentMode').innerText = modeLabels[mode];
}

function toggleSidebar() {
    sidebar.classList.toggle('active');
}

// --- Chat Logic ---
function fillInput(text) {
    userInput.value = text;
    userInput.focus();
    sendBtn.disabled = false;
}

async function handleSend() {
    const text = userInput.value.trim();
    if (!text) return;
    if (!apiKey) {
        openSettings();
        return;
    }

    // UI Updates
    userInput.value = '';
    userInput.style.height = 'auto';
    welcomeScreen.style.display = 'none';
    
    addMessage(text, 'user');
    const loadingId = addLoadingMessage();

    // Prepare Prompt based on Mode
    let systemPrompt = localStorage.getItem('system_instruction') || "You are a helpful AI.";
    if (currentMode === 'deep') systemPrompt += " Think step-by-step and provide a very detailed, logical analysis.";
    if (currentMode === 'code') systemPrompt += " Focus on writing clean, efficient code with comments. Output code inside markdown blocks.";

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: systemPrompt + "\n\nUser: " + text }]
                }]
            })
        });

        const data = await response.json();
        
        // Remove loading
        document.getElementById(loadingId).remove();

        if (data.error) {
            addMessage("API Error: " + data.error.message, 'bot');
        } else {
            const aiText = data.candidates[0].content.parts[0].text;
            addMessage(aiText, 'bot');
        }

    } catch (error) {
        document.getElementById(loadingId).remove();
        addMessage("Connection Error. Please check your internet or API Key.", 'bot');
    }
}

// Display Message
function addMessage(text, sender) {
    const div = document.createElement('div');
    div.className = `message-row ${sender}`;
    
    // Markdown Parsing using Marked.js
    const parsedText = sender === 'bot' ? marked.parse(text) : text;

    div.innerHTML = `
        <div class="avatar ${sender}">
            <i class="fas ${sender === 'user' ? 'fa-user' : 'fa-robot'}"></i>
        </div>
        <div class="msg-content">${parsedText}</div>
    `;
    
    chatContainer.appendChild(div);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

function addLoadingMessage() {
    const id = 'loading-' + Date.now();
    const div = document.createElement('div');
    div.id = id;
    div.className = 'message-row bot';
    div.innerHTML = `
        <div class="avatar bot"><i class="fas fa-robot"></i></div>
        <div class="msg-content">Thinking... <i class="fas fa-spinner fa-spin"></i></div>
    `;
    chatContainer.appendChild(div);
    chatContainer.scrollTop = chatContainer.scrollHeight;
    return id;
}

// Event Listeners
sendBtn.addEventListener('click', handleSend);
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend();
    }
});
