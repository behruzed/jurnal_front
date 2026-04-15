import React, { useState, useEffect } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { Form, Button, Row, Col, Card, Alert, Spinner } from 'react-bootstrap';
import { Save, AlertCircle, CheckCircle2, Plus, Trash2, Clock } from 'lucide-react';
import axios from '../api/axios';
import useAuthStore from '../store/authStore';

const JournalForm = ({ type, onSuccess }) => {
  const { station } = useAuthStore();
  const [formData, setFormData] = useState({});
  const [personnelRows, setPersonnelRows] = useState([{ certificateId: '', fullName: '' }]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleString('uz-UZ'));

  useEffect(() => {
    setFormData({});
    setPersonnelRows([{ certificateId: '', fullName: '' }]);
    setError('');
    setSuccess(false);
    setCurrentTime(new Date().toLocaleString('uz-UZ'));
  }, [type]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date().toLocaleString('uz-UZ'));
    }, 60000);
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

  const addPersonnelRow = () => {
    setPersonnelRows(prev => [...prev, { certificateId: '', fullName: '' }]);
  };

  const removePersonnelRow = (index) => {
    setPersonnelRows(prev => prev.filter((_, idx) => idx !== index));
  };

  const buildSubmissionData = () => {
    const baseData = {
      ...formData,
      stationName: station?.name || 'Unknown station',
      stationCode: station?.department || 'Unknown',
      recordedAt: new Date().toISOString()
    };

    if (type.code === 'DU-5') {
      const filteredPersonnel = personnelRows
        .filter(row => row.certificateId.trim() || row.fullName.trim())
        .map((row, index) => ({
          id: index + 1,
          certificateId: row.certificateId,
          fullName: row.fullName,
          recordedAt: new Date().toISOString()
        }));

      return {
        ...baseData,
        personnelCount: filteredPersonnel.length,
        personnel: filteredPersonnel,
        dutyLabel: type.code,
        dutyTime: currentTime
      };
    }

    return {
      ...baseData,
      dutyLabel: type.code,
      dutyTime: currentTime
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await axios.post('/journals/entries', {
        journalTypeId: type._id,
        data: buildSubmissionData()
      });
      setSuccess(true);
      setTimeout(() => {
        onSuccess();
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Jurnal yozuvini saqlashda xatolik yuz berdi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      <Card className="card-modern shadow-2xl p-4 p-md-10 border-0 border-top border-8 border-primary/10 bg-white dark:bg-metro-card">
        <Card.Body className="p-0">
          <Form onSubmit={handleSubmit} className="space-y-10">
            {type.code === 'DU-5' && (
              <div className="space-y-6 p-4 rounded-3xl border border-primary/10 bg-primary/5 text-metro-foreground">
                <div className="d-flex align-items-center gap-3">
                  <Clock size={24} className="text-primary" />
                  <div>
                    <h4 className="m-0 font-black uppercase tracking-[0.2em]">Tunnelga yoʻnaltirilgan xodimlar</h4>
                    <p className="text-sm opacity-70 m-0">Vaqt va bekat avtomatik toʻldiriladi, roʻyxatni qoʻshimcha qiling.</p>
                  </div>
                </div>
                <div className="d-flex flex-wrap gap-3">
                  <div className="badge-code bg-white/10 px-4 py-3 rounded-2xl">Bekat: {station?.name || 'Nomaʼlum'}</div>
                  <div className="badge-code bg-white/10 px-4 py-3 rounded-2xl">Vaqt: {currentTime}</div>
                  <div className="badge-code bg-white/10 px-4 py-3 rounded-2xl">Duty: {type.code}</div>
                </div>
              </div>
            )}

            {type.code === 'DU-5' ? (
              <div className="space-y-6">
                {personnelRows.map((row, index) => (
                  <div key={index} className="p-4 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-3xl transition-all hover:border-primary/30">
                    <div className="d-flex align-items-center justify-content-between gap-3 mb-4">
                      <h4 className="m-0 text-lg font-black uppercase tracking-wider">Xodim #{index + 1}</h4>
                      <Button
                        variant="ghost"
                        type="button"
                        onClick={() => removePersonnelRow(index)}
                        className="p-2 bg-white/10 dark:bg-white/10 rounded-xl border border-white/10 text-danger"
                      >
                        <Trash2 size={18} />
                      </Button>
                    </div>
                    <Row className="g-4">
                      <Col xs={12} md={6}>
                        <Form.Group className="space-y-2">
                          <Form.Label className="text-[10px] font-black uppercase tracking-[0.2em] opacity-50">Guvohnoma raqami</Form.Label>
                          <Form.Control
                            type="text"
                            required
                            value={row.certificateId}
                            onChange={(e) => handlePersonnelChange(index, 'certificateId', e.target.value)}
                            className="input-metro border-2 py-3 px-4"
                            placeholder="12345678"
                          />
                        </Form.Group>
                      </Col>
                      <Col xs={12} md={6}>
                        <Form.Group className="space-y-2">
                          <Form.Label className="text-[10px] font-black uppercase tracking-[0.2em] opacity-50">F.I.SH</Form.Label>
                          <Form.Control
                            type="text"
                            required
                            value={row.fullName}
                            onChange={(e) => handlePersonnelChange(index, 'fullName', e.target.value)}
                            className="input-metro border-2 py-3 px-4"
                            placeholder="Ism Familiya"
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                  </div>
                ))}

                <Button
                  variant="ghost"
                  type="button"
                  className="btn-metro border-2 border-dashed border-primary text-primary px-5 py-3 rounded-3xl d-flex align-items-center gap-3"
                  onClick={addPersonnelRow}
                >
                  <Plus size={18} /> Yangi xodim qoʻshish
                </Button>

                {type.fields.some((field) => field.name === 'notes') && (
                  <Form.Group className="space-y-3">
                    <Form.Label className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 ml-1 d-flex align-items-center gap-2 m-0">
                      Qoʻshimcha eslatma
                    </Form.Label>
                    <Form.Control
                      as="textarea"
                      className="input-metro border-2 py-3 px-4 shadow-sm min-h-[120px] resize-none"
                      placeholder="Qoʻshimcha maʼlumot kiriting..."
                      value={formData.notes || ''}
                      onChange={(e) => handleInputChange('notes', e.target.value)}
                    />
                  </Form.Group>
                )}
              </div>
            ) : (
              <Row className="g-4 g-md-8">
                {type.fields.map((field) => (
                  <Col key={field.name} xs={12} md={field.type === 'textarea' ? 12 : 6}>
                  <Form.Group className="space-y-3">
                    <Form.Label className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 ml-1 d-flex align-items-center gap-2 m-0">
                      {field.label} {field.required && <span className="text-danger font-bold text-lg leading-none">*</span>}
                    </Form.Label>
                    
                    {field.type === 'text' && (
                      <Form.Control 
                        type="text" 
                        required={field.required}
                        className="input-metro border-2 py-3 px-4 shadow-sm"
                        placeholder="Ma'lumotni kiriting..."
                        value={formData[field.name] || ''}
                        onChange={(e) => handleInputChange(field.name, e.target.value)}
                      />
                    )}

                    {field.type === 'number' && (
                      <Form.Control 
                        type="number" 
                        required={field.required}
                        className="input-metro border-2 py-3 px-4 shadow-sm"
                        placeholder="0"
                        value={formData[field.name] || ''}
                        onChange={(e) => handleInputChange(field.name, e.target.value)}
                      />
                    )}

                    {field.type === 'textarea' && (
                      <Form.Control 
                        as="textarea"
                        required={field.required}
                        className="input-metro border-2 py-3 px-4 shadow-sm min-h-[120px] resize-none"
                        placeholder="Batafsil tavsif..."
                        value={formData[field.name] || ''}
                        onChange={(e) => handleInputChange(field.name, e.target.value)}
                      />
                    )}

                    {field.type === 'select' && (
                      <div className="position-relative">
                        <Form.Select 
                          required={field.required}
                          className="input-metro appearance-none cursor-pointer pr-10 border-2 py-3 px-4 shadow-sm"
                          value={formData[field.name] || ''}
                          onChange={(e) => handleInputChange(field.name, e.target.value)}
                        >
                          <option value="">Variantni tanlang...</option>
                          {field.options.map(opt => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </Form.Select>
                      </div>
                    )}

                    {field.type === 'date' && (
                      <Form.Control 
                        type="date" 
                        required={field.required}
                        className="input-metro border-2 py-3 px-4 shadow-sm"
                        value={formData[field.name] || ''}
                        onChange={(e) => handleInputChange(field.name, e.target.value)}
                      />
                    )}

                    {field.type === 'boolean' && (
                      <div className="p-4 bg-slate-100/50 dark:bg-white/5 border-2 border-slate-100 dark:border-white/10 rounded-2xl cursor-pointer hover:bg-primary/5 transition-all group">
                         <Form.Check 
                            type="checkbox"
                            id={field.name}
                            className="d-flex align-items-center gap-4 m-0 p-0"
                         >
                            <Form.Check.Input 
                               className="peer h-6 w-6 cursor-pointer appearance-none rounded-lg border-2 border-slate-300 dark:border-slate-600 checked:bg-primary checked:border-primary transition-all m-0 shadow-sm"
                               checked={formData[field.name] || false}
                               onChange={(e) => handleInputChange(field.name, e.target.checked)}
                            />
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
              <Button 
                type="submit" 
                disabled={loading || success}
                className={`btn-metro px-12 py-5 text-xl shadow-2xl transition-all duration-500 min-w-[240px] border-0 ${
                  success ? 'bg-success text-white' : 'btn-primary'
                } disabled:opacity-50`}
              >
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
