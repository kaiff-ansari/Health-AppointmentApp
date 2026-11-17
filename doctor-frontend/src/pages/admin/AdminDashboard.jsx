import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  Mail,
  Heart,
  Activity,
  User,
  BookOpen,
  MessageSquare,
  HelpCircle,
  ExternalLink,
  Shield,
  LayoutDashboard,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import Toast from '../../components/common/Toast';

// Tabs
import AppointmentsTab from './tabs/AppointmentsTab';
import SubscribersTab from './tabs/SubscribersTab';
import SpecialtiesTab from './tabs/SpecialtiesTab';
import TreatmentsTab from './tabs/TreatmentsTab';
import DoctorTab from './tabs/DoctorTab';
import ArticlesTab from './tabs/ArticlesTab';
import ReviewsTab from './tabs/ReviewsTab';
import FaqsTab from './tabs/FaqsTab';

import './AdminDashboard.css';

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const { showToast } = useApp();
  const [activeTab, setActiveTab] = useState('appointments');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [counts, setCounts] = useState({
    appointments: 0,
    subscribers: 0,
    specialties: 0,
    treatments: 0,
  });

  useEffect(() => {
    fetchQuickStats();
  }, [activeTab]);

  async function fetchQuickStats() {
    try {
      const [appts, subs, specs, procs] = await Promise.allSettled([
        api.getAppointments(),
        api.getSubscribers(),
        api.getSpecialties(),
        api.getProcedures(),
      ]);

      setCounts({
        appointments: appts.status === 'fulfilled' ? (appts.value.total || appts.value.appointments?.length || 0) : 0,
        subscribers: subs.status === 'fulfilled' ? (subs.value?.length || 0) : 0,
        specialties: specs.status === 'fulfilled' ? (specs.value?.length || 0) : 0,
        treatments: procs.status === 'fulfilled' ? (procs.value?.length || 0) : 0,
      });
    } catch {
      // stats fallback
    }
  }

  const navItems = [
    { id: 'appointments', label: 'Appointments', icon: Calendar, badge: counts.appointments },
    { id: 'subscribers', label: 'Subscribers', icon: Mail, badge: counts.subscribers },
    { id: 'specialties', label: 'Specialties', icon: Heart, badge: counts.specialties },
    { id: 'treatments', label: 'Treatments', icon: Activity, badge: counts.treatments },
    { id: 'doctor', label: 'Doctor Profile', icon: User },
    { id: 'articles', label: 'Blog Articles', icon: BookOpen },
    { id: 'reviews', label: 'Patient Reviews', icon: MessageSquare },
    { id: 'faqs', label: 'FAQs', icon: HelpCircle },
  ];

  return (
    <div className="admin-root">
      <Toast />

      {/* Mobile Sidebar Overlay Backdrop */}
      {sidebarOpen && (
        <div
          className="admin-sidebar-backdrop"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Left Sidebar Navigation ─────────────────────────────────── */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'admin-sidebar--open' : ''}`}>
        <div className="admin-sidebar__brand">
          <div className="admin-sidebar__logo-icon">
            <Shield size={20} />
          </div>
          <div>
            <h1 className="admin-sidebar__title">HeartCare</h1>
            <p className="admin-sidebar__subtitle">Admin Console</p>
          </div>
          <button
            type="button"
            className="admin-sidebar-close"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="admin-sidebar__nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                className={`admin-nav-item ${isActive ? 'admin-nav-item--active' : ''}`}
                onClick={() => {
                  setActiveTab(item.id);
                  setSidebarOpen(false);
                }}
              >
                <Icon size={18} />
                <span>{item.label}</span>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="admin-nav-item__badge">{item.badge}</span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="admin-sidebar__footer">
          <Link to="/" target="_blank" className="admin-btn-preview">
            <ExternalLink size={15} />
            <span>View Live Website</span>
          </Link>
          <button
            type="button"
            className="admin-btn-logout"
            onClick={() => {
              logout();
              showToast({
                type: 'info',
                title: 'Signed Out',
                message: 'You have been logged out of the admin console.',
              });
            }}
          >
            <LogOut size={15} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* ── Main Content Area ───────────────────────────────────────── */}
      <main className="admin-main">
        <header className="admin-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button
              type="button"
              className="admin-mobile-toggle"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open navigation menu"
            >
              <Menu size={22} />
            </button>
            <div className="admin-header__title-wrap">
              <h2>
                {navItems.find((n) => n.id === activeTab)?.label || 'Dashboard'}
              </h2>
              <p className="admin-header__subtitle-desc">Manage and update your clinic data in real-time</p>
            </div>
          </div>

          <div className="admin-header__actions">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  background: 'var(--gradient-primary, linear-gradient(135deg, #1a6bbd, #0ea5a0))',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.8rem',
                  fontWeight: '700',
                  color: '#ffffff',
                  boxShadow: '0 2px 8px rgba(26, 107, 189, 0.25)',
                  flexShrink: 0,
                }}
              >
                {user?.name ? user.name.slice(0, 2).toUpperCase() : 'AD'}
              </div>
              <div className="admin-header__user-text" style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--clr-text, #0f1d2e)', fontWeight: '600', lineHeight: 1.2 }}>
                  {user?.name || 'Administrator'}
                </span>
                <span style={{ fontSize: '0.72rem', color: 'var(--clr-text-muted, #5a7899)' }}>
                  {user?.email || 'admin@heartcare.in'}
                </span>
              </div>
            </div>
          </div>
        </header>

        <div className="admin-content">
          {/* Quick Metrics Bar */}
          <div className="admin-stats-grid">
            <div className="admin-stat-box">
              <div
                className="admin-stat-box__icon"
                style={{ background: 'rgba(14, 165, 160, 0.15)', color: '#0ea5a0' }}
              >
                <Calendar size={22} />
              </div>
              <div>
                <div className="admin-stat-box__val">{counts.appointments}</div>
                <div className="admin-stat-box__label">Total Inquiries</div>
              </div>
            </div>

            <div className="admin-stat-box">
              <div
                className="admin-stat-box__icon"
                style={{ background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8' }}
              >
                <Mail size={22} />
              </div>
              <div>
                <div className="admin-stat-box__val">{counts.subscribers}</div>
                <div className="admin-stat-box__label">Subscribers</div>
              </div>
            </div>

            <div className="admin-stat-box">
              <div
                className="admin-stat-box__icon"
                style={{ background: 'rgba(244, 63, 94, 0.15)', color: '#f43f5e' }}
              >
                <Heart size={22} />
              </div>
              <div>
                <div className="admin-stat-box__val">{counts.specialties}</div>
                <div className="admin-stat-box__label">Specialties</div>
              </div>
            </div>

            <div className="admin-stat-box">
              <div
                className="admin-stat-box__icon"
                style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}
              >
                <Activity size={22} />
              </div>
              <div>
                <div className="admin-stat-box__val">{counts.treatments}</div>
                <div className="admin-stat-box__label">Procedures</div>
              </div>
            </div>
          </div>

          {/* Active Tab View */}
          {activeTab === 'appointments' && <AppointmentsTab />}
          {activeTab === 'subscribers' && <SubscribersTab />}
          {activeTab === 'specialties' && <SpecialtiesTab />}
          {activeTab === 'treatments' && <TreatmentsTab />}
          {activeTab === 'doctor' && <DoctorTab />}
          {activeTab === 'articles' && <ArticlesTab />}
          {activeTab === 'reviews' && <ReviewsTab />}
          {activeTab === 'faqs' && <FaqsTab />}
        </div>
      </main>
    </div>
  );
}
