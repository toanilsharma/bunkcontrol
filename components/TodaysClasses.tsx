
import React from 'react';
import { Subject, AttendanceStatus } from '../types';
import { SubjectIcon, CheckCircleIcon, XCircleIcon } from './icons';
import { useTheme } from '../contexts/ThemeContext';

interface TodaysClassesProps {
  subjects: Subject[];
  onUpdateAttendance: (subjectId: string, status: AttendanceStatus) => void;
}

const TodaysClasses: React.FC<TodaysClassesProps> = ({ subjects, onUpdateAttendance }) => {
  const { privacyMode } = useTheme();
  const today = new Date().getDay();
  const todayName = new Date().toLocaleDateString('en-US', { weekday: 'long' });

  // Filter subjects that have a schedule for today
  const todaysSubjects = subjects.filter(subject => 
    subject.schedules?.some(s => s.day === today)
  ).map(subject => {
    // Get the specific schedule for today
    const schedule = subject.schedules?.find(s => s.day === today);
    return { ...subject, schedule };
  }).sort((a, b) => {
    // Sort by time
    return (a.schedule?.startTime || '').localeCompare(b.schedule?.startTime || '');
  });

  if (todaysSubjects.length === 0) return null;
  
  const blurClass = privacyMode ? 'filter blur-md hover:blur-none transition-all duration-300 cursor-help' : '';

  return (
    <div className="mb-8 animate-slide-up">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
          Today's Schedule <span className="text-sm font-normal text-gray-500 dark:text-gray-400">({todayName})</span>
        </h2>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x">
        {todaysSubjects.map(subject => {
            // Helper to determine time context
            const [hours, minutes] = (subject.schedule?.startTime || "00:00").split(':').map(Number);
            const timeString = new Date(0, 0, 0, hours, minutes).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
            
            const pct = (subject.attended / (subject.attended + subject.absent || 1)) * 100;

            return (
                <div 
                    key={subject.id} 
                    className="flex-shrink-0 w-72 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 p-4 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 snap-start relative overflow-hidden group"
                >
                    <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
                    
                    <div className="flex justify-between items-start mb-3 pl-2">
                        <div className="flex items-center gap-2">
                             <div className="bg-blue-100 dark:bg-blue-900/40 p-1.5 rounded-lg">
                                <SubjectIcon iconName={subject.icon} className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                             </div>
                             <div>
                                 <h3 className="font-bold text-gray-900 dark:text-white truncate max-w-[120px]">{subject.name}</h3>
                                 <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">{timeString}</p>
                             </div>
                        </div>
                         <div className={`text-sm font-bold px-2 py-0.5 rounded ${
                             pct >= subject.requiredPercentage
                             ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                             : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                         } ${blurClass}`}>
                             {pct.toFixed(0)}%
                         </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mt-4 pl-2">
                        <button 
                            onClick={() => onUpdateAttendance(subject.id, AttendanceStatus.Present)}
                            className="flex items-center justify-center gap-1.5 bg-green-50 hover:bg-green-100 dark:bg-green-900/20 dark:hover:bg-green-900/40 text-green-700 dark:text-green-400 py-2 rounded-lg text-sm font-semibold transition-colors border border-green-200 dark:border-green-800"
                        >
                            <CheckCircleIcon className="h-4 w-4" /> Present
                        </button>
                        <button 
                            onClick={() => onUpdateAttendance(subject.id, AttendanceStatus.Absent)}
                            className="flex items-center justify-center gap-1.5 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/40 text-red-700 dark:text-red-400 py-2 rounded-lg text-sm font-semibold transition-colors border border-red-200 dark:border-red-800"
                        >
                            <XCircleIcon className="h-4 w-4" /> Absent
                        </button>
                    </div>
                </div>
            );
        })}
        
        {/* Empty state filler for horizontal scroll hint */}
        <div className="w-4"></div>
      </div>
    </div>
  );
};

export default TodaysClasses;
