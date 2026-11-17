import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Phone, Mail, MapPin, ArrowRight, Clock, Send, CheckCircle, Shield } from 'lucide-react';
import { NAV_LINKS } from '../../utils/constants';
import { api } from '../../services/api';
import { useApp } from '../../context/AppContext';
import './Footer.css';

/* ── Inline brand SVGs (lucide-react doesn't ship brand icons) ── */
const LinkedinIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
    <rect width="4" height="12" x="2" y="9"/>
    <circle cx="4" cy="4" r="2"/>
  </svg>
);
const TwitterIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/>
  </svg>
);
const InstagramIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);
const YoutubeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.95C5.12 20 12 20 12 20s6.88 0 8.59-.47a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/>
    <polygon fill="white" points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"/>
  </svg>
);

const STATS = [
  { value: '18+',    label: 'Years Experience' },
  { value: '12K+',   label: 'Patients Treated' },
  { value: '5,000+', label: 'Procedures Done' },
  { value: '4.9★',   label: 'Patient Rating' },
];

const SOCIAL_PLATFORMS = [
  { key: 'linkedin',  Icon: LinkedinIcon,  label: 'LinkedIn',  color: '#0a66c2', defaultHref: 'https://linkedin.com' },
  { key: 'twitter',   Icon: TwitterIcon,   label: 'Twitter',   color: '#1da1f2', defaultHref: 'https://twitter.com' },
  { key: 'instagram', Icon: InstagramIcon, label: 'Instagram', color: '#e1306c', defaultHref: 'https://instagram.com' },
  { key: 'youtube',   Icon: YoutubeIcon,   label: 'YouTube',   color: '#ff0000', defaultHref: 'https://youtube.com' },
];

const DEFAULT_WORKING_HOURS = [
  { day: 'Mon – Fri', time: '9 AM – 6 PM' },
  { day: 'Saturday',  time: '9 AM – 2 PM' },
  { day: 'Sunday',    time: 'Emergency' },
];

function getHoursBadgeClass(timeStr = '') {
  const lower = timeStr.toLowerCase();
  if (lower.includes('emergency') || lower.includes('closed')) {
    return 'footer__hours-badge--emrg';
  }
  if (lower.includes('2 pm') || lower.includes('1 pm') || lower.includes('half') || lower.includes('app')) {
    return 'footer__hours-badge--half';
  }
  return 'footer__hours-badge--open';
}

export default function Footer() {
  const { showToast, doctor } = useApp();
  const year = new Date().getFullYear();
  const [email, setEmail]       = useState('');
  const [subStatus, setSubStatus] = useState('idle'); // idle | success
  const quickLinks = NAV_LINKS.slice(0, 5);
  const moreLinks  = NAV_LINKS.slice(5);

  const socialLinks = SOCIAL_PLATFORMS.map(p => ({
    ...p,
    href: doctor?.socials?.[p.key]?.trim() || p.defaultHref,
  }));

  async function handleSubscribe(e) {
    e.preventDefault();
    if (!email) return;
    try {
      const res = await api.subscribeNewsletter(email);
      setSubStatus('success');
      setEmail('');
      showToast({
        type: 'success',
        title: 'Newsletter Subscribed!',
        message: res.message || 'Thank you for subscribing to our heart health newsletter!',
        duration: 5000,
      });
      setTimeout(() => setSubStatus('idle'), 4000);
    } catch (err) {
      showToast({
        type: 'error',
        title: 'Subscription Error',
        message: err.message || 'Subscription failed. Please try again.',
        duration: 5000,
      });
    }
  }

  return (
    <footer className="footer">
      {/* ── Decorative SVG Wave ──────────────────────────── */}
      <div className="footer__wave-wrap" aria-hidden="true">
        <svg viewBox="0 0 1440 80" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M0,40 C240,80 480,0 720,40 C960,80 1200,0 1440,40 L1440,80 L0,80 Z"
            fill="#0f1d2e"
          />
        </svg>
      </div>

      {/* ── Newsletter CTA Strip ─────────────────────────── */}
      <div className="footer__newsletter-strip">
        <div className="container footer__newsletter-inner">
          <div className="footer__newsletter-text">
            <span className="footer__newsletter-badge">📧 Health Newsletter</span>
            <h3>Get Free Heart Health Tips in Your Inbox</h3>
            <p>Monthly articles, lifestyle tips, and appointment reminders from Dr. Sharma.</p>
          </div>
          <form className="footer__newsletter-form" onSubmit={handleSubscribe}>
            {subStatus === 'success' ? (
              <div className="footer__newsletter-success">
                <CheckCircle size={18} />
                <span>Subscribed! Thank you.</span>
              </div>
            ) : (
              <>
                <input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="footer__newsletter-input"
                  id="footer-newsletter-input"
                />
                <button type="submit" className="footer__newsletter-btn" id="footer-newsletter-btn">
                  <Send size={16} /> Subscribe
                </button>
              </>
            )}
          </form>
        </div>
      </div>

      {/* ── Mini Stats Bar ───────────────────────────────── */}
      <div className="footer__stats-bar">
        <div className="container footer__stats-inner">
          {(doctor?.stats || STATS).map(s => (
            <div key={s.label} className="footer__stat">
              <span className="footer__stat-value">{s.value}</span>
              <span className="footer__stat-label">{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Main Footer Grid ─────────────────────────────── */}
      <div className="footer__main">
        <div className="container footer__grid">

          {/* Brand Column */}
          <div className="footer__brand">
            <Link to="/" className="footer__logo">
              <div className="footer__logo-icon">
                <Heart size={18} fill="white" />
              </div>
              <div className="footer__logo-text">
                <span className="footer__logo-name">{doctor?.name || 'Dr. Arjun Sharma'}</span>
                <span className="footer__logo-specialty">{doctor?.specialty || 'Interventional Cardiologist'}</span>
              </div>
            </Link>

            <p className="footer__tagline">"{doctor?.tagline || 'Expert Care. Personal Attention. Better Health.'}"</p>

            <p className="footer__bio">
              {doctor?.shortBio || doctor?.bio || 'Board-certified Interventional Cardiologist dedicated to world-class cardiac care with empathy and precision.'}
            </p>

            {/* Credentials badges */}
            <div className="footer__credentials">
              <span className="footer__cred-badge">🏥 AIIMS Trained</span>
              <span className="footer__cred-badge">🇺🇸 Cleveland Clinic</span>
              <span className="footer__cred-badge">🏆 24 Awards</span>
            </div>

            {/* Socials */}
            <div className="footer__socials">
              {socialLinks.map(({ Icon, href, label, color }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="footer__social-btn"
                  style={{ '--social-color': color }}
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer__col">
            <h4 className="footer__col-title">
              <span className="footer__col-title-line" />
              Quick Links
            </h4>
            <ul className="footer__links">
              {quickLinks.map(l => (
                <li key={l.path}>
                  <Link to={l.path} className="footer__link">
                    <ArrowRight size={12} className="footer__link-arrow" />
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* More Links */}
          <div className="footer__col">
            <h4 className="footer__col-title">
              <span className="footer__col-title-line" />
              More Pages
            </h4>
            <ul className="footer__links">
              {moreLinks.map(l => (
                <li key={l.path}>
                  <Link to={l.path} className="footer__link">
                    <ArrowRight size={12} className="footer__link-arrow" />
                    {l.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link to="/admin" className="footer__link footer__link--admin" title="Doctor & Admin Portal Login">
                  <Shield size={12} className="footer__link-arrow" style={{ opacity: 1, color: '#0ea5a0' }} />
                  Admin Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Hours */}
          <div className="footer__col footer__col--contact">
            <h4 className="footer__col-title">
              <span className="footer__col-title-line" />
              Get In Touch
            </h4>

            <div className="footer__contact-items">
              <a href={`tel:${(doctor?.phone || '+91 98765 43210').replace(/\s+/g, '')}`} className="footer__contact-item">
                <div className="footer__contact-icon footer__contact-icon--phone">
                  <Phone size={14} />
                </div>
                <div>
                  <span className="footer__contact-label">Emergency / Appointment</span>
                  <span className="footer__contact-value">{doctor?.phone || '+91 98765 43210'}</span>
                </div>
              </a>

              <a href={`mailto:${doctor?.email || 'dr.sharma@heartcare.in'}`} className="footer__contact-item">
                <div className="footer__contact-icon footer__contact-icon--mail">
                  <Mail size={14} />
                </div>
                <div>
                  <span className="footer__contact-label">Email Us</span>
                  <span className="footer__contact-value">{doctor?.email || 'dr.sharma@heartcare.in'}</span>
                </div>
              </a>

              <div className="footer__contact-item">
                <div className="footer__contact-icon footer__contact-icon--map">
                  <MapPin size={14} />
                </div>
                <div>
                  <span className="footer__contact-label">Clinic Address</span>
                  <span className="footer__contact-value">{doctor?.address || 'Suite 401, Medicity Tower, Sector 44, Gurugram, HR 122003'}</span>
                </div>
              </div>
            </div>

            {/* Hours card */}
            <div className="footer__hours-card">
              <div className="footer__hours-header">
                <Clock size={14} />
                <strong>Working Hours</strong>
              </div>
              <div className="footer__hours-rows">
                {(doctor?.workingHours?.length ? doctor.workingHours : DEFAULT_WORKING_HOURS).map((wh, idx) => (
                  <div key={idx} className="footer__hours-row">
                    <span>{wh.day}</span>
                    <span className={`footer__hours-badge ${getHoursBadgeClass(wh.time)}`}>{wh.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom Bar ───────────────────────────────────── */}
      <div className="footer__bottom">
        <div className="container footer__bottom-inner">
          <p className="footer__copyright">
            © {year} {doctor?.name || 'Dr. Arjun Sharma'}{doctor?.title ? ` ${doctor.title}` : ' MD, DM'}. All rights reserved.
          </p>
          <div className="footer__bottom-links">
            <a href="#" className="footer__bottom-link">Privacy Policy</a>
            <span className="footer__bottom-sep">·</span>
            <a href="#" className="footer__bottom-link">Terms of Use</a>
            <span className="footer__bottom-sep">·</span>
            <a href="#" className="footer__bottom-link">Disclaimer</a>
            <span className="footer__bottom-sep">·</span>
            <Link to="/admin" className="footer__admin-btn" title="Doctor & Admin Portal Login">
              <Shield size={12} />
              <span>Admin Login</span>
            </Link>
          </div>
          <p className="footer__made">
            Made with <Heart size={11} fill="#e74c6e" color="#e74c6e" /> for better heart health
          </p>
        </div>
      </div>
    </footer>
  );
}
