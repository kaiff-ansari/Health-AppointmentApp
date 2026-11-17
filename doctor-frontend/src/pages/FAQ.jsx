import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import SectionTitle from '../components/common/SectionTitle';
import ScrollReveal from '../components/common/ScrollReveal';
import { useApi } from '../hooks/useApi';
import { api } from '../services/api';
import { FAQ_CATEGORIES } from '../utils/constants';
import { useApp } from '../context/AppContext';
import './FAQ.css';

export default function FAQ() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [expanded, setExpanded] = useState(null);
  const { openModal } = useApp();

  const { data: faqs, loading } = useApi(
    () => api.getFaqs(activeCategory === 'All' ? null : activeCategory),
    [activeCategory]
  );

  return (
    <div className="faq-page">
      <section className="page-hero">
        <div className="container page-hero__inner">
          <ScrollReveal>
            <span className="pill pill--primary">FAQs</span>
            <h1 className="page-hero__title">
              Frequently Asked <span className="text-gradient">Questions</span>
            </h1>
            <p className="page-hero__subtitle">
              Clear, honest answers to the questions our patients ask most often about appointments, procedures, and heart health.
            </p>
          </ScrollReveal>
        </div>
      </section>

      <section className="section">
        <div className="container faq-container">
          {/* Category Filter */}
          <div className="faq-filter">
            {FAQ_CATEGORIES.map(cat => (
              <button
                key={cat}
                id={`faq-cat-${cat.toLowerCase()}-btn`}
                className={`filter-pill ${activeCategory === cat ? 'filter-pill--active' : ''}`}
                onClick={() => { setActiveCategory(cat); setExpanded(null); }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* FAQ Accordion */}
          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {[...Array(5)].map((_, i) => <div key={i} className="skeleton-row" style={{ height: 68 }} />)}
            </div>
          ) : (
            <div className="faq-list">
              {(faqs || []).map((faq, i) => (
                <ScrollReveal key={faq.id} delay={i * 0.06} className="faq-item">
                  <button
                    className={`faq-item__question ${expanded === faq.id ? 'faq-item__question--open' : ''}`}
                    onClick={() => setExpanded(expanded === faq.id ? null : faq.id)}
                    id={`faq-${faq.id}-btn`}
                    aria-expanded={expanded === faq.id}
                  >
                    <span className="faq-item__q-text">{faq.question}</span>
                    <ChevronDown
                      size={20}
                      className={`faq-item__chevron ${expanded === faq.id ? 'faq-item__chevron--open' : ''}`}
                    />
                  </button>
                  {expanded === faq.id && (
                    <div className="faq-item__answer">
                      <p>{faq.answer}</p>
                    </div>
                  )}
                </ScrollReveal>
              ))}
            </div>
          )}

          {/* Still have questions CTA */}
          <ScrollReveal className="faq-cta">
            <div className="faq-cta__inner">
              <h3>Still Have Questions?</h3>
              <p>Our team is happy to answer any queries you might have.</p>
              <div className="faq-cta__buttons">
                <button className="btn btn--primary" onClick={openModal} id="faq-book-btn">
                  Book a Consultation
                </button>
                <a href="tel:+919876543210" className="btn btn--secondary">
                  Call Us Now
                </a>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
