import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Subject, ClassSchedule } from '../types';
import { subjectIconsList } from './icons';
import ScheduleSelector from './ScheduleSelector';

interface EditSubjectModalProps {
  subject: Subject;
  onUpdate: (updatedSubject: Subject) => void;
  onClose: () => void;
}

const EditSubjectModal: React.FC<EditSubjectModalProps> = ({ subject, onUpdate, onClose }) => {
  const [name, setName] = useState(subject.name);
  const [percentage, setPercentage] = useState(subject.requiredPercentage.toString());
  const [selectedIcon, setSelectedIcon] = useState(subject.icon || subjectIconsList[0].name);
  const [attended, setAttended] = useState(subject.attended.toString());
  const [absent, setAbsent] = useState(subject.absent.toString());
  const [cancelled, setCancelled] = useState(subject.cancelled.toString());
  const [schedules, setSchedules] = useState<ClassSchedule[]>(subject.schedules || []);


  useEffect(() => {
    setName(subject.name);
    setPercentage(subject.requiredPercentage.toString());
    setSelectedIcon(subject.icon || subjectIconsList[0].name);
    setAttended(subject.attended.toString());
    setAbsent(subject.absent.toString());
    setCancelled(subject.cancelled.toString());
    setSchedules(subject.schedules || []);
  }, [subject]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && percentage) {
      const numericPercentage = parseFloat(percentage);
      const numAttended = parseInt(attended, 10);
      const numAbsent = parseInt(absent, 10);
      const numCancelled = parseInt(cancelled, 10);

      if (
        !isNaN(numericPercentage) && numericPercentage >= 0 && numericPercentage <= 100 &&
        !isNaN(numAttended) && numAttended >= 0 &&
        !isNaN(numAbsent) && numAbsent >= 0 &&
        !isNaN(numCancelled) && numCancelled >= 0
      ) {
        onUpdate({
          ...subject,
          name: name.trim(),
          requiredPercentage: numericPercentage,
          icon: selectedIcon,
          attended: numAttended,
          absent: numAbsent,
          cancelled: numCancelled,
          schedules: schedules
        });
      } else {
        alert("Please enter a valid positive number for all fields.");
      }
    }
  };
  
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

  const modalContent = (
    <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex justify-center items-center p-4 overflow-y-auto"
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-subject-title"
    >
      <div 
        className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-2xl w-full max-w-md relative animate-scale-in transition-colors duration-300 my-8"
        onClick={e => e.stopPropagation()}
      >
        <h2 id="edit-subject-title" className="text-xl font-bold text-gray-900 dark:text-white mb-6">Edit Subject</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="edit-subject-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Subject Name
            </label>
            <input
              id="edit-subject-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label htmlFor="edit-percentage" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Required Attendance (%)
            </label>
            <input
              id="edit-percentage"
              type="number"
              value={percentage}
              onChange={(e) => setPercentage(e.target.value)}
              className="w-full bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              min="0"
              max="100"
              step="0.1"
              required
            />
          </div>
          
          <div className="max-h-48 overflow-y-auto pr-2">
             <ScheduleSelector schedules={schedules} onChange={setSchedules} />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Select an Icon
            </label>
            <div className="flex flex-wrap gap-3">
              {subjectIconsList.map(({ name: iconName, Component }) => (
                <button
                  type="button"
                  key={iconName}
                  onClick={() => setSelectedIcon(iconName)}
                  className={`p-3 rounded-full transition-all duration-200 transform hover:scale-110 ${
                    selectedIcon === iconName ? 'bg-blue-600 text-white ring-2 ring-offset-2 ring-offset-gray-100 dark:ring-offset-gray-800 ring-blue-500' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                  aria-label={`Select ${iconName} icon`}
                  aria-pressed={selectedIcon === iconName}
                  title={`${iconName} Icon`}
                >
                  <Component className="h-6 w-6" />
                </button>
              ))}
            </div>
          </div>
           <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Edit Attendance
            </label>
            <div className="grid grid-cols-3 gap-3">
                <div>
                    <label htmlFor="edit-attended" className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Attended</label>
                    <input
                        id="edit-attended"
                        type="number"
                        value={attended}
                        onChange={(e) => setAttended(e.target.value)}
                        className="w-full bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        min="0"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="edit-absent" className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Absent</label>
                    <input
                        id="edit-absent"
                        type="number"
                        value={absent}
                        onChange={(e) => setAbsent(e.target.value)}
                        className="w-full bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        min="0"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="edit-cancelled" className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Cancelled</label>
                    <input
                        id="edit-cancelled"
                        type="number"
                        value={cancelled}
                        onChange={(e) => setCancelled(e.target.value)}
                        className="w-full bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        min="0"
                        required
                    />
                </div>
            </div>
          </div>
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="w-full bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-800 dark:text-white font-bold py-3 px-4 rounded-md transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-md transition-colors"
            >
              Update Subject
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default EditSubjectModal;