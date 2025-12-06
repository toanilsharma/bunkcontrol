
import React from 'react';
import { ClassSchedule } from '../types';
import { TrashIcon, PlusIcon } from './icons';

interface ScheduleSelectorProps {
  schedules: ClassSchedule[];
  onChange: (schedules: ClassSchedule[]) => void;
}

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const ScheduleSelector: React.FC<ScheduleSelectorProps> = ({ schedules, onChange }) => {
  
  const addSchedule = () => {
    onChange([...schedules, { day: 1, startTime: '09:00' }]);
  };

  const removeSchedule = (index: number) => {
    const newSchedules = [...schedules];
    newSchedules.splice(index, 1);
    onChange(newSchedules);
  };

  const updateSchedule = (index: number, field: keyof ClassSchedule, value: any) => {
    const newSchedules = [...schedules];
    newSchedules[index] = { ...newSchedules[index], [field]: value };
    onChange(newSchedules);
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        Weekly Schedule (Optional)
      </label>
      <div className="space-y-2">
        {schedules.map((schedule, index) => (
          <div key={index} className="flex flex-wrap gap-2 items-center bg-gray-50 dark:bg-gray-700/50 p-2 rounded-lg border border-gray-200 dark:border-gray-600 animate-fade-in">
            <select
              value={schedule.day}
              onChange={(e) => updateSchedule(index, 'day', parseInt(e.target.value))}
              className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block p-1.5"
            >
              {daysOfWeek.map((day, dIndex) => (
                <option key={dIndex} value={dIndex}>{day}</option>
              ))}
            </select>
            <input
              type="time"
              value={schedule.startTime}
              onChange={(e) => updateSchedule(index, 'startTime', e.target.value)}
              className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block p-1.5"
            />
            <button
              type="button"
              onClick={() => removeSchedule(index)}
              className="ml-auto text-red-500 hover:text-red-700 p-1"
            >
              <TrashIcon className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={addSchedule}
        className="text-sm flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:underline font-medium"
      >
        <PlusIcon className="h-4 w-4" /> Add Class Time
      </button>
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
        Adding a schedule helps us show you "Today's Classes" at the top of your dashboard.
      </p>
    </div>
  );
};

export default ScheduleSelector;
