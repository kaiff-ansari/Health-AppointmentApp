import { useState } from 'react';
import { Phone, Mail, MapPin, Clock, Send, CheckCircle } from 'lucide-react';
import SectionTitle from '../components/common/SectionTitle';
import ScrollReveal from '../components/common/ScrollReveal';
import { api } from '../services/api';
import { useApp } from '../context/AppContext';
import './Contact.css';

const WORKING_HOURS = [
  { day: 'Monday',    time: '9:00 AM – 6:00 PM', status: 'open' },
  { day: 'Tuesday',   time: '9:00 AM – 6:00 PM', status: 'open' },
  { day: 'Wednesday', time: '9:00 AM – 6:00 PM', status: 'open' },
  { day: 'Thursday',  time: '9:00 AM – 6:00 PM', status: 'open' },
  { day: 'Friday',    time: '9:00 AM – 6:00 PM', status: 'open' },
  { day: 'Saturday',  time: '9:00 AM – 2:00 PM', status: 'half' },
  { day: 'Sunday',    time: 'Emergency Only',     status: 'emergency' },
];

export default function Contact() {
  const { showToast, doctor } = useApp();
  const [status, setStatus] = useState('idle'); // idle | loading | success | error

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus('loading');
    const data = Object.fromEntries(new FormData(e.target));
    try {
      const res = await api.submitContact(data);
      setStatus('success');
      e.target.reset();
      showToast({
        type: 'success',
        title: 'Message Sent Successfully!',
        message: res.message || "We have received your request and will contact you within 24 hours.",
        duration: 6000,
      });
    } catch {
      setStatus('error');
      showToast({
        type: 'error',
        title: 'Failed to Send',
        message: 'Something went wrong. Please try again or call us directly.',
        duration: 5000,
      });
    }
  }

  return (
    <div className="contact-page">
      <section className="page-hero">
        <div className="container page-hero__inner">
          <ScrollReveal>
            <span className="pill pill--primary">Contact</span>
            <h1 className="page-hero__title">
              Get in Touch &amp; <span className="text-gradient">Book an Appointment</span>
            </h1>
            <p className="page-hero__subtitle">
              Reach out to our team — we're here to help you take the first step toward better heart health.
            </p>
          </ScrollReveal>
        </div>
      </section>

      <section className="section">
        <div className="container contact-grid">
          {/* Form */}
          <ScrollReveal className="contact-form-wrap">
            <div className="contact-card">
              <h2 className="contact-card__title">Send a Message</h2>
              <p className="contact-card__subtitle">We'll respond within 24 hours.</p>

              {status === 'success' ? (
                <div className="contact-success">
                  <CheckCircle size={48} className="contact-success__icon" />
                  <h3>Message Sent!</h3>
                  <p>Thank you for reaching out. Dr. Sharma's team will contact you within 24 hours to confirm your appointment.</p>
                  <button className="btn btn--primary" onClick={() => setStatus('idle')} id="contact-again-btn">
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} id="contact-main-form" className="contact-form">
                  <div className="contact-form__row">
                    <div className="contact-form__group">
                      <label htmlFor="contact-name">Full Name *</label>
                      <input id="contact-name" name="name" type="text" placeholder="Your full name" required />
                    </div>
                    <div className="contact-form__group">
                      <label htmlFor="contact-phone">Phone Number</label>
                      <input id="contact-phone" name="phone" type="tel" placeholder="+91 98765 43210" />
                    </div>
                  </div>
                  <div className="contact-form__group">
                    <label htmlFor="contact-email">Email Address *</label>
                    <input id="contact-email" name="email" type="email" placeholder="your@email.com" required />
                  </div>
                  <div className="contact-form__group">
                    <label htmlFor="contact-date">Preferred Appointment Date</label>
                    <input id="contact-date" name="preferredDate" type="date" min={new Date().toISOString().split('T')[0]} />
                  </div>
                  <div className="contact-form__group">
                    <label htmlFor="contact-message">Symptoms / Reason for Visit *</label>
                    <textarea
                      id="contact-message"
                      name="message"
                      rows={4}
                      placeholder="Please describe your symptoms, medical history, or reason for visiting Dr. Sharma..."
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="btn btn--primary btn--lg contact-submit"
                    id="contact-submit-btn"
                    disabled={status === 'loading'}
                  >
                    {status === 'loading' ? (
                      <>Sending...</>
                    ) : (
                      <><Send size={18} /> Send Message</>
                    )}
                  </button>
                  {status === 'error' && (
                    <p className="contact-error">Something went wrong. Please try again or call us directly.</p>
                  )}
                </form>
              )}
            </div>
          </ScrollReveal>

          {/* Info */}
          <div className="contact-info">
            {/* Quick Contact */}
            <ScrollReveal className="contact-info-card">
              <h3 className="contact-info-card__title">Contact Information</h3>
              <div className="contact-info-list">
                <a href={`tel:${(doctor?.phone || '+91 98765 43210').replace(/\s+/g, '')}`} className="contact-info-item">
                  <div className="contact-info-item__icon contact-info-item__icon--blue">
                    <Phone size={18} />
                  </div>
                  <div>
                    <strong>Phone</strong>
                    <p>{doctor?.phone || '+91 98765 43210'}</p>
                  </div>
                </a>
                <a href={`mailto:${doctor?.email || 'dr.sharma@heartcare.in'}`} className="contact-info-item">
                  <div className="contact-info-item__icon contact-info-item__icon--teal">
                    <Mail size={18} />
                  </div>
                  <div>
                    <strong>Email</strong>
                    <p>{doctor?.email || 'dr.sharma@heartcare.in'}</p>
                  </div>
                </a>
                <div className="contact-info-item">
                  <div className="contact-info-item__icon contact-info-item__icon--purple">
                    <MapPin size={18} />
                  </div>
                  <div>
                    <strong>Clinic Address</strong>
                    <p>{doctor?.address || 'Suite 401, Medicity Tower, Sector 44, Gurugram, Haryana 122003'}</p>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            {/* Working Hours */}
            <ScrollReveal className="contact-info-card" delay={0.1}>
              <div className="contact-hours-header">
                <Clock size={18} className="contact-hours-icon" />
                <h3 className="contact-info-card__title">Working Hours</h3>
              </div>
              <div className="hours-list">
                {(doctor?.workingHours || WORKING_HOURS).map((h, i) => (
                  <div key={h.day || i} className="hours-row">
                    <span className="hours-row__day">{h.day}</span>
                    <span className={`hours-row__time ${h.status ? `hours-row__time--${h.status}` : ''}`}>{h.time}</span>
                  </div>
                ))}
              </div>
            </ScrollReveal>

            {/* Map placeholder */}
            <ScrollReveal delay={0.2} className="contact-map">
              <div className="contact-map__placeholder">
                <MapPin size={36} className="contact-map__icon" />
                <p><strong>Medicity Heart Centre</strong></p>
                <p>Suite 401, Medicity Tower, Sector 44, Gurugram</p>
                <a
                  href="https://maps.google.com?q=Medicity+Tower+Gurugram"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn--primary"
                  id="contact-directions-btn"
                >
                  Get Directions
                </a>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>
    </div>
  );
}
