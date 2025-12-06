import React from 'react';
import { createPortal } from 'react-dom';
import { Subject } from '../types';
import { UserGroupIcon, DocumentDownloadIcon } from './icons';

interface ShareScheduleModalProps {
  subjects: Subject[];
  onClose: () => void;
}

const ShareScheduleModal: React.FC<ShareScheduleModalProps> = ({ subjects, onClose }) => {
  const handleDownload = () => {
    // strip personal attendance data
    const sharedData = subjects.map(s => ({
        ...s,
        attended: 0,
        absent: 0,
        cancelled: 0,
        // keep id, name, requiredPercentage, icon, schedules, reminder
    }));

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(sharedData));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "bunk_control_class_schedule.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
    onClose();
  };

  return createPortal(
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex justify-center items-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-2xl w-full max-w-md relative animate-scale-in"
        onClick={e => e.stopPropagation()}
      >
        <div className="text-center mb-6">
            <div className="inline-flex p-3 rounded-full bg-indigo-100 dark:bg-indigo-900/30 mb-4 text-indigo-600 dark:text-indigo-400">
                <UserGroupIcon className="h-10 w-10" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Share Class Schedule</h2>
            <p className="text-gray-600 dark:text-gray-400 mt-2 text-sm leading-relaxed">
                Be the hero of your class! 🦸‍♂️<br/>
                Generate a file with all subjects and timings. Your personal attendance stats will be hidden.
            </p>
        </div>

        <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl border border-gray-100 dark:border-gray-600 mb-6 text-sm text-gray-700 dark:text-gray-300">
            <ul className="list-disc list-inside space-y-1">
                <li>Includes <strong>{subjects.length}</strong> subjects</li>
                <li>Includes class timings</li>
                <li><span className="text-green-600 dark:text-green-400 font-bold">Excludes</span> your attendance record</li>
            </ul>
        </div>

        <button
            onClick={handleDownload}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 px-4 rounded-xl transition-transform transform hover:scale-105 shadow-lg shadow-indigo-500/30 flex items-center justify-center gap-2"
        >
            <DocumentDownloadIcon className="h-5 w-5" />
            Download Shareable File
        </button>
        
        <button
            onClick={onClose}
            className="w-full mt-3 py-3 text-gray-500 dark:text-gray-400 font-medium hover:text-gray-800 dark:hover:text-white transition-colors"
        >
            Cancel
        </button>
      </div>
    </div>,
    document.body
  );
};

export default ShareScheduleModal;