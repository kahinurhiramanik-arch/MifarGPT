const userInput = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');
const chatDisplay = document.getElementById('chatDisplay');

// Auto-resize textarea
userInput.addEventListener('input', function() {
    this.style.height = 'auto';
    this.style.height = (this.scrollHeight) + 'px';
});

function addMessage(text, isUser) {
    // Remove welcome screen on first message
    const welcome = document.querySelector('.welcome-screen');
    if (welcome) welcome.remove();

    const msgDiv = document.createElement('div');
    msgDiv.className = isUser ? 'message user-msg' : 'message bot-msg';
    
    const icon = isUser ? '<i class="fas fa-user"></i>' : '<i class="fas fa-robot text-blue-400"></i>';
    
    msgDiv.innerHTML = `
        <div class="msg-content">
            <p>${text}</p>
        </div>
    `;
    
    chatDisplay.appendChild(msgDiv);
    chatDisplay.scrollTo({ top: chatDisplay.scrollHeight, behavior: 'smooth' });
}

function handleResponse() {
    const text = userInput.value.trim();
    if (text === "") return;

    addMessage(text, true);
    userInput.value = "";
    userInput.style.height = 'auto';

    // Simulate AI thinking
    setTimeout(() => {
        const response = "Hello! I am **MifarGPT**. I am currently in demo mode. To make me smarter, you can connect an API key in the backend code!";
        addMessage(response, false);
    }, 1000);
}

sendBtn.addEventListener('click', handleResponse);

userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleResponse();
    }
});
