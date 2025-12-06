
import React from 'react';
import { LightbulbIcon } from './icons';

const tips = [
  "Use the 'What If' calculator before deciding to skip a class to understand the impact on your percentage.",
  "Communicate with your professors beforehand if you know you'll miss a class. A little courtesy goes a long way.",
  "Set reminders for your classes, especially for those early morning lectures. Don't let oversleeping be the reason you miss out.",
  "Don't forget that cancelled classes don't hurt your attendance! Make sure to mark them as 'Cancelled' to keep your records accurate.",
  "Prioritize your health. It's better to miss one class to recover fully than to attend while sick and miss several more later."
];

const AttendanceTips: React.FC = () => {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg mb-6 shadow-md dark:shadow-lg border border-gray-200 dark:border-gray-700 animate-fade-in transition-colors duration-300">
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-yellow-100 dark:bg-yellow-900/30 p-2 rounded-full">
            <LightbulbIcon className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Attendance Pro-Tips</h2>
      </div>
      <ul className="space-y-3 list-disc list-inside text-gray-700 dark:text-gray-300">
        {tips.map((tip, index) => (
          <li key={index} className="pl-2">{tip}</li>
        ))}
      </ul>
    </div>
  );
};

export default AttendanceTips;
