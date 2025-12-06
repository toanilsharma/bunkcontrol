import React, { useState } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';

const CookieConsent: React.FC = () => {
  const [consent, setConsent] = useLocalStorage('cookie_consent', false);
  const [isVisible, setIsVisible] = useState(!consent);

  const handleAccept = () => {
    setConsent(true);
    setIsVisible(false);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 animate-slide-up">
      <div className="bg-gray-800/90 backdrop-blur-sm max-w-4xl mx-auto rounded-lg shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4 p-4">
        <p className="text-sm text-gray-300">
          We use local storage to save your data on your device and may use cookies from third-party partners like Google for advertising. See our{' '}
          <a href="/privacy.html" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-400 hover:underline">
            Privacy Policy
          </a>
          {' '}for more details.
        </p>
        <button
          onClick={handleAccept}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-5 rounded-md transition-colors flex-shrink-0"
        >
          Accept
        </button>
      </div>
    </div>
  );
};

export default CookieConsent;