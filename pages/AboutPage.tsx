
import React, { useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SEO from '../components/SEO';
import { useNav } from '../contexts/NavigationContext';

const AboutPage: React.FC = () => {
  const { navigateTo } = useNav();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white flex flex-col transition-colors duration-300">
      <SEO 
        title="About Us | Bunk Control" 
        description="Learn about the mission of Bunk Control: empowering students to manage their attendance smartly and stress-free."
        canonical="/?page=about"
      />
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 p-8 md:p-12 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
            <h1 className="text-3xl md:text-4xl font-bold mb-8 text-gray-900 dark:text-white border-b pb-4 border-gray-200 dark:border-gray-700">About Bunk Control</h1>
            
            <div className="space-y-6 text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                <p>
                    Welcome to <span className="font-bold text-blue-600 dark:text-blue-400">Bunk Control</span>, your strategic partner in navigating the complexities of college attendance. We believe that with the right information, students can make smarter decisions, balancing their academic responsibilities with personal well-being and other pursuits.
                </p>

                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-2">Our Mission</h2>
                <p>
                    Our goal is simple: to empower students. We're not here to encourage skipping classes, but to provide a clear, data-driven overview of your attendance. By knowing exactly where you stand, you can avoid the stress and uncertainty that comes with managing required percentages. Bunk Control is about giving you the control to make informed choices, ensuring you meet your academic requirements without unnecessary anxiety.
                </p>

                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-2">The Story</h2>
                <p>
                    This version of Bunk Control was created by <span className="font-semibold">A Sharma</span>, inspired by the original utility of bunkcontrol.co.in. As a student, the creator understood the need for a modern, private, and intuitive tool to manage attendance. The focus was on building a fast, reliable, and completely client-side application. This "privacy-first" approach means your data is yours alone—stored securely on your device and never on our servers.
                </p>

                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-2">Get in Touch</h2>
                <p>
                    We are always looking for ways to improve and would love to hear your feedback, suggestions, or questions.
                </p>
            </div>

            <div className="mt-10 text-center">
                 <button 
                    onClick={() => navigateTo('contact')} 
                    className="text-blue-600 dark:text-blue-400 font-semibold hover:underline"
                >
                    Contact Us
                </button>
                <span className="mx-2 text-gray-400">|</span>
                <button 
                    onClick={() => navigateTo('home')} 
                    className="text-blue-600 dark:text-blue-400 font-semibold hover:underline"
                >
                    Back to Home
                </button>
            </div>
        </div>
      </main>
      <Footer variant="page" />
    </div>
  );
};

export default AboutPage;
