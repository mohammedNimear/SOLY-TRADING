// src/components/layout/Footer.jsx
import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="app-footer">
      <div className="flex items-center justify-center w-full">
        <p>© {currentYear} Soly-Trading - نظام إدارة متكامل</p>
      </div>
    </footer>
  );
};

export default Footer;
