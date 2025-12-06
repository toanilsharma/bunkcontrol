import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNav } from '../contexts/NavigationContext';
import Header from '../components/Header';
import { BrainIcon, TargetIcon, CheckCircleIcon, ChartBarIcon, LightbulbIcon, TableIcon, CalculatorIcon, ArrowRightIcon } from '../components/icons';
import Footer from '../components/Footer';
import DemoSection from '../components/DemoSection';
import LoginModal from '../components/LoginModal';

const LoginPage: React.FC = () => {
  const { login, isAuthenticated, user } = useAuth();
  const { navigateTo } = useNav();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  useEffect(() => {
    // Scroll to top on mount is handled by NavContext
  }, []);

  const handleStart = () => {
    if (isAuthenticated) {
      navigateTo('dashboard');
    } else {
      setIsLoginModalOpen(true);
    }
  };
  
  const handleLoginSuccess = (name: string) => {
      login(name);
      navigateTo('dashboard');
  };

  const faqs = [
      {
          q: "Is Bunk Control really free?",
          a: "Yes! The app is 100% free to use for all students. We are supported by unobtrusive ads so you can focus on your studies."
      },
      {
          q: "Is my data private and secure?",
          a: "Absolutely. Bunk Control uses a 'Local-First' architecture. All your subject names, attendance records, and stats are stored only on your device. We do not have a backend server to read your data."
      },
      {
          q: "What happens if I clear my browser history?",
          a: "Since data is stored locally in the browser, clearing your cache/storage will wipe your data. We highly recommend using the 'Backup' button in the dashboard weekly to save a JSON file of your progress."
      },
      {
          q: "Does the app work offline?",
          a: "Yes! Bunk Control is a Progressive Web App (PWA). Once loaded, you can turn off your internet and still mark attendance, use the calculator, and view your dashboard."
      },
      {
          q: "Can I import my college timetable?",
          a: "Yes. Use our 'Import Schedule' feature. You can download our CSV template, fill in your classes for the week, and upload it to set up your entire dashboard in seconds."
      },
      {
          q: "How does the 'What-If' calculator work?",
          a: "It helps you predict the future. You enter how many classes you plan to attend or miss, and it tells you exactly what your percentage will be, helping you decide if you can afford a bunk."
      },
      {
          q: "Can I use it on my iPhone or Android?",
          a: "Yes. Open the website in Safari (iOS) or Chrome (Android) and tap 'Share' -> 'Add to Home Screen'. It will install like a native app."
      },
      {
          q: "How do I handle medical leave?",
          a: "You can adjust your 'Required Percentage' in the edit settings. If your college allows 65% with medical leave, you can change the target for that subject to track your status accurately."
      }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white flex flex-col transition-colors duration-300">
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <div className="relative overflow-hidden pt-10 pb-20 lg:pb-32">
            {/* Background decoration */}
            <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-500/10 dark:bg-blue-600/20 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute top-1/2 right-0 w-64 h-64 bg-purple-500/10 dark:bg-purple-600/10 rounded-full blur-3xl pointer-events-none"></div>

            <div className="container mx-auto px-4 flex flex-col justify-center items-center text-center relative z-10">
                <div className="inline-flex items-center gap-2 bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800 rounded-full px-4 py-1.5 mb-8">
                    <span className="flex h-2 w-2 rounded-full bg-blue-600 animate-pulse"></span>
                    <span className="text-sm font-semibold text-blue-700 dark:text-blue-300">New: One-Click Timetable Import</span>
                </div>

                <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6 text-gray-900 dark:text-white">
                    Master Your <br className="hidden md:block" /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">Attendance</span>
                </h1>
                <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
                    The strategic partner for academic success. Track classes, calculate 'what-if' scenarios, and maintain your required percentage with zero stress.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md justify-center">
                    <button
                        onClick={handleStart}
                        className="bg-blue-600 hover:bg-blue-700 text-white text-lg font-bold py-4 px-8 rounded-xl shadow-lg shadow-blue-600/20 transition-all transform hover:scale-105 hover:shadow-blue-600/40 flex items-center justify-center gap-2"
                    >
                        <ChartBarIcon className="h-5 w-5" />
                        {isAuthenticated ? `Hi ${user?.name}, Go to Dashboard` : 'Start Tracking Now'}
                    </button>
                    <button
                        onClick={() => navigateTo('help')}
                        className="bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 text-lg font-semibold py-4 px-8 rounded-xl border border-gray-200 dark:border-gray-700 transition-colors shadow-sm flex items-center justify-center gap-2"
                    >
                        <LightbulbIcon className="h-5 w-5" />
                        How it Works
                    </button>
                </div>
                
                <p className="mt-6 text-sm text-gray-500 dark:text-gray-500">
                    {isAuthenticated 
                        ? 'You are currently logged in. Your data is ready.' 
                        : 'No sign-up required. Data stored locally on your device.'}
                </p>
            </div>
        </div>

        {/* Interactive Teaser Demo Section */}
        <DemoSection />
        
        {/* Features Grid */}
        <div className="py-24 bg-white dark:bg-gray-800/50 border-y border-gray-100 dark:border-gray-800 transition-colors duration-300">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">Why Choose Bunk Control?</h2>
                    <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">Designed for students who want to optimize their college life without compromising on grades.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-2xl border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300 group">
                        <div className="bg-blue-100 dark:bg-blue-900/30 w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                            <BrainIcon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                        </div>
                        <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">Smart Calculations</h3>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                            Our advanced algorithms instantly tell you how many classes you can skip safely or how many you need to attend to recover your percentage.
                        </p>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-2xl border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300 group">
                         <div className="bg-green-100 dark:bg-green-900/30 w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                            <TargetIcon className="h-8 w-8 text-green-600 dark:text-green-400" />
                        </div>
                        <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">Visual Dashboard</h3>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                            Get a clear, color-coded overview of your academic standing. Green means safe, Red means danger. It's that simple.
                        </p>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-2xl border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300 group">
                         <div className="bg-purple-100 dark:bg-purple-900/30 w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                            <TableIcon className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                        </div>
                        <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">Easy Setup</h3>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                            Don't want to type? Download our CSV template, fill your timetable, and upload it to setup your entire dashboard in seconds.
                        </p>
                    </div>
                </div>
            </div>
        </div>

        {/* Student Success Hub (New Content for AdSense) */}
        <div className="py-20 bg-gray-50 dark:bg-gray-900">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                     <div className="inline-flex items-center gap-2 bg-green-50 dark:bg-green-900/30 border border-green-100 dark:border-green-800 rounded-full px-4 py-1.5 mb-4">
                        <span className="text-sm font-semibold text-green-700 dark:text-green-300">Student Success Hub</span>
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Resources & Guides</h2>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">Tips to manage your academic life better.</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {/* Article 1 */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col">
                        <div className="h-48 bg-gradient-to-r from-blue-500 to-blue-400 flex items-center justify-center">
                            <ChartBarIcon className="h-16 w-16 text-white/80" />
                        </div>
                        <div className="p-6 flex-grow">
                            <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">The Math Behind 75%</h3>
                            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 leading-relaxed">
                                Understanding how attendance percentages work is crucial. A single missed class in a 3-credit course can drop you by 3-5%. Learn how to calculate your buffer manually.
                            </p>
                        </div>
                    </div>

                    {/* Article 2 */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col">
                        <div className="h-48 bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                             <BrainIcon className="h-16 w-16 text-white/80" />
                        </div>
                         <div className="p-6 flex-grow">
                            <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">Strategic Skipping</h3>
                            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 leading-relaxed">
                                Not all classes are created equal. Use your attendance buffer for legitimate reasons like health, internships, or mental health days, rather than sleeping in.
                            </p>
                        </div>
                    </div>

                     {/* Article 3 */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col">
                         <div className="h-48 bg-gradient-to-r from-green-500 to-teal-500 flex items-center justify-center">
                             <TargetIcon className="h-16 w-16 text-white/80" />
                        </div>
                        <div className="p-6 flex-grow">
                            <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">Talking to Professors</h3>
                            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 leading-relaxed">
                                If you are falling short, communication is key. Learn the best ways to approach your faculty to discuss makeup assignments or attendance waivers.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* Quick Steps Section */}
        <div id="how-it-works" className="py-24 container mx-auto px-4 bg-white dark:bg-gray-800/50">
            <div className="flex flex-col lg:flex-row gap-16 items-start">
                <div className="lg:w-1/2">
                    <h2 className="text-3xl font-bold mb-6 text-blue-600 dark:text-blue-400">How It Works</h2>
                    <div className="space-y-10">
                        <div className="flex gap-6">
                            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-xl shadow-sm">1</div>
                            <div>
                                <h4 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">Start Without Sign-up</h4>
                                <p className="text-gray-600 dark:text-gray-400">No emails, no passwords. Simply click "Start Tracking" to create a local session instantly.</p>
                            </div>
                        </div>
                        <div className="flex gap-6">
                            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-xl shadow-sm">2</div>
                            <div>
                                <h4 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">Add or Import Subjects</h4>
                                <p className="text-gray-600 dark:text-gray-400">Input your courses manually or use our <strong>CSV Import</strong> feature to upload your entire timetable in one go.</p>
                            </div>
                        </div>
                        <div className="flex gap-6">
                            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-xl shadow-sm">3</div>
                            <div>
                                <h4 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">Update Daily</h4>
                                <p className="text-gray-600 dark:text-gray-400">Mark classes as Attended, Missed, or Cancelled. We handle the complex math and projections for you.</p>
                            </div>
                        </div>
                        <div className="flex gap-6">
                            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-xl shadow-sm">4</div>
                            <div>
                                <h4 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">Calculate & Plan</h4>
                                <p className="text-gray-600 dark:text-gray-400">Use the <strong>'What-If' Calculator</strong> to simulate future scenarios. Know exactly how many classes you can skip safely.</p>
                            </div>
                        </div>
                        <div className="flex gap-6">
                            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-xl shadow-sm">5</div>
                            <div>
                                <h4 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">Stay Organized</h4>
                                <p className="text-gray-600 dark:text-gray-400">Track <strong>Assignments</strong> and set <strong>Reminders</strong> so you never miss a deadline or an important lecture.</p>
                            </div>
                        </div>
                        {/* NEW 6th POINT */}
                        <div className="flex gap-6">
                            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-xl shadow-sm">6</div>
                            <div>
                                <h4 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">Backup & Secure</h4>
                                <p className="text-gray-600 dark:text-gray-400">Your data lives on your device. Regularly download a <strong>Backup</strong> to ensure you never lose your progress.</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="mt-12 flex gap-4">
                        <button
                            onClick={handleStart}
                            className="bg-gray-900 dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-100 text-white dark:text-gray-900 text-lg font-bold py-3 px-8 rounded-lg transition-colors shadow-lg"
                        >
                            {isAuthenticated ? 'Go to Dashboard' : 'Get Started Now'}
                        </button>
                        <button
                            onClick={() => navigateTo('help')}
                            className="text-blue-600 dark:text-blue-400 hover:underline font-medium py-3 px-4"
                        >
                            View Full Guide
                        </button>
                    </div>

                    {/* New Toolkit Feature Card filling empty space */}
                    <div className="mt-10 p-1 rounded-2xl bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 shadow-md transform transition-transform hover:scale-[1.02]">
                        <div className="bg-white dark:bg-gray-900 rounded-xl p-6 h-full relative overflow-hidden">
                            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl"></div>
                            
                            <div className="flex items-start gap-4 relative z-10">
                                <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-lg flex-shrink-0">
                                    <CalculatorIcon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                                </div>
                                <div>
                                    <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                                        More Than Just Attendance
                                    </h4>
                                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 leading-relaxed">
                                        Access our <strong>GPA Calculator</strong>, <strong>Focus Timer</strong>, and <strong>AI Assistant</strong> to stay ahead of the curve.
                                    </p>
                                    <button 
                                        onClick={() => navigateTo('help')}
                                        className="text-purple-600 dark:text-purple-400 font-bold text-sm flex items-center gap-2 hover:gap-3 transition-all"
                                    >
                                        Explore Student Toolkit <ArrowRightIcon className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div id="faq" className="lg:w-1/2 w-full">
                     <div className="bg-gray-50 dark:bg-gray-800 p-8 lg:p-12 rounded-3xl border border-gray-200 dark:border-gray-700 shadow-xl scroll-mt-24">
                        <h2 className="text-2xl font-bold mb-8 text-gray-900 dark:text-white">Frequently Asked Questions</h2>
                        <div className="space-y-8">
                            {faqs.map((faq, index) => (
                                <div key={index}>
                                    <h5 className="font-bold text-lg text-gray-800 dark:text-gray-200 mb-2 flex items-start gap-2">
                                        <CheckCircleIcon className="h-5 w-5 text-green-500 flex-shrink-0 mt-1" />
                                        {faq.q}
                                    </h5>
                                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm pl-7">{faq.a}</p>
                                </div>
                            ))}
                        </div>
                     </div>
                </div>
            </div>
        </div>
        
        {/* CTA Section */}
        <div className="bg-blue-600 py-16">
            <div className="container mx-auto px-4 text-center">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to take control?</h2>
                <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">Join thousands of students who are managing their attendance smarter, not harder.</p>
                <button
                    onClick={handleStart}
                    className="bg-white text-blue-600 hover:bg-gray-100 font-bold py-4 px-10 rounded-full shadow-xl transition-transform hover:scale-105"
                >
                    {isAuthenticated ? `Hi ${user?.name}, Launch Dashboard` : 'Launch Dashboard'}
                </button>
            </div>
        </div>

        <LoginModal 
            isOpen={isLoginModalOpen} 
            onClose={() => setIsLoginModalOpen(false)} 
            onLogin={handleLoginSuccess} 
        />
      </main>

      <Footer variant="page" />
    </div>
  );
};

export default LoginPage;