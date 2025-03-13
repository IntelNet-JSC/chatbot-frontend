(function () {
  function loadScript(url, callback) {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;
    script.onload = function () {
      callback();
    };
    script.onerror = function () {
      console.error(`Failed to load script: ${url}`);
    };
    document.head.appendChild(script);
  }

  function init() {
    let container = document.getElementById('my-ai-chatbot-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'my-ai-chatbot-container';
      document.body.appendChild(container);
    }

    // Add styles to the container
    container.style.position = 'fixed';
    container.style.bottom = '100px';
    container.style.right = '25px';

    const root = document.createElement('div');
    container.appendChild(root);

    loadScript('https://cdn.jsdelivr.net/npm/react@17/umd/react.production.min.js', () => {
      loadScript('https://cdn.jsdelivr.net/npm/react-dom@17/umd/react-dom.production.min.js', () => {
        const { createElement, useState } = window.React;
        const { render } = window.ReactDOM;

        function EmbedComponent() {
          const [iframeVisible, setIframeVisible] = useState(false);

          const svgChatIcon = createElement(
            'svg',
            { xmlns: 'http://www.w3.org/2000/svg', x: '0px', y: '0px', width: '30', height: '30', viewBox: '0 0 50 50' },
            createElement('path', {
              d: 'M 25 4.0625 C 12.414063 4.0625 2.0625 12.925781 2.0625 24 C 2.0625 30.425781 5.625 36.09375 11 39.71875 C 10.992188 39.933594 11 40.265625 10.71875 41.3125 C 10.371094 42.605469 9.683594 44.4375 8.25 46.46875 L 7.21875 47.90625 L 9 47.9375 C 15.175781 47.964844 18.753906 43.90625 19.3125 43.25 C 21.136719 43.65625 23.035156 43.9375 25 43.9375 C 37.582031 43.9375 47.9375 35.074219 47.9375 24 C 47.9375 12.925781 37.582031 4.0625 25 4.0625 Z M 25 5.9375 C 36.714844 5.9375 46.0625 14.089844 46.0625 24 C 46.0625 33.910156 36.714844 42.0625 25 42.0625 C 22.996094 42.0625 21.050781 41.820313 19.21875 41.375 L 18.65625 41.25 L 18.28125 41.71875 C 18.28125 41.71875 15.390625 44.976563 10.78125 45.75 C 11.613281 44.257813 12.246094 42.871094 12.53125 41.8125 C 12.929688 40.332031 12.9375 39.3125 12.9375 39.3125 L 12.9375 38.8125 L 12.5 38.53125 C 7.273438 35.21875 3.9375 29.941406 3.9375 24 C 3.9375 14.089844 13.28125 5.9375 25 5.9375 Z',
            })
          );

          const svgCloseIcon = createElement(
            'svg',
            { xmlns: 'http://www.w3.org/2000/svg', x: '0px', y: '0px', width: '16', height: '16', viewBox: '0 0 24 24' },
            createElement('path', {
              d: 'M 4.7070312 3.2929688 L 3.2929688 4.7070312 L 10.585938 12 L 3.2929688 19.292969 L 4.7070312 20.707031 L 12 13.414062 L 19.292969 20.707031 L 20.707031 19.292969 L 13.414062 12 L 20.707031 4.7070312 L 19.292969 3.2929688 L 12 10.585938 L 4.7070312 3.2929688 z',
            })
          );

          return createElement(
            'div',
            null,
            createElement(
              'button',
              {
                onClick: () => setIframeVisible(true),
                style: {
                  position: 'fixed',
                  bottom: '50px',
                  right: '20px',
                },
              },
              svgChatIcon
            ),

            iframeVisible &&
              createElement(
                'button',
                {
                  onClick: () => setIframeVisible(false),
                  style: {
                    position: 'absolute',
                    top: '2rem',
                    right: '2rem',
                    zIndex: 1000,
                  },
                },
                svgCloseIcon
              ),

            iframeVisible &&
              createElement('iframe', {
                src: 'https://chatbotui.membee.app//?link=https://aidemo.membee.app/webhook/c8018a60-91d4-4664-9a07-411f396501f1/chat&title=Membee',
                style: { height: '100vh', width: '100vw', maxHeight: '63vh', maxWidth: '37vw', borderRadius: '10px', position: 'relative' },
              })
          );
        }

        render(createElement(EmbedComponent), root);
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      init();
    });
  } else {
    init();
  }
})();
