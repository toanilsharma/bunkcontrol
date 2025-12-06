import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Subject } from '../types';
import { DocumentDownloadIcon } from './icons';

// This is how to use jsPDF from a CDN
declare const jspdf: any;

interface ExportModalProps {
  subject: Subject;
  onClose: () => void;
}

const ExportModal: React.FC<ExportModalProps> = ({ subject, onClose }) => {
  
  const calculateStats = () => {
    const totalClasses = subject.attended + subject.absent;
    const currentPercentage = totalClasses > 0 ? (subject.attended / totalClasses) * 100 : 0;
    return { totalClasses, currentPercentage };
  };

  const handleExportCSV = () => {
    const { totalClasses, currentPercentage } = calculateStats();
    const headers = ["Subject Name", "Required %", "Attended", "Absent", "Cancelled", "Total Classes", "Current %"];
    const data = [
      `"${subject.name}"`,
      subject.requiredPercentage,
      subject.attended,
      subject.absent,
      subject.cancelled,
      totalClasses,
      currentPercentage.toFixed(2),
    ];

    const csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(",") + "\n" 
      + data.join(",");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${subject.name.replace(/\s+/g, '_')}_attendance.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    onClose();
  };

  const handleExportPDF = () => {
    if (typeof jspdf === 'undefined') {
      alert('PDF generation library is not loaded. Please reload the page and try again.');
      return;
    }

    const { jsPDF } = jspdf;
    const doc = new jsPDF();
    
    const { totalClasses, currentPercentage } = calculateStats();

    doc.setFontSize(22);
    doc.text("Bunk Control - Attendance Report", 105, 20, { align: "center" });

    doc.setFontSize(16);
    doc.text(`Subject: ${subject.name}`, 20, 40);

    doc.setFontSize(12);
    const reportData = [
      `Required Attendance: ${subject.requiredPercentage}%`,
      `Classes Attended: ${subject.attended}`,
      `Classes Absent: ${subject.absent}`,
      `Classes Cancelled: ${subject.cancelled}`,
      `Total Classes Held: ${totalClasses}`,
      `Current Percentage: ${currentPercentage.toFixed(2)}%`,
    ];

    reportData.forEach((line, index) => {
      doc.text(line, 20, 60 + (index * 10));
    });

    doc.setFontSize(10);
    doc.setTextColor(150);
    doc.text(`Report generated on: ${new Date().toLocaleDateString()}`, 20, 140);

    doc.save(`${subject.name.replace(/\s+/g, '_')}_attendance.pdf`);
    onClose();
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
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex justify-center items-center p-4"
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-labelledby="export-title"
    >
      <div 
        className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-2xl w-full max-w-sm relative animate-scale-in transition-colors duration-300"
        onClick={e => e.stopPropagation()}
      >
        <h2 id="export-title" className="text-xl font-bold text-gray-900 dark:text-white mb-2">Export Data</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">For "{subject.name}"</p>
        
        <div className="space-y-3">
          <button
            onClick={handleExportCSV}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-md transition-colors flex items-center justify-center gap-2 shadow-sm"
          >
            <DocumentDownloadIcon />
            <span>Download as CSV</span>
          </button>
          <button
            onClick={handleExportPDF}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-md transition-colors flex items-center justify-center gap-2 shadow-sm"
          >
            <DocumentDownloadIcon />
            <span>Download as PDF</span>
          </button>
        </div>
        
        <div className="mt-6">
          <button
            type="button"
            onClick={onClose}
            className="w-full bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-800 dark:text-white font-bold py-2 px-4 rounded-md transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default ExportModal;