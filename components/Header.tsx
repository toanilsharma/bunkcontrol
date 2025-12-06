
import React, { useState, useEffect, useRef } from 'react';
import { ChartBarIcon, LogoutIcon, SunIcon, MoonIcon, EyeIcon, EyeOffIcon, CalculatorIcon, ClockIcon, RobotIcon, TableIcon, BookIcon, UserGroupIcon, TargetIcon, MenuIcon, XIcon, ChevronDownIcon } from './icons';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useNav, Page } from '../contexts/NavigationContext';
import LoginModal from './LoginModal';
import GPACalculatorModal from './GPACalculatorModal';
import FocusModeModal from './FocusModeModal';
import AIAssistantModal from './AIAssistantModal';

const Header: React.FC = () => {
  const { user, isAuthenticated, logout, login } = useAuth();
  const { theme, toggleTheme, privacyMode, togglePrivacyMode } = useTheme();
  const { navigateTo, currentPage } = useNav();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  
  // Modal States
  const [showGPAModal, setShowGPAModal] = useState(false);
  const [showFocusModal, setShowFocusModal] = useState(false);
  const [showAIModal, setShowAIModal] = useState(false);

  // Dropdown States
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLElement>(null);

  // Handle Scroll Effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMobileMenuOpen]);

  const handleNavClick = (page: Page) => {
    navigateTo(page);
    setIsMobileMenuOpen(false);
    setActiveDropdown(null);
  };
  
  const handleLoginSuccess = (name: string) => {
      login(name);
      navigateTo('dashboard');
      setIsMobileMenuOpen(false);
  };

  const toggleDropdown = (name: string) => {
      if (activeDropdown === name) {
          setActiveDropdown(null);
      } else {
          setActiveDropdown(name);
      }
  };

  const MobileNavLink: React.FC<{ page: Page; label: string; icon?: React.ReactNode; onClick?: () => void }> = ({ page, label, icon, onClick }) => (
    <button
        onClick={() => {
            if (onClick) onClick();
            else handleNavClick(page);
        }}
        className={`flex items-center gap-4 text-base font-medium w-full p-4 rounded-xl transition-all ${
            currentPage === page
            ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
            : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
        }`}
    >
        {icon && <span className={`${currentPage === page ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500'}`}>{icon}</span>}
        {label}
    </button>
  );

  return (
    <>
      <header 
        className={`sticky top-0 z-40 w-full transition-all duration-300 border-b
        ${isScrolled
          ? 'bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border-gray-200 dark:border-gray-800 shadow-sm py-2' 
          : 'bg-white dark:bg-gray-900 border-transparent py-4'}`}
      >
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex justify-between items-center">
            
            {/* Logo Area */}
            <div className="flex items-center gap-2 md:gap-3 cursor-pointer group" onClick={() => handleNavClick(isAuthenticated ? 'dashboard' : 'home')}>
                <div className="bg-gradient-to-tr from-blue-600 to-cyan-500 p-2 rounded-xl shadow-lg shadow-blue-500/20 transition-transform group-hover:rotate-6 group-hover:scale-105">
                    <ChartBarIcon className="h-6 w-6 text-white" />
                </div>
                <div className="flex flex-col">
                    <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white leading-none">
                      Bunk<span className="text-blue-600 dark:text-blue-400">Control</span>
                    </h1>
                    <span className="text-[10px] font-semibold text-gray-500 dark:text-gray-400 tracking-wider uppercase hidden sm:block">Academic Strategist</span>
                </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1 bg-gray-50 dark:bg-gray-800/50 p-1 rounded-full border border-gray-200 dark:border-gray-700/50" ref={dropdownRef}>
              <button 
                onClick={() => handleNavClick(isAuthenticated ? 'dashboard' : 'home')}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${currentPage === 'dashboard' || currentPage === 'home' ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}
              >
                Dashboard
              </button>

              {/* Tools Dropdown */}
              <div className="relative">
                  <button 
                    onClick={() => toggleDropdown('tools')}
                    className={`px-4 py-2 rounded-full text-sm font-semibold transition-all flex items-center gap-1 ${activeDropdown === 'tools' ? 'text-blue-600 dark:text-blue-400 bg-gray-100 dark:bg-gray-700/50' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}
                  >
                    Toolkit <svg className={`w-3 h-3 transition-transform ${activeDropdown === 'tools' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                  </button>
                  
                  {activeDropdown === 'tools' && (
                      <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-64 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-2 overflow-hidden animate-scale-in origin-top">
                          <button onClick={() => { setShowGPAModal(true); setActiveDropdown(null); }} className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 text-left group transition-colors">
                              <div className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-lg text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform"><CalculatorIcon className="h-5 w-5" /></div>
                              <div><div className="font-semibold text-gray-900 dark:text-white text-sm">GPA Calculator</div><div className="text-xs text-gray-500">Predict your grades</div></div>
                          </button>
                          <button onClick={() => { setShowFocusModal(true); setActiveDropdown(null); }} className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 text-left group transition-colors">
                              <div className="bg-red-100 dark:bg-red-900/30 p-2 rounded-lg text-red-600 dark:text-red-400 group-hover:scale-110 transition-transform"><ClockIcon className="h-5 w-5" /></div>
                              <div><div className="font-semibold text-gray-900 dark:text-white text-sm">Focus Timer</div><div className="text-xs text-gray-500">Pomodoro study mode</div></div>
                          </button>
                          <button onClick={() => { setShowAIModal(true); setActiveDropdown(null); }} className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 text-left group transition-colors">
                              <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform"><RobotIcon className="h-5 w-5" /></div>
                              <div><div className="font-semibold text-gray-900 dark:text-white text-sm">AI Assistant</div><div className="text-xs text-gray-500">Ask attendance queries</div></div>
                          </button>
                      </div>
                  )}
              </div>

              {/* Resources Dropdown */}
              <div className="relative">
                  <button 
                    onClick={() => toggleDropdown('resources')}
                    className={`px-4 py-2 rounded-full text-sm font-semibold transition-all flex items-center gap-1 ${activeDropdown === 'resources' ? 'text-blue-600 dark:text-blue-400 bg-gray-100 dark:bg-gray-700/50' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}
                  >
                    Resources <svg className={`w-3 h-3 transition-transform ${activeDropdown === 'resources' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                  </button>
                  
                  {activeDropdown === 'resources' && (
                      <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-64 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-2 overflow-hidden animate-scale-in origin-top">
                          <button onClick={() => handleNavClick('resources')} className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 text-left group transition-colors">
                              <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-lg text-green-600 dark:text-green-400 group-hover:scale-110 transition-transform"><BookIcon className="h-5 w-5" /></div>
                              <div><div className="font-semibold text-gray-900 dark:text-white text-sm">Student Hub</div><div className="text-xs text-gray-500">Guides & Articles</div></div>
                          </button>
                          <button onClick={() => handleNavClick('help')} className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 text-left group transition-colors">
                              <div className="bg-yellow-100 dark:bg-yellow-900/30 p-2 rounded-lg text-yellow-600 dark:text-yellow-400 group-hover:scale-110 transition-transform"><TargetIcon className="h-5 w-5" /></div>
                              <div><div className="font-semibold text-gray-900 dark:text-white text-sm">Pro Tips & Hacks</div><div className="text-xs text-gray-500">App User Guide</div></div>
                          </button>
                      </div>
                  )}
              </div>
            </nav>
            
            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-3">
                {isAuthenticated && (
                  <button
                    onClick={togglePrivacyMode}
                    className={`p-2.5 rounded-full transition-colors ${
                      privacyMode 
                        ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'
                        : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                    title={privacyMode ? "Disable Incognito Mode" : "Enable Incognito Mode"}
                  >
                    {privacyMode ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                  </button>
                )}

                <button
                  onClick={toggleTheme}
                  className="p-2.5 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  title="Toggle Theme"
                >
                  {theme === 'dark' ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
                </button>

                <div className="h-6 w-px bg-gray-200 dark:bg-gray-700 mx-1"></div>

                {!isAuthenticated ? (
                    <button
                      onClick={() => setIsLoginModalOpen(true)}
                      className="text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 px-5 py-2.5 rounded-full shadow-lg shadow-blue-500/30 transition-all hover:scale-105 active:scale-95"
                    >
                      Sign In
                    </button>
                ) : (
                    <div className="flex items-center gap-3">
                        <div className="flex flex-col items-end">
                            <span className="text-sm font-bold text-gray-900 dark:text-white leading-none">{user?.name}</span>
                            <button onClick={logout} className="text-[10px] text-gray-500 hover:text-red-500 font-medium">Log out</button>
                        </div>
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm shadow-md">
                            {user?.name.charAt(0).toUpperCase()}
                        </div>
                    </div>
                )}
            </div>

            {/* Mobile Toggle */}
            <div className="flex items-center gap-3 md:hidden">
               {isAuthenticated && (
                 <button
                    onClick={togglePrivacyMode}
                    className={`p-2 rounded-full transition-colors ${
                      privacyMode ? 'text-purple-500 bg-purple-50 dark:bg-purple-900/20' : 'text-gray-500 dark:text-gray-400'
                    }`}
                  >
                    {privacyMode ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                  </button>
               )}
               <button 
                className="p-2 text-gray-600 dark:text-gray-300 focus:outline-none hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                onClick={() => setIsMobileMenuOpen(true)}
                aria-label="Open menu"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Modals */}
      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
        onLogin={handleLoginSuccess}
      />
      
      {showGPAModal && <GPACalculatorModal onClose={() => setShowGPAModal(false)} />}
      {showFocusModal && <FocusModeModal onClose={() => setShowFocusModal(false)} />}
      {showAIModal && <AIAssistantModal onClose={() => setShowAIModal(false)} subjects={[]} />} {/* Subjects passed empty here, usually populated in Dashboard */}

      {/* Mobile Menu Drawer */}
      <div 
        className={`fixed inset-0 z-50 transition-colors duration-300 ${
          isMobileMenuOpen ? 'bg-black/60 backdrop-blur-sm pointer-events-auto' : 'bg-transparent pointer-events-none'
        }`}
        onClick={() => setIsMobileMenuOpen(false)}
      >
        <div 
            className={`absolute top-0 right-0 h-full w-[85%] max-w-sm bg-white dark:bg-gray-900 shadow-2xl transform transition-transform duration-300 ease-out border-l border-gray-200 dark:border-gray-800 flex flex-col ${
            isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
            }`}
            onClick={e => e.stopPropagation()}
        >
            <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                        {isAuthenticated ? <span className="font-bold text-lg">{user?.name.charAt(0)}</span> : <ChartBarIcon className="h-6 w-6" />}
                    </div>
                    <div>
                        <p className="font-bold text-gray-900 dark:text-white text-lg">{isAuthenticated ? user?.name : 'Guest'}</p>
                        <p className="text-xs text-gray-500">{isAuthenticated ? 'Pro Member' : 'Welcome!'}</p>
                    </div>
                </div>
                <button 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 bg-gray-100 dark:bg-gray-800 rounded-full"
                >
                    <XIcon className="h-5 w-5" />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-6">
                <div className="space-y-2">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider pl-2">Menu</p>
                    <MobileNavLink page="dashboard" label="Dashboard" icon={<ChartBarIcon className="h-5 w-5" />} />
                    <MobileNavLink page="resources" label="Guides & Resources" icon={<BookIcon className="h-5 w-5" />} />
                    <MobileNavLink page="help" label="Pro Tips & Hacks" icon={<TargetIcon className="h-5 w-5" />} />
                </div>

                <div className="space-y-2">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider pl-2">Tools</p>
                    <button onClick={() => { setShowGPAModal(true); setIsMobileMenuOpen(false); }} className="flex items-center gap-4 text-base font-medium w-full p-4 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all">
                        <span className="text-purple-500"><CalculatorIcon className="h-5 w-5" /></span> GPA Calculator
                    </button>
                    <button onClick={() => { setShowFocusModal(true); setIsMobileMenuOpen(false); }} className="flex items-center gap-4 text-base font-medium w-full p-4 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all">
                        <span className="text-red-500"><ClockIcon className="h-5 w-5" /></span> Focus Timer
                    </button>
                    <button onClick={() => { setShowAIModal(true); setIsMobileMenuOpen(false); }} className="flex items-center gap-4 text-base font-medium w-full p-4 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all">
                        <span className="text-blue-500"><RobotIcon className="h-5 w-5" /></span> AI Assistant
                    </button>
                </div>

                <div className="space-y-2">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider pl-2">App</p>
                    <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                        <span className="text-gray-600 dark:text-gray-300 font-medium flex items-center gap-4">
                            {theme === 'dark' ? <MoonIcon className="h-5 w-5" /> : <SunIcon className="h-5 w-5" />} 
                            Dark Mode
                        </span>
                        <button 
                            onClick={toggleTheme} 
                            className={`w-12 h-6 rounded-full p-1 transition-colors ${theme === 'dark' ? 'bg-blue-600' : 'bg-gray-300'}`}
                        >
                            <div className={`w-4 h-4 rounded-full bg-white transition-transform ${theme === 'dark' ? 'translate-x-6' : 'translate-x-0'}`}></div>
                        </button>
                    </div>
                </div>
            </div>

            <div className="p-5 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50">
                {!isAuthenticated ? (
                    <button 
                        onClick={() => { setIsMobileMenuOpen(false); setIsLoginModalOpen(true); }}
                        className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl shadow-lg shadow-blue-500/20 active:scale-95 transition-transform"
                    >
                        Sign In / Get Started
                    </button>
                ) : (
                    <button 
                        onClick={() => { logout(); navigateTo('home'); setIsMobileMenuOpen(false); }}
                        className="w-full bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 font-bold py-3 rounded-xl flex items-center justify-center gap-2 active:scale-95 transition-transform"
                    >
                        <LogoutIcon className="h-5 w-5" /> Sign Out
                    </button>
                )}
            </div>
        </div>
      </div>
    </>
  );
};

export default Header;
