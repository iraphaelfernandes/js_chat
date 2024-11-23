document.addEventListener('DOMContentLoaded', () => {

    const POLLING_INTERVAL = 500;
    const BASE_URL = `http://localhost:3014`;

    const API_ENDPOINTS = {
        GET_CHAT: '/chat',
        POST_MESSAGE: '/message',
        CENSOR_MESSAGE: '/censorMessage',
        DELETE_CHAT: '/chat'
    }

    const displayPopupError = () => {
        document.querySelector('.error-message-popup').classList.add('active');
    };

    const hideErrorPopup = () => {
        document.querySelector('.error-message-popup').classList.remove('active');
    };

    hideErrorPopup();
    document.querySelector('.close-btn').addEventListener('click', hideErrorPopup);

    const toggleSendButton = () => {
        const author = document.querySelector('.username-input').value.trim();
        const message = document.querySelector('.new-message-input').value.trim();
        const sendSbutton = document.querySelector('.send-message-btn');
        sendSbutton.disabled = !author || !message;
        sendSbutton.style.cursor = sendSbutton.disabled ? 'default' : 'pointer';
        sendSbutton.style.backgroundColor = sendSbutton.disabled ? '#9d9d9d' : '';
    };
    
    const updateChatWindow = (chatData) => {
        const chat_window = document.querySelector('.chat-window');
        chat_window.innerHTML = chatData.map(
            entry => `<div class="chat-entry">
                        <span class="author">${entry.author}</span>
                        <span class="delimiter">:&nbsp;</span>
                        <span class="message">${entry.message}</span>
                      </div>`
        ).join('');
    };

    const fetchChatContent = async () => {
        try {
            const response = await fetch(`${BASE_URL}${API_ENDPOINTS.GET_CHAT}`);
            if (response.status !== 200) throw new Error();
            const chatData = await response.json();
            updateChatWindow(chatData);
        } catch {
            displayPopupError();
        }
    };

    setInterval(fetchChatContent, POLLING_INTERVAL);

    const censorMessage = async (message) => {
        try {
            const response = await fetch(`${BASE_URL}${API_ENDPOINTS.CENSOR_MESSAGE}?message=${encodeURIComponent(message)}`);
            if (response.status !== 200) throw new Error();
            const { censoredMessage } = await response.json();
            return censoredMessage;
        } catch {
            displayPopupError();
            return null;
        }
    };

    const postMessage = async () => {
        const author = document.querySelector('.username-input').value.trim();
        const message = document.querySelector('.new-message-input').value.trim();
        if (!author || !message) return;

        const censoredMessage = await censorMessage(message);
        if (!censoredMessage) return;

        try {
            const response = await fetch(`${BASE_URL}${API_ENDPOINTS.POST_MESSAGE}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ author, message: censoredMessage })
            });
            if (response.status !== 200) throw new Error();
            const chatData = await response.json();
            updateChatWindow(chatData);
            document.querySelector('.new-message-input').value = '';
            toggleSendButton();
        } catch {
            displayPopupError();
        }
    };

    document.querySelector('.send-message-btn').addEventListener('click', postMessage);

    document.querySelector('.new-message-input').addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !document.querySelector('.send-message-btn').disabled) {
            e.preventDefault();
            postMessage();
        }
    });

    const clearChat = async () => {
        try {
            const response = await fetch(`${BASE_URL}${API_ENDPOINTS.DELETE_CHAT}`, { method: 'DELETE' });
            if (response.status !== 200) throw new Error();
            const chatData = await response.json();
            updateChatWindow(chatData);
        } catch {
            displayPopupError();
        }
    };

    document.querySelector('.clear-chat-btn').addEventListener('click', clearChat);

    document.querySelectorAll('.username-input, .new-message-input').forEach(input => {
        input.addEventListener('input', toggleSendButton);
    });

    toggleSendButton();
});
