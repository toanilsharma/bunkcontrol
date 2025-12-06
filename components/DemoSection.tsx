import React from 'react';
import { MockSubjectCard, MockCalculator } from './Mocks';
import { ArrowRightIcon, CursorClickIcon } from './icons';
import { useNav } from '../contexts/NavigationContext';

const DemoSection: React.FC = () => {
  const { navigateTo } = useNav();

  return (
    <div className="py-20 bg-gray-50 dark:bg-gray-900/50 transition-colors duration-300">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">See It In Action</h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            These demos are interactive. Click buttons and type numbers to see how it works!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          
          {/* Feature 1: Tracking Teaser */}
          <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                <div className="relative bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-100 dark:border-gray-800">
                    <div className="absolute -right-2 top-1/2 z-10 hidden md:block animate-bounce">
                         <div className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded shadow-lg flex items-center gap-1">
                            <CursorClickIcon className="h-3 w-3" /> Try Me!
                         </div>
                    </div>
                    <MockSubjectCard />
                </div>
          </div>

          <div className="space-y-6">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 text-sm">1</span>
                  Effortless Tracking
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
                  Your dashboard gives you a crystal-clear view of your academic health. Green means you are safe, Red means you need to attend. It's that simple.
              </p>
              <ul className="space-y-3">
                  <li className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                      <ArrowRightIcon className="h-5 w-5 text-green-500" />
                      <span>Instantly calculate current percentage</span>
                  </li>
                  <li className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                      <ArrowRightIcon className="h-5 w-5 text-green-500" />
                      <span>Track Attended, Missed, and Cancelled classes</span>
                  </li>
              </ul>
          </div>

          {/* Feature 2: Calculator Teaser */}
          <div className="order-4 lg:order-3 space-y-6">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400 text-sm">2</span>
                  Smart Forecasting
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
                  Planning a vacation? Use the <strong>'What If' Calculator</strong> to predict your attendance percentage before you decide to skip.
              </p>
              <button 
                onClick={() => navigateTo('help')}
                className="text-blue-600 dark:text-blue-400 font-semibold hover:underline inline-flex items-center gap-1"
              >
                See all features in the Help Guide <ArrowRightIcon className="h-4 w-4" />
              </button>
          </div>

          <div className="order-3 lg:order-4 relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                <div className="relative bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-100 dark:border-gray-800">
                    <MockCalculator />
                </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DemoSection;