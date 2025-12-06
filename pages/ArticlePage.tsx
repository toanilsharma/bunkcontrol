import React, { useEffect, useState, useMemo } from 'react';
import { useNav } from '../contexts/NavigationContext';
import { articles } from '../data/articles';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { ClockIcon, ShareIcon, CheckCircleIcon, BookIcon } from '../components/icons';

const ArticlePage: React.FC = () => {
  const { currentArticleId, navigateTo } = useNav();
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState<string>('');
  const [isLiked, setIsLiked] = useState(false);

  const article = articles.find(a => a.id === currentArticleId);

  // Extract headings for Table of Contents
  const tableOfContents = useMemo(() => {
    if (!article) return [];
    return article.content
      .filter(section => section.title)
      .map((section, index) => ({
        id: `section-${index}`,
        title: section.title
      }));
  }, [article]);

  useEffect(() => {
    if (!article) {
        navigateTo('resources');
    }
    window.scrollTo(0, 0);
  }, [article, navigateTo]);

  useEffect(() => {
    const handleScroll = () => {
        const totalScroll = document.documentElement.scrollTop;
        const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scroll = totalScroll / windowHeight;
        setScrollProgress(Number(scroll));

        // Highlight active TOC item
        const headings = tableOfContents.map(t => document.getElementById(t.id));
        let current = '';
        headings.forEach(h => {
            if (h && window.scrollY >= (h.offsetTop - 150)) {
                current = h.id;
            }
        });
        if (current) setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [tableOfContents]);
  
  const handleShare = () => {
      if (navigator.share) {
          navigator.share({
              title: article?.title,
              text: article?.subtitle,
              url: window.location.href,
          });
      } else {
          navigator.clipboard.writeText(window.location.href);
          alert('Link copied to clipboard!');
      }
  };

  const scrollToSection = (id: string) => {
      const element = document.getElementById(id);
      if (element) {
          window.scrollTo({
              top: element.offsetTop - 100, // Offset for sticky header
              behavior: 'smooth'
          });
      }
  };

  // Helper to parse **bold** and *italic* markdown-style formatting
  const renderFormattedText = (text: string) => {
    if (!text) return null;
    
    // Robust regex to split by **bold** sections.
    // [\s\S] matches any character including newlines.
    const parts = text.split(/(\*\*[\s\S]+?\*\*)/g);
    
    return parts.map((part, index) => {
        // Handle Bold
        if (part.startsWith('**') && part.endsWith('**') && part.length >= 4) {
            const content = part.slice(2, -2);
            // Render bold with standard strong tag
            return <strong key={index} className="font-extrabold text-gray-900 dark:text-white">{content}</strong>;
        }
        
        // Handle Italics inside the non-bold parts (simple *text*)
        const italicParts = part.split(/(\*[^\s\*](?:.|\r\n|\n)*?[^\s\*]\*)/g);
        
        if (italicParts.length > 1) {
             return (
                <span key={index}>
                    {italicParts.map((subPart, j) => {
                        if (subPart.startsWith('*') && subPart.endsWith('*') && subPart.length > 2 && !subPart.startsWith('**')) {
                             return <em key={j} className="italic text-gray-800 dark:text-gray-200 bg-yellow-50 dark:bg-yellow-900/10 px-0.5 rounded">{subPart.slice(1, -1)}</em>;
                        }
                        return subPart;
                    })}
                </span>
             );
        }

        return <span key={index}>{part}</span>;
    });
  };

  if (!article) return null;

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300 font-sans selection:bg-blue-100 dark:selection:bg-blue-900">
      {/* Scroll Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1.5 bg-gray-100 dark:bg-gray-800 z-[60]">
        <div 
            className={`h-full bg-gradient-to-r ${article.color}`} 
            style={{ width: `${scrollProgress * 100}%` }}
        ></div>
      </div>

      <Header />
      
      <main className="pb-20">
        {/* Immersive Hero Section */}
        <div className="relative pt-12 pb-16 md:pt-24 md:pb-32 overflow-hidden border-b border-gray-100 dark:border-gray-800">
            <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-[120%] h-full bg-gradient-to-b ${article.color} opacity-5 dark:opacity-10 blur-3xl -z-10 rounded-[50%]`}></div>
            
            <div className="container mx-auto px-4 max-w-4xl text-center relative z-10">
                <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 text-sm font-semibold text-gray-600 dark:text-gray-300 mb-8 animate-fade-in">
                    <span className={`text-transparent bg-clip-text bg-gradient-to-r ${article.color}`}>{article.category}</span>
                    <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600"></span>
                    <span>{article.date}</span>
                </div>
                
                <h1 className="text-4xl md:text-6xl md:leading-tight font-black tracking-tight mb-8 text-gray-900 dark:text-white drop-shadow-sm animate-slide-up">
                    {article.title}
                </h1>
                
                <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 leading-relaxed mb-10 max-w-3xl mx-auto font-light animate-slide-up" style={{ animationDelay: '100ms' }}>
                    {article.subtitle}
                </p>
                
                <div className="flex items-center justify-center gap-8 text-sm md:text-base text-gray-500 dark:text-gray-400 pt-4 w-fit mx-auto animate-slide-up" style={{ animationDelay: '200ms' }}>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center font-bold text-gray-700 dark:text-gray-200 shadow-inner">
                            {article.author.charAt(0)}
                        </div>
                        <div className="text-left">
                            <p className="font-bold text-gray-900 dark:text-white leading-none">{article.author}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">Editor, Bunk Control</p>
                        </div>
                    </div>
                    <div className="h-8 w-px bg-gray-200 dark:bg-gray-700"></div>
                    <div className="flex items-center gap-2">
                        <ClockIcon className="h-5 w-5 text-gray-400" />
                        <span className="font-medium">{article.readTime}</span>
                    </div>
                </div>
            </div>
        </div>

        <div className="container mx-auto px-4 max-w-7xl flex flex-col lg:flex-row gap-12 mt-12">
            {/* Sidebar: Table of Contents (Desktop) */}
            <aside className="hidden lg:block w-64 flex-shrink-0">
                <div className="sticky top-32">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">On this page</h3>
                    <nav className="space-y-1 relative">
                        {/* Active Indicator Line */}
                        <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-800"></div>
                        
                        {tableOfContents.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => scrollToSection(item.id)}
                                className={`block text-left text-sm py-2 pl-4 border-l-2 transition-all duration-200 w-full ${
                                    activeSection === item.id
                                    ? `border-blue-600 text-blue-600 dark:text-blue-400 font-bold bg-blue-50/50 dark:bg-blue-900/10`
                                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:border-gray-300'
                                }`}
                            >
                                {item.title}
                            </button>
                        ))}
                    </nav>
                    
                    <div className="mt-8 pt-8 border-t border-gray-100 dark:border-gray-800">
                        <p className="text-xs text-gray-400 mb-3">Share this guide</p>
                        <div className="flex gap-2">
                            <button onClick={handleShare} className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                                <ShareIcon className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 max-w-3xl mx-auto">
                
                {/* Key Takeaways Box */}
                <div className="mb-12 bg-white dark:bg-gray-800 rounded-2xl p-6 md:p-8 shadow-xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-gray-700 relative overflow-hidden">
                    <div className={`absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b ${article.color}`}></div>
                    <div className="flex items-start gap-4 relative z-10">
                        <div className={`p-3 rounded-xl bg-gradient-to-br ${article.color} text-white shadow-lg`}>
                            <BookIcon className="h-6 w-6" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Key Takeaways</h3>
                            <ul className="space-y-2 text-gray-600 dark:text-gray-300 text-sm md:text-base">
                                <li className="flex items-start gap-2">
                                    <CheckCircleIcon className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                                    <span>Master the math behind the attendance percentage.</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <CheckCircleIcon className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                                    <span>Learn actionable strategies to negotiate with professors.</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <CheckCircleIcon className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                                    <span>Understand the risks and rewards of skipping classes.</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                <article className="prose prose-lg dark:prose-invert prose-slate mx-auto">
                    {article.content.map((section, idx) => {
                        const sectionId = section.title ? `section-${idx}` : undefined;
                        return (
                        <div key={idx} id={sectionId} className="mb-10 scroll-mt-32">
                            {section.title && (
                                <h2 className="text-2xl md:text-3xl font-bold mt-12 mb-6 text-gray-900 dark:text-white tracking-tight">
                                    {section.title}
                                </h2>
                            )}
                            
                            {section.type === 'text' && (
                                <div className="text-gray-700 dark:text-gray-300 leading-8 space-y-6">
                                    {Array.isArray(section.content) ? section.content.map((p, i) => <p key={i} className="mb-4">{renderFormattedText(p)}</p>) : <p>{renderFormattedText(section.content as string)}</p>}
                                </div>
                            )}
                            
                            {section.type === 'list' && Array.isArray(section.content) && (
                                <ul className="space-y-4 my-6">
                                    {section.content.map((item, i) => (
                                        <li key={i} className="flex items-start gap-4 text-gray-700 dark:text-gray-300 leading-7">
                                            <div className={`mt-2.5 w-1.5 h-1.5 rounded-full flex-shrink-0 bg-gray-400 dark:bg-gray-500`}></div>
                                            <span>{renderFormattedText(item)}</span>
                                        </li>
                                    ))}
                                </ul>
                            )}

                            {section.type === 'code' && (
                                <div className="relative group my-8">
                                    <div className="absolute -inset-0.5 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-200"></div>
                                    <div className="relative bg-gray-900 text-gray-100 p-6 rounded-xl font-mono text-sm overflow-x-auto shadow-2xl border border-gray-800">
                                        <div className="flex gap-1.5 mb-4 opacity-50">
                                            <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                            <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                        </div>
                                        <pre className="whitespace-pre-wrap">{section.content}</pre>
                                    </div>
                                </div>
                            )}

                            {section.type === 'callout-info' && (
                                <div className="bg-blue-50 dark:bg-blue-900/10 border-l-4 border-blue-500 p-6 my-8 rounded-r-xl shadow-sm">
                                    <h4 className="text-blue-700 dark:text-blue-300 font-bold mb-2 uppercase text-xs tracking-wider">Did you know?</h4>
                                    <p className="font-medium text-blue-900 dark:text-blue-100 m-0 text-lg leading-relaxed">{renderFormattedText(section.content as string)}</p>
                                </div>
                            )}
                            
                            {section.type === 'callout-warning' && (
                                <div className="bg-red-50 dark:bg-red-900/10 border-l-4 border-red-500 p-6 my-8 rounded-r-xl shadow-sm">
                                    <h4 className="text-red-700 dark:text-red-300 font-bold mb-2 uppercase text-xs tracking-wider">Warning</h4>
                                    <p className="font-medium text-red-900 dark:text-red-100 m-0 text-lg leading-relaxed">{renderFormattedText(section.content as string)}</p>
                                </div>
                            )}
                            
                            {section.type === 'callout-tip' && (
                                <div className="bg-emerald-50 dark:bg-emerald-900/10 border-l-4 border-emerald-500 p-6 my-8 rounded-r-xl shadow-sm flex flex-col md:flex-row gap-4 items-start">
                                    <div className="bg-emerald-100 dark:bg-emerald-900/30 p-2 rounded-lg text-emerald-600 dark:text-emerald-400 flex-shrink-0">
                                        <CheckCircleIcon className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h4 className="text-emerald-700 dark:text-emerald-300 font-bold mb-1 uppercase text-xs tracking-wider">Pro Tip</h4>
                                        <p className="font-medium text-emerald-900 dark:text-emerald-100 m-0 text-lg leading-relaxed">{renderFormattedText(section.content as string)}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    )})}
                </article>

                {/* Floating Action Bar (Mobile) */}
                <div className="fixed bottom-6 right-6 lg:hidden z-50 flex flex-col gap-3">
                    <button 
                        onClick={() => setIsLiked(!isLiked)}
                        className={`p-4 rounded-full shadow-lg transition-all transform active:scale-95 ${isLiked ? 'bg-red-500 text-white' : 'bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-300'}`}
                    >
                        <svg className={`w-6 h-6 ${isLiked ? 'fill-current' : 'fill-none'}`} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                    </button>
                    <button 
                        onClick={handleShare} 
                        className="bg-blue-600 text-white p-4 rounded-full shadow-lg transition-all transform active:scale-95"
                    >
                        <ShareIcon className="h-6 w-6" />
                    </button>
                </div>

                {/* Bottom CTA */}
                <div className="mt-20 relative overflow-hidden rounded-3xl bg-gray-900 text-white p-8 md:p-12 text-center shadow-2xl">
                    <div className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-br ${article.color} opacity-20 blur-3xl rounded-full transform translate-x-1/2 -translate-y-1/2`}></div>
                    <div className="relative z-10">
                        <h3 className="text-3xl font-bold mb-4">Don't let the math stress you out.</h3>
                        <p className="text-gray-300 mb-8 max-w-xl mx-auto text-lg">Use Bunk Control's dashboard to track everything we just talked about automatically.</p>
                        <button
                            onClick={() => navigateTo('dashboard')}
                            className="bg-white text-gray-900 hover:bg-gray-100 font-bold py-4 px-10 rounded-xl shadow-lg transition-transform hover:scale-105"
                        >
                            Open Dashboard
                        </button>
                    </div>
                </div>
            </div>
        </div>
      </main>

      <Footer variant="page" />
    </div>
  );
};

export default ArticlePage;