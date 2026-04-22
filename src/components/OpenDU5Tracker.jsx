import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, Button, Badge, Spinner, Alert, Modal } from 'react-bootstrap';
import { User, Clock, MapPin, CheckCircle2, AlertCircle, ExternalLink, ChevronRight } from 'lucide-react';
import axios from '../api/axios';
import { toast } from 'react-hot-toast';

const OpenDU5Tracker = () => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [closing, setClosing] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [entryToClose, setEntryToClose] = useState(null);

  useEffect(() => {
    fetchOpenEntries();
    const interval = setInterval(fetchOpenEntries, 30000); // Auto refresh every 30s
    return () => clearInterval(interval);
  }, []);

  const fetchOpenEntries = async () => {
    try {
      const { data } = await axios.get('/journals/entries/open/du5');
      setEntries(data);
    } catch (err) {
      console.error('Error fetching open DU-5 entries:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseClick = (entry) => {
    setEntryToClose(entry);
    setShowConfirmModal(true);
  };

  const confirmClose = async () => {
    if (!entryToClose) return;
    
    setClosing(entryToClose._id);
    try {
      await axios.put(`/journals/entries/${entryToClose._id}/close`, {
        exit_time: new Date().toISOString(),
        exit_location: 'Ushbu bekat' // Could be expanded to allow selecting location
      });
      toast.success('Xodim(lar)ning tuneldan chiqqani tasdiqlandi.');
      fetchOpenEntries();
    } catch (err) {
      toast.error('Xatolik yuz berdi. Iltimos qayta urinib ko\'ring.');
    } finally {
      setClosing(null);
      setShowConfirmModal(false);
      setEntryToClose(null);
    }
  };

  if (loading && entries.length === 0) {
    return (
      <div className="text-center py-20 opacity-40">
        <Spinner animation="border" variant="primary" className="mb-4" />
        <p className="font-black uppercase tracking-widest text-[10px]">Yuklanmoqda...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="d-flex align-items-center justify-content-between mb-8">
        <div>
          <h3 className="text-2xl font-black uppercase italic m-0">Tuneldagi Xodimlar</h3>
          <p className="text-[10px] font-black uppercase tracking-widest opacity-40 m-0 mt-1">Hozirda tunnelda bo'lgan xodimlar ro'yxati</p>
        </div>
        <Badge bg="primary" className="px-4 py-2 rounded-xl border-2 border-primary/20 text-sm font-black">
          {entries.length} FAOL
        </Badge>
      </div>

      {entries.length === 0 ? (
        <Alert variant="info" className="rounded-3xl border-0 bg-primary/5 text-primary p-10 text-center shadow-inner">
          <div className="p-6 bg-primary/10 rounded-full w-fit mx-auto mb-6">
            <CheckCircle2 size={48} />
          </div>
          <h4 className="font-black uppercase mb-2">Hamma xodimlar chiqqan</h4>
          <p className="m-0 opacity-60">Hozirda tunnelda hech kim yo'q.</p>
        </Alert>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AnimatePresence mode='popLayout'>
            {entries.map((entry) => (
              <motion.div
                key={entry._id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
              >
                <Card className="card-modern border-2 border-primary/10 shadow-xl hover:border-primary/30 transition-all overflow-hidden group">
                  <div className="p-6">
                    <div className="d-flex justify-content-between align-items-start mb-6">
                      <div className="d-flex align-items-center gap-3">
                        <div className="p-3 bg-primary/10 rounded-2xl group-hover:bg-primary group-hover:text-white transition-colors">
                          <User size={24} />
                        </div>
                        <div>
                          <p className="text-[10px] font-black uppercase opacity-40 m-0">Kiritilgan vaqt</p>
                          <p className="m-0 font-black text-sm">{new Date(entry.createdAt).toLocaleTimeString('uz-UZ')}</p>
                        </div>
                      </div>
                      <Badge bg="warning" className="px-3 py-1.5 rounded-lg border-2 border-warning/20 text-[10px] font-black uppercase tracking-wider">
                        TUNELDA
                      </Badge>
                    </div>

                    <div className="space-y-4 mb-8">
                      {entry.data.personnel?.map((person, idx) => (
                        <div key={idx} className="p-4 bg-slate-100 dark:bg-white/5 rounded-2xl border border-slate-200 dark:border-white/10">
                          <div className="d-flex justify-content-between align-items-center">
                            <div>
                              <p className="m-0 font-black text-base">{person.fullName}</p>
                              <p className="m-0 text-[10px] font-bold opacity-60 uppercase tracking-widest">Guvohnoma: {person.certificateId}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="d-flex flex-wrap gap-3 mb-8">
                      <div className="d-flex align-items-center gap-2 px-4 py-2 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-100 dark:border-white/10">
                        <Clock size={14} className="opacity-40" />
                        <span className="text-[11px] font-bold opacity-60">Maqsad: {entry.data.purpose || 'Ishchi guruh'}</span>
                      </div>
                      <div className="d-flex align-items-center gap-2 px-4 py-2 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-100 dark:border-white/10">
                        <MapPin size={14} className="opacity-40" />
                        <span className="text-[11px] font-bold opacity-60">Chiqish: {entry.data.exit_location || 'Belgilanmagan'}</span>
                      </div>
                    </div>

                    <Button
                      onClick={() => handleCloseClick(entry)}
                      disabled={closing === entry._id}
                      className="w-100 btn-metro btn-primary py-4 rounded-2xl shadow-lg group-hover:scale-[1.02] transition-transform d-flex align-items-center justify-content-center gap-3"
                    >
                      {closing === entry._id ? (
                        <Spinner animation="border" size="sm" />
                      ) : (
                        <>
                          <CheckCircle2 size={20} />
                          <span className="font-black uppercase tracking-widest text-sm">Tuneldan chiqdi</span>
                        </>
                      )}
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Confirmation Modal */}
      <Modal 
        show={showConfirmModal} 
        onHide={() => !closing && setShowConfirmModal(false)}
        centered
        className="modal-metro"
      >
        <Modal.Body className="p-10 text-center">
          <div className="mb-8">
            <div className="icon-badge mx-auto mb-4 bg-primary/10 text-primary p-4 rounded-full inline-block">
              <AlertCircle size={48} />
            </div>
            <h3 className="text-2xl font-black uppercase italic m-0">Tasdiqlash</h3>
            <p className="opacity-60 uppercase tracking-widest text-[11px] mt-4 max-w-[300px] mx-auto">
              Xodim(lar)ning tuneldan chiqqaniga ishonchingiz komilmi?
            </p>
          </div>
          
          <div className="flex flex-col gap-4">
            <Button 
              className="btn-metro btn-primary py-4 text-sm font-black uppercase tracking-[0.2em]"
              onClick={confirmClose}
              disabled={closing}
            >
              Ha, Ishonchim komil
            </Button>
            <button 
              className="mt-4 text-[10px] font-black uppercase tracking-[0.3em] opacity-30 hover:opacity-100 transition-all border-0 bg-transparent"
              onClick={() => setShowConfirmModal(false)}
              disabled={closing}
            >
              Bekor qilish
            </button>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default OpenDU5Tracker;
