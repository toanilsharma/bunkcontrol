
import React, { useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useNav } from '../contexts/NavigationContext';
import { articles } from '../data/articles';
import { ArrowRightIcon } from '../components/icons';

const ResourcesPage: React.FC = () => {
  const { navigateTo } = useNav();
  const HeroIcon = articles[0].icon;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white flex flex-col transition-colors duration-300">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-black mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
                Student Success Hub
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed">
                Expert guides, cheat sheets, and strategies to hack your college attendance. Learn the rules, then play the game.
            </p>
        </div>
        
        {/* Featured / Hero Article (First one) */}
        <div 
            onClick={() => navigateTo('article', { id: articles[0].id })}
            className="group relative bg-white dark:bg-gray-800 rounded-3xl p-6 md:p-10 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-gray-700 cursor-pointer mb-12 overflow-hidden animate-slide-up"
        >
             <div className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-br ${articles[0].color} opacity-10 rounded-bl-full transform translate-x-1/3 -translate-y-1/3 transition-transform group-hover:scale-110`}></div>
             
             <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start">
                 <div className={`p-4 rounded-2xl bg-gradient-to-br ${articles[0].color} text-white shadow-lg`}>
                     <HeroIcon className="h-10 w-10" />
                 </div>
                 <div className="flex-1">
                     <div className="flex items-center gap-3 text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">
                         <span className="bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-full">Featured</span>
                         <span>{articles[0].readTime}</span>
                     </div>
                     <h2 className="text-3xl font-bold mb-3 text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                         {articles[0].title}
                     </h2>
                     <p className="text-gray-600 dark:text-gray-400 text-lg mb-6 max-w-2xl">
                         {articles[0].subtitle}
                     </p>
                     <span className="text-blue-600 dark:text-blue-400 font-bold flex items-center gap-2 group-hover:translate-x-2 transition-transform">
                         Read Article <ArrowRightIcon className="h-5 w-5" />
                     </span>
                 </div>
             </div>
        </div>

        {/* Grid of remaining articles */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.slice(1).map((article, index) => {
                const ArticleIcon = article.icon;
                return (
                <div 
                    key={article.id}
                    onClick={() => navigateTo('article', { id: article.id })}
                    className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm hover:shadow-xl border border-gray-100 dark:border-gray-700 transition-all duration-300 cursor-pointer group flex flex-col h-full animate-scale-in"
                    style={{ animationDelay: `${index * 100}ms` }}
                >
                    <div className="flex items-start justify-between mb-4">
                        <div className={`p-3 rounded-xl bg-gradient-to-br ${article.color} text-white`}>
                            <ArticleIcon className="h-6 w-6" />
                        </div>
                        <span className="text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded-full">
                            {article.category}
                        </span>
                    </div>
                    
                    <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                        {article.title}
                    </h3>
                    
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-6 flex-grow line-clamp-3">
                        {article.subtitle}
                    </p>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 border-t border-gray-100 dark:border-gray-700 pt-4 mt-auto">
                        <span>{article.date}</span>
                        <span className="flex items-center gap-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            Read <ArrowRightIcon className="h-4 w-4" />
                        </span>
                    </div>
                </div>
            )})}
        </div>
      </main>
      
      <Footer variant="page" />
    </div>
  );
};

export default ResourcesPage;
