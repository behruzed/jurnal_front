import React, { createContext, useContext, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const LoadingContext = createContext({
  setLoading: () => {},
});

export const useLoading = () => useContext(LoadingContext);

export const LoadingProvider = ({ children }) => {
  const [loading, setLoadingState] = useState(false);

  const setLoading = (val) => {
    setLoadingState(val);
  };

  // Attach to window object for global access without imports (as requested)
  useEffect(() => {
    window.setLoading = setLoading;
  }, []);

  return (
    <LoadingContext.Provider value={{ setLoading }}>
      {children}
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#020617]/80 backdrop-blur-md"
          >
            <div className="relative flex flex-col items-center">
              {/* Outer pulsing ring */}
              <motion.div
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity,
                  ease: "easeInOut" 
                }}
                className="absolute w-32 h-32 rounded-full border-2 border-primary/30"
              />
              
              {/* Spinning Metro Arc */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ 
                  duration: 1.5, 
                  repeat: Infinity, 
                  ease: "linear" 
                }}
                className="w-20 h-20 rounded-full border-4 border-transparent border-t-primary border-r-primary/50 relative"
              >
                <div className="absolute top-0 right-0 w-3 h-3 bg-primary rounded-full blur-[2px]" />
              </motion.div>

              {/* Logo / M in center */}
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-primary rounded-xl flex items-center justify-center font-black text-white text-xl shadow-lg shadow-primary/20"
              >
                M
              </motion.div>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-8 text-xs font-black uppercase tracking-[0.4em] text-primary animate-pulse"
              >
                Tizim Yuklanmoqda
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </LoadingContext.Provider>
  );
};
