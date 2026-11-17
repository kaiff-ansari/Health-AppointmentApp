import { ArrowRight, Heart, Activity, Zap, Shield, Layers, TrendingUp, Stethoscope, Award } from 'lucide-react';
import SectionTitle from '../components/common/SectionTitle';
import ScrollReveal from '../components/common/ScrollReveal';
import Button from '../components/common/Button';
import { useApi } from '../hooks/useApi';
import { api } from '../services/api';
import './Specialization.css';

const ICON_MAP = {
  heart: Heart,
  activity: Activity,
  zap: Zap,
  shield: Shield,
  layers: Layers,
  'trending-up': TrendingUp,
  stethoscope: Stethoscope,
  award: Award,
};

function renderSpecIcon(iconName, size = 28) {
  const IconComponent = ICON_MAP[iconName?.toLowerCase()] || Heart;
  return <IconComponent size={size} />;
}

export default function Specialization() {
  const { data: specialties, loading } = useApi(() => api.getSpecialties());

  return (
    <div className="specialization-page">
      {/* Hero */}
      <section className="page-hero">
        <div className="container page-hero__inner">
          <ScrollReveal>
            <span className="pill pill--primary">Specializations</span>
            <h1 className="page-hero__title">
              Areas of <span className="text-gradient">Cardiac Expertise</span>
            </h1>
            <p className="page-hero__subtitle">
              Comprehensive coverage of all major cardiovascular conditions — from prevention to advanced interventional therapy.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Specialties Grid */}
      <section className="section">
        <div className="container">
          {loading ? (
            <div className="loading-grid grid-3">
              {[...Array(6)].map((_, i) => <div key={i} className="skeleton-card" />)}
            </div>
          ) : (
            <div className="spec-grid">
              {(specialties || []).map((spec, i) => (
                <ScrollReveal key={spec.id || spec._id} delay={i * 0.1} className="spec-card">
                  <div className="spec-card__top" style={{ '--spec-color': spec.color }}>
                    <div className="spec-card__icon-wrap" style={{ color: spec.color }}>
                      {renderSpecIcon(spec.icon)}
                    </div>
                    <h3 className="spec-card__title">{spec.title}</h3>
                  </div>
                  <div className="spec-card__body">
                    <p className="spec-card__short">{spec.shortDesc}</p>
                    <p className="spec-card__full">{spec.fullDesc}</p>
                    <Button
                      to="/treatments"
                      variant="outline"
                      className="spec-card__link"
                      id={`spec-card-${spec.id}-btn`}
                    >
                      View Treatments <ArrowRight size={15} />
                    </Button>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
