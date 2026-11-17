import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, ArrowRight, Award, Users, Activity, Star, ChevronRight, Shield, Heart, Zap } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ParticleBackground from '../components/three/ParticleBackground';
import SectionTitle from '../components/common/SectionTitle';
import ScrollReveal from '../components/common/ScrollReveal';
import Button from '../components/common/Button';
import { useApp } from '../context/AppContext';
import { useApi } from '../hooks/useApi';
import { api } from '../services/api';
import './Home.css';

gsap.registerPlugin(ScrollTrigger);

const STAT_CONFIGS = [
  { icon: Award,    color: '#1a6bbd' },
  { icon: Users,    color: '#0ea5a0' },
  { icon: Activity, color: '#7c3aed' },
  { icon: Star,     color: '#d97706' },
];

const DEFAULT_STATS = [
  { value: '18+',     label: 'Years Experience' },
  { value: '12,000+', label: 'Patients Treated' },
  { value: '5,000+',  label: 'Procedures Done' },
  { value: '4.9',     label: 'Patient Rating' },
];

const VALUE_ICONS = {
  heart:  { icon: Heart,  color: '#e74c6e' },
  shield: { icon: Shield, color: '#1a6bbd' },
  zap:    { icon: Zap,    color: '#0ea5a0' },
  users:  { icon: Users,  color: '#7c3aed' },
  award:  { icon: Award,  color: '#d97706' },
};

const FEATURES = [
  {
    icon: Shield,
    title: 'Evidence-Based Treatment',
    desc: 'Every treatment plan is built on the latest clinical research and international cardiology guidelines.',
    color: '#1a6bbd',
  },
  {
    icon: Heart,
    title: 'Compassionate Care',
    desc: 'We treat every patient like family — listening, explaining, and partnering with you for better health.',
    color: '#e74c6e',
  },
  {
    icon: Zap,
    title: 'Advanced Technology',
    desc: 'State-of-the-art cardiac catheterization lab with the latest imaging and interventional equipment.',
    color: '#0ea5a0',
  },
];

const SPEC_ICON_MAP = {
  heart: '❤',
  activity: '📊',
  zap: '⚡',
  shield: '🛡',
  layers: '🫀',
  'trending-up': '📈',
  stethoscope: '🩺',
  award: '🏆',
};

const DEFAULT_SPECIALTIES = [
  { title: 'Coronary Artery Disease',  icon: '❤', color: '#fee2e2', accent: '#e74c6e' },
  { title: 'Heart Failure Management', icon: '📊', color: '#dbeafe', accent: '#1a6bbd' },
  { title: 'Cardiac Arrhythmia',       icon: '⚡', color: '#d1fae5', accent: '#059669' },
  { title: 'Preventive Cardiology',    icon: '🛡', color: '#e0f5f4', accent: '#0ea5a0' },
  { title: 'Structural Heart Disease', icon: '🫀', color: '#ede9fe', accent: '#7c3aed' },
  { title: 'Hypertension & Risk',      icon: '📈', color: '#fef3c7', accent: '#d97706' },
];

const DEFAULT_REVIEWS = [
  { name: 'Rajesh Khanna', review: 'Dr. Sharma literally saved my life. His calm demeanor and expertise gave me tremendous confidence.', rating: 5, avatar: 'RK', condition: 'Coronary Angioplasty' },
  { name: 'Sunita Patel', review: 'Within three months I felt like a new person. His patience in explaining everything was exceptional.', rating: 5, avatar: 'SP', condition: 'Hypertension & CAD Prevention' },
  { name: 'Vikram Malhotra', review: 'After years of AFib, his ablation procedure resolved it completely. Highly recommend!', rating: 5, avatar: 'VM', condition: 'TAVR Procedure' },
];

function getInitials(name = 'Dr. Arjun Sharma') {
  const parts = name.replace(/^dr\.?\s+/i, '').trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return (parts[0] || 'AS').slice(0, 2).toUpperCase();
}

function renderHeroTitle(tagline) {
  if (!tagline) {
    return (
      <>
        Expert Care.{' '}
        <span className="text-gradient">Personal Attention.</span>
        <br />
        Better Health.
      </>
    );
  }
  const parts = tagline.split('.').map(p => p.trim()).filter(Boolean);
  if (parts.length >= 3) {
    return (
      <>
        {parts[0]}.{' '}
        <span className="text-gradient">{parts[1]}.</span>
        <br />
        {parts.slice(2).join('. ')}.
      </>
    );
  }
  if (parts.length === 2) {
    return (
      <>
        {parts[0]}.{' '}
        <span className="text-gradient">{parts[1]}.</span>
      </>
    );
  }
  return <span className="text-gradient">{tagline}</span>;
}

export default function Home() {
  const { openModal, doctor } = useApp();
  const { data: specialtiesData } = useApi(() => api.getSpecialties());
  const { data: reviewsData }     = useApi(() => api.getReviews(3));

  const heroTitleRef  = useRef(null);
  const heroSubRef    = useRef(null);
  const heroCTARef    = useRef(null);
  const statRefs      = useRef([]);
  const statsBarRef   = useRef(null);

  const awardStat = doctor?.stats?.find(s => s.label?.toLowerCase().includes('award'));
  const ratingStat = doctor?.stats?.find(s => s.label?.toLowerCase().includes('rating'));
  const patientsStat = doctor?.stats?.find(s => s.label?.toLowerCase().includes('patient'));

  const displayStats = (doctor?.stats && doctor.stats.length ? doctor.stats : DEFAULT_STATS).map((st, i) => {
    const config = STAT_CONFIGS[i % STAT_CONFIGS.length];
    return {
      value: st.value,
      label: st.label,
      icon: config.icon,
      color: config.color,
    };
  });

  const displaySpecialties = specialtiesData && specialtiesData.length ? specialtiesData.slice(0, 6) : DEFAULT_SPECIALTIES;
  const displayReviews = reviewsData && reviewsData.length ? reviewsData.slice(0, 3) : DEFAULT_REVIEWS;

  const displayValues = (doctor?.values && doctor.values.length ? doctor.values.slice(0, 3) : FEATURES).map((v, i) => {
    const iconKey = typeof v.icon === 'string' ? v.icon.toLowerCase() : '';
    const matched = VALUE_ICONS[iconKey] || Object.values(VALUE_ICONS)[i % Object.values(VALUE_ICONS).length];
    return {
      title: v.title,
      desc: v.desc,
      icon: typeof v.icon === 'function' ? v.icon : matched.icon,
      color: v.color || matched.color,
    };
  });

  // Hero entrance animation
  useEffect(() => {
    const tl = gsap.timeline({ delay: 0.2 });
    tl.fromTo(heroTitleRef.current,
      { opacity: 0, y: 60 },
      { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out' }
    )
    .fromTo(heroSubRef.current,
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, '-=0.5'
    )
    .fromTo(heroCTARef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, '-=0.4'
    );
  }, []);

  // Stats counter
  useEffect(() => {
    ScrollTrigger.create({
      trigger: statsBarRef.current,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        gsap.fromTo(
          statRefs.current.filter(Boolean),
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.6, stagger: 0.12, ease: 'power3.out' }
        );
      },
    });
  }, [displayStats.length]);

  return (
    <div className="home">
      {/* ── HERO ─────────────────────────────────────────── */}
      <section className="hero" id="hero">
        <ParticleBackground />

        <div className="container hero__inner">
          <div className="hero__badge pill pill--primary">
            <span className="hero__badge-dot" />
            {doctor?.specialty || 'Interventional Cardiology'} — {doctor?.address ? doctor.address.split(',').slice(-2, -1)[0]?.trim() || 'Gurugram' : 'Gurugram'}, India
          </div>

          <h1 ref={heroTitleRef} className="hero__title">
            {renderHeroTitle(doctor?.tagline)}
          </h1>

          <p ref={heroSubRef} className="hero__subtitle">
            {doctor?.name || 'Dr. Arjun Sharma'} — {doctor?.title || 'Board-Certified Interventional Cardiologist'}. {doctor?.shortBio || 'Trained at AIIMS New Delhi & Cleveland Clinic, USA.'}
          </p>

          <div ref={heroCTARef} className="hero__cta">
            <button
              id="hero-book-btn"
              className="btn btn--primary btn--lg"
              onClick={openModal}
            >
              <Calendar size={20} />
              Book Appointment
            </button>
            <Button to="/about" variant="secondary" size="lg" id="hero-learn-btn">
              Learn About {doctor?.name ? doctor.name.split(' ')[0] + ' ' + (doctor.name.split(' ')[1] || '') : 'Dr. Sharma'}
              <ArrowRight size={20} />
            </Button>
          </div>

          {/* Trust pills */}
          <div className="hero__trust">
            <div className="hero__trust-item">
              <span className="hero__trust-dot hero__trust-dot--green" />
              {doctor?.training ? (doctor.training.includes('+') ? doctor.training.split('+')[0]?.trim() : doctor.training) : 'AIIMS Trained'}
            </div>
            <div className="hero__trust-divider" />
            <div className="hero__trust-item">
              <span className="hero__trust-dot hero__trust-dot--blue" />
              {doctor?.training && doctor.training.includes('+') ? doctor.training.split('+')[1]?.trim() : 'Cleveland Clinic Fellowship'}
            </div>
            <div className="hero__trust-divider" />
            <div className="hero__trust-item">
              <span className="hero__trust-dot hero__trust-dot--purple" />
              {awardStat ? `${awardStat.value} Awards Won` : '24 National Awards'}
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="hero__scroll-hint">
          <div className="hero__scroll-mouse">
            <div className="hero__scroll-wheel" />
          </div>
          <span>Scroll to explore</span>
        </div>
      </section>

      {/* ── STATS BAR ────────────────────────────────────── */}
      <section className="stats-bar" ref={statsBarRef}>
        <div className="container stats-bar__inner">
          {displayStats.map((stat, i) => (
            <div
              key={stat.label || i}
              ref={el => (statRefs.current[i] = el)}
              className="stat-card"
            >
              <div className="stat-card__icon" style={{ background: `${stat.color}18`, color: stat.color }}>
                <stat.icon size={24} />
              </div>
              <div className="stat-card__text">
                <span className="stat-card__value" style={{ color: stat.color }}>{stat.value}</span>
                <span className="stat-card__label">{stat.label}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── ABOUT SNIPPET ────────────────────────────────── */}
      <section className="section home-about">
        <div className="container home-about__inner">
          <ScrollReveal className="home-about__text">
            <span className="pill pill--primary">About {doctor?.name || 'Dr. Sharma'}</span>
            <h2 className="home-about__heading">
              Dedicated to Your Heart's <span className="text-gradient">Health & Longevity</span>
            </h2>
            {doctor?.bio ? (
              doctor.bio.split('\n\n').map((para, idx) => (
                <p key={idx} style={idx > 0 ? { marginTop: '1rem' } : undefined}>
                  {para}
                </p>
              ))
            ) : (
              <>
                <p>
                  With over 18 years of clinical excellence, Dr. Arjun Sharma has built a reputation as one of India's
                  leading Interventional Cardiologists. His approach combines cutting-edge interventional techniques
                  with a deeply personal touch — ensuring every patient feels heard, respected, and cared for.
                </p>
                <p style={{ marginTop: '1rem' }}>
                  He completed his MD from AIIMS New Delhi, followed by a prestigious cardiology fellowship at
                  the Cleveland Clinic, USA — bringing world-class expertise to his patients in India.
                </p>
              </>
            )}
            <div className="home-about__cta">
              <Button to="/about" variant="primary" size="lg" id="home-about-btn">
                Full Biography <ArrowRight size={18} />
              </Button>
              <Button to="/experience" variant="outline" size="lg">
                View Credentials
              </Button>
            </div>
          </ScrollReveal>

          <ScrollReveal className="home-about__card-wrap" x={60} y={0}>
            <div className="home-about__card">
              <div className="home-about__quote-icon">"</div>
              <blockquote className="home-about__quote">
                {doctor?.quote || 'The heart is not just a pump. It is the center of life. I treat every patient as if they were my own family.'}
              </blockquote>
              <div className="home-about__author">
                <div className="home-about__avatar">{getInitials(doctor?.name || 'Dr. Arjun Sharma')}</div>
                <div>
                  <strong>{doctor?.name || 'Dr. Arjun Sharma'}</strong>
                  <span>{doctor?.title || 'MD, DM (Cardiology), FESC'}</span>
                </div>
              </div>

              <div className="home-about__badges">
                <div className="home-about__badge">🏥 {doctor?.training || 'AIIMS New Delhi + Cleveland Clinic'}</div>
                <div className="home-about__badge">🏆 {awardStat ? `${awardStat.value} Awards Won` : '24 National Awards'}</div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── WHY CHOOSE US ────────────────────────────────── */}
      <section className="section section--alt home-features">
        <div className="container">
          <SectionTitle
            pill="Why Choose Us"
            title="Heart Care That Goes"
            highlight="Beyond the Ordinary"
            subtitle="Three pillars that define every patient interaction at our practice."
          />
          <div className="grid-3 home-features__grid">
            {displayValues.map((f, i) => (
              <ScrollReveal key={f.title || i} delay={i * 0.15} className="feature-card">
                <div className="feature-card__icon" style={{ background: `${f.color}15`, color: f.color }}>
                  <f.icon size={28} />
                </div>
                <h3 className="feature-card__title">{f.title}</h3>
                <p className="feature-card__desc">{f.desc}</p>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── SPECIALTIES PREVIEW ──────────────────── */}
      <section className="section home-specialties">
        <div className="container">
          <SectionTitle
            pill="Specializations"
            title="Areas of"
            highlight="Expertise"
            subtitle="Comprehensive cardiac care covering all major cardiovascular conditions."
          />
          <div className="grid-3 home-specialties__grid">
            {displaySpecialties.map((sp, i) => {
              const iconKey = typeof sp.icon === 'string' ? sp.icon.toLowerCase() : '';
              const iconDisplay = SPEC_ICON_MAP[iconKey] || sp.icon || '❤';
              const accentColor = sp.color || sp.accent || '#1a6bbd';
              const bgColor = sp.color ? `${sp.color}14` : (sp.color || '#f0f8ff');
              return (
                <ScrollReveal key={sp.slug || sp.id || sp.title} delay={i * 0.1} className="specialty-preview-card">
                  <Link
                    to="/specialization"
                    className="specialty-preview-card__inner"
                    style={{ '--sp-accent': accentColor, '--sp-bg': bgColor }}
                  >
                    <div className="specialty-preview-card__icon">{iconDisplay}</div>
                    <h4 className="specialty-preview-card__title">{sp.title}</h4>
                    <ChevronRight size={16} className="specialty-preview-card__arrow" />
                  </Link>
                </ScrollReveal>
              );
            })}
          </div>
          <div className="home-specialties__cta text-center" style={{ marginTop: '2.5rem' }}>
            <Button to="/specialization" variant="outline" size="lg" id="home-specialties-btn">
              View All Specializations <ArrowRight size={18} />
            </Button>
          </div>
        </div>
      </section>

      {/* ── REVIEW TEASER (DYNAMIC TESTIMONIALS) ──────────── */}
      <section className="section section--alt home-review-teaser">
        <div className="container home-review-teaser__inner">
          <ScrollReveal className="home-review-teaser__left">
            <span className="pill pill--accent">Patient Stories</span>
            <h2>Trusted by <span className="text-gradient">{patientsStat?.value || '12,000+'} Patients</span></h2>
            <p>
              Our patients' experiences are our greatest achievement. Read what they have to say
              about their journey to better heart health with Dr. Sharma.
            </p>
            <div className="home-review-teaser__rating">
              {[1, 2, 3, 4, 5].map(s => (
                <Star key={s} size={24} fill="#f59e0b" color="#f59e0b" />
              ))}
              <span>
                <strong>{ratingStat?.value || '4.9'}</strong> / 5.0 — {patientsStat?.value ? `${patientsStat.value} patients treated` : '1,200+ reviews'}
              </span>
            </div>
            <Button to="/reviews" variant="primary" size="lg" id="home-reviews-btn" style={{ marginTop: '1.5rem' }}>
              Read Patient Reviews <ArrowRight size={18} />
            </Button>
          </ScrollReveal>

          <div className="home-review-teaser__cards">
            {displayReviews.map((r, i) => (
              <ScrollReveal key={r.id || r._id || r.name} delay={i * 0.15} className="mini-review-card">
                <div className="mini-review-card__stars">
                  {Array.from({ length: r.rating || 5 }, (_, j) => (
                    <Star key={j} size={14} fill="#f59e0b" color="#f59e0b" />
                  ))}
                </div>
                <p className="mini-review-card__text">"{r.review || r.text}"</p>
                <div className="mini-review-card__author">
                  <div className="mini-review-card__avatar">{r.avatar || r.name?.[0] || 'P'}</div>
                  <div>
                    <strong>{r.name}</strong>
                    {r.condition && <span style={{ display: 'block', fontSize: '0.72rem', color: 'var(--clr-text-muted)' }}>{r.condition}</span>}
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ───────────────────────────────────── */}
      <section className="home-cta">
        <div className="container home-cta__inner">
          <ScrollReveal>
            <h2 className="home-cta__title">
              Ready to Take Charge of Your <span className="text-gradient">Heart Health?</span>
            </h2>
            <p className="home-cta__subtitle">
              Don't wait for a crisis. Book a consultation today and take the first step toward a healthier heart.
            </p>
            <div className="home-cta__buttons">
              <button id="home-cta-book-btn" className="btn btn--primary btn--lg" onClick={openModal}>
                <Calendar size={20} /> Book Appointment
              </button>
              <Button to="/contact" variant="secondary" size="lg" id="home-cta-contact-btn">
                Contact Us <ArrowRight size={18} />
              </Button>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
