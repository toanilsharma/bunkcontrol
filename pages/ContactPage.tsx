
import React, { useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SEO from '../components/SEO';
import { MailIcon } from '../components/icons';

const ContactPage: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white flex flex-col transition-colors duration-300">
      <SEO 
        title="Contact Us | Bunk Control" 
        description="Get in touch with the Bunk Control team for feedback, support, or inquiries."
        canonical="/?page=contact"
      />
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12 flex items-center justify-center">
        <div className="max-w-2xl w-full bg-white dark:bg-gray-800 p-8 md:p-12 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 text-center">
            <div className="bg-blue-100 dark:bg-blue-900/30 p-4 rounded-full inline-flex mb-6">
                <MailIcon className="h-10 w-10 text-blue-600 dark:text-blue-400" />
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">Contact Us</h1>
            
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                Have questions, feature requests, or just want to say hello? We'd love to hear from you.
            </p>
            
            <div className="bg-gray-50 dark:bg-gray-700/50 p-6 rounded-xl border border-gray-100 dark:border-gray-600 mb-8">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Email us at</p>
                <a href="mailto:0808miracle@gmail.com" className="text-xl md:text-2xl font-bold text-blue-600 dark:text-blue-400 hover:underline break-all">
                    0808miracle@gmail.com
                </a>
            </div>
            
            <p className="text-sm text-gray-500 dark:text-gray-500">
                We typically reply within 24-48 hours.
            </p>
        </div>
      </main>
      <Footer variant="page" />
    </div>
  );
};

export default ContactPage;
