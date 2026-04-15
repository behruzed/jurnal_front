import React, { useState, useEffect } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { Container, Row, Col, Card, Badge, Button, Form, InputGroup, Spinner } from 'react-bootstrap';
import { History, Search, FileText, User, Calendar, ExternalLink, Filter } from 'lucide-react';
import axios from '../api/axios';

const JournalHistory = () => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const { data } = await axios.get('/journals/entries');
      setEntries(data);
    } catch (err) {
      console.error('Error fetching journal history:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredEntries = entries.filter(entry => 
    entry.journalTypeId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    entry.createdBy?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    JSON.stringify(entry.data).toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusLabel = (status) => {
    switch(status) {
      case 'verified': return 'Tasdiqlangan';
      case 'pending': return 'Kutilmoqda';
      case 'rejected': return 'Rad etilgan';
      default: return status;
    }
  };

  const getStatusVariant = (status) => {
    switch(status) {
      case 'verified': return 'success';
      case 'pending': return 'warning';
      case 'rejected': return 'danger';
      default: return 'secondary';
    }
  };

  return (
    <div className="space-y-10">
      <header className="d-flex flex-column flex-md-row gap-4 items-center">
        <div className="relative group flex-1 w-100">
          <InputGroup className="position-relative group shadow-sm rounded-2xl overflow-hidden">
            <InputGroup.Text className="bg-transparent border-0 position-absolute start-0 top-50 translate-middle-y z-30 opacity-30 group-focus-within:opacity-100 transition-opacity">
              <Search size={22} className="text-primary" />
            </InputGroup.Text>
            <Form.Control 
              type="text" 
              placeholder="Nomi, xodim yoki kontent bo'yicha qidirish..."
              className="input-metro ps-12 py-4 border-2"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>
        </div>
        <Button variant="ghost" className="btn-metro px-6 whitespace-nowrap bg-slate-100 dark:bg-white/5 border-2 border-slate-200 dark:border-white/10 rounded-2xl h-fit">
          <Filter size={22} /> <span className="text-xs uppercase font-black">Filtrlar</span>
        </Button>
      </header>

      <div className="space-y-8">
        {loading ? (
          [...Array(4)].map((_, i) => (
            <div key={i} className="h-40 card-modern animate-pulse border-0 shadow-sm" />
          ))
        ) : filteredEntries.length === 0 ? (
          <div className="p-24 card-modern text-center border-2 border-dashed border-slate-200 dark:border-white/5 d-flex flex-column align-items-center justify-content-center">
             <div className="p-8 bg-slate-100 dark:bg-white/5 rounded-full mb-8 opacity-30">
               <History size={64} />
             </div>
             <p className="text-xl font-bold opacity-40">Ushbu stansiya uchun hech qanday tarixiy yozuvlar topilmadi.</p>
          </div>
        ) : (
          filteredEntries.map((entry, index) => (
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              key={entry._id}
            >
              <Card className="card-modern hover:border-primary/30 group transition-all duration-500 border-0 shadow-sm p-4 p-md-8 bg-white dark:bg-metro-card">
                <Card.Body className="p-0">
                  <div className="d-flex flex-column flex-md-row justify-content-between gap-6">
                    <div className="d-flex align-items-start gap-5">
                      <div className="p-4 bg-primary/5 dark:bg-white/5 rounded-2xl text-primary group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all shadow-glow">
                        <FileText size={32} />
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-black text-2xl uppercase italic tracking-tighter m-0">{entry.journalTypeId?.name}</h4>
                        <div className="d-flex flex-wrap align-items-center gap-x-8 gap-y-2 text-[10px] font-black uppercase tracking-widest opacity-40">
                          <span className="d-flex align-items-center gap-2"><User size={16} className="text-primary" /> {entry.createdBy?.name} ({entry.createdBy?.role})</span>
                          <span className="d-flex align-items-center gap-2 border-start border-slate-200 dark:border-white/10 ps-6"><Calendar size={16} className="text-primary" /> {new Date(entry.createdAt).toLocaleString('uz-UZ')}</span>
                        </div>
                      </div>
                    </div>

                    <div className="d-flex align-items-center gap-4 self-start align-self-md-center">
                       <Badge 
                         pill 
                         bg={getStatusVariant(entry.status)} 
                         className={`px-5 py-2.5 text-[10px] font-black uppercase tracking-[0.2em] border-2 shadow-sm ${
                           entry.status === 'verified' ? 'bg-success/10 border-success/20 text-success' : 
                           entry.status === 'pending' ? 'bg-warning/10 border-warning/20 text-warning' : 'bg-danger/10 border-danger/20 text-danger'
                         }`}
                       >
                         {getStatusLabel(entry.status)}
                       </Badge>
                       <Button 
                         variant="ghost" 
                         className="p-3 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl hover:bg-primary hover:text-white transition-all shadow-sm"
                       >
                         <ExternalLink size={20} />
                       </Button>
                    </div>
                  </div>

                  <div className="mt-10 pt-10 border-top border-slate-100 dark:border-white/10">
                    <Row className="g-5">
                       {Object.entries(entry.data).map(([key, value]) => {
                         if (Array.isArray(value) && value.length && typeof value[0] === 'object') {
                           return (
                             <Col key={key} xs={12}>
                                <div className="space-y-4">
                                  <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40">{key.replace(/_/g, ' ')}</span>
                                  <div className="grid grid-cols-1 gap-3">
                                    {value.map((row, idx) => (
                                      <div key={idx} className="p-4 bg-slate-100 dark:bg-white/5 rounded-2xl border border-slate-200 dark:border-white/10">
                                        <div className="d-flex justify-content-between gap-3 flex-wrap">
                                          <span className="text-sm font-bold">#{row.id} {row.fullName}</span>
                                          <span className="text-[10px] uppercase opacity-50">{row.certificateId}</span>
                                        </div>
                                        <p className="text-[11px] opacity-60 m-0">Vaqt: {new Date(row.recordedAt).toLocaleString('uz-UZ')}</p>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                             </Col>
                           );
                         }
                         return (
                           <Col key={key} xs={12} sm={6} lg={3}>
                              <div className="d-flex flex-column space-y-1">
                                 <span className="text-[9px] font-black opacity-40 uppercase tracking-[0.2em]">{key.replace(/_/g, ' ')}</span>
                                 <span className="text-sm font-bold truncate group-hover:text-primary transition-colors italic" title={String(value)}>{String(value)}</span>
                              </div>
                           </Col>
                         );
                       })}
                    </Row>
                  </div>
                </Card.Body>
              </Card>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default JournalHistory;
