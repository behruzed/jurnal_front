import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
  persist(
    (set) => ({
      station: null,
      employee: null,
      stationToken: null,
      employeeToken: null,
      theme: localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'),

      setTheme: (theme) => {
        set({ theme });
        localStorage.setItem('theme', theme);
        if (theme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      },

      setStation: (station, token) => set({ station, stationToken: token }),
      setEmployee: (employee, token) => set({ employee, employeeToken: token }),
      
      logoutEmployee: () => set({ employee: null, employeeToken: null }),
      logoutStation: () => set({ 
        station: null, 
        stationToken: null, 
        employee: null, 
        employeeToken: null 
      }),
    }),
    {
      name: 'metro-auth-storage',
    }
  )
);

export default useAuthStore;
