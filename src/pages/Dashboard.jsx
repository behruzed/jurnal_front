import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Container, Row, Col, Badge, Button, Nav, Navbar, Card } from 'react-bootstrap';
import { 
  LayoutDashboard, 
  BookOpen, 
  MessageSquare, 
  LogOut, 
  User, 
  Settings, 
  BarChart3, 
  Bell, 
  Send, 
  Search, 
  Clock, 
  Moon, 
  Sun, 
  Menu, 
  X, 
  ShieldCheck,
  TrendingUp,
  Activity,
  AlertCircle,
  PlusCircle,
  BarChart,
  ArrowUpRight
} from 'lucide-react';
import useAuthStore from '../store/authStore';
import { useNavigate } from 'react-router-dom';
import Journals from './Journals';
import Messages from './Messages';
import DispatcherPanel from './DispatcherPanel';
import { socket } from '../utils/socket';
import './Dashboard.scss';

const Dashboard = () => {
  const { employee, station, logoutEmployee, theme, setTheme } = useAuthStore();
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(3);
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const hours = new Date().getHours();
    if (hours < 12) setGreeting('XAYRLI TONG');
    else if (hours < 18) setGreeting('XAYRLI KUN');
    else setGreeting('XAYRLI KECH');

    if (station) {
       socket.connect();
       socket.emit('join_room', station._id);
       socket.on('receive_dispatcher_message', () => {
         setUnreadCount(prev => prev + 1);
       });
    }
    return () => {
      socket.off('receive_dispatcher_message');
    };
  }, [station]);

  return (
    <div className="dashboard-container">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="greeting-hero"
      >
        <div className="relative z-10">
          <p>{greeting}, {employee?.role || 'XODIM'}</p>
          <h1>{employee?.name}</h1>
          <div className="flex items-center gap-4 mt-6">
            <Badge pill className="bg-white/10 text-metro-foreground dark:text-white px-4 py-2 border border-white/10 font-bold uppercase tracking-widest text-[9px]">
               {station?.name} stansiyasi
            </Badge>
            <div className="h-1 shadow-glow w-24 bg-primary/30 rounded-full" />
          </div>
        </div>
      </motion.div>

      <Row className="g-5 mb-12">
        {[
          { label: 'Jurnal Yozuvlari', value: '1,420', trend: '+12%', icon: BookOpen, color: 'primary' },
          { label: 'Faollik ko\'rsatkichi', value: '98%', trend: 'OPTIMAL', icon: Activity, color: 'success' },
          { label: 'Xabarnomalar', value: unreadCount, trend: 'MUHIM', icon: Bell, color: 'danger' },
          { label: 'Tizim Barqarorligi', value: '99.9%', trend: 'OK', icon: ShieldCheck, color: 'info' },
        ].map((stat, i) => (
          <Col key={i} xs={12} sm={6} lg={3}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="stat-card">
                 <div className={`icon-box bg-${stat.color}/10 text-${stat.color}`}>
                   <stat.icon size={28} />
                 </div>
                 <div className="stat-label">{stat.label}</div>
                 <div className="flex items-end justify-between">
                    <h3 className="stat-value text-metro-foreground">{stat.value}</h3>
                    <span className="stat-trend text-metro-foreground/40">{stat.trend}</span>
                 </div>
              </div>
            </motion.div>
          </Col>
        ))}
      </Row>

      <div className="main-grid">
        <div className="activity-hub">
           <div className="hub-header">
              <h3>OPERATSION FAOLIYAT</h3>
              <Button variant="ghost" className="p-0 text-primary font-black uppercase text-[10px] tracking-widest">
                 Barchasi <ArrowUpRight size={14} className="ml-2" />
              </Button>
           </div>
           
           <div className="timeline">
              {[
                { time: '11:45', action: 'Dispetcherdan yangi buyruq keldi: "1-liniya tezligini oshirish"', operator: 'Abidov J.' },
                { time: '10:20', action: 'Smenadagi texnik holat tekshirildi - Barcha tizimlar OK', operator: 'Usmonov M.' },
                { time: '09:00', action: 'Smena qabul qilindi. 42-marshrut yo\'lga chiqdi', operator: 'Rahimov S.' }
              ].map((item, i) => (
                <div key={i} className="timeline-item">
                  <div className="time">{item.time}</div>
                  <div className="content text-metro-foreground">{item.action}</div>
                  <div className="meta">Bajaruvchi: {item.operator}</div>
                </div>
              ))}
           </div>
        </div>

        <div className="quick-links">
           <div className="hub-header mb-2 px-2">
              <h3 className="text-sm font-black italic opacity-40 uppercase tracking-widest">TEZKOR AMALLAR</h3>
           </div>
           
           <div onClick={() => navigate('/dashboard/journals')} className="action-btn group">
              <div className="icon-circle bg-primary">
                <PlusCircle size={22} />
              </div>
              <div className="text-content">
                <h4 className="text-metro-foreground">YANGI YOZUV</h4>
                <p>RAQAMLI JURNALLARNI TO'LDIRISH</p>
              </div>
           </div>

           <div onClick={() => navigate('/dashboard/messages')} className="action-btn group">
              <div className="icon-circle bg-danger shadow-danger/20">
                <MessageSquare size={22} />
              </div>
              <div className="text-content">
                <h4 className="text-metro-foreground">XABARAR MARKAZI</h4>
                <p>DISPETCHERLIK KO'RSATMALARI</p>
              </div>
           </div>

           <div onClick={() => navigate('/dashboard/profile')} className="action-btn group">
              <div className="icon-circle bg-success shadow-success/20">
                <User size={22} />
              </div>
              <div className="text-content">
                <h4 className="text-metro-foreground">SHAXSIY PROFIL</h4>
                <p>LOYIHA SOZLAMALARI VA STATISTIKA</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
