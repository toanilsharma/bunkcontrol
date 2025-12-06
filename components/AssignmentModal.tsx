import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Subject, Assignment } from '../types';
import { PlusIcon, TrashIcon, CalendarIcon, CheckCircleIcon } from './icons';

interface AssignmentModalProps {
  subject: Subject;
  onUpdate: (updatedSubject: Subject) => void;
  onClose: () => void;
}

const AssignmentModal: React.FC<AssignmentModalProps> = ({ subject, onUpdate, onClose }) => {
  const [assignments, setAssignments] = useState<Assignment[]>(subject.assignments || []);
  const [newTitle, setNewTitle] = useState('');
  const [newDate, setNewDate] = useState('');
  const [newType, setNewType] = useState<Assignment['type']>('Homework');

  useEffect(() => {
    setAssignments(subject.assignments || []);
  }, [subject]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleAddAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newAssignment: Assignment = {
      id: crypto.randomUUID(),
      title: newTitle.trim(),
      dueDate: newDate,
      completed: false,
      type: newType,
    };

    const updatedAssignments = [...assignments, newAssignment];
    setAssignments(updatedAssignments);
    onUpdate({ ...subject, assignments: updatedAssignments });
    
    // Reset form
    setNewTitle('');
    setNewDate('');
    setNewType('Homework');
  };

  const handleToggleComplete = (id: string) => {
    const updatedAssignments = assignments.map(a => 
      a.id === id ? { ...a, completed: !a.completed } : a
    );
    setAssignments(updatedAssignments);
    onUpdate({ ...subject, assignments: updatedAssignments });
  };

  const handleDelete = (id: string) => {
    const updatedAssignments = assignments.filter(a => a.id !== id);
    setAssignments(updatedAssignments);
    onUpdate({ ...subject, assignments: updatedAssignments });
  };

  const getTypeColor = (type: string) => {
    switch(type) {
      case 'Exam': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      case 'Lab': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
      case 'Project': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300';
      default: return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
    }
  };

  return createPortal(
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex justify-center items-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-2xl w-full max-w-md relative animate-scale-in flex flex-col max-h-[85vh]"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
            <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Assignments & Tasks</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">For {subject.name}</p>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
        </div>

        {/* List of Assignments */}
        <div className="flex-grow overflow-y-auto mb-6 pr-2 -mr-2 space-y-3">
            {assignments.length === 0 ? (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl">
                    <p>No pending tasks! 🎉</p>
                    <p className="text-sm">Add homework, exams, or labs below.</p>
                </div>
            ) : (
                assignments.map(assign => (
                    <div 
                        key={assign.id} 
                        className={`flex items-start gap-3 p-3 rounded-lg border transition-all ${
                            assign.completed 
                            ? 'bg-gray-50 dark:bg-gray-800/50 border-gray-100 dark:border-gray-700 opacity-60' 
                            : 'bg-white dark:bg-gray-700/30 border-gray-200 dark:border-gray-600 shadow-sm'
                        }`}
                    >
                        <button 
                            onClick={() => handleToggleComplete(assign.id)}
                            className={`mt-1 flex-shrink-0 w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                                assign.completed 
                                ? 'bg-green-500 border-green-500 text-white' 
                                : 'border-gray-400 hover:border-blue-500 text-transparent'
                            }`}
                        >
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/></svg>
                        </button>
                        
                        <div className="flex-grow min-w-0">
                            <p className={`font-medium text-gray-900 dark:text-white truncate ${assign.completed ? 'line-through text-gray-500' : ''}`}>
                                {assign.title}
                            </p>
                            <div className="flex items-center gap-2 mt-1 text-xs">
                                <span className={`px-1.5 py-0.5 rounded font-semibold ${getTypeColor(assign.type)}`}>
                                    {assign.type}
                                </span>
                                {assign.dueDate && (
                                    <span className={`flex items-center gap-1 ${
                                        new Date(assign.dueDate) < new Date() && !assign.completed ? 'text-red-500 font-bold' : 'text-gray-500 dark:text-gray-400'
                                    }`}>
                                        <CalendarIcon className="h-3 w-3" />
                                        {new Date(assign.dueDate).toLocaleDateString()}
                                    </span>
                                )}
                            </div>
                        </div>

                        <button onClick={() => handleDelete(assign.id)} className="text-gray-400 hover:text-red-500 transition-colors p-1">
                            <TrashIcon className="h-4 w-4" />
                        </button>
                    </div>
                ))
            )}
        </div>

        {/* Add New Form */}
        <form onSubmit={handleAddAssignment} className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wide">Add New Task</h3>
            <div className="space-y-3">
                <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="Task name (e.g. Chapter 5 Notes)"
                    className="w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <div className="flex gap-2">
                    <select
                        value={newType}
                        onChange={(e) => setNewType(e.target.value as Assignment['type'])}
                        className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg px-2 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 flex-1"
                    >
                        <option value="Homework">Homework</option>
                        <option value="Exam">Exam</option>
                        <option value="Lab">Lab</option>
                        <option value="Project">Project</option>
                        <option value="Other">Other</option>
                    </select>
                    <input
                        type="date"
                        value={newDate}
                        onChange={(e) => setNewDate(e.target.value)}
                        className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg px-2 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 flex-1"
                    />
                </div>
                <button
                    type="submit"
                    disabled={!newTitle.trim()}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:dark:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg transition-colors shadow-sm flex items-center justify-center gap-2 text-sm"
                >
                    <PlusIcon className="h-4 w-4" /> Add Task
                </button>
            </div>
        </form>
      </div>
    </div>,
    document.body
  );
};

export default AssignmentModal;