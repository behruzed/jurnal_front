import React, { useState, useEffect } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { Container, Row, Col, Card, Button, Badge, Form, InputGroup, Spinner } from 'react-bootstrap';
import { BookOpen, Search, Plus, ArrowRight, History, ClipboardList, X, Filter, ChevronRight, FileText, CheckCircle2 } from 'lucide-react';
import axios from '../api/axios';
import JournalForm from '../components/JournalForm';
import JournalHistory from '../components/JournalHistory';
import './Journals.scss';

const Journals = () => {
  const [journalTypes, setJournalTypes] = useState([]);
  const [selectedType, setSelectedType] = useState(null);
  const [view, setView] = useState('list'); // 'list', 'create', 'history'
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchJournalTypes();
  }, []);

  const fetchJournalTypes = async () => {
    try {
      const { data } = await axios.get('/journals/types');
      setJournalTypes(data);
    } catch (err) {
      console.error('Error fetching journal types:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredTypes = journalTypes.filter(type => 
    type.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    type.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedTypes = [...filteredTypes].sort((a, b) => {
    const order = ['DU-2', 'DU-5'];
    const aIndex = order.indexOf(a.code);
    const bIndex = order.indexOf(b.code);
    if (aIndex !== -1 || bIndex !== -1) {
      if (aIndex === -1) return 1;
      if (bIndex === -1) return -1;
      return aIndex - bIndex;
    }
    return a.name.localeCompare(b.name);
  });

  const handleSelectType = (type) => {
    setSelectedType(type);
    setView('create');
  };

  if (loading) {
    return (
      <div className="d-flex align-items-center justify-content-center min-vh-50">
        <div className="text-center">
          <Spinner animation="border" variant="primary" size="lg" className="mb-4" />
          <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40">Ma'lumotlar yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="journals-container">
      <AnimatePresence mode="wait">
        {view === 'list' && (
          <motion.div
            key="list"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="header-section">
              <div className="flex flex-col md:flex-row items-md-end justify-between gap-6">
                <div>
                  <h2>Raqamli <span className="text-primary">Jurnallar</span></h2>
                  <p>Hujjatlarni rasmiylashtirish va hisobotlar markazi</p>
                </div>
                <div className="flex gap-3">
                   <Button 
                    onClick={() => setView('history')}
                    className="btn-metro btn-ghost px-6 py-2.5"
                   >
                     <History size={16} /> Tarix
                   </Button>
                </div>
              </div>
            </div>

            <div className="search-container">
              <div className="search-input-wrapper">
                 <Search size={20} />
                 <input 
                  type="text" 
                  className="input-metro h-14" 
                  placeholder="Jurnal turini qidiring (masalan: Poyezdlar...)" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                 />
              </div>
            </div>

            <div className="journal-grid">
              {sortedTypes.map((type, i) => (
                <motion.div
                  key={type._id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => handleSelectType(type)}
                  className="journal-card"
                >
                  <div className="icon-box">
                    <FileText size={32} />
                  </div>
                  <h3>{type.name}</h3>
                  <p>{type.description || 'Stansiya faoliyatini qayd etish uchun rasmiy elektron jurnal.'}</p>
                  
                  <div className="card-footer">
                    <div className="badge-code text-metro-foreground/60">{type.code}</div>
                    <ArrowRight className="arrow" size={20} />
                  </div>
                </motion.div>
              ))}
            </div>

            {filteredTypes.length === 0 && (
              <div className="text-center py-20 opacity-30">
                <ClipboardList size={64} className="mx-auto mb-6" />
                <p className="text-xl font-bold uppercase tracking-widest italic">Hech narsa topilmadi</p>
              </div>
            )}
          </motion.div>
        )}

        {(view === 'create' || view === 'history') && (
          <motion.div
            key="form"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <div className="mb-10 d-flex align-items-center gap-6">
              <Button 
                variant="ghost" 
                onClick={() => setView('list')}
                className="p-3 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all shadow-sm"
              >
                <X size={20} />
              </Button>
              <div>
                <h3 className="text-2xl font-black uppercase italic m-0">
                  {view === 'create' ? `YANGI YOZUV: ${selectedType?.name}` : 'STANSIYA TARIXI'}
                </h3>
                <p className="text-[10px] font-black uppercase tracking-widest opacity-40 m-0 mt-1">
                  {view === 'create' ? selectedType?.code : 'So\'nggi kiritilgan hisobotlar'}
                </p>
              </div>
            </div>

            {view === 'create' ? (
              <Card className="card-modern border-0 p-4 p-md-10 shadow-2xl overflow-hidden">
                 <JournalForm 
                  type={selectedType} 
                  onSuccess={() => setView('list')} 
                  onCancel={() => setView('list')} 
                 />
              </Card>
            ) : (
              <div className="history-table shadow-2xl">
                <JournalHistory />
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Journals;
