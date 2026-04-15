import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Sun, Moon, Bell, Search, Menu, X } from 'lucide-react';
import useAuthStore from '../store/authStore';

const Navbar = ({ isDashboard = false, onToggleSidebar, isSidebarOpen }) => {
  const { theme, setTheme, station, employee } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark');

  return (
    <header className={`h-20 flex items-center px-6 md:px-12 border-b border-metro-border bg-metro-panel sticky top-0 z-[100] transition-colors duration-500`}>
      <div className="flex items-center gap-6">
        {isDashboard && (
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2.5 bg-metro-slate-100 dark:bg-metro-slate-800 rounded-xl text-metro-primary hover:bg-metro-accent/10 transition-all"
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        )}
        
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
          <div className="w-10 h-10 bg-metro-primary rounded-xl flex items-center justify-center font-black text-white shadow-lg shadow-metro-primary/20">M</div>
          <h1 className="text-xl font-black italic uppercase tracking-tighter m-0 text-metro-fg">
            UZ METRO <span className="text-metro-accent">TIZIMI</span>
          </h1>
        </div>
      </div>

      <div className="ml-auto flex items-center gap-2 md:gap-6">
        {/* Environment Status (Fixed Metro Board Style) */}
        <div className="hidden md:flex items-center gap-4 px-6 py-2 bg-metro-slate-50 dark:bg-metro-slate-950/30 border border-metro-border rounded-2xl">
           <div className="text-right">
              <p className="text-[8px] font-black opacity-30 uppercase tracking-[0.2em] m-0 leading-none mb-1">STANSIYA HOLATI</p>
              <p className="text-[11px] font-black italic uppercase tracking-tighter text-metro-accent m-0">
                {station?.name || 'ULANILMAGAN'}
              </p>
           </div>
           <div className="w-[1px] h-6 bg-metro-border" />
           <div className="text-right">
              <p className="text-[8px] font-black opacity-30 uppercase tracking-[0.2em] m-0 leading-none mb-1">XODIM</p>
              <p className="text-[11px] font-black italic uppercase tracking-tighter text-metro-fg m-0">
                {employee?.name || 'MEHMON'}
              </p>
           </div>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={toggleTheme}
            className="p-3 bg-metro-slate-100 dark:bg-metro-slate-800 rounded-xl hover:bg-metro-accent/10 transition-all text-metro-fg"
          >
            {theme === 'dark' ? <Sun size={18} className="text-metro-warning" /> : <Moon size={18} className="text-metro-primary" />}
          </button>
          
          <button className="p-3 bg-metro-slate-100 dark:bg-metro-slate-800 rounded-xl hover:bg-metro-accent/10 transition-all text-metro-fg relative">
            <Bell size={18} />
            <div className="absolute top-2.5 right-2.5 w-2 h-2 bg-metro-danger rounded-full border-2 border-metro-panel" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
