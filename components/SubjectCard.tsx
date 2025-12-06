
import React, { useMemo, useState, useEffect } from 'react';
import { Subject, AttendanceStatus, Reminder } from '../types';
import { TrashIcon, RefreshIcon, SubjectIcon, EditIcon, WhatIfCalculatorIcon, ExportIcon, ReminderIcon, ShareIcon, ClipboardCheckIcon, SparklesIcon, HistoryIcon } from './icons';
import WhatIfCalculatorModal from './WhatIfCalculatorModal';
import ExportModal from './ExportModal';
import ReminderModal from './ReminderModal';
import AssignmentModal from './AssignmentModal';
import AttendanceCalendar from './AttendanceCalendar';
import { useTheme } from '../contexts/ThemeContext';

interface SubjectCardProps {
  subject: Subject;
  onUpdateAttendance: (subjectId: string, status: AttendanceStatus) => void;
  onDelete: (subjectId: string) => void;
  onReset: (subjectId: string) => void;
  onEdit: (subjectId: string) => void;
  onUpdate: (subject: Subject) => void;
  onSafeStatusReached?: () => void;
}

const formatTime = (time: string) => {
  if (!time) return '';
  const [hours, minutes] = time.split(':');
  const h = parseInt(hours, 10);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 || 12;
  return `${h12}:${minutes} ${ampm}`;
};

const formatDays = (days: number[]) => {
  if (!days || days.length === 0) return '';
  if (days.length === 7) return 'Daily';
  if (days.length === 5 && !days.includes(0) && !days.includes(6)) return 'Weekdays';
  if (days.length === 2 && days.includes(0) && days.includes(6)) return 'Weekends';
  
  const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const sortedDays = [...days].sort((a, b) => a - b);
  return sortedDays.map(d => dayLabels[d]).join(', ');
};

const SubjectCard: React.FC<SubjectCardProps> = ({ subject, onUpdateAttendance, onDelete, onReset, onEdit, onUpdate, onSafeStatusReached }) => {
  const { name, requiredPercentage, attended, absent, icon } = subject;
  const { privacyMode } = useTheme();
  const [animationState, setAnimationState] = useState<'present' | 'absent' | 'cancelled' | null>(null);
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isReminderOpen, setIsReminderOpen] = useState(false);
  const [isAssignmentOpen, setIsAssignmentOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [showShareTooltip, setShowShareTooltip] = useState(false);
  
  const totalClasses = attended + absent;
  const currentPercentage = totalClasses > 0 ? (attended / totalClasses) * 100 : 0;
  const pendingAssignments = subject.assignments?.filter(a => !a.completed).length || 0;

  // Track previous status to trigger confetti only on improvement
  const [prevIsSafe, setPrevIsSafe] = useState(currentPercentage >= requiredPercentage);

  useEffect(() => {
    if (animationState) {
      const timer = setTimeout(() => setAnimationState(null), 500); // Animation duration
      return () => clearTimeout(timer);
    }
  }, [animationState]);

  const handleUpdateAttendance = (status: AttendanceStatus) => {
    onUpdateAttendance(subject.id, status);
    if (status === AttendanceStatus.Present) setAnimationState('present');
    else if (status === AttendanceStatus.Absent) setAnimationState('absent');
    else if (status === AttendanceStatus.Cancelled) setAnimationState('cancelled');
  };
  
  const handleSaveReminder = (reminder: Reminder | null) => {
      onUpdate({ ...subject, reminder: reminder ? reminder : undefined });
  };

  const { bunksAvailable, classesToAttend, statusColor, statusText, isSafe, gradientBar, showSparkle } = useMemo(() => {
    let bunks = 0;
    let needed = 0;
    const isSafeNow = currentPercentage >= requiredPercentage;
    const percentageDiff = currentPercentage - requiredPercentage;
    
    if (isSafeNow) {
      bunks = Math.floor((attended - (requiredPercentage / 100) * totalClasses) / (requiredPercentage / 100));
    } else if (totalClasses > 0) {
      needed = Math.ceil(((requiredPercentage / 100) * totalClasses - attended) / (1 - (requiredPercentage / 100)));
    }

    let color = 'bg-red-500';
    let text = 'Cooked 🍳'; // Default danger
    let grad = 'from-red-500 to-red-600';
    let sparkle = false;
    
    if (totalClasses === 0) {
        color = 'bg-gray-500';
        text = 'Ghost Mode 👻';
        grad = 'from-gray-400 to-gray-500';
    } else if (percentageDiff >= 15) {
        color = 'bg-indigo-500';
        text = 'God Mode 😇';
        grad = 'from-indigo-400 to-purple-500';
        sparkle = true;
    } else if (percentageDiff >= 10) {
        color = 'bg-green-600';
        text = "Teacher's Pet 🍎";
        grad = 'from-green-500 to-emerald-600';
        sparkle = true;
    } else if (percentageDiff >= 5) {
        color = 'bg-green-500';
        text = 'Bunkable ✅';
        grad = 'from-green-400 to-green-600';
    } else if (percentageDiff >= 0) {
        color = 'bg-emerald-500';
        text = 'Living on the Edge 🧗';
        grad = 'from-emerald-400 to-teal-500';
    } else if (percentageDiff > -5) {
        color = 'bg-amber-500';
        text = 'Danger Zone ⚠️';
        grad = 'from-amber-400 to-amber-600';
    } else {
        color = 'bg-red-500';
        text = 'Academic Victim 🤕';
        grad = 'from-red-500 to-red-600';
    }
    
    return {
      bunksAvailable: bunks > 0 ? bunks : 0,
      classesToAttend: needed > 0 ? needed : 0,
      statusColor: color,
      statusText: text,
      isSafe: isSafeNow,
      gradientBar: grad,
      showSparkle: sparkle
    };
  }, [attended, totalClasses, requiredPercentage, currentPercentage]);
  
  // Effect to trigger confetti
  useEffect(() => {
    if (!prevIsSafe && isSafe && totalClasses > 0 && onSafeStatusReached) {
        onSafeStatusReached();
    }
    setPrevIsSafe(isSafe);
  }, [isSafe, prevIsSafe, totalClasses, onSafeStatusReached]);

  const handleShare = () => {
    const text = `I'm at ${currentPercentage.toFixed(1)}% attendance in ${subject.name}! Status: ${statusText}. Track your own at BunkControl.app 🚀`;
    navigator.clipboard.writeText(text).then(() => {
      setShowShareTooltip(true);
      setTimeout(() => setShowShareTooltip(false), 2000);
    });
  };

  const animationClass = {
    present: 'animate-flash-green',
    absent: 'animate-flash-red',
    cancelled: 'animate-flash-gray',
  }[animationState] || '';

  const blurClass = privacyMode ? 'filter blur-md hover:blur-none transition-all duration-300 cursor-help' : '';

  return (
    <>
      <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-md dark:shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden transition-all transform hover:-translate-y-1 hover:shadow-xl flex flex-col ${animationClass}`}>
        <div className={`p-4 ${statusColor} relative`}>
          {showSparkle && (
              <div className="absolute top-2 right-12 animate-pulse text-yellow-300">
                  <SparklesIcon className="h-6 w-6" />
              </div>
          )}
          <div className="flex justify-between items-start">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                  <SubjectIcon iconName={icon} className="h-8 w-8 text-white/90 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h2 className="text-xl font-bold text-white truncate shadow-sm drop-shadow-md">{name}</h2>
                    <p className="text-sm text-white/90 font-semibold">{statusText}</p>
                  </div>
              </div>
              <div className={`text-4xl font-black text-white/95 ml-2 drop-shadow-md ${blurClass}`}>
                  {currentPercentage.toFixed(1)}<span className="text-2xl">%</span>
              </div>
          </div>
          
          {/* Enhanced Visual Progress Bar */}
          <div className="w-full bg-black/20 rounded-full h-3 mt-3 overflow-hidden backdrop-blur-sm relative">
             {/* Striped Background Pattern */}
            <div className="absolute inset-0 opacity-10 bg-[length:10px_10px] bg-[linear-gradient(45deg,rgba(255,255,255,0.5)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.5)_50%,rgba(255,255,255,0.5)_75%,transparent_75%,transparent)] animate-[pulse_2s_linear_infinite]"></div>
            <div
              className={`h-full rounded-full transition-all duration-700 ease-out bg-gradient-to-r ${gradientBar} shadow-[0_0_10px_rgba(255,255,255,0.3)]`}
              style={{ width: `${Math.min(currentPercentage, 100)}%` }}
            ></div>
          </div>
        </div>
        
        <div className="p-5 flex-grow">
          <div className="grid grid-cols-2 gap-4 text-center mb-5">
              <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Classes</p>
                  <p className={`text-lg font-bold text-gray-900 dark:text-white ${blurClass}`}>{attended} <span className="text-gray-400 dark:text-gray-500">/ {totalClasses}</span></p>
              </div>
              <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Required</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">{requiredPercentage}%</p>
              </div>
          </div>

          <div className="bg-gray-100 dark:bg-gray-700/50 rounded-lg p-3 text-center mb-5">
              {currentPercentage >= requiredPercentage ? (
                  <p className="text-gray-700 dark:text-gray-200"><span className={`font-bold text-green-600 dark:text-green-400 ${blurClass}`}>{bunksAvailable}</span> more class{bunksAvailable !== 1 ? 'es' : ''} can be missed.</p>
              ) : (
                  <p className="text-gray-700 dark:text-gray-200">Attend next <span className={`font-bold text-amber-600 dark:text-yellow-400 ${blurClass}`}>{classesToAttend}</span> class{classesToAttend !== 1 ? 'es' : ''} to get on track.</p>
              )}
          </div>
          
          <div className="grid grid-cols-3 gap-2">
              <button onClick={() => handleUpdateAttendance(AttendanceStatus.Present)} className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-3 rounded-md transition-colors text-sm shadow-sm active:scale-95 transform">Present</button>
              <button onClick={() => handleUpdateAttendance(AttendanceStatus.Absent)} className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-3 rounded-md transition-colors text-sm shadow-sm active:scale-95 transform">Absent</button>
              <button onClick={() => handleUpdateAttendance(AttendanceStatus.Cancelled)} className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-3 rounded-md transition-colors text-sm shadow-sm active:scale-95 transform">Cancelled</button>
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-800/50 px-5 py-3 flex justify-end items-center gap-2 border-t border-gray-200 dark:border-gray-700">
          <div className="text-xs text-gray-500 dark:text-gray-400 mr-auto font-medium flex flex-col">
             <span>Cancelled: {subject.cancelled}</span>
             {subject.reminder?.enabled && (
                <span className="text-blue-600 dark:text-blue-400 flex items-center gap-1 mt-0.5" title="Reminder set">
                    <ReminderIcon className="h-3 w-3" />
                    {formatDays(subject.reminder.days)} @ {formatTime(subject.reminder.time)}
                </span>
             )}
          </div>
          
          <div className="relative">
              {showShareTooltip && (
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded shadow-lg whitespace-nowrap z-10 animate-fade-in">
                      Copied!
                  </div>
              )}
              <button onClick={handleShare} title="Share Status" className="text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"><ShareIcon /></button>
          </div>
          
          {/* Assignment Button with Badge */}
          <div className="relative">
             <button onClick={() => setIsAssignmentOpen(true)} title="Assignments & Tasks" className={`${pendingAssignments > 0 ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30' : 'text-gray-400 hover:text-gray-600 dark:hover:text-white'} transition-colors p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700`}>
                 <ClipboardCheckIcon />
             </button>
             {pendingAssignments > 0 && (
                 <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white font-bold ring-2 ring-white dark:ring-gray-800">
                    {pendingAssignments}
                 </span>
             )}
          </div>

          <button onClick={() => setIsCalendarOpen(true)} title="View Attendance History" className="text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"><HistoryIcon /></button>
          <button onClick={() => setIsReminderOpen(true)} title="Set Reminder" className={`${subject.reminder?.enabled ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30' : 'text-gray-400 hover:text-gray-600 dark:hover:text-white'} transition-colors p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700`}><ReminderIcon /></button>
          <button onClick={() => setIsCalculatorOpen(true)} title="'What If' Calculator" className="text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"><WhatIfCalculatorIcon /></button>
          <button onClick={() => setIsExporting(true)} title="Export Data" className="text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"><ExportIcon /></button>
          <button onClick={() => onEdit(subject.id)} title="Edit Subject" className="text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"><EditIcon /></button>
          <button onClick={() => onReset(subject.id)} title="Reset Attendance" className="text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"><RefreshIcon /></button>
          <button onClick={() => onDelete(subject.id)} title="Delete Subject" className="text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"><TrashIcon /></button>
        </div>
      </div>
      
      {isCalculatorOpen && (
        <WhatIfCalculatorModal
          subject={subject}
          onClose={() => setIsCalculatorOpen(false)}
        />
      )}

      {isExporting && (
        <ExportModal
          subject={subject}
          onClose={() => setIsExporting(false)}
        />
      )}

      {isReminderOpen && (
        <ReminderModal
          subject={subject}
          onSave={handleSaveReminder}
          onClose={() => setIsReminderOpen(false)}
        />
      )}

      {isAssignmentOpen && (
        <AssignmentModal 
          subject={subject}
          onUpdate={onUpdate}
          onClose={() => setIsAssignmentOpen(false)}
        />
      )}

      {isCalendarOpen && (
        <AttendanceCalendar 
          subject={subject}
          onClose={() => setIsCalendarOpen(false)}
        />
      )}
    </>
  );
};

export default SubjectCard;
