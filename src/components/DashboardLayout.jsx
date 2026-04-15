import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  BookOpen, 
  Bell, 
  User, 
  ChevronDown, 
  LogOut, 
  Menu, 
  X,
  Send,
  Train,
  LogOut as LogOutIcon
} from 'lucide-react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import { Container, Badge, Button } from 'react-bootstrap';
import Navbar from './Navbar';
import Footer from './Footer';
import './DashboardLayout.scss';

const DashboardLayout = () => {
  const { employee, station, logoutEmployee, theme } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleLogout = () => {
    logoutEmployee();
    navigate('/employee-login');
  };

  const navItems = [
    { label: 'Umumiy Panel', icon: LayoutDashboard, path: '/dashboard', group: 'Asosiy' },
    { label: 'Raqamli Jurnallar', icon: BookOpen, path: '/dashboard/journals', group: 'Hujjatlar' },
    { label: 'Xabarlar Markazi', icon: Bell, path: '/dashboard/messages', group: 'Aloqa' },
    { label: 'Dispetcherlik', icon: Send, path: '/dashboard/dispatcher', role: ['dispatcher', 'superadmin'], group: 'Aloqa' },
    { label: 'Mening Profilim', icon: User, path: '/dashboard/profile', group: 'Sozlamalar' },
  ];

  const filteredNavItems = navItems.filter(item => 
    !item.role || item.role.includes(employee?.role)
  );

  return (
    <div className={`min-h-screen ${isSidebarOpen ? 'sidebar-open' : ''} ${theme === 'dark' ? 'dark bg-metro-sidebar' : 'bg-metro-bg'}`}>
      {/* Permanent Aside */}
      <aside className="sidebar-fixed">
        <div className="sidebar-brand">
          <div className="logo-box">M</div>
          <div className="brand-text text-metro-sidebar-fg">
            <h2>UZ METRO</h2>
            <span>Raqamli Boshqaruv</span>
          </div>
        </div>

        <div className="nav-section">
          {['Asosiy', 'Hujjatlar', 'Aloqa', 'Sozlamalar'].map(group => {
            const itemsInGroup = filteredNavItems.filter(item => item.group === group);
            if (itemsInGroup.length === 0) return null;
            
            return (
              <React.Fragment key={group}>
                <div className="nav-group-label">{group}</div>
                {itemsInGroup.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => navigate(item.path)}
                    className={`nav-item-industrial ${location.pathname === item.path ? 'active' : ''}`}
                  >
                    <div className="icon-wrapper">
                      <item.icon size={20} />
                    </div>
                    <span>{item.label}</span>
                  </button>
                ))}
              </React.Fragment>
            );
          })}
        </div>

        <div className="user-profile-bar">
          <div className="user-card">
            <div className="avatar-circle">
               {employee?.name?.charAt(0) || 'U'}
            </div>
            <div className="user-info">
              <h4>{employee?.name}</h4>
              <p>{employee?.role}</p>
            </div>
            <button onClick={handleLogout} className="p-2 ml-auto opacity-30 hover:opacity-100 hover:text-danger transition-all">
               <LogOutIcon size={18} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Area */}
      <div className="main-wrapper">
        <Navbar 
          isDashboard={true} 
          isSidebarOpen={isSidebarOpen} 
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
        />

        <Container fluid className="p-8 md:p-12 flex-1 animate-fade-in" key={location.pathname}>
          <Outlet />
        </Container>

        <Footer />
      </div>
    </div>
  );
};

export default DashboardLayout;
