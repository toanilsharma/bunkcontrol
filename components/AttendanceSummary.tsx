
import React from 'react';
import { CheckCircleIcon, XCircleIcon } from './icons';
import { useTheme } from '../contexts/ThemeContext';

interface AttendanceSummaryProps {
  overallPercentage: number;
  totalAttended: number;
  totalAbsent: number;
}

const DonutChart: React.FC<{ percentage: number; blur: boolean }> = ({ percentage, blur }) => {
  const size = 120;
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  let colorClass = 'text-red-500';
  if (percentage >= 75) {
    colorClass = 'text-green-500';
  } else if (percentage >= 50) {
    colorClass = 'text-amber-500';
  }
  
  const blurClass = blur ? 'filter blur-md hover:blur-none transition-all duration-300 cursor-help' : '';

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        <circle
          className="text-gray-200 dark:text-gray-700"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <circle
          className={`${colorClass} transition-all duration-500`}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
      </svg>
      <div className={`absolute inset-0 flex items-center justify-center ${blurClass}`}>
        <span className="text-2xl font-bold text-gray-900 dark:text-white">{percentage.toFixed(1)}%</span>
      </div>
    </div>
  );
};

const AttendanceSummary: React.FC<AttendanceSummaryProps> = ({
  overallPercentage,
  totalAttended,
  totalAbsent,
}) => {
  const { privacyMode } = useTheme();
  const blurClass = privacyMode ? 'filter blur-md hover:blur-none transition-all duration-300 cursor-help' : '';

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg mb-6 shadow-md dark:shadow-lg border border-gray-200 dark:border-gray-700 animate-fade-in transition-colors duration-300">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Overall Summary</h2>
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex-shrink-0">
          <DonutChart percentage={overallPercentage} blur={privacyMode} />
        </div>
        <div className="flex-grow grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
            <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg flex items-center gap-4 border border-gray-100 dark:border-gray-600/50">
                <div className="text-green-500"><CheckCircleIcon /></div>
                <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Total Attended</p>
                    <p className={`text-2xl font-bold text-gray-900 dark:text-white ${blurClass}`}>{totalAttended}</p>
                </div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg flex items-center gap-4 border border-gray-100 dark:border-gray-600/50">
                <div className="text-red-500"><XCircleIcon /></div>
                <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Total Missed</p>
                    <p className={`text-2xl font-bold text-gray-900 dark:text-white ${blurClass}`}>{totalAbsent}</p>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default AttendanceSummary;
