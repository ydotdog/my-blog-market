import React, { useEffect, useState, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sun, Moon, Menu, X } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isDark, setIsDark] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSubscribeOpen, setIsSubscribeOpen] = useState(false);
  const [email, setEmail] = useState('');
  const subscribeRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  // Automatic Dark Mode based on System Preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const applyTheme = (dark: boolean) => {
       if (dark) {
        document.documentElement.classList.add('dark');
        setIsDark(true);
      } else {
        document.documentElement.classList.remove('dark');
        setIsDark(false);
      }
    }

    // Initial check
    applyTheme(mediaQuery.matches);

    // Listener for system changes
    const handler = (e: MediaQueryListEvent) => applyTheme(e.matches);

    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Close subscribe popover and mobile menu on route change
  useEffect(() => {
    setIsSubscribeOpen(false);
    setIsMobileMenuOpen(false);
  }, [location]);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark');
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      setIsDark(true);
    }
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Subscribed: ${email}`);
    setEmail('');
    setIsSubscribeOpen(false);
    setIsMobileMenuOpen(false);
  };

  const navLinks = [
    { name: '主页', path: '/' },
    { name: '归档', path: '/archive' },
  ];

  return (
    <div className="flex flex-col min-h-screen font-sans relative">
      {/* 
        Modified Header: 
        1. Changed 'fixed' to 'absolute' so it scrolls away with the page.
        2. Removed 'max-w-3xl' constraint from inner div to span full width.
      */}
      <header className="absolute top-0 w-full bg-white/90 dark:bg-[#111]/90 backdrop-blur-md z-[100] border-b border-transparent transition-colors duration-300">
        <div className="w-full px-6 md:px-12 h-20 flex items-center justify-between relative">
          
          {/* Logo / Brand - Fixed Color #d93d3d */}
          <Link to="/" className="text-2xl font-serif font-bold tracking-tight text-[#d93d3d]">
            超级杠杆
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link 
                key={link.path}
                to={link.path} 
                className={`text-sm font-medium transition-colors hover:text-black dark:hover:text-white ${
                  location.pathname === link.path 
                    ? 'text-neutral-900 dark:text-white' 
                    : 'text-neutral-500 dark:text-neutral-400'
                }`}
              >
                {link.name}
              </Link>
            ))}
            
            {/* Desktop Subscribe Button & Popover Container */}
            <div className="relative" ref={subscribeRef}>
              <button
                onClick={() => setIsSubscribeOpen(!isSubscribeOpen)}
                className={`text-sm font-medium px-4 py-1.5 rounded-full transition-all ${
                  isSubscribeOpen 
                    ? 'bg-neutral-100 dark:bg-neutral-800 text-black dark:text-white' 
                    : 'bg-neutral-900 dark:bg-neutral-100 text-white dark:text-black hover:opacity-80'
                }`}
              >
                订阅
              </button>

              {/* Minimalist Popover */}
              {isSubscribeOpen && (
                <>
                  {/* Invisible Backdrop to handle click outside */}
                  <div className="fixed inset-0 z-10 cursor-default" onClick={() => setIsSubscribeOpen(false)}></div>
                  
                  <div className="absolute right-0 top-full mt-3 w-72 bg-white dark:bg-[#111] border border-neutral-200 dark:border-neutral-800 shadow-xl rounded-lg p-4 z-20 animate-fade-in-down">
                    <form onSubmit={handleSubscribe} className="flex flex-col space-y-3">
                      <input
                        type="email"
                        required
                        placeholder="Email Address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded text-sm text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:border-neutral-400 dark:focus:border-neutral-500"
                        autoFocus
                      />
                      <button 
                        type="submit"
                        className="w-full py-2 bg-neutral-900 dark:bg-neutral-100 text-white dark:text-black text-xs font-bold uppercase tracking-wider rounded hover:opacity-90 transition-opacity"
                      >
                        Subscribe
                      </button>
                    </form>
                  </div>
                </>
              )}
            </div>

            <div className="w-px h-4 bg-neutral-200 dark:bg-neutral-800 mx-2"></div>
            
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800/50 transition-colors text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
              aria-label="Toggle Theme"
            >
              {isDark ? <Moon size={16} /> : <Sun size={16} />}
            </button>
          </nav>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center space-x-4">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-1 text-neutral-900 dark:text-white"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-20 left-0 w-full bg-white dark:bg-[#111] border-b border-neutral-100 dark:border-neutral-800 shadow-xl animate-fade-in-down z-[100]">
            <div className="px-6 py-6 flex flex-col space-y-6 text-center">
              {navLinks.map((link) => (
                <Link 
                  key={link.path}
                  to={link.path} 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`text-lg font-medium ${
                    location.pathname === link.path 
                      ? 'text-neutral-900 dark:text-white' 
                      : 'text-neutral-500 dark:text-neutral-400'
                  }`}
                >
                  {link.name}
                </Link>
              ))}

              {/* Mobile Subscribe Inline */}
              {isSubscribeOpen ? (
                 <form onSubmit={handleSubscribe} className="w-full max-w-xs mx-auto flex flex-col space-y-3 animate-fade-in">
                    <input
                      type="email"
                      required
                      placeholder="Email Address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded text-sm text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none text-center"
                      autoFocus
                    />
                    <button 
                      type="submit"
                      className="w-full py-2 bg-neutral-900 dark:bg-neutral-100 text-white dark:text-black text-xs font-bold uppercase tracking-wider rounded"
                    >
                      Subscribe
                    </button>
                 </form>
              ) : (
                 <button 
                   onClick={() => setIsSubscribeOpen(true)}
                   className="text-lg font-medium text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
                 >
                   订阅
                 </button>
              )}

              <div className="pt-4 flex justify-center">
                <button 
                  onClick={toggleTheme}
                  className="p-2 rounded-full text-neutral-500 dark:text-neutral-400"
                >
                  {isDark ? <Moon size={20} /> : <Sun size={20} />}
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      <main className="flex-grow pt-32 px-6 pb-12 w-full max-w-3xl mx-auto transition-colors duration-300">
        {children}
      </main>

      <footer className="py-12 mt-12 transition-colors duration-300 opacity-60 hover:opacity-100">
        <div className="max-w-3xl mx-auto px-6 text-center space-y-4">
          <div className="w-8 h-px bg-neutral-200 dark:bg-neutral-800 mx-auto"></div>
          {/* TODO: 修改这里：页脚的引言 */}
          <p className="text-neutral-500 dark:text-neutral-500 text-sm font-serif italic">
            "财富是你睡觉时仍在为你赚钱的资产。"
          </p>
          {/* TODO: 修改这里：页脚的版权信息 */}
          <div className="text-xs text-neutral-400 dark:text-neutral-600 font-sans">
            © {new Date().getFullYear()} 超级杠杆.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;