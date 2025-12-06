import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { ClockIcon, PlayIcon, PauseIcon, StopIcon } from './icons';

interface FocusModeModalProps {
  onClose: () => void;
}

const FocusModeModal: React.FC<FocusModeModalProps> = ({ onClose }) => {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<'focus' | 'break'>('focus');
  const timerRef = useRef<number | null>(null);

  // Helper function to play a beep using Web Audio API (No external dependencies)
  const playBeep = () => {
    try {
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioContext) return;
        
        const ctx = new AudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        // Simple beep sound
        osc.type = 'sine';
        osc.frequency.value = 880; // A5
        
        // Volume envelope
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + 0.5);
        
        osc.start();
        osc.stop(ctx.currentTime + 0.5);
    } catch (e) {
        console.error("Audio playback failed", e);
    }
  };

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = window.setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      // Timer finished
      setIsActive(false);
      playBeep();
      
      if (mode === 'focus') {
          if(Notification.permission === 'granted') {
             new Notification("Focus Session Complete!", { body: "Take a 5 minute break." });
          }
          setMode('break');
          setTimeLeft(5 * 60);
      } else {
          if(Notification.permission === 'granted') {
             new Notification("Break Over!", { body: "Time to get back to work." });
          }
          setMode('focus');
          setTimeLeft(25 * 60);
      }
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, timeLeft, mode]);

  const toggleTimer = () => setIsActive(!isActive);
  
  const resetTimer = () => {
      setIsActive(false);
      setTimeLeft(mode === 'focus' ? 25 * 60 : 5 * 60);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return createPortal(
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex justify-center items-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-gray-900 text-white p-8 rounded-3xl shadow-2xl w-full max-w-sm relative animate-scale-in text-center border border-gray-700"
        onClick={e => e.stopPropagation()}
      >
        <div className="absolute top-4 right-4">
             <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
        </div>

        <div className="mb-8">
            <div className={`inline-flex items-center gap-2 px-4 py-1 rounded-full text-sm font-bold uppercase tracking-wide mb-2 ${mode === 'focus' ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
                <ClockIcon className="h-4 w-4" />
                {mode === 'focus' ? 'Focus Mode' : 'Break Time'}
            </div>
            <h2 className="text-7xl font-black font-mono tracking-tighter tabular-nums my-4">
                {formatTime(timeLeft)}
            </h2>
            <p className="text-gray-400">
                {isActive ? 'Stay focused. Don\'t change tabs.' : 'Ready to lock in?'}
            </p>
        </div>

        <div className="flex justify-center gap-6">
            <button
                onClick={toggleTimer}
                className={`w-16 h-16 rounded-full flex items-center justify-center transition-transform hover:scale-110 active:scale-95 shadow-lg ${isActive ? 'bg-yellow-500 text-black' : 'bg-white text-black'}`}
            >
                {isActive ? <PauseIcon className="h-8 w-8" /> : <PlayIcon className="h-8 w-8 ml-1" />}
            </button>
             <button
                onClick={resetTimer}
                className="w-16 h-16 rounded-full bg-gray-800 text-gray-300 flex items-center justify-center transition-colors hover:bg-gray-700 hover:text-white"
            >
                <StopIcon className="h-8 w-8" />
            </button>
        </div>
        
        <div className="mt-8 pt-6 border-t border-gray-800">
             <p className="text-xs text-gray-500">Bunk Control Focus Timer</p>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default FocusModeModal;