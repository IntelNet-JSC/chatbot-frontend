(function () {
  // Check if React is available; if not, load React & ReactDOM
  if (!window.React || !window.ReactDOM) {
    const reactScript = document.createElement('script');
    reactScript.src = 'https://unpkg.com/react@18/umd/react.production.min.js';
    reactScript.async = true;
    document.head.appendChild(reactScript);

    const reactDOMScript = document.createElement('script');
    reactDOMScript.src = 'https://unpkg.com/react-dom@18/umd/react-dom.production.min.js';
    reactDOMScript.async = true;
    document.head.appendChild(reactDOMScript);

    reactDOMScript.onload = function () {
      loadChatbotScript();
    };
  } else {
    loadChatbotScript();
  }

  function loadChatbotScript() {
    // Create a container for the chatbot
    let container = document.getElementById('my-ai-chatbot-container');

    if (!container) {
      container = document.createElement('div');
      container.id = 'my-ai-chatbot-container';
      document.body.appendChild(container);
    }

    // Load the chatbot script dynamically
    const chatbotScript = document.createElement('script');
    chatbotScript.src = 'http://localhost:3000//widget.js'; // Update with your domain
    chatbotScript.async = true;

    console.log(window.ChatbotWidget);

    chatbotScript.onload = function () {
      if (window.ChatbotWidget) {
        window.ChatbotWidget(); // Initialize chatbot
      } else {
        console.error('ChatbotWidget function not found.');
      }
    };

    document.body.appendChild(chatbotScript);
  }
})();
