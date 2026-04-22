import React, { useState, useEffect } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { Container, Row, Col, Card, Badge, Button, Form, InputGroup, Spinner, Table, Modal } from 'react-bootstrap';
import { History, Search, FileText, User, Calendar, Filter, ChevronDown, Eye, X } from 'lucide-react';
import axios from '../api/axios';

const JournalHistory = () => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [sortBy, setSortBy] = useState('date-desc');
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState(null);

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

  const getActionDescription = (entry) => {
    const data = entry.data || {};
    const journalCode = entry.journalTypeId?.code;
    
    switch(journalCode) {
      case 'DU-2':
        return `${data.action_type || ''} - ${data.train_number || ''} (${data.track_id || ''})`;
      case 'DU-5':
        return `${data.personnelCount || 0} ta xodim kiritildi`;
      case 'DU-19':
        return `${data.wagon_count || 0} vagon - ${data.start_route || '-'} → ${data.end_route || '-'} yo'l`;
      default:
        return entry.journalTypeId?.name || 'Noma\'lum';
    }
  };

  const filteredAndSortedEntries = entries
    .filter(entry => {
      let matches = true;
      
      // Search filter
      if (searchTerm) {
        matches = matches && (
          entry.journalTypeId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
          entry.createdBy?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          getActionDescription(entry).toLowerCase().includes(searchTerm.toLowerCase()) ||
          JSON.stringify(entry.data).toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      
      // Type filter
      if (filterType) {
        matches = matches && entry.journalTypeId?.code === filterType;
      }
      
      // Status filter
      if (filterStatus) {
        matches = matches && entry.status === filterStatus;
      }
      
      return matches;
    })
    .sort((a, b) => {
      switch(sortBy) {
        case 'date-desc':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'date-asc':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'type':
          return (a.journalTypeId?.name || '').localeCompare(b.journalTypeId?.name || '');
        default:
          return 0;
      }
    });

  const getStatusLabel = (entry) => {
    if (entry.journalTypeId?.code === 'DU-5') {
      return entry.data?.journal_status === 'closed' ? 'CHIQDI' : 'TUNELDA';
    }
    switch(entry.status) {
      case 'verified': return 'Tasdiqlangan';
      case 'pending': return 'Kutilmoqda';
      case 'rejected': return 'Rad etilgan';
      default: return entry.status;
    }
  };

  const getStatusVariant = (entry) => {
    if (entry.journalTypeId?.code === 'DU-5') {
      return entry.data?.journal_status === 'closed' ? 'success' : 'warning';
    }
    switch(entry.status) {
      case 'verified': return 'success';
      case 'pending': return 'warning';
      case 'rejected': return 'danger';
      default: return 'secondary';
    }
  };

  const uniqueTypes = [...new Set(entries.map(e => e.journalTypeId?.code).filter(Boolean))];

  const openDetailModal = (entry) => {
    setSelectedEntry(entry);
    setShowDetailModal(true);
  };

  return (
    <div className="space-y-10">
      {/* Header and Filters */}
      <div className="space-y-6">
        <header className="d-flex flex-column flex-md-row gap-4 items-center">
          <div className="relative group flex-1 w-100">
            <InputGroup className="position-relative group shadow-sm rounded-2xl overflow-hidden">
              <InputGroup.Text className="bg-transparent border-0 position-absolute start-0 top-50 translate-middle-y z-30 opacity-30 group-focus-within:opacity-100 transition-opacity">
                <Search size={22} className="text-primary" />
              </InputGroup.Text>
              <Form.Control 
                type="text" 
                placeholder="Nomi, xodim, harakat yoki kontent bo'yicha qidirish..."
                className="input-metro ps-12 py-4 border-2"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </InputGroup>
          </div>
        </header>

        {/* Filter Controls */}
        <div className="d-flex flex-wrap gap-4 align-items-center">
          <div className="position-relative" style={{ minWidth: '200px' }}>
            <Form.Select 
              className="input-metro border-2 py-3 px-4"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="">Barcha jurnal turlari</option>
              {uniqueTypes.map(type => {
                const typeObj = entries.find(e => e.journalTypeId?.code === type)?.journalTypeId;
                return <option key={type} value={type}>{typeObj?.name}</option>;
              })}
            </Form.Select>
          </div>

          <div className="position-relative" style={{ minWidth: '150px' }}>
            <Form.Select 
              className="input-metro border-2 py-3 px-4"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="">Barcha holatlar</option>
              <option value="pending">Kutilmoqda</option>
              <option value="verified">Tasdiqlangan</option>
              <option value="rejected">Rad etilgan</option>
            </Form.Select>
          </div>

          <div className="position-relative" style={{ minWidth: '150px' }}>
            <Form.Select 
              className="input-metro border-2 py-3 px-4"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="date-desc">Eng soʻnggi</option>
              <option value="date-asc">Eng qadimgi</option>
              <option value="type">Jurnal turi</option>
            </Form.Select>
          </div>

          {(filterType || filterStatus || searchTerm) && (
            <Button 
              variant="ghost"
              className="p-2 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl hover:bg-danger/20 transition-all"
              onClick={() => {
                setSearchTerm('');
                setFilterType('');
                setFilterStatus('');
              }}
            >
              <X size={18} /> Filtrlarni tozalash
            </Button>
          )}
        </div>
      </div>

      {/* Table View */}
      <div className="card-modern shadow-2xl overflow-hidden border-0">
        {loading ? (
          <div className="p-12 d-flex align-items-center justify-content-center">
            <Spinner animation="border" variant="primary" />
          </div>
        ) : filteredAndSortedEntries.length === 0 ? (
          <div className="p-24 text-center border-2 border-dashed border-slate-200 dark:border-white/5 d-flex flex-column align-items-center justify-content-center">
             <div className="p-8 bg-slate-100 dark:bg-white/5 rounded-full mb-8 opacity-30">
               <History size={64} />
             </div>
             <p className="text-xl font-bold opacity-40">Hech qanday tarixiy yozuvlar topilmadi.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table hover className="m-0" style={{ fontSize: '14px' }}>
              <thead className="bg-slate-100/50 dark:bg-white/5 border-bottom border-slate-200 dark:border-white/10">
                <tr>
                  <th className="px-4 py-3 text-[11px] font-black uppercase tracking-wider opacity-70">Jurnal Turi</th>
                  <th className="px-4 py-3 text-[11px] font-black uppercase tracking-wider opacity-70">Harakat</th>
                  <th className="px-4 py-3 text-[11px] font-black uppercase tracking-wider opacity-70">Xodim</th>
                  <th className="px-4 py-3 text-[11px] font-black uppercase tracking-wider opacity-70">Vaqt</th>
                  <th className="px-4 py-3 text-[11px] font-black uppercase tracking-wider opacity-70">Holat</th>
                  <th className="px-4 py-3 text-[11px] font-black uppercase tracking-wider opacity-70 text-center">Batafsil</th>
                </tr>
              </thead>
              <tbody>
                {filteredAndSortedEntries.map((entry, index) => (
                  <motion.tr
                    key={entry._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.02 }}
                    className="border-bottom border-slate-100 dark:border-white/5 hover:bg-primary/5 transition-colors"
                  >
                    <td className="px-4 py-4">
                      <div className="d-flex align-items-center gap-2">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <FileText size={16} className="text-primary" />
                        </div>
                        <div>
                          <p className="m-0 font-bold text-[12px]">{entry.journalTypeId?.code}</p>
                          <p className="m-0 text-[10px] opacity-60">{entry.journalTypeId?.name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <p className="m-0 font-bold text-[12px]">{getActionDescription(entry)}</p>
                    </td>
                    <td className="px-4 py-4">
                      <div>
                        <p className="m-0 font-bold text-[12px]">{entry.createdBy?.name}</p>
                        <p className="m-0 text-[10px] opacity-60">{entry.createdBy?.role}</p>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div>
                        <p className="m-0 font-bold text-[12px]">{new Date(entry.createdAt).toLocaleDateString('uz-UZ')}</p>
                        <p className="m-0 text-[10px] opacity-60">{new Date(entry.createdAt).toLocaleTimeString('uz-UZ')}</p>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <Badge 
                        bg={getStatusVariant(entry)}
                        className={`px-3 py-1 text-[10px] font-black uppercase tracking-wider border-2 ${
                          entry.journalTypeId?.code === 'DU-5' ? (
                            entry.data?.journal_status === 'closed' ? 'bg-success/10 border-success/20 text-success' : 'bg-warning/10 border-warning/20 text-warning'
                          ) : (
                            entry.status === 'verified' ? 'bg-success/10 border-success/20 text-success' : 
                            entry.status === 'pending' ? 'bg-warning/10 border-warning/20 text-warning' : 'bg-danger/10 border-danger/20 text-danger'
                          )
                        }`}
                      >
                        {getStatusLabel(entry)}
                      </Badge>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="p-2 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg hover:bg-primary hover:text-white transition-all"
                        onClick={() => openDetailModal(entry)}
                      >
                        <Eye size={16} />
                      </Button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      <Modal show={showDetailModal} onHide={() => setShowDetailModal(false)} centered className="modal-metro" size="lg">
        <Modal.Header className="border-0 pb-0">
          <Modal.Title className="text-xl font-black uppercase">Batafsil Ma'lumot</Modal.Title>
          <button className="btn-close" onClick={() => setShowDetailModal(false)} />
        </Modal.Header>
        <Modal.Body className="p-6">
          {selectedEntry && (
            <div className="space-y-6">
              <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10">
                <p className="text-[10px] font-black uppercase opacity-60 mb-2">Jurnal Turi</p>
                <p className="m-0 font-bold text-lg">{selectedEntry.journalTypeId?.name}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-100 dark:bg-white/5 rounded-2xl border border-slate-200 dark:border-white/10">
                  <p className="text-[10px] font-black uppercase opacity-60 mb-2">Xodim</p>
                  <p className="m-0 font-bold">{selectedEntry.createdBy?.name}</p>
                  <p className="m-0 text-[10px] opacity-60">{selectedEntry.createdBy?.role}</p>
                </div>
                <div className="p-4 bg-slate-100 dark:bg-white/5 rounded-2xl border border-slate-200 dark:border-white/10">
                  <p className="text-[10px] font-black uppercase opacity-60 mb-2">Vaqt</p>
                  <p className="m-0 font-bold">{new Date(selectedEntry.createdAt).toLocaleString('uz-UZ')}</p>
                </div>
              </div>

              <div className="p-4 bg-slate-100 dark:bg-white/5 rounded-2xl border border-slate-200 dark:border-white/10">
                <p className="text-[10px] font-black uppercase opacity-60 mb-3">Holat</p>
                <Badge 
                  bg={getStatusVariant(selectedEntry)}
                  className={`px-4 py-2 text-[11px] font-black uppercase tracking-wider border-2 ${
                    selectedEntry.journalTypeId?.code === 'DU-5' ? (
                      selectedEntry.data?.journal_status === 'closed' ? 'bg-success/10 border-success/20 text-success' : 'bg-warning/10 border-warning/20 text-warning'
                    ) : (
                      selectedEntry.status === 'verified' ? 'bg-success/10 border-success/20 text-success' : 
                      selectedEntry.status === 'pending' ? 'bg-warning/10 border-warning/20 text-warning' : 'bg-danger/10 border-danger/20 text-danger'
                    )
                  }`}
                >
                  {getStatusLabel(selectedEntry)}
                </Badge>
              </div>

              <div className="p-4 bg-slate-100 dark:bg-white/5 rounded-2xl border border-slate-200 dark:border-white/10">
                <p className="text-[10px] font-black uppercase opacity-60 mb-3">Kiritilgan Malumotlar</p>
                <div className="space-y-3">
                  {Object.entries(selectedEntry.data || {}).map(([key, value]) => {
                    if (Array.isArray(value)) {
                      return (
                        <div key={key}>
                          <p className="text-[10px] font-bold uppercase opacity-70 mb-2">{key.replace(/_/g, ' ')}</p>
                          <div className="space-y-2">
                            {value.map((item, idx) => (
                              <div key={idx} className="p-2 bg-white dark:bg-white/5 rounded border border-slate-200 dark:border-white/10 text-[11px]">
                                {typeof item === 'object' ? JSON.stringify(item) : String(item)}
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    }
                    return (
                      <div key={key} className="flex justify-between gap-4">
                        <p className="font-bold text-[11px] uppercase opacity-70 flex-shrink-0">{key.replace(/_/g, ' ')}:</p>
                        <p className="m-0 text-[11px] text-right break-words">{String(value)}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default JournalHistory;
