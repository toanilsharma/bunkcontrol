import React, { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Subject, ClassSchedule } from '../types';
import { TableIcon, DocumentDownloadIcon, UploadCloudIcon, CheckCircleIcon, BookIcon, CalculatorIcon, GlobeIcon } from './icons';

// Declare XLSX from CDN
declare const XLSX: any;

interface ImportTimetableModalProps {
  subjects: Subject[];
  onImport: (newSubjects: Subject[]) => void;
  onClose: () => void;
}

const ImportTimetableModal: React.FC<ImportTimetableModalProps> = ({ subjects, onImport, onClose }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [previewData, setPreviewData] = useState<{ name: string; day: string; time: string }[]>([]);

  const presets = {
      engineering: [
          { name: "Mathematics", day: "Monday", time: "09:00" },
          { name: "Physics", day: "Tuesday", time: "10:30" },
          { name: "Chemistry", day: "Wednesday", time: "11:00" },
          { name: "Mechanics", day: "Thursday", time: "14:00" },
          { name: "Computer Science", day: "Friday", time: "09:00" },
          { name: "Electronics", day: "Monday", time: "14:00" }
      ],
      commerce: [
          { name: "Accounting", day: "Monday", time: "10:00" },
          { name: "Economics", day: "Tuesday", time: "11:00" },
          { name: "Business Studies", day: "Wednesday", time: "09:00" },
          { name: "Marketing", day: "Thursday", time: "13:00" },
          { name: "Statistics", day: "Friday", time: "10:00" }
      ],
      arts: [
          { name: "History", day: "Monday", time: "11:00" },
          { name: "Psychology", day: "Tuesday", time: "09:00" },
          { name: "Sociology", day: "Wednesday", time: "14:00" },
          { name: "English Literature", day: "Thursday", time: "10:00" },
          { name: "Political Science", day: "Friday", time: "12:00" }
      ]
  };

  const loadPreset = (preset: 'engineering' | 'commerce' | 'arts') => {
      setPreviewData(presets[preset]);
      setError(null);
  };

  const handleDownloadCSV = () => {
    const csvTemplate = `Subject Name,Day,Time
Mathematics,Monday,09:00
Physics,Tuesday,10:30
Chemistry,Wednesday,14:00
English,Thursday,11:00
Computer Science,Friday,15:00`;
    const blob = new Blob([csvTemplate], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'bunk_control_template.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const handleDownloadExcel = () => {
    if (typeof XLSX === 'undefined') {
        alert("Excel generator loading... please wait a second and try again.");
        return;
    }
    const ws_data = [
        ["Subject Name", "Day", "Time"],
        ["Mathematics", "Monday", "09:00"],
        ["Physics", "Tuesday", "10:30"],
        ["Chemistry", "Wednesday", "14:00"],
        ["English", "Thursday", "11:00"],
        ["Computer Science", "Friday", "15:00"]
    ];
    const ws = XLSX.utils.aoa_to_sheet(ws_data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Timetable");
    XLSX.writeFile(wb, "bunk_control_template.xlsx");
  };

  const parseDay = (dayStr: any): number | null => {
    if (!dayStr) return null;
    const d = String(dayStr).toLowerCase().trim();
    if (d.includes('sun')) return 0;
    if (d.includes('mon')) return 1;
    if (d.includes('tue')) return 2;
    if (d.includes('wed')) return 3;
    if (d.includes('thu')) return 4;
    if (d.includes('fri')) return 5;
    if (d.includes('sat')) return 6;
    return null;
  };

  const parseTime = (timeStr: any): string => {
    if (!timeStr) return "09:00"; // Default fallback
    const t = String(timeStr).trim().toLowerCase();
    
    // Check for Excel serial number (decimal 0.x)
    // SheetJS raw:false usually handles this, but just in case
    if (!isNaN(Number(t)) && Number(t) < 1 && Number(t) > 0) {
        // It's likely an excel time fraction. We let users check the table preview.
        // But with raw:false in sheet_to_json, this usually comes as a formatted string.
    }

    // Matches HH:MM or HH:MM:SS
    const simpleMatch = t.match(/^(\d{1,2}):(\d{2})(:(\d{2}))?$/);
    if (simpleMatch) {
       let h = parseInt(simpleMatch[1]);
       const m = simpleMatch[2];
       if (h < 10) return `0${h}:${m}`;
       return `${h}:${m}`;
    }

    // Matches 2 PM, 2:00 PM, 2:00:00 PM
    const amPmMatch = t.match(/^(\d{1,2})(:(\d{2}))?(:(\d{2}))?\s*(am|pm)$/);
    if (amPmMatch) {
       let h = parseInt(amPmMatch[1]);
       const m = amPmMatch[3] || '00';
       const isPm = amPmMatch[6] === 'pm';
       
       if (isPm && h !== 12) h += 12;
       if (!isPm && h === 12) h = 0;
       
       return `${h.toString().padStart(2, '0')}:${m}`;
    }

    return t; 
  };

  const processFile = (file: File) => {
    setError(null);
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          
          if (typeof XLSX === 'undefined') {
              throw new Error("Parser library not loaded. Please check your internet connection.");
          }

          const workbook = XLSX.read(data, { type: 'array' });
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          
          // Get raw data as array of arrays, forcing formatted text (raw: false)
          const jsonData: any[][] = XLSX.utils.sheet_to_json(worksheet, { header: 1, raw: false, defval: "" });

          if (!jsonData || jsonData.length === 0) {
              throw new Error("File appears empty.");
          }

          const parsed: { name: string; day: string; time: string }[] = [];
          
          // Detect start row. Look for header "Subject" or assume row 0 if not found, but skip if it is a header
          let startIndex = 0;
          if (jsonData[0] && String(jsonData[0][0]).toLowerCase().includes('subject')) {
              startIndex = 1;
          }

          for (let i = startIndex; i < jsonData.length; i++) {
              const row = jsonData[i];
              // Ensure row has at least 3 columns and first column is not empty
              if (row.length >= 3 && row[0]) {
                  parsed.push({
                      name: String(row[0]).trim(),
                      day: String(row[1]).trim(),
                      time: String(row[2]).trim()
                  });
              }
          }

          if (parsed.length === 0) {
             setError("No valid data found. Please ensure you matched the template format: Subject, Day, Time.");
          } else {
             setPreviewData(parsed);
          }

      } catch (err: any) {
          console.error(err);
          setError("Failed to parse file. " + (err.message || "Please ensure it's a valid CSV or Excel file."));
      }
    };
    reader.readAsArrayBuffer(file);
  };

  // Trigger the hidden file input
  const triggerFileUpload = () => {
    if (fileInputRef.current) {
        fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
    // Reset value so same file can be selected again if needed
    if (e.target.value) e.target.value = '';
  };

  const handleFinalImport = () => {
    let updatedSubjects = [...subjects];

    previewData.forEach(row => {
        const day = parseDay(row.day);
        const time = parseTime(row.time);
        
        if (day === null) return; 

        const subjectIndex = updatedSubjects.findIndex(s => s.name.toLowerCase() === row.name.toLowerCase());
        const newSchedule: ClassSchedule = { day, startTime: time };

        if (subjectIndex >= 0) {
            const subject = updatedSubjects[subjectIndex];
            const exists = subject.schedules?.some(s => s.day === day && s.startTime === time);
            if (!exists) {
                updatedSubjects[subjectIndex] = {
                    ...subject,
                    schedules: [...(subject.schedules || []), newSchedule]
                };
            }
        } else {
            updatedSubjects.push({
                id: crypto.randomUUID(),
                name: row.name,
                requiredPercentage: 75,
                attended: 0,
                absent: 0,
                cancelled: 0,
                icon: 'Book',
                schedules: [newSchedule]
            });
        }
    });

    onImport(updatedSubjects);
    onClose();
  };

  return createPortal(
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex justify-center items-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-800 p-6 md:p-8 rounded-2xl shadow-2xl w-full max-w-3xl relative animate-scale-in flex flex-col max-h-[90vh]"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6 border-b border-gray-100 dark:border-gray-700 pb-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <TableIcon className="h-7 w-7 text-blue-500" />
                Import Class Schedule
            </h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
        </div>

        {previewData.length === 0 ? (
            <div className="flex flex-col gap-6 overflow-y-auto">
                {/* Presets Section */}
                <div>
                     <p className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">Quick Load Presets</p>
                     <div className="grid grid-cols-3 gap-4 mb-6">
                         <button onClick={() => loadPreset('engineering')} className="bg-orange-50 dark:bg-orange-900/20 hover:bg-orange-100 dark:hover:bg-orange-900/40 border border-orange-200 dark:border-orange-800 rounded-lg p-3 flex flex-col items-center gap-2 transition-colors">
                             <CalculatorIcon className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                             <span className="text-sm font-semibold text-orange-800 dark:text-orange-300">Engineering</span>
                         </button>
                         <button onClick={() => loadPreset('commerce')} className="bg-teal-50 dark:bg-teal-900/20 hover:bg-teal-100 dark:hover:bg-teal-900/40 border border-teal-200 dark:border-teal-800 rounded-lg p-3 flex flex-col items-center gap-2 transition-colors">
                             <BookIcon className="h-6 w-6 text-teal-600 dark:text-teal-400" />
                             <span className="text-sm font-semibold text-teal-800 dark:text-teal-300">Commerce</span>
                         </button>
                         <button onClick={() => loadPreset('arts')} className="bg-pink-50 dark:bg-pink-900/20 hover:bg-pink-100 dark:hover:bg-pink-900/40 border border-pink-200 dark:border-pink-800 rounded-lg p-3 flex flex-col items-center gap-2 transition-colors">
                             <GlobeIcon className="h-6 w-6 text-pink-600 dark:text-pink-400" />
                             <span className="text-sm font-semibold text-pink-800 dark:text-pink-300">Arts</span>
                         </button>
                     </div>
                     <div className="relative mb-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
                        </div>
                        <div className="relative flex justify-center">
                            <span className="px-2 bg-white dark:bg-gray-800 text-sm text-gray-500">OR Upload File</span>
                        </div>
                     </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Step 1: Download */}
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-xl p-6 flex flex-col items-center text-center hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors">
                        <div className="bg-blue-200 dark:bg-blue-800 w-16 h-16 rounded-full flex items-center justify-center mb-4 text-blue-700 dark:text-blue-300">
                            <DocumentDownloadIcon className="h-8 w-8" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Step 1: Get Template</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 flex-grow">
                            Get a template to fill in your schedule. Supports CSV and Excel.
                        </p>
                        <div className="flex gap-2 w-full">
                            <button 
                                onClick={handleDownloadCSV}
                                className="flex-1 bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-700 font-bold py-2 px-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm text-sm"
                            >
                                CSV
                            </button>
                            <button 
                                onClick={handleDownloadExcel}
                                className="flex-1 bg-white dark:bg-gray-800 text-green-600 dark:text-green-400 border border-green-200 dark:border-green-700 font-bold py-2 px-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm text-sm"
                            >
                                Excel
                            </button>
                        </div>
                    </div>

                    {/* Step 2: Upload */}
                    <div className="bg-gray-50 dark:bg-gray-700/30 border border-gray-200 dark:border-gray-700 rounded-xl p-6 flex flex-col items-center text-center hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors">
                        <div className="bg-gray-200 dark:bg-gray-600 w-16 h-16 rounded-full flex items-center justify-center mb-4 text-gray-700 dark:text-gray-300">
                            <UploadCloudIcon className="h-8 w-8" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Step 2: Upload File</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 flex-grow">
                            Select your filled <strong>CSV</strong> or <strong>Excel</strong> (.xlsx, .xls) file.
                        </p>
                        <button 
                            onClick={triggerFileUpload}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors shadow-md flex items-center justify-center gap-2"
                        >
                            Select File to Upload
                        </button>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".csv, .xlsx, .xls"
                            className="hidden"
                            onChange={handleFileChange}
                        />
                    </div>
                </div>
                
                {error && (
                    <div className="mt-2 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-sm text-center font-medium border border-red-100 dark:border-red-900/30">
                        {error}
                    </div>
                )}
            </div>
        ) : (
            <div className="flex flex-col h-full overflow-hidden">
                 <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 p-4 rounded-xl flex items-center gap-3 mb-4 flex-shrink-0">
                    <CheckCircleIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
                    <div>
                        <p className="text-green-800 dark:text-green-300 font-bold">
                            Success! Found {previewData.length} schedules.
                        </p>
                        <p className="text-green-700 dark:text-green-400 text-sm">
                            Review below and confirm to import.
                        </p>
                    </div>
                 </div>
                 
                 <div className="flex-grow overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-xl mb-4">
                    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 sticky top-0">
                            <tr>
                                <th scope="col" className="px-6 py-3">Subject</th>
                                <th scope="col" className="px-6 py-3">Day</th>
                                <th scope="col" className="px-6 py-3">Time</th>
                            </tr>
                        </thead>
                        <tbody>
                            {previewData.map((row, idx) => (
                                <tr key={idx} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                    <td className="px-6 py-3 font-bold text-gray-900 dark:text-white">{row.name}</td>
                                    <td className="px-6 py-3">{row.day}</td>
                                    <td className="px-6 py-3 font-mono text-xs">{row.time}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                 </div>

                 <div className="flex gap-4 pt-2 flex-shrink-0">
                     <button
                        onClick={() => { setPreviewData([]); setError(null); }}
                        className="flex-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-bold py-3 px-4 rounded-xl transition-colors"
                     >
                        Cancel / Reset
                     </button>
                     <button
                        onClick={handleFinalImport}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-xl transition-colors shadow-lg animate-pulse"
                     >
                        Confirm Import
                     </button>
                 </div>
            </div>
        )}
      </div>
    </div>,
    document.body
  );
};

export default ImportTimetableModal;