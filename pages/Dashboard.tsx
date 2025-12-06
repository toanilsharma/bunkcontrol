import React, { useState, useEffect, useMemo, useRef, lazy, Suspense } from 'react';
import { Subject, AttendanceStatus, Reminder, ClassSchedule, Assignment, AttendanceRecord } from '../types';
import useLocalStorage from '../hooks/useLocalStorage';
import Header from '../components/Header';
import AddSubjectForm from '../components/AddSubjectForm';
import SubjectCard from '../components/SubjectCard';
import { PlusIcon, SortAscIcon, SortDescIcon, DocumentDownloadIcon, DownloadCloudIcon, UploadCloudIcon, TableIcon, TargetIcon, UserGroupIcon, CalculatorIcon, ClockIcon, RobotIcon } from '../components/icons';
import AttendanceSummary from '../components/AttendanceSummary';
import CookieConsent from '../components/CookieConsent';
import Footer from '../components/Footer';
import AttendanceTips from '../components/AttendanceTips';
import { useAuth } from '../contexts/AuthContext';
import { useNav } from '../contexts/NavigationContext';
import Confetti from '../components/Confetti';
import TodaysClasses from '../components/TodaysClasses';
import QuickStats from '../components/QuickStats';
import Toast from '../components/Toast';
import Badges from '../components/Badges';

// Lazy load modals to improve performance
const EditSubjectModal = lazy(() => import('../components/EditSubjectModal'));
const ImportTimetableModal = lazy(() => import('../components/ImportTimetableModal'));
const ShareScheduleModal = lazy(() => import('../components/ShareScheduleModal'));
const GPACalculatorModal = lazy(() => import('../components/GPACalculatorModal'));
const FocusModeModal = lazy(() => import('../components/FocusModeModal'));
const AIAssistantModal = lazy(() => import('../components/AIAssistantModal'));

// This is how to use jsPDF from a CDN
declare const jspdf: any;

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { currentParams } = useNav();
  const [subjects, setSubjects] = useLocalStorage<Subject[]>('subjects', []);
  const [lastBackupDate, setLastBackupDate] = useLocalStorage<number | null>('lastBackupDate', null);
  const [isAdding, setIsAdding] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [sortBy, setSortBy] = useState<'name' | 'percentage' | 'urgency'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [showConfetti, setShowConfetti] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [showGPAModal, setShowGPAModal] = useState(false);
  const [showFocusModal, setShowFocusModal] = useState(false);
  const [showAIModal, setShowAIModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Undo Toast State
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [lastAction, setLastAction] = useState<{subjectId: string, status: AttendanceStatus} | null>(null);
  
  // Welcome State Logic for new users
  const [hasSeenWelcome, setHasSeenWelcome] = useLocalStorage('hasSeenWelcome', false);
  const [showWelcomeToast, setShowWelcomeToast] = useState(false);

  // Deep linking logic
  useEffect(() => {
    if (currentParams.tool) {
        switch(currentParams.tool) {
            case 'gpa': setShowGPAModal(true); break;
            case 'focus': setShowFocusModal(true); break;
            case 'ai': setShowAIModal(true); break;
            case 'import': setIsImportModalOpen(true); break;
        }
    }
  }, [currentParams]);

  useEffect(() => {
    setIsClient(true);
    // If first time, show welcome toast/confetti
    if (!hasSeenWelcome) {
        setShowWelcomeToast(true);
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
        // Mark as seen so it doesn't show again on reload
        setHasSeenWelcome(true);
    }

    // Weekly Backup Reminder
    if (lastBackupDate) {
        const oneWeek = 7 * 24 * 60 * 60 * 1000;
        if (Date.now() - lastBackupDate > oneWeek) {
             setToastMessage("⚠️ It's been a week! Please backup your data.");
             setToastVisible(true);
        }
    }
  }, [hasSeenWelcome, setHasSeenWelcome, lastBackupDate]);
  
  // Request notification permission
  useEffect(() => {
    if (isClient && 'Notification' in window && Notification.permission !== 'granted' && Notification.permission !== 'denied') {
      Notification.requestPermission();
    }
  }, [isClient]);

  // Check for reminders every minute
  useEffect(() => {
    if (!isClient) return;

    const checkReminders = () => {
      if (!('Notification' in window) || Notification.permission !== 'granted') return;

      const now = new Date();
      const currentDay = now.getDay(); // 0 = Sunday
      const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

      subjects.forEach(subject => {
        if (subject.reminder?.enabled && subject.reminder.days.includes(currentDay) && subject.reminder.time === currentTime) {
          new Notification(`Time for ${subject.name}!`, {
            body: "Don't forget to update your attendance for this class.",
            icon: '/icon.png' // Optional: add an icon path if available
          });
        }
      });
    };
    
    // Check immediately on load then every minute
    const intervalId = setInterval(checkReminders, 60000);

    return () => clearInterval(intervalId);
  }, [subjects, isClient]);

  const overallStats = useMemo(() => {
    const totalAttended = subjects.reduce((sum, s) => sum + s.attended, 0);
    const totalAbsent = subjects.reduce((sum, s) => sum + s.absent, 0);
    const totalClasses = totalAttended + totalAbsent;
    const overallPercentage = totalClasses > 0 ? (totalAttended / totalClasses) * 100 : 0;
    
    return {
        totalAttended,
        totalAbsent,
        totalClasses,
        overallPercentage,
    };
  }, [subjects]);
  
  const handleSortByChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newSortBy = event.target.value as 'name' | 'percentage' | 'urgency';
    setSortBy(newSortBy);
    if (newSortBy === 'urgency') {
      setSortOrder('desc');
    } else {
      setSortOrder('asc');
    }
  };

  const sortedSubjects = useMemo(() => {
    const calculatePercentage = (s: Subject) => {
      const total = s.attended + s.absent;
      return total > 0 ? (s.attended / total) * 100 : 0;
    };

    const calculateUrgency = (s: Subject) => {
      const total = s.attended + s.absent;
      const current = calculatePercentage(s);
      if (current >= s.requiredPercentage) return -1;
      if (total === 0) return 0;
      
      const needed = Math.ceil(((s.requiredPercentage / 100) * total - s.attended) / (1 - (s.requiredPercentage / 100)));
      return needed > 0 ? needed : 0;
    };

    return [...subjects].sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'percentage':
          comparison = calculatePercentage(a) - calculatePercentage(b);
          break;
        case 'urgency':
          comparison = calculateUrgency(a) - calculateUrgency(b);
          break;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });
  }, [subjects, sortBy, sortOrder]);

  const addSubject = (name: string, requiredPercentage: number, icon: string, schedules: ClassSchedule[]) => {
    const newSubject: Subject = {
      id: crypto.randomUUID(),
      name,
      requiredPercentage,
      attended: 0,
      absent: 0,
      cancelled: 0,
      icon,
      schedules,
      assignments: [],
      history: []
    };
    setSubjects([...subjects, newSubject]);
    setIsAdding(false);
  };

  const updateSubject = (updatedSubject: Subject) => {
    setSubjects(subjects.map(s => s.id === updatedSubject.id ? updatedSubject : s));
    setEditingSubject(null);
  };
  
  const handleBulkImport = (newSubjects: Subject[]) => {
      setSubjects(newSubjects);
  };

  const updateAttendance = (subjectId: string, status: AttendanceStatus) => {
    // Store for undo
    setLastAction({ subjectId, status });
    let msg = '';
    if (status === AttendanceStatus.Present) msg = 'Marked Present';
    else if (status === AttendanceStatus.Absent) msg = 'Marked Absent';
    else msg = 'Marked Cancelled';
    setToastMessage(msg);
    setToastVisible(true);

    // Create history record
    const newRecord: AttendanceRecord = {
        id: crypto.randomUUID(),
        date: new Date().toISOString(),
        status
    };

    setSubjects(
      subjects.map((subject) => {
        if (subject.id === subjectId) {
          // Add history
          const updatedHistory = [...(subject.history || []), newRecord];

          switch (status) {
            case AttendanceStatus.Present:
              return { ...subject, attended: subject.attended + 1, history: updatedHistory };
            case AttendanceStatus.Absent:
              return { ...subject, absent: subject.absent + 1, history: updatedHistory };
            case AttendanceStatus.Cancelled:
              return { ...subject, cancelled: subject.cancelled + 1, history: updatedHistory };
            default:
              return subject;
          }
        }
        return subject;
      })
    );
  };

  const handleUndo = () => {
      if (!lastAction) return;
      const { subjectId, status } = lastAction;
      
      setSubjects(
        subjects.map((subject) => {
            if (subject.id === subjectId) {
                // Remove last history record if possible
                let updatedHistory = subject.history || [];
                if (updatedHistory.length > 0) {
                     updatedHistory = updatedHistory.slice(0, -1);
                }

                switch (status) {
                    case AttendanceStatus.Present:
                    return { ...subject, attended: Math.max(0, subject.attended - 1), history: updatedHistory };
                    case AttendanceStatus.Absent:
                    return { ...subject, absent: Math.max(0, subject.absent - 1), history: updatedHistory };
                    case AttendanceStatus.Cancelled:
                    return { ...subject, cancelled: Math.max(0, subject.cancelled - 1), history: updatedHistory };
                    default:
                    return subject;
                }
            }
            return subject;
        })
      );
      setToastVisible(false);
      setLastAction(null);
  };

  const deleteSubject = (subjectId: string) => {
    if (window.confirm('Are you sure you want to delete this subject and all its data?')) {
        setSubjects(subjects.filter((subject) => subject.id !== subjectId));
    }
  };
  
  const resetSubject = (subjectId: string) => {
    if (window.confirm('Are you sure you want to reset this subject\'s attendance?')) {
        // We preserve assignments and schedules, only resetting counts and history
        setSubjects(subjects.map(s => s.id === subjectId ? {...s, attended: 0, absent: 0, cancelled: 0, history: []} : s));
    }
  };

  const handleStartEdit = (subjectId: string) => {
    const subjectToEdit = subjects.find(s => s.id === subjectId);
    if (subjectToEdit) {
      setEditingSubject(subjectToEdit);
    }
  };
  
  const triggerConfetti = () => {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 4000); // Hide after animation
  };

  const handleBackupData = () => {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(subjects));
      const downloadAnchorNode = document.createElement('a');
      downloadAnchorNode.setAttribute("href", dataStr);
      downloadAnchorNode.setAttribute("download", "bunk_control_backup_" + new Date().toISOString().split('T')[0] + ".json");
      document.body.appendChild(downloadAnchorNode); // required for firefox
      downloadAnchorNode.click();
      downloadAnchorNode.remove();
      
      // Update last backup date
      setLastBackupDate(Date.now());
  };

  const handleRestoreClick = () => {
      fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const fileObj = event.target.files && event.target.files[0];
      if (!fileObj) {
          return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
          const content = e.target?.result as string;
          if (!content) return;

          try {
              // Try parsing as JSON (Backup format)
              const json = JSON.parse(content);
              if (Array.isArray(json)) {
                  if (window.confirm("This will overwrite your current data with the backup. Are you sure you want to proceed?")) {
                      setSubjects(json);
                      setLastBackupDate(Date.now()); // Reset backup reminder
                      alert("Data restored successfully!");
                  }
              } else {
                  alert("Invalid backup file format. Backup should be a JSON array.");
              }
          } catch (error) {
              console.error("JSON Parse Error during restore:", error);
              // Check if user accidentally uploaded a CSV to the Restore button
              if (content.trim().toLowerCase().startsWith("subject")) {
                   alert("Oops! It looks like you uploaded a Timetable CSV file.\n\nPlease use the 'Import Schedule' button (Table Icon) to import timetables.");
              } else {
                   alert("Failed to parse file. Please ensure you are uploading a valid JSON backup file.");
              }
          }
          // Reset input
          if (fileInputRef.current) fileInputRef.current.value = "";
      };
      reader.readAsText(fileObj);
  };

  const handleExportAllPDF = () => {
    if (typeof jspdf === 'undefined') {
      alert('PDF generation library is not loaded. Please try again.');
      return;
    }
    const { jsPDF } = jspdf;
    const doc = new jsPDF();
    const pageHeight = doc.internal.pageSize.height;
    let y = 40;

    const checkPageBreak = () => {
      if (y >= pageHeight - 20) {
        doc.addPage();
        y = 20;
      }
    };

    doc.setFontSize(20);
    doc.text("Bunk Control - Attendance Summary", 105, 20, { align: "center" });
    doc.setFontSize(10);
    doc.setTextColor(150);
    doc.text(`Report generated on: ${new Date().toLocaleDateString()}`, 105, 28, { align: "center" });

    doc.setFontSize(14);
    doc.setTextColor(55, 65, 81);
    doc.setFont(undefined, 'bold');
    doc.text("Overall Performance", 20, y);

    const overallPercentageColor = overallStats.overallPercentage >= 75 ? [34, 197, 94] : overallStats.overallPercentage >= 50 ? [245, 158, 11] : [239, 68, 68];
    doc.setFontSize(22);
    doc.setTextColor(...overallPercentageColor);
    doc.text(`${overallStats.overallPercentage.toFixed(1)}%`, 185, y, { align: 'right'});

    doc.setFontSize(10);
    doc.setTextColor(107, 114, 128);
    doc.text(`Attended: ${overallStats.totalAttended} | Missed: ${overallStats.totalAbsent} | Total: ${overallStats.totalClasses}`, 20, y + 7);

    y += 18;
    
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(0);
    doc.text("Subject Breakdown", 14, y);
    y += 8;

    const tableHeaderY = y;
    const startX = 15;
    const colWidths = [80, 25, 25, 25, 30];

    doc.setFontSize(10);
    doc.text("Subject Name", startX, tableHeaderY);
    doc.text("Attended", startX + colWidths[0], tableHeaderY, { align: 'center' });
    doc.text("Absent", startX + colWidths[0] + colWidths[1], tableHeaderY, { align: 'center' });
    doc.text("Total", startX + colWidths[0] + colWidths[1] + colWidths[2], tableHeaderY, { align: 'center' });
    doc.text("Current %", startX + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3] + 5, tableHeaderY, { align: 'right' });
    y += 2;
    doc.setLineWidth(0.2);
    doc.line(14, y, 196, y);
    y += 6;

    doc.setFont(undefined, 'normal');

    sortedSubjects.forEach((subject) => {
      checkPageBreak();

      const totalClasses = subject.attended + subject.absent;
      const currentPercentage = totalClasses > 0 ? (subject.attended / totalClasses) * 100 : 0;
      const percentageDiff = currentPercentage - subject.requiredPercentage;

      let statusColor = [239, 68, 68]; 
      if (totalClasses === 0) statusColor = [107, 114, 128]; 
      else if (percentageDiff >= 5) statusColor = [34, 197, 94]; 
      else if (percentageDiff >= 0) statusColor = [245, 158, 11]; 

      const subjectNameLines = doc.splitTextToSize(subject.name, colWidths[0] - 5);
      
      doc.setTextColor(0);
      doc.text(subjectNameLines, startX, y);

      doc.text(String(subject.attended), startX + colWidths[0], y, { align: 'center' });
      doc.text(String(subject.absent), startX + colWidths[0] + colWidths[1], y, { align: 'center' });
      doc.text(String(totalClasses), startX + colWidths[0] + colWidths[1] + colWidths[2], y, { align: 'center' });

      doc.setTextColor(...statusColor);
      doc.setFont(undefined, 'bold');
      doc.text(currentPercentage.toFixed(1) + "%", startX + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3] + 5, y, { align: 'right' });
      doc.setFont(undefined, 'normal');

      const nameHeight = doc.getTextDimensions(subjectNameLines).h;
      y += Math.max(8, nameHeight + 2);

      if (y < pageHeight - 20) {
        doc.setDrawColor(229, 231, 235);
        doc.line(14, y - 4, 196, y - 4);
      }
    });

    doc.save('BunkControl_Report.pdf');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white font-sans flex flex-col transition-colors duration-300">
      {showConfetti && <Confetti />}
      <Header />
      <main className="container mx-auto p-4 md:p-6 flex-grow">
        
        {/* Welcome Toast for New Users */}
        {showWelcomeToast && (
            <div className="bg-gradient-to-r from-blue-600 to-blue-500 rounded-xl p-4 md:p-6 mb-8 text-white shadow-lg animate-scale-in flex justify-between items-center relative overflow-hidden">
                <div className="relative z-10">
                    <h2 className="text-2xl font-bold mb-1">Welcome to Bunk Control! 🚀</h2>
                    <p className="text-blue-100 max-w-xl">
                        You're all set. Start by adding your subjects below or importing your timetable to get a grip on your attendance.
                    </p>
                </div>
                <button 
                    onClick={() => setShowWelcomeToast(false)} 
                    className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-lg transition-colors z-10"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
                {/* Decoration */}
                <div className="absolute right-0 top-0 h-full w-64 bg-white/10 transform skew-x-12 translate-x-12"></div>
            </div>
        )}

        <div className="flex justify-between items-center mb-6 gap-2">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100 truncate flex-1">
            {user?.name ? `${user.name}'s Dashboard` : 'My Dashboard'}
          </h1>
          
          <div className="flex gap-2">
            <button
                onClick={() => setIsImportModalOpen(true)}
                title="Import Timetable (CSV)"
                className="flex items-center gap-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-white font-semibold py-2 px-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm hidden sm:flex"
            >
                <TableIcon className="h-5 w-5 text-blue-500" />
                Import Schedule
            </button>
            <button
                onClick={() => setIsAdding(!isAdding)}
                title={isAdding ? 'Close form' : 'Add a new subject'}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-transform transform hover:scale-105 shadow-md"
            >
                <PlusIcon />
                {isAdding ? 'Cancel' : 'Add Subject'}
            </button>
          </div>
        </div>
        
        {/* Student Toolkit Section (New) */}
        {isClient && (
            <div className="flex gap-3 mb-8 overflow-x-auto pb-2 scrollbar-hide">
                <button 
                    onClick={() => setShowGPAModal(true)}
                    className="flex-shrink-0 flex items-center gap-2 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900/40 px-4 py-2 rounded-full border border-purple-200 dark:border-purple-800 transition-colors text-sm font-medium"
                >
                    <CalculatorIcon className="h-4 w-4" /> GPA Calculator
                </button>
                <button 
                    onClick={() => setShowFocusModal(true)}
                    className="flex-shrink-0 flex items-center gap-2 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-900/40 px-4 py-2 rounded-full border border-red-200 dark:border-red-800 transition-colors text-sm font-medium"
                >
                    <ClockIcon className="h-4 w-4" /> Focus Mode
                </button>
                <button 
                    onClick={() => setShowAIModal(true)}
                    className="flex-shrink-0 flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/40 px-4 py-2 rounded-full border border-blue-200 dark:border-blue-800 transition-colors text-sm font-medium"
                >
                    <RobotIcon className="h-4 w-4" /> AI Assistant
                </button>
            </div>
        )}
        
        {/* Mobile only import button */}
        <div className="sm:hidden mb-4">
             <button
                onClick={() => setIsImportModalOpen(true)}
                className="w-full flex items-center justify-center gap-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-white font-semibold py-3 px-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm"
            >
                <TableIcon className="h-5 w-5 text-blue-500" />
                Import Timetable (CSV)
            </button>
        </div>
        
        {isClient && subjects.length > 0 && (
             <QuickStats subjects={subjects} />
        )}
        
        {isClient && subjects.length > 0 && (
             <Badges subjects={subjects} />
        )}
        
        {isClient && subjects.length > 0 && !isAdding && (
          <TodaysClasses subjects={subjects} onUpdateAttendance={updateAttendance} />
        )}

        {isAdding && <AddSubjectForm onAddSubject={addSubject} />}

        {isClient && overallStats.totalClasses > 0 && (
            <div className="mb-6">
                <AttendanceSummary 
                    overallPercentage={overallStats.overallPercentage}
                    totalAttended={overallStats.totalAttended}
                    totalAbsent={overallStats.totalAbsent}
                />
            </div>
        )}
        
        {isClient && overallStats.totalClasses > 0 && (
             <AttendanceTips />
        )}

        {isClient && subjects.length === 0 && !isAdding && (
            <div className="text-center py-16 px-4 bg-white dark:bg-gray-800 rounded-lg mt-6 border border-dashed border-gray-300 dark:border-gray-700 shadow-sm animate-fade-in">
                <div className="bg-blue-50 dark:bg-blue-900/30 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <TargetIcon className="h-10 w-10 text-blue-600 dark:text-blue-400" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-2">No subjects yet!</h2>
                <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md mx-auto">
                    Your dashboard is looking a bit empty. Add your first subject to start tracking your attendance goals.
                </p>
                 <div className="flex flex-col sm:flex-row justify-center gap-4">
                     <button
                        onClick={() => setIsAdding(true)}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors shadow-lg"
                      >
                        Add First Subject
                      </button>
                      <button
                        onClick={() => setIsImportModalOpen(true)}
                        className="bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600 font-bold py-3 px-6 rounded-lg transition-colors shadow-sm flex items-center justify-center gap-2"
                      >
                        <TableIcon className="h-5 w-5" /> Import Timetable
                      </button>
                 </div>
                 <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-sm text-gray-500 mb-3">Already have a backup?</p>
                    <button
                        onClick={handleRestoreClick}
                        className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 flex items-center justify-center gap-2 mx-auto transition-colors"
                    >
                        <UploadCloudIcon className="h-5 w-5" />
                        <span>Restore Data from Backup</span>
                    </button>
                 </div>
            </div>
        )}

        {isClient && subjects.length > 0 && (
          <>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-8 mb-4">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">My Subjects</h2>
              <div className="flex items-center gap-2 self-end sm:self-auto flex-wrap justify-end">
                  {subjects.length > 1 && (
                    <>
                      <label htmlFor="sort-by" className="sr-only">Sort by</label>
                      <select
                          id="sort-by"
                          value={sortBy}
                          onChange={handleSortByChange}
                          className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm rounded-md border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 py-2 px-3 cursor-pointer"
                      >
                          <option value="name">Name</option>
                          <option value="percentage">Percentage</option>
                          <option value="urgency">Urgency</option>
                      </select>
                      <button
                          onClick={() => setSortOrder(o => o === 'asc' ? 'desc' : 'asc')}
                          className="p-2 bg-white dark:bg-gray-700 rounded-md hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300"
                          title={`Sort ${sortOrder === 'asc' ? 'Descending' : 'Ascending'}`}
                      >
                          {sortOrder === 'asc' ? <SortAscIcon /> : <SortDescIcon />}
                      </button>
                    </>
                  )}
                  <div className="h-6 w-px bg-gray-300 dark:bg-gray-600 mx-1 hidden sm:block"></div>
                  
                  <button
                      onClick={() => setIsShareModalOpen(true)}
                      className="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-md hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors border border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400"
                      title="Share Schedule with Classmates"
                  >
                      <UserGroupIcon />
                  </button>

                  <button
                      onClick={handleBackupData}
                      className="p-2 bg-white dark:bg-gray-700 rounded-md hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300"
                      title="Backup Data (Download JSON)"
                  >
                      <DownloadCloudIcon />
                  </button>
                  <button
                      onClick={handleRestoreClick}
                      className="p-2 bg-white dark:bg-gray-700 rounded-md hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300"
                      title="Restore Data (Upload JSON)"
                  >
                      <UploadCloudIcon />
                  </button>
                  <button
                      onClick={handleExportAllPDF}
                      className="p-2 bg-white dark:bg-gray-700 rounded-md hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300"
                      title="Export All to PDF"
                  >
                      <DocumentDownloadIcon />
                  </button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedSubjects.map((subject) => (
                <SubjectCard
                  key={subject.id}
                  subject={subject}
                  onUpdateAttendance={updateAttendance}
                  onDelete={deleteSubject}
                  onReset={resetSubject}
                  onEdit={handleStartEdit}
                  onUpdate={updateSubject}
                  onSafeStatusReached={triggerConfetti}
                />
              ))}
            </div>
          </>
        )}
      </main>
      
      {/* Hidden file input for restore functionality */}
      <input 
          type="file" 
          ref={fileInputRef} 
          style={{ display: 'none' }} 
          accept=".json" 
          onChange={handleFileChange}
      />
      
      <Toast 
         message={toastMessage}
         isVisible={toastVisible}
         onClose={() => setToastVisible(false)}
         onUndo={handleUndo}
      />

      <Suspense fallback={null}>
        {editingSubject && (
            <EditSubjectModal
            subject={editingSubject}
            onUpdate={updateSubject}
            onClose={() => setEditingSubject(null)}
            />
        )}
        
        {isImportModalOpen && (
            <ImportTimetableModal 
                subjects={subjects}
                onImport={handleBulkImport}
                onClose={() => setIsImportModalOpen(false)}
            />
        )}

        {isShareModalOpen && (
            <ShareScheduleModal 
                subjects={subjects}
                onClose={() => setIsShareModalOpen(false)}
            />
        )}
        
        {showGPAModal && (
            <GPACalculatorModal onClose={() => setShowGPAModal(false)} />
        )}
        
        {showFocusModal && (
            <FocusModeModal onClose={() => setShowFocusModal(false)} />
        )}
        
        {showAIModal && (
            <AIAssistantModal onClose={() => setShowAIModal(false)} subjects={subjects} />
        )}
      </Suspense>

      {isClient && <CookieConsent />}

      <Footer />
    </div>
  );
};

export default Dashboard;