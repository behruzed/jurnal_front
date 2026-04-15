import React from 'react';
import { motion } from 'framer-motion';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { User, Mail, Award, Clock, Shield, Edit3, MapPin, Briefcase } from 'lucide-react';
import useAuthStore from '../store/authStore';
import DashboardLayout from '../components/DashboardLayout';

const Profile = () => {
  const { employee, station } = useAuthStore();

  const stats = [
    { label: 'Smenalar', value: '128', icon: <Clock className="text-primary" /> },
    { label: 'Jurnallar', value: '1,420', icon: <Edit3 className="text-success" /> },
    { label: 'Reyting', value: '4.9', icon: <Award className="text-warning" /> },
  ];

  return (
    <div className="space-y-10">
      {/* Profile Header */}
      <div className="relative h-60 rounded-[3rem] overflow-hidden shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-primary to-blue-900" />
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
        
        <div className="absolute -bottom-16 left-12 flex items-end gap-8">
          <div className="w-40 h-40 rounded-[2.5rem] bg-white dark:bg-[#1e293b] p-2 shadow-2xl border-4 border-primary">
            <div className="w-full h-full rounded-[2rem] bg-primary/10 flex items-center justify-center text-primary overflow-hidden">
              {employee?.avatar ? <img src={employee.avatar} className="w-full h-full object-cover" /> : <User size={64} />}
            </div>
          </div>
          <div className="pb-20">
            <h2 className="text-4xl font-black uppercase italic tracking-tighter text-white m-0 leading-none mb-2">{employee?.name}</h2>
            <div className="flex items-center gap-4 text-white/70 text-xs font-bold uppercase tracking-widest">
              <span className="flex items-center gap-2"><Briefcase size={14} /> {employee?.role || 'Navbatchi'}</span>
              <span className="w-1 h-1 rounded-full bg-white/30" />
              <span className="flex items-center gap-2"><MapPin size={14} /> {station?.name || 'Toshkent Metro'}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-20">
        <Row className="g-8">
          {/* Stats */}
          <Col lg={4}>
            <div className="space-y-6">
              {stats.map((stat, i) => (
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  key={i} 
                  className="card-modern border-0 flex items-center justify-between p-6"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-white/5 flex items-center justify-center">
                      {stat.icon}
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest opacity-40 m-0">{stat.label}</p>
                      <h4 className="text-2xl font-black m-0">{stat.value}</h4>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </Col>

          {/* General Info */}
          <Col lg={8}>
            <Card className="card-modern border-0">
              <div className="flex items-center justify-between mb-10">
                <h3 className="text-xl font-black uppercase italic d-flex align-items-center gap-3 m-0">
                  <Shield size={24} className="text-primary" />
                  Shaxsiy Ma'lumotlar
                </h3>
                <Button className="btn-metro btn-ghost py-2 h-fit">TAHRIRLASH</Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {[
                  { label: "F.I.SH", value: employee?.name, icon: <User size={18} /> },
                  { label: "Email", value: employee?.email || 'Noma\'lum', icon: <Mail size={18} /> },
                  { label: "Lavozim", value: employee?.role, icon: <Briefcase size={18} /> },
                  { label: "Xavfsizlik Darajasi", value: "Boshqaruvchi", icon: <Shield size={18} /> },
                ].map((info, i) => (
                  <div key={i} className="space-y-2">
                     <p className="text-[10px] font-black uppercase tracking-widest opacity-40 m-0 d-flex align-items-center gap-2">
                       {info.icon} {info.label}
                     </p>
                     <p className="text-sm font-bold m-0">{info.value}</p>
                     <div className="h-px bg-white/5 w-full mt-4" />
                  </div>
                ))}
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
);
};

export default Profile;
