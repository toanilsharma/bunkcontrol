
import React, { useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const PrivacyPage: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white flex flex-col transition-colors duration-300">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 p-8 md:p-12 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
            <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">Privacy Policy</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">Last updated: July 27, 2024</p>
            
            <div className="prose dark:prose-invert max-w-none space-y-6 text-gray-700 dark:text-gray-300">
                <p>
                    This Privacy Policy explains how Bunk Control ("we," "us," or "our") handles information when you use our application (the "Service"). Your privacy is our top priority. Our service is fundamentally designed to be private, with all core attendance data stored locally on your device.
                </p>
                
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-6">1. Data We Do Not Collect</h2>
                <p>
                    Bunk Control is a client-side application. This means <strong>we do not have a backend server</strong> to store your personal data. All information you enter, including subject names, attendance records, and required percentages, is stored exclusively on your device's local storage.
                </p>
                <p>We do not collect, store, transmit, or have any access to your subject and attendance data.</p>

                <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-6">2. Data Stored Locally On Your Device</h2>
                <p>
                    The Service uses your browser's <code>localStorage</code> to save your data, allowing it to persist between sessions. This data remains on your computer and is never sent to us. If you clear your browser's data, this information will be permanently deleted. You are responsible for the data you create.
                </p>

                <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-6">3. Third-Party Services</h2>
                <p>We use third-party services to provide authentication and to display advertisements, which helps keep Bunk Control free.</p>
                <ul className="list-disc list-inside pl-4 space-y-2">
                    <li>
                        <strong>Google Sign-In:</strong> We use Google Sign-In for authentication. When you sign in, you are subject to <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Google's Privacy Policy</a>. We only receive a confirmation of successful authentication to grant you access; we do not store your Google profile information.
                    </li>
                    <li>
                        <strong>Google AdSense:</strong> We use Google AdSense to show ads. Google and its partners may use cookies (including the DoubleClick cookie) to serve ads based on your prior visits to this and other websites.
                    </li>
                </ul>

                <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-6">4. How to Opt-Out of Personalized Advertising</h2>
                <p>
                    You can opt out of personalized advertising by visiting Google's <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Ads Settings</a>. Alternatively, you can opt out of a third-party vendor's use of cookies for personalized advertising by visiting <a href="http://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">www.aboutads.info/choices</a>.
                </p>
                
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-6">5. Data Security</h2>
                <p>
                    While your data is stored locally, we encourage you to use a secure computer and browser. Since the data resides on your device, you are responsible for its physical and digital security.
                </p>

                <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-6">6. Children's Privacy</h2>
                <p>Our Service is not intended for children under the age of 13. We do not knowingly collect personally identifiable information from children.</p>

                <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-6">7. Changes to This Privacy Policy</h2>
                <p>
                    We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. We encourage you to review this Privacy Policy periodically for any changes.
                </p>
            </div>
        </div>
      </main>
      <Footer variant="page" />
    </div>
  );
};

export default PrivacyPage;
