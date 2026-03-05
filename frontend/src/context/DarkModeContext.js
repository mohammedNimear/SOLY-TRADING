
import React, { createContext, useState, useContext, useEffect } from 'react';

const DarkModeContext = createContext();

export const useDarkMode = () => {
    const context = useContext(DarkModeContext);
    if (!context) {
        throw new Error('useDarkMode must be used within DarkModeProvider');
    }
    return context;
};
export const DarkModeProvider = ({ children }) => {
  // التحقق من وجود تفضيل محفوظ في localStorage، أو استخدام تفضيل نظام المستخدم
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    if (saved !== null) {
      return saved === 'true';
    }
    // إذا لم يوجد تفضيل، نستخدم تفضيل نظام التشغيل
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // تطبيق الكلاس المناسب على عنصر html
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', isDark);
  }, [isDark]);

  const toggleDarkMode = () => setIsDark(prev => !prev);

  return (
    <DarkModeContext.Provider value={{ isDark, toggleDarkMode }}>
      {children}
    </DarkModeContext.Provider>
  );
};
