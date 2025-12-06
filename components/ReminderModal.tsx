import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Subject, Reminder } from '../types';

interface ReminderModalProps {
  subject: Subject;
  onSave: (reminder: Reminder | null) => void;
  onClose: () => void;
}

const daysOfWeek = [
  { label: 'S', value: 0 }, { label: 'M', value: 1 }, { label: 'T', value: 2 },
  { label: 'W', value: 3 }, { label: 'T', value: 4 }, { label: 'F', value: 5 },
  { label: 'S', value: 6 }
];

const ReminderModal: React.FC<ReminderModalProps> = ({ subject, onSave, onClose }) => {
  const [enabled, setEnabled] = useState(subject.reminder?.enabled ?? false);
  const [time, setTime] = useState(subject.reminder?.time ?? '10:00');
  const [days, setDays] = useState<number[]>(subject.reminder?.days ?? []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleDayToggle = (dayValue: number) => {
    setDays(prevDays =>
      prevDays.includes(dayValue)
        ? prevDays.filter(d => d !== dayValue)
        : [...prevDays, dayValue]
    );
  };

  const handleSave = () => {
    if (enabled && days.length === 0) {
      alert('Please select at least one day for the reminder.');
      return;
    }
    onSave({ enabled, time, days });
    onClose();
  };
  
  const handleDelete = () => {
    onSave(null);
    onClose();
  };

  const modalContent = (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex justify-center items-center p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="reminder-title"
    >
      <div
        className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-2xl w-full max-w-sm relative animate-scale-in transition-colors duration-300"
        onClick={e => e.stopPropagation()}
      >
        <h2 id="reminder-title" className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          Set Reminder
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">For "{subject.name}"</p>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <label htmlFor="reminder-enabled" className="text-lg font-medium text-gray-800 dark:text-gray-300">
              Enable Reminder
            </label>
            <button
              id="reminder-enabled"
              role="switch"
              aria-checked={enabled}
              onClick={() => setEnabled(!enabled)}
              className={`${enabled ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'} relative inline-flex items-center h-6 rounded-full w-11 transition-colors`}
            >
              <span className={`${enabled ? 'translate-x-6' : 'translate-x-1'} inline-block w-4 h-4 transform bg-white rounded-full transition-transform shadow-sm`} />
            </button>
          </div>

          <div className={`transition-opacity duration-300 ${enabled ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
            <div className="mb-4">
              <label htmlFor="reminder-time" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Time
              </label>
              <input
                id="reminder-time"
                type="time"
                value={time}
                onChange={e => setTime(e.target.value)}
                className="w-full bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={!enabled}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Repeat on
              </label>
              <div className="flex justify-between gap-1">
                {daysOfWeek.map(({ label, value }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => handleDayToggle(value)}
                    className={`w-10 h-10 rounded-full font-bold transition-colors ${
                      days.includes(value) ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                    }`}
                    aria-pressed={days.includes(value)}
                    disabled={!enabled}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-4 pt-8">
          <button
            type="button"
            onClick={handleDelete}
            className="w-full bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 text-red-700 dark:text-red-400 font-bold py-3 px-4 rounded-md transition-colors"
            disabled={!subject.reminder}
          >
            Delete
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-md transition-colors"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default ReminderModal;