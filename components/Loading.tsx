import React from 'react';
import { ChartBarIcon } from './icons';

const Loading: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 transition-colors">
      <div className="relative">
        <div className="h-16 w-16 rounded-full border-4 border-gray-200 dark:border-gray-700 opacity-50"></div>
        <div className="absolute top-0 left-0 h-16 w-16 rounded-full border-4 border-blue-600 border-t-transparent animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
            <ChartBarIcon className="h-6 w-6 text-blue-600 animate-pulse" />
        </div>
      </div>
      <p className="mt-4 text-sm font-medium text-gray-500 dark:text-gray-400 animate-pulse">
        Loading Bunk Control...
      </p>
    </div>
  );
};

export default Loading;