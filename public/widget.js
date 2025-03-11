import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';

function ChatbotWidget() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);

    try {
      const response = await fetch('https://aidemo.membee.app/webhook/c8018a60-91d4-4664-9a07-411f396501f1/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMessage] }),
      });

      const data = await response.json();
      setMessages((prev) => [...prev, { role: 'assistant', content: data.reply }]);
    } catch (error) {
      console.error('Chatbot error:', error);
    }

    setInput('');
  };

  return React.createElement(
    'div',
    { style: widgetContainerStyle },
    React.createElement('button', { style: buttonStyle, onClick: () => setIsOpen(!isOpen) }, isOpen ? 'Close Chat' : 'Open Chat'),
    isOpen &&
      React.createElement(
        'div',
        { style: chatboxStyle },
        messages.map((msg, index) =>
          React.createElement('p', { key: index, style: msg.role === 'user' ? userMessageStyle : aiMessageStyle }, msg.content)
        ),
        React.createElement('input', {
          type: 'text',
          value: input,
          onChange: (e) => setInput(e.target.value),
          placeholder: 'Ask me something...',
          style: inputStyle,
        }),
        React.createElement('button', { onClick: sendMessage, style: sendButtonStyle }, 'Send')
      )
  );
}

// Styles
const widgetContainerStyle = {
  position: 'fixed',
  bottom: '10px',
  right: '10px',
};

const chatboxStyle = {
  background: 'white',
  padding: '10px',
  borderRadius: '8px',
  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
  width: '300px',
};

const buttonStyle = {
  padding: '10px',
  background: 'blue',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
};

const userMessageStyle = { textAlign: 'right', color: 'blue', margin: '5px 0' };
const aiMessageStyle = { textAlign: 'left', color: 'green', margin: '5px 0' };
const inputStyle = { width: '100%', padding: '5px', margin: '5px 0' };
const sendButtonStyle = { width: '100%', padding: '5px', background: 'blue', color: 'white', border: 'none', borderRadius: '4px' };

// Attach to window
window.ChatbotWidget = function () {
  document.addEventListener('DOMContentLoaded', () => {
    let container = document.getElementById('my-ai-chatbot-container');

    if (!container) {
      container = document.createElement('div');
      container.id = 'my-ai-chatbot-container';
      document.body.appendChild(container);
    }

    const root = createRoot(container);
    root.render(React.createElement(ChatbotWidget));
  });
};
