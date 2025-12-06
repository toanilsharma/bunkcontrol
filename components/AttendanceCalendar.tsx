import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Subject, AttendanceStatus } from '../types';
import { ChevronLeftIcon, ChevronRightIcon } from './icons';

interface AttendanceCalendarProps {
  subject: Subject;
  onClose: () => void;
}

const AttendanceCalendar: React.FC<AttendanceCalendarProps> = ({ subject, onClose }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-10"></div>);
    }

    // Days of the month
    for (let d = 1; d <= daysInMonth; d++) {
      const dateString = new Date(currentDate.getFullYear(), currentDate.getMonth(), d).toISOString().split('T')[0];
      
      // Find history for this date
      const historyForDay = subject.history?.filter(h => h.date.split('T')[0] === dateString);
      
      let statusColor = '';
      if (historyForDay && historyForDay.length > 0) {
          // If multiple, show the latest or mix (showing latest logic here)
          const lastRecord = historyForDay[historyForDay.length - 1];
          switch(lastRecord.status) {
              case AttendanceStatus.Present: statusColor = 'bg-green-500 text-white'; break;
              case AttendanceStatus.Absent: statusColor = 'bg-red-500 text-white'; break;
              case AttendanceStatus.Cancelled: statusColor = 'bg-gray-400 text-white'; break;
          }
      }

      days.push(
        <div key={d} className="h-10 flex flex-col items-center justify-center relative">
          <div className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-medium ${statusColor || 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
            {d}
          </div>
          {historyForDay && historyForDay.length > 1 && (
             <div className="absolute bottom-0 w-1 h-1 bg-blue-500 rounded-full"></div>
          )}
        </div>
      );
    }

    return days;
  };

  return createPortal(
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex justify-center items-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-2xl w-full max-w-sm relative animate-scale-in"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white truncate pr-2">History: {subject.name}</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
        </div>

        <div className="flex items-center justify-between mb-4 px-2">
            <button onClick={prevMonth} className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400">
                <ChevronLeftIcon className="h-6 w-6" />
            </button>
            <span className="font-bold text-lg text-gray-800 dark:text-gray-200">
                {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </span>
            <button onClick={nextMonth} className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400">
                <ChevronRightIcon className="h-6 w-6" />
            </button>
        </div>

        <div className="grid grid-cols-7 gap-1 mb-2 text-center text-xs font-bold text-gray-400 uppercase tracking-wide">
            <div>Sun</div>
            <div>Mon</div>
            <div>Tue</div>
            <div>Wed</div>
            <div>Thu</div>
            <div>Fri</div>
            <div>Sat</div>
        </div>

        <div className="grid grid-cols-7 gap-1">
            {renderCalendar()}
        </div>

        <div className="mt-6 flex justify-center gap-4 text-xs text-gray-500 dark:text-gray-400">
             <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-green-500"></div> Present</div>
             <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-red-500"></div> Absent</div>
             <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-gray-400"></div> Cancelled</div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default AttendanceCalendar;