import React from 'react';
import { motion } from 'framer-motion';
import { Container, Row, Col, Button, Card, Badge } from 'react-bootstrap';
import { Shield, Zap, Activity, Users, Lock, Clock, ArrowRight, MapPin, CheckCircle2, ChevronRight, Train, Globe, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Home = () => {
  const { theme, station, employee } = useAuthStore();
  const navigate = useNavigate();

  const handleActionClick = () => {
    if (station) {
      if (employee) navigate('/dashboard');
      else navigate('/employee-login');
    } else {
      navigate('/station-login');
    }
  };

  const features = [
    { 
      title: 'Raqamli Jurnallash', 
      desc: 'Barcha qog\'oz jurnallarni zamonaviy va qulay raqamli formatga o\'tkazing.',
      icon: <Zap className="text-metro-accent" size={32} />
    },
    { 
      title: 'Real-vaqt Monitoringi', 
      desc: 'Poyezdlar harakati va stansiya holatini soniyalar ichida nazorat qiling.',
      icon: <Activity className="text-metro-accent" size={32} />
    },
    { 
      title: 'Maksimal Xavfsizlik', 
      desc: 'Dizayn darajasida o\'rnatilgan xavfsizlik va ma\'lumotlar himoyasi.',
      icon: <ShieldCheck className="text-metro-accent" size={32} />
    }
  ];

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-500 overflow-x-hidden ${theme === 'dark' ? 'dark bg-metro-sidebar' : 'bg-metro-bg'}`}>
      <Navbar isDashboard={false} />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative pt-32 pb-24 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full -z-10 opacity-30">
             <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-metro-accent/20 rounded-full blur-[120px] animate-pulse" />
             <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-metro-danger/10 rounded-full blur-[120px] animate-pulse" />
          </div>

          <Container lg className="relative z-10 px-6">
            <Row className="align-items-center g-5">
              <Col lg={7} className="text-center text-lg-start">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="inline-flex items-center gap-3 px-5 py-2.5 bg-metro-accent/10 border border-metro-accent/20 rounded-xl text-metro-accent text-[10px] font-black uppercase tracking-[0.2em] mb-12"
                >
                  <div className="w-2 h-2 rounded-full bg-metro-accent animate-ping" />
                  Yangi Avlod Raqamli Ekotizimi
                </motion.div>
                
                <motion.h1 
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9] mb-12 text-metro-fg"
                >
                  METRO <br /> <span className="text-metro-accent italic">RAQAMLI</span> <br /> OLAMI.
                </motion.h1>

                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="max-w-2xl text-xl opacity-60 leading-relaxed mb-12 mx-auto mx-lg-0 font-medium text-metro-fg"
                >
                  Toshkent Metropolitenining barcha operatsion jarayonlarini yagona, xavfsiz va real vaqtdagi platformada birlashtiring.
                </motion.p>

                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="d-flex flex-column flex-sm-row align-items-center gap-4 justify-content-center justify-content-lg-start"
                >
                  <Button 
                     onClick={handleActionClick}
                     className="btn-metro-primary min-w-[240px] h-16 shadow-2xl shadow-metro-accent/20 text-white border-0"
                  >
                    {station ? 'BOSHQARUVGA O\'TISH' : 'TIZIMNI BOSHLASH'} <ArrowRight size={22} className="ml-2" />
                  </Button>
                  <Button 
                    className="p-4 bg-metro-slate-100 dark:bg-metro-slate-800 rounded-xl border border-metro-border text-[10px] font-black uppercase tracking-widest hover:bg-metro-accent/10 transition-all text-metro-fg"
                  >
                    Hujjatlar <Globe size={18} className="ml-2" />
                  </Button>
                </motion.div>
              </Col>

              <Col lg={5} className="d-none d-lg-block">
                 <motion.div
                   initial={{ opacity: 0, scale: 0.8 }}
                   animate={{ opacity: 1, scale: 1 }}
                   className="relative"
                 >
                    <div className="aspect-square bg-metro-sidebar rounded-[3rem] p-12 border border-white/5 relative overflow-hidden shadow-2xl">
                       <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />
                       <div className="relative z-10 flex flex-col justify-between h-full">
                          <div className="w-16 h-16 bg-metro-accent rounded-2xl flex items-center justify-center text-white shadow-lg">
                             <Train size={32} />
                          </div>
                          <div>
                             <h3 className="text-4xl font-black text-white italic uppercase tracking-tighter m-0 mb-2">LIVE CONTROL</h3>
                             <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.4em] m-0">System Node Active</p>
                          </div>
                       </div>
                       <motion.div 
                         animate={{ x: [0, 100, 0] }}
                         transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                         className="absolute top-1/2 left-0 w-full h-[1px] bg-metro-accent/30" 
                       />
                    </div>
                 </motion.div>
              </Col>
            </Row>
          </Container>
        </section>

        {/* Features Section */}
        <section className="py-32 bg-metro-slate-50 dark:bg-metro-slate-950/20" id="features">
           <Container>
              <div className="text-center mb-24 max-w-2xl mx-auto space-y-4">
                 <div className="inline-block px-4 py-2 text-[10px] uppercase font-black tracking-widest bg-metro-accent text-white rounded-lg">TIZIM IMKONIYATLARI</div>
                 <h2 className="text-5xl font-black italic uppercase tracking-tighter text-metro-fg">MUKAMMAL BOSHQUV</h2>
                 <p className="text-sm font-bold opacity-40 uppercase tracking-widest text-metro-fg">Har bir detal xavfsizlik va unumdorglik uchun xizmat qiladi</p>
              </div>

              <Row className="g-4">
                 {features.map((feature, i) => (
                   <Col md={4} key={i}>
                      <motion.div 
                        whileHover={{ y: -10 }}
                        className="card-metro h-full space-y-6"
                      >
                         <div className="p-4 bg-metro-accent/10 rounded-2xl w-fit">
                            {feature.icon}
                         </div>
                         <h3 className="text-xl font-black italic uppercase tracking-tight m-0 text-metro-fg">{feature.title}</h3>
                         <p className="text-sm font-medium opacity-60 m-0 text-metro-fg leading-relaxed">{feature.desc}</p>
                         <div className="pt-4 border-t border-metro-border flex items-center gap-2 text-[10px] font-black uppercase text-metro-accent cursor-pointer group">
                             Batafsil <ChevronRight size={14} className="group-hover:translate-x-1 transition-all" />
                         </div>
                      </motion.div>
                   </Col>
                 ))}
              </Row>
           </Container>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Home;
