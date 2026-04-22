import React, { useState, useEffect, useRef } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { Form, Button, Row, Col, Card, Alert, Spinner } from 'react-bootstrap';
import { Save, AlertCircle, CheckCircle2, Plus, Trash2, Clock, BookOpen, Calendar, ChevronLeft, ChevronRight, X } from 'lucide-react';
import axios from '../api/axios';
import useAuthStore from '../store/authStore';

// ─── Helper: Format a Date object to "DD-MM-YYYY HH:MM" ───────────────────────
const formatDate = (date) => {
  if (!(date instanceof Date) || isNaN(date)) return '';
  const dd = String(date.getDate()).padStart(2, '0');
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const yyyy = date.getFullYear();
  const hh = String(date.getHours()).padStart(2, '0');
  const min = String(date.getMinutes()).padStart(2, '0');
  return `${dd}-${mm}-${yyyy} ${hh}:${min}`;
};

// ─── Custom DateTime Picker ────────────────────────────────────────────────────
const DateTimePicker = ({ value, onChange, required }) => {
  const [open, setOpen] = useState(false);
  const [viewDate, setViewDate] = useState(value instanceof Date ? value : new Date());
  const [selectedDate, setSelectedDate] = useState(value instanceof Date ? value : new Date());
  const [hour, setHour] = useState(value instanceof Date && !isNaN(value) ? value.getHours() : new Date().getHours());
  const [minute, setMinute] = useState(value instanceof Date && !isNaN(value) ? value.getMinutes() : new Date().getMinutes());
  const ref = useRef(null);

  // Sync internal state when value prop changes or picker opens
  useEffect(() => {
    if (value instanceof Date && !isNaN(value)) {
      setViewDate(value);
      setSelectedDate(value);
      setHour(value.getHours());
      setMinute(value.getMinutes());
    }
  }, [value, open]);

  // Close when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const MONTHS = ['Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun',
                  'Iyul', 'Avgust', 'Sentabr', 'Oktabr', 'Noyabr', 'Dekabr'];
  const DAYS = ['Du', 'Se', 'Ch', 'Pa', 'Ju', 'Sh', 'Ya'];

  const prevMonth = () => setViewDate(d => new Date(d.getFullYear(), d.getMonth() - 1, 1));
  const nextMonth = () => setViewDate(d => new Date(d.getFullYear(), d.getMonth() + 1, 1));

  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year, month) => {
    const day = new Date(year, month, 1).getDay();
    return day === 0 ? 6 : day - 1; // Mon=0
  };

  const handleSelectDay = (day) => {
    const d = new Date(viewDate.getFullYear(), viewDate.getMonth(), day, hour, minute);
    setSelectedDate(d);
  };

  const applySelection = () => {
    const d = new Date(
      selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate(),
      hour, minute
    );
    onChange(d);
    setOpen(false);
  };

  const daysInMonth = getDaysInMonth(viewDate.getFullYear(), viewDate.getMonth());
  const firstDay = getFirstDayOfMonth(viewDate.getFullYear(), viewDate.getMonth());

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const isSelected = (d) =>
    d &&
    selectedDate.getDate() === d &&
    selectedDate.getMonth() === viewDate.getMonth() &&
    selectedDate.getFullYear() === viewDate.getFullYear();

  const isToday = (d) => {
    const now = new Date();
    return d && now.getDate() === d && now.getMonth() === viewDate.getMonth() && now.getFullYear() === viewDate.getFullYear();
  };

  return (
    <div className="position-relative" ref={ref}>
      {/* Input trigger */}
      <div
        className="input-metro border-2 py-3 px-4 shadow-sm d-flex align-items-center justify-content-between gap-3 cursor-pointer"
        style={{ cursor: 'pointer', minHeight: '52px' }}
        onClick={() => setOpen(o => !o)}
        role="button"
        tabIndex={0}
        onKeyDown={e => e.key === 'Enter' && setOpen(o => !o)}
      >
        <span className={value instanceof Date && !isNaN(value) ? '' : 'opacity-40'}>
          {value instanceof Date && !isNaN(value) ? formatDate(value) : 'Vaqtni tanlang...'}
        </span>
        <Calendar size={18} className="opacity-40 flex-shrink-0" />
      </div>

      {/* Pop-up portal (absolute positioned) */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.97 }}
            transition={{ duration: 0.2 }}
            className="position-absolute start-0 z-50"
            style={{ top: 'calc(100% + 8px)', minWidth: '320px', zIndex: 9999 }}
          >
            <div className="card-modern border-2 p-4 shadow-2xl" style={{
              background: 'var(--metro-panel)',
              borderColor: 'rgba(0,108,228,0.2)',
              borderRadius: '1.5rem',
              overflow: 'hidden'
            }}>
              {/* Header */}
              <div className="d-flex align-items-center justify-content-between mb-4">
                <button
                  type="button"
                  onClick={prevMonth}
                  className="p-2 border-0 rounded-xl"
                  style={{ background: 'rgba(0,108,228,0.08)', color: 'var(--metro-fg)' }}
                >
                  <ChevronLeft size={16} />
                </button>
                <span className="font-black uppercase tracking-widest text-sm">
                  {MONTHS[viewDate.getMonth()]} {viewDate.getFullYear()}
                </span>
                <button
                  type="button"
                  onClick={nextMonth}
                  className="p-2 border-0 rounded-xl"
                  style={{ background: 'rgba(0,108,228,0.08)', color: 'var(--metro-fg)' }}
                >
                  <ChevronRight size={16} />
                </button>
              </div>

              {/* Day names */}
              <div className="d-grid mb-2" style={{ gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px' }}>
                {DAYS.map(d => (
                  <div key={d} className="text-center text-[10px] font-black opacity-30 uppercase py-1">{d}</div>
                ))}
              </div>

              {/* Calendar cells */}
              <div className="d-grid mb-4" style={{ gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px' }}>
                {cells.map((d, i) => (
                  <button
                    key={i}
                    type="button"
                    disabled={!d}
                    onClick={() => d && handleSelectDay(d)}
                    className="border-0 rounded-xl text-sm font-bold py-1.5 transition-all"
                    style={{
                      background: isSelected(d) ? 'var(--metro-accent)' : isToday(d) ? 'rgba(0,108,228,0.12)' : 'transparent',
                      color: isSelected(d) ? 'white' : 'var(--metro-fg)',
                      opacity: d ? 1 : 0,
                      cursor: d ? 'pointer' : 'default',
                      fontWeight: isSelected(d) ? 900 : 600,
                    }}
                  >
                    {d}
                  </button>
                ))}
              </div>

              {/* Time picker */}
              <div className="d-flex align-items-center justify-content-center gap-3 py-3 rounded-2xl mb-4"
                style={{ background: 'rgba(0,108,228,0.05)', border: '1px solid rgba(0,108,228,0.1)' }}>
                <Clock size={16} className="opacity-40" />
                <div className="d-flex align-items-center gap-2">
                  <div className="d-flex flex-column align-items-center">
                    <button type="button" onClick={() => {
                      const newHour = (hour + 1) % 24;
                      setHour(newHour);
                      // Live update the date object to propagate changes
                      const d = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate(), newHour, minute);
                      setSelectedDate(d);
                    }} className="border-0 bg-transparent text-lg font-black opacity-50 hover:opacity-100 leading-none py-1" style={{ color: 'var(--metro-fg)' }}>▲</button>
                    <span className="font-black text-2xl tabular-nums" style={{ color: 'var(--metro-accent)', minWidth: '2ch', textAlign: 'center' }}>
                      {String(hour).padStart(2, '0')}
                    </span>
                    <button type="button" onClick={() => {
                      const newHour = (hour - 1 + 24) % 24;
                      setHour(newHour);
                      const d = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate(), newHour, minute);
                      setSelectedDate(d);
                    }} className="border-0 bg-transparent text-lg font-black opacity-50 hover:opacity-100 leading-none py-1" style={{ color: 'var(--metro-fg)' }}>▼</button>
                  </div>
                  <span className="font-black text-2xl opacity-40">:</span>
                  <div className="d-flex flex-column align-items-center">
                    <button type="button" onClick={() => {
                      const newMin = (minute + 1) % 60;
                      setMinute(newMin);
                      const d = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate(), hour, newMin);
                      setSelectedDate(d);
                    }} className="border-0 bg-transparent text-lg font-black opacity-50 hover:opacity-100 leading-none py-1" style={{ color: 'var(--metro-fg)' }}>▲</button>
                    <span className="font-black text-2xl tabular-nums" style={{ color: 'var(--metro-accent)', minWidth: '2ch', textAlign: 'center' }}>
                      {String(minute).padStart(2, '0')}
                    </span>
                    <button type="button" onClick={() => {
                      const newMin = (minute - 1 + 60) % 60;
                      setMinute(newMin);
                      const d = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate(), hour, newMin);
                      setSelectedDate(d);
                    }} className="border-0 bg-transparent text-lg font-black opacity-50 hover:opacity-100 leading-none py-1" style={{ color: 'var(--metro-fg)' }}>▼</button>
                  </div>
                </div>
              </div>

              {/* Confirm */}
              <button
                type="button"
                onClick={applySelection}
                className="w-100 border-0 py-3 rounded-2xl font-black uppercase tracking-widest text-sm text-white"
                style={{ background: 'var(--metro-accent)', cursor: 'pointer' }}
              >
                Tasdiqlash
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ─── Main JournalForm ──────────────────────────────────────────────────────────
const JournalForm = ({ type, onSuccess, du2Action }) => {
  const { station } = useAuthStore();
  const [formData, setFormData] = useState({});
  const [personnelRows, setPersonnelRows] = useState([{ certificateId: '', fullName: '' }]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [currentTime, setCurrentTime] = useState(formatDate(new Date()));
  const [stations, setStations] = useState([]);

  useEffect(() => {
    const fetchStations = async () => {
      try {
        const { data } = await axios.get('/auth/stations'); // Assuming endpoint exists for fetching stations
        setStations(data.map(s => s.name));
      } catch (err) {
        // Fallback stations if fetch fails
        setStations(['Bodomzor', 'Shahriston', 'Yunusobod', 'Turkiston', 'Minor', 'Abdulla Qodiriy', 'Paxtakor', 'Chorsu']);
      }
    };
    fetchStations();
  }, []);

  useEffect(() => {
    let initialData = {};
    if (type?.code === 'DU-2' && du2Action) {
      initialData = {
        action_type: du2Action,
        event_time: new Date()
      };
    } else if (type?.code === 'DU-5') {
      initialData = {
        record_time: new Date()
      };
    } else if (type?.code === 'DU-19') {
      initialData = {
        record_time: new Date(),
        completion_time: new Date()
      };
    }
    setFormData(initialData);
    setPersonnelRows([{ certificateId: '', fullName: '' }]);
    setError('');
    setSuccess(false);
    setCurrentTime(formatDate(new Date()));
  }, [type, du2Action]);

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(formatDate(new Date())), 60000);
    return () => clearInterval(interval);
  }, []);

  const handleInputChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePersonnelChange = (index, field, value) => {
    setPersonnelRows(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const addPersonnelRow = () => setPersonnelRows(prev => [...prev, { certificateId: '', fullName: '' }]);
  const removePersonnelRow = (index) => setPersonnelRows(prev => prev.filter((_, idx) => idx !== index));

  const buildSubmissionData = () => {
    const processed = {};
    Object.keys(formData).forEach(key => {
      processed[key] = formData[key] instanceof Date ? formatDate(formData[key]) : formData[key];
    });

    const base = {
      ...processed,
      stationName: station?.name || 'Unknown',
      stationCode: station?.department || 'Unknown',
      recordedAt: new Date().toISOString()
    };

    if (type.code === 'DU-5') {
      const filtered = personnelRows
        .filter(r => r.certificateId.trim() || r.fullName.trim())
        .map((r, i) => ({ id: i + 1, ...r, recordedAt: new Date().toISOString() }));
      return { ...base, personnelCount: filtered.length, personnel: filtered, dutyLabel: type.code, dutyTime: currentTime };
    }
    return { ...base, dutyLabel: type.code, dutyTime: currentTime };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await axios.post('/journals/entries', { journalTypeId: type._id, data: buildSubmissionData() });
      setSuccess(true);
      setTimeout(() => onSuccess(), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Jurnal yozuvini saqlashda xatolik yuz berdi.');
    } finally {
      setLoading(false);
    }
  };

  if (!type) {
    return (
      <div className="text-center py-20 opacity-40">
        <Spinner animation="border" variant="primary" className="mb-4" />
        <p className="font-black uppercase tracking-widest text-[10px]">Yuklanmoqda...</p>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}>
      <Card className="card-modern shadow-2xl p-4 p-md-10 border-0 border-top border-8 border-primary/10 bg-white dark:bg-metro-card">
        <Card.Body className="p-0">
          <Form onSubmit={handleSubmit} className="space-y-10">

            {/* DU-5 header */}
            {type.code === 'DU-5' && (
              <div className="space-y-6">
                <div className="space-y-6 p-6 rounded-3xl border-2 border-primary/20 bg-primary/5 text-metro-foreground shadow-inner">
                  <div className="d-flex align-items-center gap-3">
                    <Clock size={24} className="text-primary" />
                    <div>
                      <h4 className="m-0 font-black uppercase tracking-[0.2em]">Tunnelga yoʻnaltirilgan xodimlar</h4>
                      <p className="text-sm opacity-70 m-0">Vaqt va bekat avtomatik toʻldiriladi.</p>
                    </div>
                  </div>
                  <div className="d-flex flex-wrap gap-3">
                    <div className="badge-code bg-white/10 px-4 py-3 rounded-2xl">Bekat: {station?.name || 'Nomaʼlum'}</div>
                    <div className="badge-code bg-white/10 px-4 py-3 rounded-2xl">Vaqt: {formData.record_time instanceof Date ? formatDate(formData.record_time) : currentTime}</div>
                    <div className="badge-code bg-white/10 px-4 py-3 rounded-2xl">Duty: {type.code}</div>
                  </div>
                </div>

                {/* DU-5 Time Picker Section */}
                <div className="p-6 rounded-3xl border-2 border-primary/10 bg-slate-50 dark:bg-white/5">
                  <Form.Group className="space-y-3 m-0">
                    <Form.Label className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60 ml-1 d-flex align-items-center gap-2 m-0">
                      Vaqtni tanlang <span className="text-danger font-bold text-lg leading-none">*</span>
                    </Form.Label>
                    <DateTimePicker
                      value={formData.record_time instanceof Date ? formData.record_time : new Date()}
                      onChange={(date) => handleInputChange('record_time', date)}
                      required={true}
                    />
                  </Form.Group>
                </div>
              </div>
            )}

            {/* DU-2 header */}
            {type.code === 'DU-2' && (
              <div className="space-y-6">
                <div className="p-6 rounded-3xl border-2 border-primary/20 bg-primary/5 text-metro-foreground shadow-inner">
                  <div className="d-flex align-items-center justify-content-between flex-wrap gap-4">
                    <div className="d-flex align-items-center gap-4">
                      <div className="p-3 bg-primary/20 rounded-2xl">
                        <BookOpen size={28} className="text-primary" />
                      </div>
                      <div>
                        <h4 className="m-0 font-black uppercase tracking-[0.2em] text-xl">{du2Action}</h4>
                        <p className="text-xs opacity-60 m-0 uppercase font-bold tracking-widest">Poyezd harakatini qayd etish</p>
                      </div>
                    </div>
                    <div className="d-flex gap-3 flex-wrap">
                      <div className="px-5 py-3 bg-white/10 dark:bg-black/20 rounded-2xl border border-white/10">
                        <span className="text-[10px] font-black opacity-40 uppercase block mb-1">Tanlangan vaqt</span>
                        <span className="font-black text-base" style={{ color: 'var(--metro-accent)' }}>
                          {formData.event_time instanceof Date ? formatDate(formData.event_time) : '—'}
                        </span>
                      </div>
                      <div className="px-5 py-3 bg-white/10 dark:bg-black/20 rounded-2xl border border-white/10">
                        <span className="text-[10px] font-black opacity-40 uppercase block mb-1">Bekat</span>
                        <span className="font-black text-base">{station?.name}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* DU-2 Time Picker Section */}
                <div className="p-6 rounded-3xl border-2 border-primary/10 bg-slate-50 dark:bg-white/5">
                  <Form.Group className="space-y-3 m-0">
                    <Form.Label className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60 ml-1 d-flex align-items-center gap-2 m-0">
                      Vaqtni tanlang <span className="text-danger font-bold text-lg leading-none">*</span>
                    </Form.Label>
                    <DateTimePicker
                      value={formData.event_time instanceof Date ? formData.event_time : new Date()}
                      onChange={(date) => handleInputChange('event_time', date)}
                      required={true}
                    />
                  </Form.Group>
                </div>
              </div>
            )}

            {/* DU-5 Personnel section */}
            {type.code === 'DU-5' ? (
              <div className="space-y-6">
                {personnelRows.map((row, index) => (
                  <div key={index} className="p-4 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-3xl transition-all hover:border-primary/30">
                    <div className="d-flex align-items-center justify-content-between gap-3 mb-4">
                      <h4 className="m-0 text-lg font-black uppercase tracking-wider">Xodim #{index + 1}</h4>
                      <Button variant="ghost" type="button" onClick={() => removePersonnelRow(index)}
                        className="p-2 bg-white/10 rounded-xl border border-white/10 text-danger">
                        <Trash2 size={18} />
                      </Button>
                    </div>
                    <Row className="g-4">
                      <Col xs={12} md={6}>
                        <Form.Group className="space-y-2">
                          <Form.Label className="text-[10px] font-black uppercase tracking-[0.2em] opacity-50">Guvohnoma raqami</Form.Label>
                          <Form.Control type="text" required value={row.certificateId}
                            onChange={(e) => handlePersonnelChange(index, 'certificateId', e.target.value)}
                            className="input-metro border-2 py-3 px-4" placeholder="12345678" />
                        </Form.Group>
                      </Col>
                      <Col xs={12} md={6}>
                        <Form.Group className="space-y-2">
                          <Form.Label className="text-[10px] font-black uppercase tracking-[0.2em] opacity-50">F.I.SH</Form.Label>
                          <Form.Control type="text" required value={row.fullName}
                            onChange={(e) => handlePersonnelChange(index, 'fullName', e.target.value)}
                            className="input-metro border-2 py-3 px-4" placeholder="Ism Familiya" />
                        </Form.Group>
                      </Col>
                    </Row>
                  </div>
                ))}

                <div className="d-flex justify-content-end mb-8">
                  <Button variant="ghost" type="button" onClick={addPersonnelRow}
                    className="btn-metro border-2 border-dashed border-primary text-primary px-6 py-3 rounded-3xl d-flex align-items-center gap-3 hover:bg-primary/5 transition-all">
                    <Plus size={20} /> Yangi xodim qoʻshish
                  </Button>
                </div>

                <div className="p-8 rounded-[2.5rem] border-2 border-primary/10 bg-primary/5 shadow-inner">
                  <h5 className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 mb-6 flex align-items-center gap-2">
                    <AlertCircle size={14} /> Umumiy ma'lumotlar
                  </h5>
                  <Row className="g-6">
                  <Col xs={12} md={6}>
                    <Form.Group className="space-y-2">
                      <Form.Label className="text-[10px] font-black uppercase tracking-[0.2em] opacity-50">Tunelga tushishdan maqsadi</Form.Label>
                      <Form.Control as="textarea" required
                        className="input-metro border-2 py-3 px-4 min-h-[100px]" placeholder="Ish faoliyati mazmuni..."
                        value={formData.purpose || ''} onChange={(e) => handleInputChange('purpose', e.target.value)} />
                    </Form.Group>
                  </Col>
                  <Col xs={12} md={6}>
                    <Form.Group className="space-y-2">
                      <Form.Label className="text-[10px] font-black uppercase tracking-[0.2em] opacity-50">Naryad (ixtiyoriy)</Form.Label>
                      <Form.Control type="text"
                        className="input-metro border-2 py-3 px-4" placeholder="Naryad raqami"
                        value={formData.assignment || ''} onChange={(e) => handleInputChange('assignment', e.target.value)} />
                    </Form.Group>
                  </Col>
                  <Col xs={12}>
                    <Form.Group className="space-y-2">
                      <Form.Label className="text-[10px] font-black uppercase tracking-[0.2em] opacity-50">Chiqish manzili (bekat)</Form.Label>
                      <Form.Select required
                        className="input-metro border-2 py-3 px-4 shadow-sm"
                        value={formData.exit_location || ''}
                        onChange={(e) => handleInputChange('exit_location', e.target.value)}>
                        <option value="">Bekatni tanlang...</option>
                        {stations.map(name => <option key={name} value={name}>{name}</option>)}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>
              </div>

                {type.fields.some(f => f.name === 'notes') && (
                  <Form.Group className="space-y-3">
                    <Form.Label className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 ml-1">Qoʻshimcha eslatma</Form.Label>
                    <Form.Control as="textarea" className="input-metro border-2 py-3 px-4 shadow-sm min-h-[80px] resize-none"
                      placeholder="Qoʻshimcha maʼlumot kiriting..."
                      value={formData.notes || ''} onChange={(e) => handleInputChange('notes', e.target.value)} />
                  </Form.Group>
                )}
              </div>
            ) : type.code === 'DU-19' ? (
              <div className="space-y-6">
                {/* DU-19 Header */}
                <div className="p-6 rounded-3xl border-2 border-primary/20 bg-primary/5 text-metro-foreground shadow-inner">
                  <div className="d-flex align-items-center gap-3 mb-4">
                    <div className="p-3 bg-primary/20 rounded-2xl">
                      <BookOpen size={28} className="text-primary" />
                    </div>
                    <div>
                      <h4 className="m-0 font-black uppercase tracking-[0.2em] text-xl">Manyovr Jurnali</h4>
                      <p className="text-xs opacity-60 m-0 uppercase font-bold tracking-widest">Operatsiyani qayd etish</p>
                    </div>
                  </div>
                </div>

                {/* Date and Time Section */}
                <Row className="g-4">
                  <Col xs={12} md={6}>
                    <Form.Group className="space-y-3">
                      <Form.Label className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 ml-1 d-flex align-items-center gap-2 m-0">
                        Sana va vaqt <span className="text-danger font-bold text-lg leading-none">*</span>
                      </Form.Label>
                      <DateTimePicker
                        value={formData.record_time instanceof Date ? formData.record_time : new Date()}
                        onChange={(date) => handleInputChange('record_time', date)}
                        required={true}
                      />
                    </Form.Group>
                  </Col>
                  <Col xs={12} md={6}>
                    <Form.Group className="space-y-3">
                      <Form.Label className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 ml-1 d-flex align-items-center gap-2 m-0">
                        Amalga oshirilgan vaqti <span className="text-danger font-bold text-lg leading-none">*</span>
                      </Form.Label>
                      <DateTimePicker
                        value={formData.completion_time instanceof Date ? formData.completion_time : new Date()}
                        onChange={(date) => handleInputChange('completion_time', date)}
                        required={true}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                {/* Maneuver Details */}
                <Row className="g-4">
                  <Col xs={12} md={6}>
                    <Form.Group className="space-y-3">
                      <Form.Label className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 ml-1 d-flex align-items-center gap-2 m-0">
                        Manyovr tarkibidagi vagonlar soni <span className="text-danger font-bold text-lg leading-none">*</span>
                      </Form.Label>
                      <Form.Control type="number" required
                        className="input-metro border-2 py-3 px-4 shadow-sm" placeholder="0"
                        value={formData.wagon_count || ''}
                        onChange={(e) => handleInputChange('wagon_count', e.target.value)} />
                    </Form.Group>
                  </Col>
                  <Col xs={12} md={6}>
                    <Form.Group className="space-y-3">
                      <Form.Label className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 ml-1 d-flex align-items-center gap-2 m-0">
                        Svetofor <span className="text-danger font-bold text-lg leading-none">*</span>
                      </Form.Label>
                      <Form.Control type="text" required
                        className="input-metro border-2 py-3 px-4 shadow-sm" placeholder="Svetofor ma'lumoti"
                        value={formData.traffic_light || ''}
                        onChange={(e) => handleInputChange('traffic_light', e.target.value)} />
                    </Form.Group>
                  </Col>
                </Row>

                {/* Track Routes Section */}
                <div className="p-6 rounded-3xl border-2 border-primary/10 bg-slate-50 dark:bg-white/5">
                  <h5 className="text-sm font-black uppercase tracking-wider mb-4 opacity-70">Yo'l Kanava</h5>
                  <Row className="g-4">
                    <Col xs={12} md={6}>
                      <Form.Group className="space-y-3">
                        <Form.Label className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 ml-1 d-flex align-items-center gap-2 m-0">
                          Boshlanish kanava <span className="text-danger font-bold text-lg leading-none">*</span>
                        </Form.Label>
                        <Form.Control type="number" required
                          className="input-metro border-2 py-3 px-4 shadow-sm" placeholder="0"
                          value={formData.start_route || ''}
                          onChange={(e) => handleInputChange('start_route', e.target.value)} />
                      </Form.Group>
                    </Col>
                    <Col xs={12} md={6}>
                      <Form.Group className="space-y-3">
                        <Form.Label className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 ml-1 d-flex align-items-center gap-2 m-0">
                          Tugash kanava <span className="text-danger font-bold text-lg leading-none">*</span>
                        </Form.Label>
                        <Form.Control type="number" required
                          className="input-metro border-2 py-3 px-4 shadow-sm" placeholder="0"
                          value={formData.end_route || ''}
                          onChange={(e) => handleInputChange('end_route', e.target.value)} />
                      </Form.Group>
                    </Col>
                  </Row>
                </div>

                {/* Employee Information */}
                <Row className="g-4">
                  <Col xs={12} md={6}>
                    <Form.Group className="space-y-3">
                      <Form.Label className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 ml-1 d-flex align-items-center gap-2 m-0">
                        Xodim F.I.Sh <span className="text-danger font-bold text-lg leading-none">*</span>
                      </Form.Label>
                      <Form.Control type="text" required
                        className="input-metro border-2 py-3 px-4 shadow-sm" placeholder="Ism Familiya Otasi"
                        value={formData.employee_name || ''}
                        onChange={(e) => handleInputChange('employee_name', e.target.value)} />
                    </Form.Group>
                  </Col>
                  <Col xs={12} md={6}>
                    <Form.Group className="space-y-3">
                      <Form.Label className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 ml-1 d-flex align-items-center gap-2 m-0">
                        Lavozimi <span className="text-danger font-bold text-lg leading-none">*</span>
                      </Form.Label>
                      <Form.Control type="text" required
                        className="input-metro border-2 py-3 px-4 shadow-sm" placeholder="Lavozim nomi"
                        value={formData.position || ''}
                        onChange={(e) => handleInputChange('position', e.target.value)} />
                    </Form.Group>
                  </Col>
                </Row>

                {/* Notes Section */}
                <Form.Group className="space-y-3">
                  <Form.Label className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 ml-1">Izoh</Form.Label>
                  <Form.Control as="textarea" 
                    className="input-metro border-2 py-3 px-4 shadow-sm min-h-[100px] resize-none"
                    placeholder="Qoʻshimcha ma'lumot (ixtiyoriy)..."
                    value={formData.notes || ''} 
                    onChange={(e) => handleInputChange('notes', e.target.value)} />
                </Form.Group>
              </div>
            ) : (
              <Row className="g-4 g-md-8">
                {type.fields?.filter(f => f.name !== 'action_type' && (type.code !== 'DU-2' || f.name !== 'event_time') && (type.code !== 'DU-5' || f.name !== 'record_time') && (type.code !== 'DU-19' || !['record_time', 'completion_time', 'wagon_count', 'traffic_light', 'start_route', 'end_route', 'employee_name', 'position', 'notes'].includes(f.name))).map((field) => (
                  <Col key={field.name} xs={12} md={field.type === 'textarea' ? 12 : 6}>
                    <Form.Group className="space-y-3">
                      <Form.Label className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 ml-1 d-flex align-items-center gap-2 m-0">
                        {field.label} {field.required && <span className="text-danger font-bold text-lg leading-none">*</span>}
                      </Form.Label>

                      {field.type === 'text' && (
                        <Form.Control type="text" required={field.required}
                          className="input-metro border-2 py-3 px-4 shadow-sm"
                          placeholder="Ma'lumotni kiriting..."
                          value={formData[field.name] || ''}
                          onChange={(e) => handleInputChange(field.name, e.target.value)} />
                      )}

                      {field.type === 'number' && (
                        <Form.Control type="number" required={field.required}
                          className="input-metro border-2 py-3 px-4 shadow-sm" placeholder="0"
                          value={formData[field.name] || ''}
                          onChange={(e) => handleInputChange(field.name, e.target.value)} />
                      )}

                      {field.type === 'textarea' && (
                        <Form.Control as="textarea" required={field.required}
                          className="input-metro border-2 py-3 px-4 shadow-sm min-h-[120px] resize-none"
                          placeholder="Batafsil tavsif..."
                          value={formData[field.name] || ''}
                          onChange={(e) => handleInputChange(field.name, e.target.value)} />
                      )}

                      {field.type === 'select' && (
                        <Form.Select required={field.required}
                          className="input-metro cursor-pointer border-2 py-3 px-4 shadow-sm"
                          value={formData[field.name] || ''}
                          onChange={(e) => handleInputChange(field.name, e.target.value)}>
                          <option value="">Variantni tanlang...</option>
                          {field.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                        </Form.Select>
                      )}

                      {field.type === 'date' && (
                        <Form.Control type="date" required={field.required}
                          className="input-metro border-2 py-3 px-4 shadow-sm"
                          value={formData[field.name] || ''}
                          onChange={(e) => handleInputChange(field.name, e.target.value)} />
                      )}

                      {field.type === 'datetime' && (
                        <DateTimePicker
                          value={formData[field.name] instanceof Date ? formData[field.name] : (formData[field.name] ? new Date() : new Date())}
                          onChange={(date) => handleInputChange(field.name, date)}
                          required={field.required}
                        />
                      )}

                      {field.type === 'boolean' && (
                        <div className="p-4 bg-slate-100/50 dark:bg-white/5 border-2 border-slate-100 dark:border-white/10 rounded-2xl cursor-pointer hover:bg-primary/5 transition-all group">
                          <Form.Check type="checkbox" id={field.name} className="d-flex align-items-center gap-4 m-0 p-0">
                            <Form.Check.Input
                              className="peer h-6 w-6 cursor-pointer rounded-lg border-2 border-slate-300 dark:border-slate-600 m-0 shadow-sm"
                              checked={formData[field.name] || false}
                              onChange={(e) => handleInputChange(field.name, e.target.checked)} />
                            <Form.Check.Label className="text-sm font-black opacity-70 group-hover:opacity-100 uppercase tracking-widest cursor-pointer m-0">
                              Tasdiqlandi
                            </Form.Check.Label>
                          </Form.Check>
                        </div>
                      )}
                    </Form.Group>
                  </Col>
                ))}
              </Row>
            )}

            {error && (
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                <Alert variant="danger" className="rounded-2xl border-0 bg-danger/10 text-danger text-sm font-bold d-flex align-items-center gap-4 p-5 m-0 shadow-sm">
                  <AlertCircle size={24} /> {error}
                </Alert>
              </motion.div>
            )}

            <div className="d-flex justify-content-end pt-10 border-top border-slate-100 dark:border-white/10">
              <Button type="submit" disabled={loading || success}
                className={`btn-metro px-12 py-5 text-xl shadow-2xl transition-all duration-500 min-w-[240px] border-0 ${success ? 'bg-success text-white' : 'btn-primary'} disabled:opacity-50`}>
                {success ? (
                  <motion.div initial={{ scale: 0.5 }} animate={{ scale: 1 }} className="d-flex align-items-center gap-3">
                    <CheckCircle2 size={28} /> Muvaffaqiyatli Saqlandi!
                  </motion.div>
                ) : (
                  <div className="d-flex align-items-center gap-3">
                    {loading ? <Spinner animation="border" size="sm" /> : <Save size={28} />}
                    <span>{loading ? 'Saqlanmoqda...' : 'Yozuvni Kiritish'}</span>
                  </div>
                )}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </motion.div>
  );
};

export default JournalForm;
