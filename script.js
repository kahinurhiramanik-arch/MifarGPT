// Sidebar Toggle for Mobile
const menuToggle = document.getElementById('menuToggle');
const sidebar = document.getElementById('sidebar');

if(menuToggle) {
    menuToggle.addEventListener('click', () => {
        sidebar.classList.toggle('active');
    });
}

// Mode Selection
const modeBtns = document.querySelectorAll('.mode-btn');
let currentMode = 'standard';

modeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        modeBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentMode = btn.getAttribute('data-mode');
    });
});

// Chat Logic
const sendBtn = document.getElementById('sendBtn');
const userInput = document.getElementById('userInput');
const chatDisplay = document.getElementById('chatDisplay');

function createMessage(text, sender) {
    const welcome = document.querySelector('.welcome-screen');
    if(welcome) welcome.style.display = 'none';

    const msgDiv = document.createElement('div');
    msgDiv.className = `message ${sender === 'user' ? 'user-m' : 'bot-m'}`;
    msgDiv.innerHTML = `<p>${text}</p>`;
    chatDisplay.appendChild(msgDiv);
    chatDisplay.scrollTop = chatDisplay.scrollHeight;
}

function handleSend() {
    const text = userInput.value.trim();
    if(!text) return;

    createMessage(text, 'user');
    userInput.value = '';
    
    // Fake Response for now (Will connect API later)
    setTimeout(() => {
        const response = `[MifarGPT ${currentMode.toUpperCase()}]: I'm currently in UI preview mode. Once we connect the API, I will be able to answer: "${text}"`;
        createMessage(response, 'bot');
    }, 8000); // 800ms delay
}

sendBtn.addEventListener('click', handleSend);

userInput.addEventListener('keydown', (e) => {
    if(e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend();
    }
});

// Auto-resize textarea
userInput.addEventListener('input', function() {
    this.style.height = 'auto';
    this.style.height = (this.scrollHeight) + 'px';
});
