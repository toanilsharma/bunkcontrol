
import React, { useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SEO from '../components/SEO';

const TermsPage: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white flex flex-col transition-colors duration-300">
      <SEO 
        title="Terms of Service | Bunk Control" 
        description="Review the Terms of Service for using Bunk Control. Appropriate usage, data responsibility, and liability limitations."
        canonical="/?page=terms"
      />
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 p-8 md:p-12 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
            <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">Terms of Service</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">Last updated: July 27, 2024</p>

            <div className="prose dark:prose-invert max-w-none space-y-6 text-gray-700 dark:text-gray-300">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-6">1. Welcome to Bunk Control</h2>
                <p>
                    By accessing and using our application, Bunk Control (the "Service"), you agree to be bound by these Terms of Service ("Terms"). If you disagree with any part of the terms, then you may not access the Service.
                </p>

                <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-6">2. Use of Our Service</h2>
                <p>
                    Bunk Control is a client-side tool for tracking academic attendance. All data you enter is stored locally in your browser. You are responsible for the accuracy of your data and for maintaining its security on your device. You agree not to use the Service for any illegal or unauthorized purpose.
                </p>
                
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-6">3. Third-Party Links and Services</h2>
                <p>
                    Our Service may display advertisements from third parties (e.g., Google AdSense) and may contain links to third-party web sites or services that are not owned or controlled by us. We have no control over, and assume no responsibility for, the content, privacy policies, or practices of any third-party web sites or services.
                </p>

                <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-6">4. Intellectual Property</h2>
                <p>
                    The Service and its original content, features, and functionality are and will remain the exclusive property of Bunk Control and its licensors.
                </p>

                <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-6">5. Disclaimer of Warranties</h2>
                <p>
                    The Service is provided on an "AS IS" and "AS AVAILABLE" basis. We do not warrant that the service will be uninterrupted, secure, or error-free. The calculations are based on the data you provide; we are not responsible for any inaccuracies or academic consequences resulting from your use of this tool.
                </p>

                <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-6">6. Limitation of Liability</h2>
                <p>
                    In no event shall Bunk Control or its creators be liable for any indirect, incidental, special, or consequential damages arising out of the use of or inability to use the Service.
                </p>

                <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-6">7. Termination</h2>
                <p>
                    We may terminate or suspend access to our Service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
                </p>
                
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-6">8. Changes to Terms</h2>
                <p>
                    We reserve the right to modify these terms at any time. By continuing to access or use our Service after those revisions become effective, you agree to be bound by the revised terms.
                </p>
            </div>
        </div>
      </main>
      <Footer variant="page" />
    </div>
  );
};

export default TermsPage;
