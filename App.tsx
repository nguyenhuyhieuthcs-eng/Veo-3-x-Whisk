
import React, { useState, useCallback } from 'react';
import Home from './views/Home';
import Whisk from './views/Whisk';
import Veo from './views/Veo';
import Account from './views/Account';
import { Zap, Clapperboard, Home as HomeIcon, UserCircle, Menu, X } from 'lucide-react';
import type { NavItemType, Page } from './types';

const navItems: NavItemType[] = [
  { id: 'home', label: 'Home', icon: HomeIcon },
  { id: 'whisk', label: 'Whisk AI', icon: Zap },
  { id: 'veo', label: 'Veo3 AI', icon: Clapperboard },
  { id: 'account', label: 'Account', icon: UserCircle },
];

const App: React.FC = () => {
  const [activePage, setActivePage] = useState<Page>('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const renderPage = useCallback(() => {
    switch (activePage) {
      case 'whisk':
        return <Whisk />;
      case 'veo':
        return <Veo />;
      case 'account':
        return <Account />;
      case 'home':
      default:
        return <Home setActivePage={setActivePage} />;
    }
  }, [activePage]);
  
  const handleNavClick = (page: Page) => {
    setActivePage(page);
    setIsMenuOpen(false);
  };

  const NavLink: React.FC<{ item: NavItemType }> = ({ item }) => (
    <button
      onClick={() => handleNavClick(item.id)}
      className={`flex items-center w-full px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
        activePage === item.id
          ? 'bg-brand-blue text-white shadow-lg'
          : 'text-medium-text hover:bg-dark-card hover:text-light-text'
      }`}
    >
      <item.icon className="w-5 h-5 mr-3" />
      <span>{item.label}</span>
    </button>
  );

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-dark-bg font-sans">
      {/* Mobile Header */}
      <header className="md:hidden flex justify-between items-center p-4 bg-dark-card border-b border-dark-border sticky top-0 z-20">
        <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-blue to-brand-purple">
          Whisk+Veo3
        </h1>
        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-light-text z-30">
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed top-0 left-0 h-full z-10 md:relative md:flex flex-col w-64 p-4 bg-dark-card border-r border-dark-border transition-transform duration-300 ease-in-out ${
          isMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="flex items-center mb-8 px-2 pt-2">
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-blue to-brand-purple">
            Whisk+Veo3
          </h1>
        </div>
        <nav className="flex flex-col space-y-2">
          {navItems.map((item) => (
            <NavLink key={item.id} item={item} />
          ))}
        </nav>
        <div className="mt-auto p-4 text-center text-xs text-medium-text">
          <p>&copy; 2024 AI Creations Inc.</p>
          <p>Powered by Gemini</p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          {renderPage()}
        </div>
      </main>
    </div>
  );
};

export default App;
