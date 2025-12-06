import React, { useState, useMemo, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Subject } from '../types';

interface WhatIfCalculatorModalProps {
  subject: Subject;
  onClose: () => void;
}

const WhatIfCalculatorModal: React.FC<WhatIfCalculatorModalProps> = ({ subject, onClose }) => {
  const [attendedClasses, setAttendedClasses] = useState(0);
  const [missedClasses, setMissedClasses] = useState(0);

  // Calculation for the projection based on user input
  const { projectedPercentage, isSafe } = useMemo(() => {
    const futureAttendance = Math.max(0, attendedClasses);
    const futureAbsences = Math.max(0, missedClasses);
    
    const newTotalAttended = subject.attended + futureAttendance;
    const newTotalAbsent = subject.absent + futureAbsences;
    const newTotalClasses = newTotalAttended + newTotalAbsent;

    if (newTotalClasses === 0) {
      return { projectedPercentage: 0, isSafe: 0 >= subject.requiredPercentage };
    }

    const percentage = (newTotalAttended / newTotalClasses) * 100;
    return {
      projectedPercentage: percentage,
      isSafe: percentage >= subject.requiredPercentage,
    };
  }, [attendedClasses, missedClasses, subject]);
  
  // Calculation for how many classes are needed to get on track
  const { classesToAttend } = useMemo(() => {
    const totalClasses = subject.attended + subject.absent;
    const currentPercentage = totalClasses > 0 ? (subject.attended / totalClasses) * 100 : 0;
    
    let needed = 0;
    // Check if below required percentage and if any classes have been held
    if (currentPercentage < subject.requiredPercentage && totalClasses > 0) {
      // Formula to calculate number of consecutive classes to attend
      needed = Math.ceil(
        ((subject.requiredPercentage / 100) * totalClasses - subject.attended) /
        (1 - (subject.requiredPercentage / 100))
      );
    }
    
    return {
      classesToAttend: needed > 0 ? needed : 0,
    };
}, [subject.attended, subject.absent, subject.requiredPercentage]);


  // Handle Escape key to close
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  const resultColor = isSafe ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400';
  const resultBgColor = isSafe ? 'bg-green-50 dark:bg-green-500/10' : 'bg-red-50 dark:bg-red-500/10';
  const resultBorderColor = isSafe ? 'border-green-200 dark:border-green-500/30' : 'border-red-200 dark:border-red-500/30';

  const modalContent = (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex justify-center items-center p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="calculator-title"
    >
      <div
        className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-2xl w-full max-w-sm relative animate-scale-in transition-colors duration-300"
        onClick={e => e.stopPropagation()}
      >
        <h2 id="calculator-title" className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          'What If' Calculator
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">For "{subject.name}"</p>

        {classesToAttend > 0 && (
          <div className="bg-yellow-50 dark:bg-yellow-500/10 border border-yellow-200 dark:border-yellow-500/30 p-3 rounded-lg text-center mb-6">
              <h3 className="text-base font-semibold text-yellow-700 dark:text-yellow-300 mb-1">Recovery Plan</h3>
              <p className="text-yellow-800 dark:text-yellow-400 text-sm">
                  You need to attend the next <span className="font-bold">{classesToAttend}</span> class{classesToAttend !== 1 ? 'es' : ''} consecutively to reach {subject.requiredPercentage}%.
              </p>
          </div>
        )}

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700 pb-2">Attendance Simulator</h3>
          <div className="grid grid-cols-2 gap-4">
             <div>
                <label htmlFor="attended-classes-input" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  If I attend...
                </label>
                <div className="relative">
                  <input
                    id="attended-classes-input"
                    type="number"
                    value={attendedClasses}
                    onChange={(e) => setAttendedClasses(parseInt(e.target.value, 10) || 0)}
                    className="w-full bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-center text-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    min="0"
                    autoFocus
                  />
                </div>
              </div>
              <div>
                <label htmlFor="missed-classes-input" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  ...and miss
                </label>
                <div className="relative">
                  <input
                    id="missed-classes-input"
                    type="number"
                    value={missedClasses}
                    onChange={(e) => setMissedClasses(parseInt(e.target.value, 10) || 0)}
                    className="w-full bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-center text-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    min="0"
                  />
                </div>
              </div>
          </div>


          <div className={`p-4 rounded-lg border ${resultBorderColor} ${resultBgColor} transition-colors duration-300`}>
            <p className="text-sm text-gray-600 dark:text-gray-400 text-center">Your attendance would be:</p>
            <p className={`text-4xl font-bold text-center my-2 ${resultColor}`}>
              {projectedPercentage.toFixed(2)}%
            </p>
            <p className={`text-center font-semibold ${resultColor}`}>
              {isSafe
                ? `You'll still be above the required ${subject.requiredPercentage}%.`
                : `You'll drop below the required ${subject.requiredPercentage}%.`}
            </p>
          </div>
        </div>

        <div className="mt-6">
          <button
            type="button"
            onClick={onClose}
            className="w-full bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-800 dark:text-white font-bold py-2 px-4 rounded-md transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default WhatIfCalculatorModal;