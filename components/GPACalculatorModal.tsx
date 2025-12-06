import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { AcademicCapIcon, TrashIcon, PlusIcon } from './icons';

interface GPACalculatorModalProps {
  onClose: () => void;
}

interface Course {
  id: string;
  name: string;
  credits: number;
  grade: number; // Grade point (e.g. 10 for O, 9 for A+)
}

const GPACalculatorModal: React.FC<GPACalculatorModalProps> = ({ onClose }) => {
  const [courses, setCourses] = useState<Course[]>([
    { id: '1', name: 'Subject 1', credits: 4, grade: 9 },
    { id: '2', name: 'Subject 2', credits: 3, grade: 8 },
  ]);

  const addCourse = () => {
    setCourses([...courses, { id: crypto.randomUUID(), name: '', credits: 3, grade: 0 }]);
  };

  const removeCourse = (id: string) => {
    setCourses(courses.filter(c => c.id !== id));
  };

  const updateCourse = (id: string, field: keyof Course, value: any) => {
    setCourses(courses.map(c => c.id === id ? { ...c, [field]: value } : c));
  };

  const calculateGPA = () => {
    const totalCredits = courses.reduce((sum, course) => sum + (course.credits || 0), 0);
    const totalPoints = courses.reduce((sum, course) => sum + ((course.credits || 0) * (course.grade || 0)), 0);
    return totalCredits === 0 ? 0 : (totalPoints / totalCredits);
  };

  const gpa = calculateGPA();

  return createPortal(
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex justify-center items-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-2xl w-full max-w-lg relative animate-scale-in flex flex-col max-h-[85vh]"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-3">
                 <div className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-lg text-purple-600 dark:text-purple-400">
                    <AcademicCapIcon className="h-6 w-6" />
                 </div>
                 <h2 className="text-xl font-bold text-gray-900 dark:text-white">GPA Calculator</h2>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
        </div>

        <div className="bg-purple-50 dark:bg-purple-900/10 p-4 rounded-xl mb-4 text-center border border-purple-100 dark:border-purple-800">
            <p className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wide font-semibold">Your Estimated SGPA</p>
            <div className="text-4xl font-black text-purple-600 dark:text-purple-400 mt-1">{gpa.toFixed(2)}</div>
        </div>

        <div className="flex-grow overflow-y-auto pr-1 mb-4">
            <div className="space-y-2">
                {courses.map((course, index) => (
                    <div key={course.id} className="flex gap-2 items-center bg-gray-50 dark:bg-gray-700/50 p-2 rounded-lg border border-gray-200 dark:border-gray-600">
                        <div className="flex-grow">
                             <input
                                type="text"
                                placeholder={`Subject ${index + 1}`}
                                value={course.name}
                                onChange={(e) => updateCourse(course.id, 'name', e.target.value)}
                                className="w-full bg-transparent border-none text-gray-900 dark:text-white text-sm focus:ring-0 p-0 placeholder-gray-400"
                             />
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-16">
                                <label className="block text-[10px] text-gray-400 uppercase">Credits</label>
                                <input
                                    type="number"
                                    value={course.credits}
                                    onChange={(e) => updateCourse(course.id, 'credits', parseFloat(e.target.value))}
                                    className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-xs text-center dark:text-white"
                                />
                            </div>
                             <div className="w-16">
                                <label className="block text-[10px] text-gray-400 uppercase">Grade Pt</label>
                                <input
                                    type="number"
                                    value={course.grade}
                                    onChange={(e) => updateCourse(course.id, 'grade', parseFloat(e.target.value))}
                                    className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-xs text-center dark:text-white"
                                />
                            </div>
                            <button onClick={() => removeCourse(course.id)} className="text-red-400 hover:text-red-600 p-1 mt-3">
                                <TrashIcon className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>

        <button
            onClick={addCourse}
            className="w-full py-2 border-2 border-dashed border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors flex items-center justify-center gap-2 text-sm font-semibold"
        >
            <PlusIcon className="h-4 w-4" /> Add Subject
        </button>

        <p className="text-xs text-gray-400 mt-4 text-center">
            Tip: Enter Grade Points (e.g. 10 for O, 9 for A+). Check your college grading system.
        </p>
      </div>
    </div>,
    document.body
  );
};

export default GPACalculatorModal;