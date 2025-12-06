
import React from 'react';
import { FacebookIcon, TwitterIcon, WhatsappIcon, InstagramIcon, DiscordIcon, MailIcon, ChartBarIcon } from './icons';
import { useNav } from '../contexts/NavigationContext';

const appUrl = 'https://bunkcontrol.app'; 
const shareText = `Check out Bunk Control! 🚀 The smartest way to track college attendance.`;
const encodedUrl = encodeURIComponent(appUrl);
const encodedText = encodeURIComponent(shareText);

const socialLinks = [
    { name: 'Twitter', Icon: TwitterIcon, url: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}` },
    { name: 'WhatsApp', Icon: WhatsappIcon, url: `https://wa.me/?text=${encodedText}%20${encodedUrl}` },
    { name: 'Instagram', Icon: InstagramIcon, url: 'https://instagram.com' },
    { name: 'Discord', Icon: DiscordIcon, url: 'https://discord.com' },
    { name: 'Email', Icon: MailIcon, url: `mailto:?subject=Check%20out%20Bunk%20Control&body=${encodedText}%20${encodedUrl}` },
];

interface FooterProps {
  variant?: 'page' | 'dashboard';
}

const Footer: React.FC<FooterProps> = () => {
    const { navigateTo } = useNav();
    
    const FooterLink = ({ label, page, params }: { label: string, page: any, params?: any }) => (
        <button 
            onClick={() => navigateTo(page, params)}
            className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm text-left"
        >
            {label}
        </button>
    );

    return (
        <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 transition-colors duration-300">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
                    {/* Brand Column */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 group cursor-pointer" onClick={() => navigateTo('home')}>
                            <div className="bg-blue-600 p-1.5 rounded-lg text-white">
                                <ChartBarIcon className="h-5 w-5" />
                            </div>
                            <span className="text-xl font-bold text-gray-900 dark:text-white">Bunk<span className="text-blue-600 dark:text-blue-400">Control</span></span>
                        </div>
                        <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                            The #1 privacy-first attendance tracker for students. Calculate, predict, and manage your academic life without the stress.
                        </p>
                        <div className="flex gap-4 pt-2">
                            {socialLinks.map(({ name, Icon, url }) => (
                                <a
                                    key={name}
                                    href={url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                                    aria-label={name}
                                >
                                    <Icon className="h-5 w-5" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Product Column */}
                    <div className="flex flex-col gap-3">
                        <h3 className="font-bold text-gray-900 dark:text-white mb-2">Product</h3>
                        <FooterLink label="Dashboard" page="dashboard" />
                        <FooterLink label="GPA Calculator" page="dashboard" params={{ tool: 'gpa' }} />
                        <FooterLink label="Focus Timer" page="dashboard" params={{ tool: 'focus' }} />
                        <FooterLink label="Import Timetable" page="dashboard" params={{ tool: 'import' }} />
                        <FooterLink label="What-If Calculator" page="dashboard" />
                    </div>

                    {/* Resources Column */}
                    <div className="flex flex-col gap-3">
                        <h3 className="font-bold text-gray-900 dark:text-white mb-2">Resources</h3>
                        <FooterLink label="Student Success Hub" page="resources" />
                        <FooterLink label="Attendance Guide" page="help" />
                        <FooterLink label="How to Negotiate" page="article" params={{ id: 'talk-to-professors' }} />
                        <FooterLink label="75% Rule Explained" page="article" params={{ id: '75-percent-rule-explained' }} />
                        <FooterLink label="Safe Skip Cheat Sheet" page="article" params={{ id: 'safely-skip-guide' }} />
                    </div>

                    {/* Company Column */}
                    <div className="flex flex-col gap-3">
                        <h3 className="font-bold text-gray-900 dark:text-white mb-2">Company</h3>
                        <FooterLink label="About Us" page="about" />
                        <FooterLink label="Contact Support" page="contact" />
                        <FooterLink label="Privacy Policy" page="privacy" />
                        <FooterLink label="Terms of Service" page="terms" />
                    </div>
                </div>

                <div className="border-t border-gray-100 dark:border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-gray-500 dark:text-gray-500">
                        © {new Date().getFullYear()} Bunk Control. Made with 💙 for students. <span className="text-yellow-500 font-bold ml-1">Created By A Sharma</span>
                    </p>
                    <div className="flex items-center gap-6 text-sm">
                        <div className="flex items-center gap-2 text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-3 py-1 rounded-full text-xs font-semibold">
                            <span className="relative flex h-2 w-2">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                            </span>
                            All Systems Operational
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
