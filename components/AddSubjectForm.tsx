
import React, { useState } from 'react';
import { subjectIconsList } from './icons';
import { ClassSchedule } from '../types';
import ScheduleSelector from './ScheduleSelector';

interface AddSubjectFormProps {
  onAddSubject: (name: string, percentage: number, icon: string, schedules: ClassSchedule[]) => void;
}

const AddSubjectForm: React.FC<AddSubjectFormProps> = ({ onAddSubject }) => {
  const [name, setName] = useState('');
  const [percentage, setPercentage] = useState('75');
  const [selectedIcon, setSelectedIcon] = useState(subjectIconsList[0].name);
  const [schedules, setSchedules] = useState<ClassSchedule[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && percentage) {
      const numericPercentage = parseFloat(percentage);
      if (!isNaN(numericPercentage) && numericPercentage >= 0 && numericPercentage <= 100) {
        onAddSubject(name.trim(), numericPercentage, selectedIcon, schedules);
        setName('');
        setPercentage('75');
        setSelectedIcon(subjectIconsList[0].name);
        setSchedules([]);
      } else {
        alert("Please enter a valid percentage between 0 and 100.");
      }
    }
  };

  const presetPercentages = [75, 80, 85, 90];

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg mb-6 shadow-md dark:shadow-lg border border-gray-200 dark:border-gray-700 animate-fade-in transition-colors duration-300">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="subject-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Subject Name
          </label>
          <input
            id="subject-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Data Structures"
            className="w-full bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400 dark:placeholder-gray-500"
            required
          />
        </div>
        <div>
          <label htmlFor="percentage" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Required Attendance (%)
          </label>
          <div className="flex gap-2 mb-2">
             {presetPercentages.map(p => (
                 <button
                    key={p}
                    type="button"
                    onClick={() => setPercentage(p.toString())}
                    className={`px-3 py-1 text-xs rounded-full border ${percentage === p.toString() ? 'bg-blue-100 border-blue-500 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300' : 'bg-gray-100 border-gray-200 text-gray-600 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300'}`}
                 >
                    {p}%
                 </button>
             ))}
          </div>
          <input
            id="percentage"
            type="number"
            value={percentage}
            onChange={(e) => setPercentage(e.target.value)}
            placeholder="e.g., 75"
            className="w-full bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400 dark:placeholder-gray-500"
            min="0"
            max="100"
            step="0.1"
            required
          />
        </div>
        
        <ScheduleSelector schedules={schedules} onChange={setSchedules} />

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Select an Icon
          </label>
          <div className="flex flex-wrap gap-3">
            {subjectIconsList.map(({ name, Component }) => (
              <button
                type="button"
                key={name}
                onClick={() => setSelectedIcon(name)}
                className={`p-3 rounded-full transition-colors ${
                  selectedIcon === name ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
                aria-label={`Select ${name} icon`}
                title={`${name} Icon`}
              >
                <Component className="h-6 w-6" />
              </button>
            ))}
          </div>
        </div>
        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-md transition-colors shadow-sm"
        >
          Save Subject
        </button>
      </form>
    </div>
  );
};

export default AddSubjectForm;
