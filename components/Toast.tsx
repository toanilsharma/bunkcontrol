import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';

interface ToastProps {
  message: string;
  onUndo?: () => void;
  onClose: () => void;
  isVisible: boolean;
}

const Toast: React.FC<ToastProps> = ({ message, onUndo, onClose, isVisible }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 5000); // Disappear after 5 seconds
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return createPortal(
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-[110] animate-slide-up">
      <div className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-6 py-4 rounded-xl shadow-2xl flex items-center gap-4 min-w-[300px] justify-between border border-gray-700 dark:border-gray-200">
        <div className="flex items-center gap-3">
           <span className="flex items-center justify-center w-6 h-6 rounded-full bg-green-500 text-white">
             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
           </span>
           <span className="font-medium text-sm">{message}</span>
        </div>
        
        {onUndo && (
          <button 
            onClick={onUndo}
            className="text-yellow-400 dark:text-blue-600 font-bold text-sm hover:underline uppercase tracking-wide"
          >
            Undo
          </button>
        )}
      </div>
    </div>,
    document.body
  );
};

export default Toast;