
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Page = 'home' | 'dashboard' | 'help' | 'about' | 'contact' | 'privacy' | 'terms' | 'resources' | 'article';

interface NavigationContextType {
  currentPage: Page;
  currentArticleId: string | null;
  currentParams: Record<string, string>;
  navigateTo: (page: Page, params?: Record<string, string>) => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export const NavigationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [currentArticleId, setCurrentArticleId] = useState<string | null>(null);
  const [currentParams, setCurrentParams] = useState<Record<string, string>>({});

  // Initialize state from URL query parameter if available
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const params = new URLSearchParams(window.location.search);
        const pageParam = params.get('page') as Page;
        
        // Extract all params into an object
        const paramsObj: Record<string, string> = {};
        params.forEach((value, key) => {
            paramsObj[key] = value;
        });
        setCurrentParams(paramsObj);

        if (pageParam && ['home', 'dashboard', 'help', 'about', 'contact', 'privacy', 'terms', 'resources', 'article'].includes(pageParam)) {
          setCurrentPage(pageParam);
        }
        
        if (params.get('id')) {
            setCurrentArticleId(params.get('id'));
        }
      } catch (e) {
        console.warn('Unable to read initial URL params:', e);
      }
    }
  }, []);

  // Sync URL with state and handle Back button
  useEffect(() => {
    const handlePopState = () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const pageParam = params.get('page') as Page;
        if (pageParam) setCurrentPage(pageParam);
        else setCurrentPage('home');

        setCurrentArticleId(params.get('id'));
        
        const paramsObj: Record<string, string> = {};
        params.forEach((value, key) => {
            paramsObj[key] = value;
        });
        setCurrentParams(paramsObj);

      } catch (e) {
        console.warn('Unable to read URL params on popstate:', e);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Update Page Title
  useEffect(() => {
    const titles: Record<Page, string> = {
      home: 'Home | Bunk Control',
      dashboard: 'Dashboard | Bunk Control',
      help: 'User Guide | Bunk Control',
      about: 'About Us | Bunk Control',
      contact: 'Contact | Bunk Control',
      privacy: 'Privacy Policy | Bunk Control',
      terms: 'Terms of Service | Bunk Control',
      resources: 'Student Resources & Guides | Bunk Control',
      article: 'Article | Bunk Control'
    };
    
    if (currentPage !== 'article') {
        document.title = titles[currentPage] || 'Bunk Control 🚀';
    }
  }, [currentPage]);

  const navigateTo = (page: Page, params?: Record<string, string>) => {
    setCurrentPage(page);
    setCurrentParams(params || {});

    if (page === 'article' && params?.id) {
        setCurrentArticleId(params.id);
    } else {
        setCurrentArticleId(null);
    }
    
    window.scrollTo(0, 0);
    
    try {
        const urlParams = new URLSearchParams();
        if (page !== 'home') urlParams.set('page', page);
        if (params) {
            Object.entries(params).forEach(([key, value]) => {
                urlParams.set(key, value);
            });
        }
        
        const queryString = urlParams.toString();
        const newUrl = queryString ? `?${queryString}` : window.location.pathname;
        
        window.history.pushState(null, '', newUrl);
    } catch (e) {
        console.warn('URL update skipped due to environment restrictions (SecurityError). Internal navigation continued.');
    }
  };

  return (
    <NavigationContext.Provider value={{ currentPage, currentArticleId, currentParams, navigateTo }}>
      {children}
    </NavigationContext.Provider>
  );
};

export const useNav = (): NavigationContextType => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNav must be used within a NavigationProvider');
  }
  return context;
};
