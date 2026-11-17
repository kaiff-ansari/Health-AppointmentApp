import { useState, useEffect, useRef } from 'react';
import { X, Calendar, Phone, Mail, Clock } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { api } from '../../services/api';
import { gsap } from 'gsap';
import confetti from 'canvas-confetti';
import './AppointmentModal.css';

export default function AppointmentModal() {
  const { modalOpen, closeModal, showToast } = useApp();
  const [submitting, setSubmitting] = useState(false);
  const overlayRef = useRef(null);
  const panelRef   = useRef(null);

  // GSAP open/close animation
  useEffect(() => {
    if (!overlayRef.current || !panelRef.current) return;
    if (modalOpen) {
      document.body.style.overflow = 'hidden';
      gsap.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.3, ease: 'power2.out' });
      gsap.fromTo(panelRef.current, { opacity: 0, y: 40, scale: 0.95 }, { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: 'back.out(1.4)' });
    } else {
      document.body.style.overflow = '';
    }
  }, [modalOpen]);

  async function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    setSubmitting(true);
    try {
      const res = await api.submitContact(data);
      closeModal();
      e.target.reset();

      // Gentle celebratory confetti
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.5 },
          colors: ['#0ea5a0', '#10b981', '#38bdf8', '#f59e0b']
        });
      } catch {
        // Confetti fallback
      }

      showToast({
        type: 'success',
        title: 'Appointment Request Received!',
        message: res.message || "Thank you! Dr. Sharma's team will contact you within 24 hours.",
        duration: 6000,
      });
    } catch (err) {
      showToast({
        type: 'error',
        title: 'Submission Failed',
        message: err.message || 'Failed to send message. Please try again or call directly.',
        duration: 5000,
      });
    } finally {
      setSubmitting(false);
    }
  }

  if (!modalOpen) return null;

  return (
    <div className="modal-overlay" ref={overlayRef} onClick={(e) => e.target === overlayRef.current && closeModal()}>
      <div className="modal-panel" ref={panelRef} role="dialog" aria-modal="true" aria-labelledby="modal-title">
        {/* Header */}
        <div className="modal-header">
          <div className="modal-header__left">
            <div className="modal-icon">
              <Calendar size={20} />
            </div>
            <div>
              <h3 id="modal-title">Book Appointment</h3>
              <p>We'll confirm within 24 hours</p>
            </div>
          </div>
          <button className="modal-close" onClick={closeModal} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        {/* Quick Info */}
        <div className="modal-info-strip">
          <div className="modal-info-item">
            <Phone size={14} />
            <span>+91 98765 43210</span>
          </div>
          <div className="modal-info-item">
            <Mail size={14} />
            <span>dr.sharma@heartcare.in</span>
          </div>
          <div className="modal-info-item">
            <Clock size={14} />
            <span>Mon–Fri: 9AM–6PM</span>
          </div>
        </div>

        {/* Form */}
        <form className="modal-form" onSubmit={handleSubmit} id="appointment-form">
          <div className="modal-form__row">
            <div className="modal-form__group">
              <label htmlFor="appt-name">Full Name *</label>
              <input id="appt-name" name="name" type="text" placeholder="Rajesh Khanna" required />
            </div>
            <div className="modal-form__group">
              <label htmlFor="appt-phone">Phone Number</label>
              <input id="appt-phone" name="phone" type="tel" placeholder="+91 98765 43210" />
            </div>
          </div>
          <div className="modal-form__group">
            <label htmlFor="appt-email">Email Address *</label>
            <input id="appt-email" name="email" type="email" placeholder="your@email.com" required />
          </div>
          <div className="modal-form__group">
            <label htmlFor="appt-date">Preferred Date</label>
            <input id="appt-date" name="preferredDate" type="date" min={new Date().toISOString().split('T')[0]} />
          </div>
          <div className="modal-form__group">
            <label htmlFor="appt-message">Symptoms / Reason for Visit *</label>
            <textarea
              id="appt-message"
              name="message"
              rows={3}
              placeholder="Briefly describe your symptoms or reason for visiting..."
              required
            />
          </div>
          <button
            type="submit"
            className="btn btn--primary btn--lg modal-submit"
            id="modal-submit-btn"
            disabled={submitting}
          >
            <Calendar size={18} />
            {submitting ? 'Submitting Request...' : 'Confirm Appointment Request'}
          </button>
        </form>
      </div>
    </div>
  );
}
