import React from 'react';
import { ChartBarIcon, BrainIcon, TargetIcon, ShieldCheckIcon } from '../components/icons';
import { useAuth } from '../contexts/AuthContext';

interface WelcomePageProps {
  onFinish: () => void;
}

const WelcomePage: React.FC<WelcomePageProps> = ({ onFinish }) => {
  const { user } = useAuth();
  
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-4xl mx-auto bg-gray-800 rounded-xl shadow-2xl p-8 md:p-12 animate-fade-in">
        
        <div className="text-center mb-8">
          <ChartBarIcon className="h-12 w-12 text-blue-400 mx-auto mb-4" />
          <h1 className="text-3xl md:text-4xl font-bold text-white">
            Welcome to Bunk Control{user?.name ? `, ${user.name}` : ''}!
          </h1>
          <p className="text-lg text-gray-300 mt-2">Your new strategic partner for academic success.</p>
        </div>

        <div className="space-y-8 text-left">
          <div>
            <h2 className="text-2xl font-semibold text-blue-400 mb-4">What is this for?</h2>
            <p className="text-gray-300 leading-relaxed">
              Bunk Control helps you smartly manage your college attendance. It's not about encouraging you to skip class, but about giving you the data to make informed decisions. Know exactly where you stand so you can balance your academic responsibilities and personal life without stress.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-green-400 mb-4">How to Get Started</h2>
            <ol className="list-decimal list-inside space-y-3 text-gray-300">
              <li><span className="font-semibold text-white">Add Your Subjects:</span> Go to your dashboard and click "Add Subject". Enter the name and the required attendance percentage.</li>
              <li><span className="font-semibold text-white">Track As You Go:</span> After each class, simply mark yourself as 'Present', 'Absent', or if the class was 'Cancelled'.</li>
              <li><span className="font-semibold text-white">Check Your Status:</span> The app instantly calculates your attendance and shows your status (Safe, Borderline, or Danger Zone) for each subject.</li>
            </ol>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-yellow-400 mb-4">Key Benefits</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex items-start gap-4">
                    <BrainIcon className="h-8 w-8 text-yellow-400 flex-shrink-0 mt-1" />
                    <div>
                        <h3 className="font-bold text-white">Informed Decisions</h3>
                        <p className="text-sm text-gray-400">Know exactly how many classes you can miss or must attend.</p>
                    </div>
                </div>
                <div className="flex items-start gap-4">
                    <TargetIcon className="h-8 w-8 text-yellow-400 flex-shrink-0 mt-1" />
                    <div>
                        <h3 className="font-bold text-white">Stay on Target</h3>
                        <p className="text-sm text-gray-400">Visual cues help you see which subjects need your attention.</p>
                    </div>
                </div>
                 <div className="flex items-start gap-4">
                    <ShieldCheckIcon className="h-8 w-8 text-yellow-400 flex-shrink-0 mt-1" />
                    <div>
                        <h3 className="font-bold text-white">100% Private</h3>
                        <p className="text-sm text-gray-400">All your data is stored securely on your device, not on our servers.</p>
                    </div>
                </div>
            </div>
          </div>
        </div>
        
        <div className="text-center mt-10">
          <button
            onClick={onFinish}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition-transform transform hover:scale-105"
          >
            Let's Go!
          </button>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;