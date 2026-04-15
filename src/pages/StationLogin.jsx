import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Container, Row, Col, Form, Button, Alert, Spinner, Badge } from 'react-bootstrap';
import { Train, ShieldCheck, MapPin, ArrowRight, ShieldAlert, Globe, Zap, CheckCircle2 } from 'lucide-react';
import axios from '../api/axios';
import useAuthStore from '../store/authStore';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const StationLogin = () => {
  const [stationName, setStationName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const setStation = useAuthStore((state) => state.setStation);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data } = await axios.post('/auth/station-login', {
        name: stationName,
        password
      });
      setStation(data, data.stationToken);
      navigate('/employee-login');
    } catch (err) {
      setError(err.response?.data?.message || 'Login xatosi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-metro-bg">
      <Navbar isDashboard={false} />

      <div className="flex-1 flex flex-col lg:flex-row">
        {/* Left Side: Industrial Visual */}
        <div className="hidden lg:flex lg:w-1/2 bg-metro-sidebar relative overflow-hidden items-center justify-center p-24">
           <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] pointer-events-none" />
           <div className="relative z-10 space-y-12 max-w-lg">
              <motion.div 
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-4"
              >
                <div className="inline-block px-4 py-2 text-[10px] uppercase font-black tracking-widest bg-metro-accent text-white rounded-lg mb-4">BOSHQARUV PORTALI</div>
                <h1 className="text-6xl font-black text-white italic uppercase tracking-tighter leading-tight">
                  XAVFSIZLIK VA <span className="text-metro-accent">NAZORAT</span>
                </h1>
                <p className="text-lg text-white/50 font-bold leading-relaxed">
                  Toshkent Metropoliteni raqamli hisobot tizimiga xush kelibsiz. Tizimga kirish uchun stansiya ma'lumotlarini kiriting.
                </p>
              </motion.div>

              <div className="grid grid-cols-2 gap-8 pt-10 border-t border-white/10">
                 <div className="space-y-2">
                   <div className="text-metro-accent"><ShieldCheck size={32} /></div>
                   <h4 className="text-white font-black text-sm uppercase">HIMOYALANGAN</h4>
                   <p className="text-white/30 text-[10px] font-bold uppercase tracking-widest">SSL encryption faol</p>
                 </div>
                 <div className="space-y-2">
                   <div className="text-metro-accent"><Globe size={32} /></div>
                   <h4 className="text-white font-black text-sm uppercase">MARKAZLASHGAN</h4>
                   <p className="text-white/30 text-[10px] font-bold uppercase tracking-widest">Real-vaqt sinxronizatsiyasi</p>
                 </div>
              </div>
           </div>
           <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-metro-accent to-transparent opacity-20" />
        </div>

        {/* Right Side: Login Form */}
        <div className="flex-1 flex items-center justify-center p-8 md:p-24 bg-metro-bg">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-md space-y-10"
          >
            <div>
              <h2 className="text-4xl font-black italic uppercase tracking-tighter m-0 mb-3 text-metro-fg">STANSIYA <span className="text-metro-primary">KIRISHI</span></h2>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 text-metro-fg">Tizimga kirish uchun identifikatsiya kodi talab etiladi</p>
            </div>

            {error && (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                <Alert variant="danger" className="border-0 bg-danger/10 text-danger rounded-2xl flex items-center gap-3 p-4">
                  <ShieldAlert size={20} />
                  <span className="text-sm font-black uppercase tracking-widest">{error}</span>
                </Alert>
              </motion.div>
            )}

            <Form onSubmit={handleLogin} className="space-y-8">
              <Form.Group className="space-y-3">
                <Form.Label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-1 text-metro-fg">Stansiya Nomi</Form.Label>
                <div className="relative group">
                   <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30 group-focus-within:text-metro-primary group-focus-within:opacity-100 transition-all text-metro-fg" size={20} />
                   <Form.Control 
                     type="text" 
                     required
                     className="input-metro-industrial h-14 ps-12"
                     placeholder="Masalan: Paxtakor"
                     value={stationName}
                     onChange={(e) => setStationName(e.target.value)}
                   />
                </div>
              </Form.Group>

              <Form.Group className="space-y-3">
                <Form.Label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-1 text-metro-fg">Parol / Kirish Kodi</Form.Label>
                <Form.Control 
                  type="password" 
                  required
                  className="input-metro-industrial h-14"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Form.Group>

              <Button 
                type="submit" 
                disabled={loading}
                className="btn-metro-primary w-100 h-16 flex items-center justify-center gap-3"
              >
                {loading ? <Spinner animation="border" size="sm" /> : <Zap size={20} />}
                <span>STANSIYANI FAOLLASHTIRISH</span>
              </Button>
            </Form>

            <div className="pt-10 border-t border-metro-border text-center">
               <p className="text-[10px] font-black opacity-30 uppercase tracking-widest m-0 leading-relaxed text-metro-fg">
                 Tizim administratorlari tomonidan berilgan identifikatsiya ma'lumotlaridan foydalaning. 
                 <br />Xatolik yuzaga kelsa, Markaziy dispetcher bilan bog'laning.
               </p>
            </div>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default StationLogin;
