import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Container, Row, Col, Card, Form, Button, Badge, InputGroup, Spinner } from 'react-bootstrap';
import { Send, AlertTriangle, Users, Building2, MapPin, Search, Radio, ShieldAlert, Globe, Layout, Loader2, CheckCircle2, AlertCircle, Zap } from 'lucide-react';
import axios from '../api/axios';
import { socket } from '../utils/socket';
import './DispatcherPanel.scss';

const DispatcherPanel = () => {
  const [formData, setFormData] = useState({
    text: '',
    targetType: 'all',
    targetId: '',
    isUrgent: false
  });
  const [loading, setLoading] = useState(false);
  const [messageSent, setMessageSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await axios.post('/messages', formData);
      socket.emit('new_dispatcher_message', data);
      setMessageSent(true);
      setFormData({ text: '', targetType: 'all', targetId: '', isUrgent: false });
      setTimeout(() => setMessageSent(false), 3000);
    } catch (err) {
      console.error('Error sending message:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dispatcher-container">
      <header className="panel-header">
        <div className="title-group">
          <h2>Markaziy <span>Dispetcherlik</span> Pulti</h2>
          <p>Global operatsion boshqaruv va tezkor e'lonlar markazi</p>
        </div>
        <div className="live-status">
          <div className="dot" />
          <span>Jonli Efir Faol</span>
        </div>
      </header>

      <div className="main-controls">
        {/* Left: Broadcast Form */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="broadcast-card shadow-2xl"
        >
          <h3 className="form-title text-metro-foreground">
            <Send className="text-primary" size={28} /> Tezkor E'lon
          </h3>

          <Form onSubmit={handleSubmit} className="space-y-10">
            <Form.Group className="space-y-4">
              <Form.Label className="text-[10px] font-black uppercase tracking-[0.25em] opacity-40 ml-1">Xabar Mazmuni</Form.Label>
              <Form.Control 
                as="textarea"
                required
                className="input-metro min-h-[150px] resize-none text-lg font-bold p-6 bg-white/5 border-2"
                placeholder="Rasmiy xabar matnini kiriting..."
                value={formData.text}
                onChange={(e) => setFormData({ ...formData, text: e.target.value })}
              />
            </Form.Group>

            <Row className="g-4">
              <Col md={6}>
                <Form.Group className="space-y-3">
                  <Form.Label className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 ml-1">Yuborish Ko'lami</Form.Label>
                  <Form.Select 
                    className="input-metro h-14 font-black cursor-pointer bg-white/5 border-2 pr-10"
                    value={formData.targetType}
                    onChange={(e) => setFormData({ ...formData, targetType: e.target.value })}
                  >
                    <option value="all">Barcha Stansiyalar</option>
                    <option value="station">Maxsus Stansiya</option>
                    <option value="department">Yo'nalish / Bo'lim</option>
                  </Form.Select>
                </Form.Group>
              </Col>

              {formData.targetType !== 'all' && (
                <Col md={6}>
                  <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-3">
                    <Form.Label className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 ml-1">
                      Target ID
                    </Form.Label>
                    <Form.Control 
                      type="text" 
                      required
                      className="input-metro h-14 font-bold bg-white/5 border-2"
                      placeholder="Stansiya nomi yoki yo'nalish..."
                      value={formData.targetId}
                      onChange={(e) => setFormData({ ...formData, targetId: e.target.value })}
                    />
                  </motion.div>
                </Col>
              )}
            </Row>

            <div 
              className={`urgent-switch ${formData.isUrgent ? 'active shadow-lg shadow-danger/20' : ''}`}
              onClick={() => setFormData({ ...formData, isUrgent: !formData.isUrgent })}
            >
              <div className={`p-3 rounded-xl ${formData.isUrgent ? 'bg-danger text-white' : 'bg-danger/10 text-danger'} transition-all`}>
                <Zap size={20} />
              </div>
              <div>
                <p className={`text-sm font-black m-0 leading-none mb-1 ${formData.isUrgent ? 'text-danger' : 'text-metro-foreground'}`}>SHOSHILINCH E'LON</p>
                <p className="text-[9px] font-black opacity-30 uppercase tracking-widest m-0 leading-none">Ovozli va vizual signalni yoqish</p>
              </div>
            </div>

            <Button 
              type="submit" 
              disabled={loading || messageSent}
              className={`btn-metro w-100 h-16 text-lg border-0 shadow-2xl transition-all duration-500 ${
                messageSent ? 'bg-success text-white' : 'btn-primary'
              }`}
            >
              {messageSent ? (
                <div className="d-flex align-items-center gap-3"><CheckCircle2 size={24} /> YUBORILDI</div>
              ) : (
                <div className="d-flex align-items-center gap-3">
                  {loading ? <Spinner animation="border" size="sm" /> : <Send size={24} />}
                  <span>TIZIMGA E'LON QILISH</span>
                </div>
              )}
            </Button>
          </Form>
        </motion.div>

        {/* Right: Monitoring */}
        <div className="status-monitor">
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="monitor-card shadow-xl">
              <h4><ActivityCircle size={14} className="text-primary" /> Liniyalar Holati</h4>
              <div className="station-list">
                {[
                  { name: 'Chilonzor Yo\'li', status: 'Barqaror' },
                  { name: 'O\'zbekiston Yo\'li', status: 'Barqaror' },
                  { name: 'Yunusobod Yo\'li', status: 'Barqaror' },
                  { name: 'Halqa Yo\'li', status: 'Nazoratda' }
                ].map((line, i) => (
                  <div key={i} className="station-item">
                    <span className="name text-metro-foreground">{line.name}</span>
                    <div className="status">
                       <div className="indicator" />
                       <span className="text-metro-foreground">{line.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}>
            <div className="monitor-card shadow-xl border-top-4 border-primary">
              <h4><ShieldAlert size={14} className="text-primary" /> Xafvsizlik Tizimi</h4>
              <div className="p-4 bg-primary/5 rounded-2xl">
                <p className="text-xs font-bold leading-relaxed opacity-60 text-metro-foreground m-0">
                  <AlertCircle size={14} className="inline mr-2 text-primary" />
                  Barcha stansiyalar bilan ulanish barqaror. Xavfsizlik protokollari operatsion rejimda.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

const ActivityCircle = ({ size, className }) => (
  <div className={`w-2 h-2 rounded-full bg-primary animate-pulse ${className}`} style={{ width: size, height: size }} />
);

export default DispatcherPanel;
