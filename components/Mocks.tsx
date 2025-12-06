import React, { useState } from 'react';
import { SubjectIcon, CursorClickIcon } from './icons';

// Interactive Mock Subject Card
export const MockSubjectCard = () => {
  const [attended, setAttended] = useState(17);
  const [absent, setAbsent] = useState(3);
  const [cancelled, setCancelled] = useState(0);
  const required = 75;

  const total = attended + absent;
  const percentage = total > 0 ? (attended / total) * 100 : 0;
  
  const isSafe = percentage >= required;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col w-full max-w-sm mx-auto select-none transition-all duration-300">
      <div className={`p-4 ${isSafe ? 'bg-green-500' : 'bg-red-500'} transition-colors duration-500 relative`}>
        <div className="flex justify-between items-start">
            <div className="flex items-center gap-3 flex-1 min-w-0">
                <SubjectIcon iconName="Calculator" className="h-8 w-8 text-white/90 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <h2 className="text-xl font-bold text-white truncate">Mathematics</h2>
                  <p className="text-sm text-white/90 font-semibold">{isSafe ? 'Safe' : 'Danger Zone!'}</p>
                </div>
            </div>
            <div className="text-4xl font-black text-white/95 ml-2">
                {percentage.toFixed(1)}<span className="text-2xl">%</span>
            </div>
        </div>
        <div className="w-full bg-black/20 rounded-full h-2 mt-3">
          <div 
            className="bg-white/90 h-2 rounded-full transition-all duration-500" 
            style={{ width: `${Math.min(percentage, 100)}%` }}
          ></div>
        </div>
      </div>
      
      <div className="p-5 flex-grow">
        <div className="grid grid-cols-2 gap-4 text-center mb-5">
            <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Classes</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">{attended} <span className="text-gray-400 dark:text-gray-500">/ {total}</span></p>
            </div>
            <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Required</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">{required}%</p>
            </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
            <button 
                onClick={() => setAttended(p => p + 1)}
                className="bg-green-600 hover:bg-green-700 active:scale-95 transition-all text-white font-semibold py-2 px-3 rounded-md text-center text-sm shadow-sm"
            >
                Present
            </button>
            <button 
                onClick={() => setAbsent(p => p + 1)}
                className="bg-red-600 hover:bg-red-700 active:scale-95 transition-all text-white font-semibold py-2 px-3 rounded-md text-center text-sm shadow-sm"
            >
                Absent
            </button>
            <button 
                onClick={() => setCancelled(p => p + 1)}
                className="bg-gray-600 hover:bg-gray-700 active:scale-95 transition-all text-white font-semibold py-2 px-3 rounded-md text-center text-sm shadow-sm"
            >
                Cancelled
            </button>
        </div>
        <p className="text-xs text-center text-gray-400 mt-3 italic animate-pulse">Try clicking the buttons above!</p>
      </div>
    </div>
  );
};

// Interactive Mock Calculator
export const MockCalculator = () => {
  const [attend, setAttend] = useState(3);
  const [miss, setMiss] = useState(0);
  const currentAttended = 17;
  const currentAbsent = 3;
  const required = 75;

  const newTotal = currentAttended + currentAbsent + attend + miss;
  const newAttended = currentAttended + attend;
  const newPct = newTotal > 0 ? (newAttended / newTotal) * 100 : 0;
  const isSafe = newPct >= required;

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 w-full max-w-sm mx-auto select-none">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
        'What If' Calculator
      </h2>
      <p className="text-gray-600 dark:text-gray-400 mb-4">For "Mathematics" (Current: 85%)</p>

      <div className={`border p-3 rounded-lg text-center mb-4 transition-colors duration-300 ${isSafe ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'}`}>
        <h3 className={`text-base font-semibold mb-1 ${isSafe ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'}`}>
            Result: {newPct.toFixed(1)}%
        </h3>
        <p className={`text-sm ${isSafe ? 'text-green-800 dark:text-green-400' : 'text-red-800 dark:text-red-400'}`}>
           {isSafe ? 'You are safe! 🎉' : 'You will drop below 75%. ⚠️'}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Attend next...
          </label>
          <input 
            type="number" 
            min="0"
            value={attend}
            onChange={(e) => setAttend(parseInt(e.target.value) || 0)}
            className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-center font-medium text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            ...and miss
          </label>
          <input 
            type="number" 
            min="0"
            value={miss}
            onChange={(e) => setMiss(parseInt(e.target.value) || 0)}
            className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-center font-medium text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
      <p className="text-xs text-center text-gray-400 mt-3 italic">Change numbers to simulate!</p>
    </div>
  );
};

// Static Mock Edit Form (Visual Representation)
export const MockEditForm = () => (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 w-full max-w-sm mx-auto pointer-events-none select-none opacity-90">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Edit Subject</h2>
        <div className="space-y-3 opacity-80">
             <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Subject Name</label>
                <div className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-gray-900 dark:text-white text-sm">Mathematics</div>
             </div>
             <div className="grid grid-cols-3 gap-3">
                 <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Attended</label>
                    <div className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-center text-sm text-gray-900 dark:text-white">17</div>
                 </div>
                 <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Absent</label>
                    <div className="w-full bg-blue-50 dark:bg-blue-900/30 border border-blue-500 rounded-md px-3 py-2 text-center text-sm text-gray-900 dark:text-white relative">
                        3
                        <div className="absolute -top-2 -right-2 bg-blue-600 text-white rounded-full p-0.5">
                             <CursorClickIcon className="h-3 w-3" />
                        </div>
                    </div>
                 </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Cancelled</label>
                    <div className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-center text-sm text-gray-900 dark:text-white">0</div>
                 </div>
             </div>
             <div className="w-full bg-green-600 text-white font-bold py-2 rounded-md text-center text-sm mt-2">Update</div>
        </div>
    </div>
);

// Static Mock Add Form
export const MockAddForm = () => (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 w-full max-w-sm mx-auto pointer-events-none select-none opacity-90">
      <div className="space-y-4 opacity-80">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Subject Name</label>
          <div className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-gray-400 text-sm">e.g. Physics</div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Required Attendance (%)</label>
          <div className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-gray-900 dark:text-white text-sm">75</div>
        </div>
        <button className="w-full bg-green-600 text-white font-bold py-2 px-4 rounded-md text-sm shadow-sm">
          Save Subject
        </button>
      </div>
    </div>
);