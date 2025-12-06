
import React from 'react';
import { Subject } from '../types';
import { CheckCircleIcon, XCircleIcon, ShieldCheckIcon } from './icons';
import { useTheme } from '../contexts/ThemeContext';

interface QuickStatsProps {
  subjects: Subject[];
}

const QuickStats: React.FC<QuickStatsProps> = ({ subjects }) => {
  const { privacyMode } = useTheme();
  const totalAttended = subjects.reduce((acc, curr) => acc + curr.attended, 0);
  const totalMissed = subjects.reduce((acc, curr) => acc + curr.absent, 0);
  const safeSubjects = subjects.filter(s => {
    const total = s.attended + s.absent;
    const pct = total > 0 ? (s.attended / total) * 100 : 0;
    return pct >= s.requiredPercentage;
  }).length;

  const blurClass = privacyMode ? 'filter blur-md hover:blur-none transition-all duration-300 cursor-help' : '';

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-3">
        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
           <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
        </div>
        <div>
           <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold tracking-wider">Subjects</p>
           <p className="text-xl font-bold text-gray-900 dark:text-white">{subjects.length}</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-3">
        <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg text-green-600 dark:text-green-400">
           <CheckCircleIcon className="w-6 h-6" />
        </div>
        <div>
           <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold tracking-wider">Attended</p>
           <p className={`text-xl font-bold text-gray-900 dark:text-white ${blurClass}`}>{totalAttended}</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-3">
        <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg text-red-600 dark:text-red-400">
           <XCircleIcon className="w-6 h-6" />
        </div>
        <div>
           <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold tracking-wider">Bunks</p>
           <p className={`text-xl font-bold text-gray-900 dark:text-white ${blurClass}`}>{totalMissed}</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-3">
        <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg text-purple-600 dark:text-purple-400">
           <ShieldCheckIcon className="w-6 h-6" />
        </div>
        <div>
           <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold tracking-wider">Safe</p>
           <p className={`text-xl font-bold text-gray-900 dark:text-white ${blurClass}`}>{safeSubjects} <span className="text-sm font-normal text-gray-400">/ {subjects.length}</span></p>
        </div>
      </div>
    </div>
  );
};

export default QuickStats;
