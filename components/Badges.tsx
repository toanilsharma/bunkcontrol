
import React from 'react';
import { Subject } from '../types';
import { BadgeIcon, SparklesIcon, ShieldCheckIcon, TargetIcon } from './icons';

interface BadgesProps {
  subjects: Subject[];
}

const Badges: React.FC<BadgesProps> = ({ subjects }) => {
  const totalAttended = subjects.reduce((acc, curr) => acc + curr.attended, 0);
  const totalClasses = subjects.reduce((acc, curr) => acc + curr.attended + curr.absent, 0);
  const overallPct = totalClasses > 0 ? (totalAttended / totalClasses) * 100 : 0;
  
  const safeSubjects = subjects.filter(s => {
    const t = s.attended + s.absent;
    const p = t > 0 ? (s.attended/t)*100 : 0;
    return p >= s.requiredPercentage;
  }).length;

  const allSafe = subjects.length > 0 && safeSubjects === subjects.length;

  const badges = [
    {
        id: 'starter',
        name: 'Freshman',
        desc: 'Added your first subject',
        unlocked: subjects.length > 0,
        icon: <TargetIcon className="h-6 w-6" />,
        color: 'bg-blue-500'
    },
    {
        id: 'safe-zone',
        name: 'Safe Zone',
        desc: 'Maintained 75% overall',
        unlocked: overallPct >= 75,
        icon: <ShieldCheckIcon className="h-6 w-6" />,
        color: 'bg-green-500'
    },
    {
        id: 'nerd',
        name: 'Academic Weapon',
        desc: '100% attendance in a subject',
        unlocked: subjects.some(s => s.attended > 0 && s.absent === 0),
        icon: <SparklesIcon className="h-6 w-6" />,
        color: 'bg-purple-500'
    },
    {
        id: 'perfect',
        name: 'Bunk King',
        desc: 'All subjects are safe',
        unlocked: allSafe,
        icon: <BadgeIcon className="h-6 w-6" />,
        color: 'bg-yellow-500'
    }
  ];

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg mb-6 shadow-md dark:shadow-lg border border-gray-200 dark:border-gray-700 animate-fade-in">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <BadgeIcon className="h-6 w-6 text-yellow-500" />
            Your Badges
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {badges.map(badge => (
                <div 
                    key={badge.id} 
                    className={`relative p-4 rounded-xl border ${badge.unlocked ? 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/30' : 'border-dashed border-gray-300 dark:border-gray-700 opacity-50'} flex flex-col items-center text-center transition-all`}
                >
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white mb-3 shadow-md ${badge.unlocked ? badge.color : 'bg-gray-400'}`}>
                        {badge.icon}
                    </div>
                    <h3 className="font-bold text-gray-900 dark:text-white text-sm">{badge.name}</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{badge.desc}</p>
                    
                    {!badge.unlocked && (
                        <div className="absolute inset-0 bg-gray-100/50 dark:bg-gray-900/50 backdrop-blur-[1px] flex items-center justify-center rounded-xl">
                            <span className="text-xs font-bold bg-gray-800 text-white px-2 py-1 rounded">Locked</span>
                        </div>
                    )}
                </div>
            ))}
        </div>
    </div>
  );
};

export default Badges;
