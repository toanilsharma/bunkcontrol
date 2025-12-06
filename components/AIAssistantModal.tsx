
import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { RobotIcon, SendIcon, ChatIcon } from './icons';
import { Subject } from '../types';

interface AIAssistantModalProps {
  onClose: () => void;
  subjects: Subject[];
}

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const AIAssistantModal: React.FC<AIAssistantModalProps> = ({ onClose, subjects }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      text: "Hi! I'm your Bunk Assistant. Ask me things like \"Can I bunk Math?\" or \"Status of Physics\".",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isMounted = useRef(true);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    isMounted.current = true;
    scrollToBottom();
    return () => { isMounted.current = false; };
  }, [messages]);

  const processQuery = (query: string) => {
    const lowerQuery = query.toLowerCase();
    
    // Logic 1: Check capability to bunk a specific subject
    // Regex matches: "can i bunk [subject]?", "can i skip [subject]?"
    const bunkMatch = subjects.find(s => lowerQuery.includes(s.name.toLowerCase()));
    
    if (lowerQuery.includes('bunk') || lowerQuery.includes('skip') || lowerQuery.includes('miss')) {
        if (bunkMatch) {
            const total = bunkMatch.attended + bunkMatch.absent;
            const currentPct = total > 0 ? (bunkMatch.attended / total) * 100 : 0;
            
            // Check if attending next makes it safe? No, check if SKIPPING next is safe.
            // Simulate missing 1 class
            const newTotal = total + 1;
            const newPct = (bunkMatch.attended / newTotal) * 100;
            
            if (newPct >= bunkMatch.requiredPercentage) {
                 return `✅ Yes, you can bunk ${bunkMatch.name}! Your percentage will drop to ${newPct.toFixed(2)}%, which is still safe (>${bunkMatch.requiredPercentage}%).`;
            } else {
                 return `❌ No! If you skip ${bunkMatch.name}, you'll drop to ${newPct.toFixed(2)}% (Required: ${bunkMatch.requiredPercentage}%). Go to class!`;
            }
        }
        return "Which subject are you asking about? Try 'Can I bunk Math?'";
    }

    // Logic 2: Check Status
    if (lowerQuery.includes('status') || lowerQuery.includes('how am i doing')) {
        if (bunkMatch) {
             const total = bunkMatch.attended + bunkMatch.absent;
             const pct = total > 0 ? (bunkMatch.attended / total) * 100 : 0;
             return `📊 ${bunkMatch.name}: You are at ${pct.toFixed(2)}%. ${pct < bunkMatch.requiredPercentage ? 'You are in the danger zone!' : 'You are safe.'}`;
        }
        // General status
        const safeCount = subjects.filter(s => {
             const t = s.attended + s.absent;
             return t > 0 && (s.attended/t)*100 >= s.requiredPercentage;
        }).length;
        return `You are safe in ${safeCount} out of ${subjects.length} subjects. Keep it up!`;
    }

    return "I didn't quite catch that. Try asking 'Can I skip [Subject]?' or 'Status of [Subject]'.";
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMsg: Message = {
        id: Date.now().toString(),
        text: inputValue,
        sender: 'user',
        timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');

    // Simulate thinking delay
    setTimeout(() => {
        if (!isMounted.current) return;
        const responseText = processQuery(userMsg.text);
        const botMsg: Message = {
            id: (Date.now() + 1).toString(),
            text: responseText,
            sender: 'bot',
            timestamp: new Date()
        };
        setMessages(prev => [...prev, botMsg]);
    }, 600);
  };

  return createPortal(
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex justify-center items-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-800 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[600px] max-h-[90vh] animate-scale-in"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-blue-600 p-4 flex items-center justify-between text-white">
             <div className="flex items-center gap-2">
                 <RobotIcon className="h-6 w-6" />
                 <h2 className="font-bold text-lg">Bunk Assistant AI</h2>
             </div>
             <button onClick={onClose} className="hover:bg-blue-700 p-1 rounded">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
             </button>
        </div>

        {/* Chat Area */}
        <div className="flex-grow overflow-y-auto p-4 bg-gray-50 dark:bg-gray-900 space-y-4">
            {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${
                        msg.sender === 'user' 
                        ? 'bg-blue-600 text-white rounded-br-none' 
                        : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-none shadow-sm'
                    }`}>
                        {msg.text}
                    </div>
                </div>
            ))}
            <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <form onSubmit={handleSend} className="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 flex gap-2">
            <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask 'Can I skip Physics?'..."
                className="flex-grow bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button 
                type="submit" 
                className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full transition-colors flex-shrink-0"
                disabled={!inputValue.trim()}
            >
                <SendIcon className="h-5 w-5" />
            </button>
        </form>
      </div>
    </div>,
    document.body
  );
};

export default AIAssistantModal;
