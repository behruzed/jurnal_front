import React from 'react';
import { Train, Globe, Mail, Phone, Info } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="py-12 bg-metro-panel border-t border-metro-border mt-auto transition-colors duration-500">
      <div className="container mx-auto px-12">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          <div className="space-y-6 max-w-sm text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start gap-4">
              <div className="w-12 h-12 bg-metro-sidebar rounded-2xl flex items-center justify-center font-black text-white text-2xl border border-white/5 shadow-2xl">M</div>
              <div>
                <h3 className="text-xl font-black italic uppercase tracking-tighter m-0 text-metro-fg">TOSHKENT METROPOLITENI</h3>
                <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40 text-metro-fg">Raqamli Axborot Tizimi</p>
              </div>
            </div>
            <p className="text-[11px] font-black uppercase tracking-widest leading-relaxed opacity-40 text-metro-fg">
              O'zbekiston Respublikasi Transport Vazirligi tasarrufidagi "Toshkent Metropoliteni" unitar korxonasi rasmiy axborot boshqaruv portali.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-12">
             <div className="space-y-4">
                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 text-metro-fg">NAVIGATSIYA</h4>
                <div className="flex flex-col gap-3 font-black uppercase text-[10px] tracking-widest text-metro-fg">
                   <a href="#" className="hover:text-metro-accent transition-all text-decoration-none">Bosh Sahifa</a>
                   <a href="#" className="hover:text-metro-accent transition-all text-decoration-none">Statistika</a>
                   <a href="#" className="hover:text-metro-accent transition-all text-decoration-none">Yuridik</a>
                </div>
             </div>
             <div className="space-y-4">
                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 text-metro-fg">ALOQA</h4>
                <div className="flex flex-col gap-3 font-black uppercase text-[10px] tracking-widest text-metro-fg">
                   <span className="flex items-center gap-2"><Phone size={14} className="text-metro-accent" /> +998 71 239-00-00</span>
                   <span className="flex items-center gap-2"><Mail size={14} className="text-metro-accent" /> info@uzmetro.uz</span>
                </div>
             </div>
             <div className="hidden md:flex flex-col gap-4">
                 <h4 className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 text-metro-fg">XAVFSIZLIK</h4>
                 <div className="p-4 bg-metro-slate-50 dark:bg-metro-slate-950/20 border border-metro-border rounded-2xl flex items-center gap-3">
                    <Info size={20} className="text-metro-accent" />
                    <p className="text-[9px] font-black uppercase tracking-widest m-0 text-metro-fg opacity-60">
                      Tizim SSL protokoli orqali himoyalangan. Barcha kirishlar nazorat ostida.
                    </p>
                 </div>
             </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-metro-border flex flex-col md:flex-row items-center justify-between gap-6 opacity-30 text-metro-fg">
           <div className="flex items-center gap-3 font-black uppercase text-[9px] tracking-widest">
              <Train size={16} />
              <span>© 2026 TOSHKENT METROPOLITENI • BARCHA HUQUQLAR HIMOYALANGAN</span>
           </div>
           <div className="flex items-center gap-6 font-black uppercase text-[9px] tracking-[0.2em]">
              <span>VERSIYA: 2.5.0-ALPHA-INDUSTRIAL</span>
           </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
