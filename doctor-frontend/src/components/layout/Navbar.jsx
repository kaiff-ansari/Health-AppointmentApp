import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X, Phone, Calendar } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { NAV_LINKS } from '../../utils/constants';
import './Navbar.css';

export default function Navbar() {
  const { openModal, doctor } = useApp();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled]   = useState(false);
  const [progress, setProgress]   = useState(0);
  const location = useLocation();
  const navRef   = useRef(null);

  // Scroll progress + background
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 30);
      const docH = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(docH > 0 ? (y / docH) * 100 : 0);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close menu on route change
  useEffect(() => { setMenuOpen(false); }, [location]);

  return (
    <header ref={navRef} className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
      {/* Scroll Progress Bar */}
      <div className="navbar__progress" style={{ width: `${progress}%` }} />

      <div className="container navbar__inner">
        {/* Logo */}
        <Link to="/" className="navbar__logo">
          <div className="navbar__logo-icon">
            <span>❤</span>
          </div>
          <div className="navbar__logo-text">
            <span className="navbar__logo-name">{doctor?.name || 'Dr. Arjun Sharma'}</span>
            <span className="navbar__logo-title">{doctor?.specialty || 'Interventional Cardiologist'}</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="navbar__links" aria-label="Main navigation">
          {NAV_LINKS.map(link => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `navbar__link ${isActive ? 'navbar__link--active' : ''}`
              }
              end={link.path === '/'}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* CTA */}
        <div className="navbar__actions">
          <a
            href={`tel:${(doctor?.phone || '+91 98765 43210').replace(/\s+/g, '')}`}
            className="navbar__phone"
          >
            <Phone size={15} />
            <span>{doctor?.phone || '+91 98765 43210'}</span>
          </a>
          <button
            id="navbar-book-btn"
            className="btn btn--primary btn--sm"
            onClick={openModal}
          >
            <Calendar size={15} />
            Book Appointment
          </button>
        </div>

        {/* Mobile Hamburger */}
        <button
          id="navbar-menu-btn"
          className="navbar__hamburger"
          onClick={() => setMenuOpen(o => !o)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`navbar__mobile ${menuOpen ? 'navbar__mobile--open' : ''}`}>
        <nav aria-label="Mobile navigation">
          {NAV_LINKS.map(link => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `navbar__mobile-link ${isActive ? 'navbar__mobile-link--active' : ''}`
              }
              end={link.path === '/'}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
        <button className="btn btn--primary" onClick={() => { openModal(); setMenuOpen(false); }}>
          <Calendar size={16} />
          Book Appointment
        </button>
      </div>
    </header>
  );
}
