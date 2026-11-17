import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { api } from '../services/api';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [doctor, setDoctor]           = useState(null);
  const [modalOpen, setModalOpen]     = useState(false);
  const [navScrolled, setNavScrolled] = useState(false);
  const [toast, setToast]             = useState(null);

  const refreshDoctor = useCallback(async () => {
    try {
      const data = await api.getDoctor();
      if (data) {
        setDoctor(data);
      }
      return data;
    } catch (err) {
      console.error('Failed to load doctor profile in context:', err);
    }
  }, []);

  useEffect(() => {
    refreshDoctor();
  }, [refreshDoctor]);

  function openModal()  { setModalOpen(true); }
  function closeModal() { setModalOpen(false); }

  const showToast = useCallback(({ title, message, type = 'success', duration = 5000 }) => {
    setToast({
      id: Date.now(),
      title,
      message,
      type,
      duration,
    });
  }, []);

  const hideToast = useCallback(() => {
    setToast(null);
  }, []);

  return (
    <AppContext.Provider value={{
      doctor, setDoctor, refreshDoctor,
      modalOpen, openModal, closeModal,
      navScrolled, setNavScrolled,
      toast, showToast, hideToast,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
