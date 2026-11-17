import { useState } from 'react';
import { Clock, Stethoscope, ChevronDown, Filter } from 'lucide-react';
import SectionTitle from '../components/common/SectionTitle';
import ScrollReveal from '../components/common/ScrollReveal';
import { useApi } from '../hooks/useApi';
import { api } from '../services/api';
import { PROCEDURE_CATEGORIES } from '../utils/constants';
import './Treatments.css';

export default function Treatments() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [expanded, setExpanded] = useState(null);

  const { data: procedures, loading } = useApi(
    () => api.getProcedures(activeCategory === 'All' ? null : activeCategory),
    [activeCategory]
  );

  return (
    <div className="treatments-page">
      <section className="page-hero">
        <div className="container page-hero__inner">
          <ScrollReveal>
            <span className="pill pill--primary">Treatments</span>
            <h1 className="page-hero__title">
              Treatments &amp; <span className="text-gradient">Procedures</span>
            </h1>
            <p className="page-hero__subtitle">
              State-of-the-art cardiac interventions performed with precision and care in our advanced catheterization laboratory.
            </p>
          </ScrollReveal>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {/* Category Filter */}
          <div className="treatments-filter">
            <Filter size={16} className="treatments-filter__icon" />
            <div className="treatments-filter__pills">
              {PROCEDURE_CATEGORIES.map(cat => (
                <button
                  key={cat}
                  id={`filter-${cat.toLowerCase()}-btn`}
                  className={`filter-pill ${activeCategory === cat ? 'filter-pill--active' : ''}`}
                  onClick={() => { setActiveCategory(cat); setExpanded(null); }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Procedures Accordion */}
          {loading ? (
            <div className="treatments-skeleton">
              {[...Array(4)].map((_, i) => <div key={i} className="skeleton-row" />)}
            </div>
          ) : (
            <div className="treatments-list">
              {(procedures || []).map((proc, i) => (
                <ScrollReveal key={proc.id} delay={i * 0.06} className="procedure-card">
                  <button
                    className={`procedure-card__header ${expanded === proc.id ? 'procedure-card__header--open' : ''}`}
                    onClick={() => setExpanded(expanded === proc.id ? null : proc.id)}
                    id={`procedure-${proc.id}-toggle`}
                  >
                    <div className="procedure-card__left">
                      <div className="procedure-card__icon">
                        <Stethoscope size={18} />
                      </div>
                      <div className="procedure-card__info">
                        <h3 className="procedure-card__title">{proc.title}</h3>
                        <span className={`procedure-card__cat cat--${proc.category.toLowerCase()}`}>{proc.category}</span>
                      </div>
                    </div>
                    <ChevronDown
                      size={18}
                      className={`procedure-card__chevron ${expanded === proc.id ? 'procedure-card__chevron--open' : ''}`}
                    />
                  </button>
                  {expanded === proc.id && (
                    <div className="procedure-card__body">
                      <p className="procedure-card__desc">{proc.desc}</p>
                      <div className="procedure-card__meta">
                        <div className="procedure-meta-item">
                          <Clock size={14} />
                          <span><strong>Duration:</strong> {proc.duration}</span>
                        </div>
                        <div className="procedure-meta-item">
                          <span>🏥</span>
                          <span><strong>Recovery:</strong> {proc.recovery}</span>
                        </div>
                        <div className="procedure-meta-item">
                          <span>💉</span>
                          <span><strong>Anesthesia:</strong> {proc.anesthesia}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </ScrollReveal>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
