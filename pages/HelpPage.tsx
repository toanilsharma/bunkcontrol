
import React, { useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { MockAddForm, MockCalculator, MockEditForm, MockSubjectCard } from '../components/Mocks';
import {
    BrainIcon, TargetIcon, EditIcon, DocumentDownloadIcon,
    CheckCircleIcon, TableIcon, RobotIcon, CalculatorIcon,
    ClockIcon, EyeIcon, BadgeIcon, ClipboardCheckIcon,
    UserGroupIcon, DownloadCloudIcon, PlayIcon
} from '../components/icons';
import { useNav } from '../contexts/NavigationContext';

const HelpPage: React.FC = () => {
    const { navigateTo } = useNav();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const handleDownloadTemplate = () => {
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

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white flex flex-col transition-colors duration-300">
            <Header />

            <main className="flex-grow container mx-auto px-4 py-12">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-16">
                        <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">App User Guide</h1>
                        <p className="text-xl text-gray-600 dark:text-gray-400">Master every feature of Bunk Control.</p>
                    </div>

                    {/* Section 1: Getting Started */}
                    <section className="mb-20 scroll-mt-24" id="getting-started">
                        <div className="flex flex-col md:flex-row gap-8 items-center mb-8">
                            <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-xl">
                                <TargetIcon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">1. Adding a Subject</h2>
                                <p className="text-gray-600 dark:text-gray-400 mt-2">
                                    Your dashboard starts empty. The first step is to add the courses you want to track.
                                </p>
                            </div>
                        </div>
                        <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col md:flex-row gap-10 items-center">
                            <div className="flex-1 space-y-4">
                                <h3 className="font-bold text-lg">Option A: Manual Add</h3>
                                <ol className="list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-300">
                                    <li>Click the <span className="font-bold text-blue-600 dark:text-blue-400">+ Add Subject</span> button.</li>
                                    <li>Enter a distinct name (e.g., "Physics").</li>
                                    <li>Set your college's required attendance percentage.</li>
                                    <li>(Optional) Add class timings for schedule tracking.</li>
                                    <li>Click Save!</li>
                                </ol>
                            </div>
                            <div className="flex-1 w-full">
                                <MockAddForm />
                                <p className="text-center text-sm text-gray-500 mt-3">The Add Subject Form</p>
                            </div>
                        </div>
                    </section>

                    {/* Section 2: Importing */}
                    <section className="mb-20 scroll-mt-24" id="importing">
                        <div className="flex flex-col md:flex-row gap-8 items-center mb-8">
                            <div className="bg-indigo-100 dark:bg-indigo-900/30 p-3 rounded-xl">
                                <TableIcon className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">2. Importing Your Timetable</h2>
                                <p className="text-gray-600 dark:text-gray-400 mt-2">
                                    Setting up many subjects? Use our Bulk Import feature.
                                </p>
                            </div>
                        </div>
                        <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                                <div className="space-y-4">
                                    <h3 className="font-bold text-lg">Steps to Import:</h3>
                                    <ol className="list-decimal list-inside space-y-3 text-gray-700 dark:text-gray-300">
                                        <li>Download the <button onClick={handleDownloadTemplate} className="text-blue-600 dark:text-blue-400 underline font-semibold">CSV Template</button>.</li>
                                        <li>Open it in Excel or Google Sheets.</li>
                                        <li>Fill in <strong>Subject Name</strong>, <strong>Day</strong> (e.g., Monday), and <strong>Time</strong> (e.g., 9:00 AM).</li>
                                        <li>Save as CSV.</li>
                                        <li>Click "Import Schedule" on your dashboard and drag the file in!</li>
                                    </ol>
                                    <button
                                        onClick={() => navigateTo('dashboard', { tool: 'import' })}
                                        className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2 text-sm transition-colors"
                                    >
                                        <PlayIcon className="h-4 w-4" /> Launch Importer
                                    </button>
                                </div>
                                <div className="bg-indigo-50 dark:bg-indigo-900/20 p-6 rounded-xl border border-indigo-100 dark:border-indigo-800 text-center">
                                    <p className="font-semibold text-indigo-900 dark:text-indigo-200 mb-4">Want to prepare your file now?</p>
                                    <button
                                        onClick={handleDownloadTemplate}
                                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center gap-2 mx-auto"
                                    >
                                        <DocumentDownloadIcon className="h-5 w-5" />
                                        Download Template
                                    </button>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Section 3: Tracking */}
                    <section className="mb-20 scroll-mt-24" id="tracking">
                        <div className="flex flex-col md:flex-row gap-8 items-center mb-8">
                            <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-xl">
                                <CheckCircleIcon className="h-8 w-8 text-green-600 dark:text-green-400" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">3. Marking Attendance</h2>
                                <p className="text-gray-600 dark:text-gray-400 mt-2">
                                    The Subject Card is where you'll spend most of your time. It updates in real-time.
                                </p>
                            </div>
                        </div>
                        <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col md:flex-row-reverse gap-10 items-center">
                            <div className="flex-1 space-y-4">
                                <h3 className="font-bold text-lg">How it works:</h3>
                                <ul className="space-y-3 text-gray-700 dark:text-gray-300">
                                    <li className="flex gap-3">
                                        <span className="font-bold text-green-600">Present:</span>
                                        <span>Increases your "Attended" count and total classes.</span>
                                    </li>
                                    <li className="flex gap-3">
                                        <span className="font-bold text-red-600">Absent:</span>
                                        <span>Increases your "Absent" count. This lowers your percentage.</span>
                                    </li>
                                    <li className="flex gap-3">
                                        <span className="font-bold text-gray-600">Cancelled:</span>
                                        <span>Keeps track of classes that didn't happen. Does <strong>not</strong> affect your percentage.</span>
                                    </li>
                                </ul>
                                <p className="text-sm text-gray-500 mt-4 italic">
                                    Tip: Use the "Today's Schedule" widget at the top of the dashboard for quick one-tap marking!
                                </p>
                            </div>
                            <div className="flex-1 w-full">
                                <MockSubjectCard />
                                <p className="text-center text-sm text-gray-500 mt-3">Interactive Subject Card</p>
                            </div>
                        </div>
                    </section>

                    {/* Section 4: Advanced Tools (Toolkit) */}
                    <section className="mb-20 scroll-mt-24" id="toolkit">
                        <div className="flex flex-col md:flex-row gap-8 items-center mb-8">
                            <div className="bg-pink-100 dark:bg-pink-900/30 p-3 rounded-xl">
                                <RobotIcon className="h-8 w-8 text-pink-600 dark:text-pink-400" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">4. Student Toolkit</h2>
                                <p className="text-gray-600 dark:text-gray-400 mt-2">
                                    Powerful tools to boost your academic productivity.
                                </p>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* GPA Calculator */}
                            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 flex flex-col gap-4">
                                <div className="flex gap-4">
                                    <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg h-fit">
                                        <CalculatorIcon className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg mb-2 text-gray-900 dark:text-white">GPA Calculator</h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            Estimate your Semester GPA (SGPA) by entering subjects, credits, and expected grade points.
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => navigateTo('dashboard', { tool: 'gpa' })}
                                    className="mt-auto w-full bg-purple-50 hover:bg-purple-100 dark:bg-purple-900/20 dark:hover:bg-purple-900/40 text-purple-700 dark:text-purple-300 font-bold py-2 rounded-lg text-sm transition-colors border border-purple-200 dark:border-purple-800"
                                >
                                    Open Calculator
                                </button>
                            </div>

                            {/* Focus Timer */}
                            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 flex flex-col gap-4">
                                <div className="flex gap-4">
                                    <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg h-fit">
                                        <ClockIcon className="h-8 w-8 text-red-600 dark:text-red-400" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg mb-2 text-gray-900 dark:text-white">Focus Timer</h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            A built-in Pomodoro timer (25 min work / 5 min break). Helps you study without leaving the app.
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => navigateTo('dashboard', { tool: 'focus' })}
                                    className="mt-auto w-full bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/40 text-red-700 dark:text-red-300 font-bold py-2 rounded-lg text-sm transition-colors border border-red-200 dark:border-red-800"
                                >
                                    Start Timer
                                </button>
                            </div>

                            {/* AI Assistant */}
                            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 flex flex-col gap-4">
                                <div className="flex gap-4">
                                    <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg h-fit">
                                        <RobotIcon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg mb-2 text-gray-900 dark:text-white">AI Assistant</h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            Ask questions like "Can I bunk Math?" or "Status of Physics". It analyzes your current attendance and gives instant advice.
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => navigateTo('dashboard', { tool: 'ai' })}
                                    className="mt-auto w-full bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-bold py-2 rounded-lg text-sm transition-colors border border-blue-200 dark:border-blue-800"
                                >
                                    Chat with AI
                                </button>
                            </div>

                            {/* What If Calculator */}
                            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 flex flex-col gap-4">
                                <div className="flex gap-4">
                                    <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg h-fit">
                                        <BrainIcon className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg mb-2 text-gray-900 dark:text-white">'What If' Calculator</h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            Predict your future percentage. Enter how many classes you plan to miss or attend to see the outcome before you act.
                                        </p>
                                    </div>
                                </div>
                                <div className="mt-auto p-2 bg-gray-50 dark:bg-gray-700 rounded text-xs text-gray-500 text-center">
                                    Open this from any subject card
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Section 5: Assignments */}
                    <section className="mb-20 scroll-mt-24" id="assignments">
                        <div className="flex flex-col md:flex-row gap-8 items-center mb-8">
                            <div className="bg-teal-100 dark:bg-teal-900/30 p-3 rounded-xl">
                                <ClipboardCheckIcon className="h-8 w-8 text-teal-600 dark:text-teal-400" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">5. Assignments & Tasks</h2>
                                <p className="text-gray-600 dark:text-gray-400 mt-2">
                                    Keep track of homework and exams directly on the subject card.
                                </p>
                            </div>
                        </div>
                        <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
                            <p className="text-gray-700 dark:text-gray-300 mb-4">
                                Click the <ClipboardCheckIcon className="inline h-5 w-5 mx-1 text-gray-500" /> icon on any subject card to open the Task Manager.
                            </p>
                            <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                                <li>Add tasks like <strong>Homework</strong>, <strong>Exam</strong>, or <strong>Lab</strong>.</li>
                                <li>Set due dates.</li>
                                <li>A <span className="text-red-500 font-bold">red badge</span> will appear on the card icon if you have incomplete tasks.</li>
                            </ul>
                        </div>
                    </section>

                    {/* Section 6: Privacy & Gamification */}
                    <section className="mb-20 scroll-mt-24" id="extras">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Incognito Mode */}
                            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
                                <div className="flex items-center gap-3 mb-4">
                                    <EyeIcon className="h-6 w-6 text-gray-700 dark:text-gray-300" />
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">Incognito Mode</h3>
                                </div>
                                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                                    Need to check your attendance in public? Toggle the "Eye" icon in the header to <strong>blur all percentage numbers</strong>.
                                    Hover over the blurred text to peek at the values privately.
                                </p>
                            </div>

                            {/* Gamification */}
                            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
                                <div className="flex items-center gap-3 mb-4">
                                    <BadgeIcon className="h-6 w-6 text-yellow-500" />
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">Badges & Rewards</h3>
                                </div>
                                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                                    Unlock badges like <strong>Safe Zone</strong>, <strong>Bunk King</strong>, and <strong>Academic Weapon</strong> by maintaining good stats.
                                    View your collection at the top of the dashboard.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Section 7: Exporting & Sharing */}
                    <section className="mb-12" id="exporting">
                        <div className="flex flex-col md:flex-row gap-8 items-center mb-8">
                            <div className="bg-orange-100 dark:bg-orange-900/30 p-3 rounded-xl">
                                <DownloadCloudIcon className="h-8 w-8 text-orange-600 dark:text-orange-400" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">6. Backup & Share</h2>
                                <p className="text-gray-600 dark:text-gray-400 mt-2">
                                    Your data belongs to you. Keep it safe.
                                </p>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                                <h3 className="font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                                    <UserGroupIcon className="h-5 w-5 text-indigo-500" /> Share Schedule
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Use the "Share Schedule" button to create a file for your classmates. It shares subject names and times but <strong>hides your personal attendance</strong>.
                                </p>
                            </div>
                            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                                <h3 className="font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                                    <DocumentDownloadIcon className="h-5 w-5 text-blue-500" /> Export / Backup
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Use the <strong>Backup</strong> button to save a JSON file of all your data. Restore it anytime if you clear your browser cache.
                                </p>
                            </div>
                        </div>

                        <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl border border-blue-100 dark:border-blue-800 text-center">
                            <p className="font-semibold text-blue-800 dark:text-blue-200">
                                📱 Install App: You can install Bunk Control on your phone!
                            </p>
                            <p className="text-sm text-blue-600 dark:text-blue-300 mt-1">
                                Tap "Share" -{'>'} "Add to Home Screen" on iOS, or "Install App" on Android Chrome. Works offline!
                            </p>
                        </div>
                    </section>

                    <div className="text-center mt-16">
                        <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Ready to start?</h3>
                        <button
                            onClick={() => navigateTo('home')}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg shadow-lg transition-transform transform hover:scale-105"
                        >
                            Go to Dashboard
                        </button>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default HelpPage;
