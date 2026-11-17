// API base URL
export const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Navigation links
export const NAV_LINKS = [
  { label: 'Home',            path: '/' },
  { label: 'About',           path: '/about' },
  { label: 'Specializations', path: '/specialization' },
  { label: 'Treatments',      path: '/treatments' },
  { label: 'Experience',      path: '/experience' },
  { label: 'Reviews',         path: '/reviews' },
  { label: 'Blog',            path: '/blog' },
  { label: 'FAQs',            path: '/faqs' },
  { label: 'Contact',         path: '/contact' },
];

// Lucide icon name → color map for specialties
export const SPECIALTY_COLORS = {
  1: '#e74c6e',
  2: '#1a6bbd',
  3: '#0ea5a0',
  4: '#7c3aed',
  5: '#059669',
  6: '#d97706',
};

// Category filter options for procedures
export const PROCEDURE_CATEGORIES = ['All', 'Interventional', 'Diagnostic', 'Structural', 'Preventive'];

// Article categories
export const ARTICLE_CATEGORIES = ['All', 'Heart Disease', 'Hypertension', 'Emergency', 'Nutrition', 'Lifestyle', 'Procedures', 'Arrhythmia'];

// FAQ categories
export const FAQ_CATEGORIES = ['All', 'Appointments', 'Procedures', 'Heart Health', 'Emergency'];
