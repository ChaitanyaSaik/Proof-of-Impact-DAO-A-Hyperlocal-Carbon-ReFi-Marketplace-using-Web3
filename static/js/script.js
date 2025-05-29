
document.addEventListener('DOMContentLoaded', () => {
    // Smooth scrolling for navigation
    document.querySelectorAll('nav a').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').startsWith('#') ? this.getAttribute('href') : null;
            if (targetId) {
                document.querySelector(targetId).scrollIntoView({
                    behavior: 'smooth'
                });
            } else {
                window.location.href = this.href; // For external/other page links like marketplace/dashboard
            }
        });
    });

    // --- Chatbot Functionality (Enhanced with OpenAI Backend Proxy) ---
    const chatToggle = document.getElementById('chat-toggle');
    const chatWidget = document.getElementById('chat-widget');
    const chatClose = document.getElementById('chat-close');
    const chatWindow = document.getElementById('chat-window');
    const chatInput = document.getElementById('chat-input');

    chatToggle.addEventListener('click', () => {
        chatWidget.classList.toggle('active');
        if (chatWidget.classList.contains('active')) {
            chatInput.focus(); // Focus input when chat opens
        }
    });

    chatClose.addEventListener('click', () => {
        chatWidget.classList.remove('active');
    });

    chatInput.addEventListener('keypress', async (e) => {
        if (e.key === 'Enter' && chatInput.value.trim() !== '') {
            const userMessage = chatInput.value.trim();
            sendMessage(userMessage, 'user');
            chatInput.value = '';
            chatInput.disabled = true; // Disable input while waiting for AI
            chatInput.placeholder = 'Thinking...';

            try {
                const response = await fetch('/api/chat', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ message: userMessage })
                });
                const data = await response.json();
                if (response.ok) {
                    sendMessage(data.response, 'bot');
                } else {
                    sendMessage(`Error: ${data.response || 'Could not get a response.'}`, 'bot');
                }
            } catch (error) {
                console.error("Chatbot API error:", error);
                sendMessage("Apologies, I couldn't connect to the AI right now. Please try again.", 'bot');
            } finally {
                chatInput.disabled = false;
                chatInput.placeholder = 'Ask me anything...';
                chatInput.focus();
            }
        }
    });

    function sendMessage(message, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', `${sender}-message`, 'fade-in');
        messageDiv.textContent = message;
        chatWindow.appendChild(messageDiv);
        chatWindow.scrollTop = chatWindow.scrollHeight; // Scroll to bottom
    }

    // Draggable Chat Widget
    let isDragging = false;
    let offsetX, offsetY;

    const chatHeader = document.getElementById('chat-header');
    chatHeader.addEventListener('mousedown', (e) => {
        isDragging = true;
        offsetX = e.clientX - chatWidget.getBoundingClientRect().left;
        offsetY = e.clientY - chatWidget.getBoundingClientRect().top;
        chatWidget.style.cursor = 'grabbing';
        chatWidget.style.transition = 'none'; // Disable transition during drag
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        chatWidget.style.left = (e.clientX - offsetX) + 'px';
        chatWidget.style.top = (e.clientY - offsetY) + 'px';
        e.preventDefault();
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
        chatWidget.style.cursor = 'grab';
        chatWidget.style.transition = 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.4s ease'; // Re-enable transition
    });


    // --- Scroll Reveal Animations ---
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.fade-in-up, .fade-in-left, .fade-in-right, .slide-in-right, .scale-in, .fade-in');
        elements.forEach(element => {
            const rect = element.getBoundingClientRect();
            // Trigger animation if element is partly visible
            if (rect.top < window.innerHeight - 100 && rect.bottom > 0) {
                element.classList.add('animated');
            }
            // Optional: remove 'animated' class if element goes out of view
            // else {
            //     element.classList.remove('animated');
            // }
        });
    };

    // Initial check on load
    animateOnScroll();

    // Attach to scroll and resize events
    window.addEventListener('scroll', animateOnScroll);
    window.addEventListener('resize', animateOnScroll);
});