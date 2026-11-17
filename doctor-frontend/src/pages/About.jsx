import { Heart, Shield, Zap, Users, Award, GraduationCap, MapPin } from 'lucide-react';
import SectionTitle from '../components/common/SectionTitle';
import ScrollReveal from '../components/common/ScrollReveal';
import Button from '../components/common/Button';
import { useApp } from '../context/AppContext';
import './About.css';

const VALUE_ICONS = {
  heart:  { icon: Heart,  color: '#e74c6e' },
  shield: { icon: Shield, color: '#1a6bbd' },
  zap:    { icon: Zap,    color: '#0ea5a0' },
  users:  { icon: Users,  color: '#7c3aed' },
  award:  { icon: Award,  color: '#d97706' },
};

const VALUES = [
  { icon: Heart,  title: 'Patient First',       desc: 'Every decision is made with the patient\'s best interest at heart — always.', color: '#e74c6e' },
  { icon: Shield, title: 'Evidence-Based Care',  desc: 'Treatment plans grounded in the latest clinical research and guidelines.',      color: '#1a6bbd' },
  { icon: Zap,    title: 'Innovation',           desc: 'Leveraging the most advanced cardiac technologies available in India.',          color: '#0ea5a0' },
  { icon: Users,  title: 'Holistic Approach',    desc: 'Treating the whole person — mind, body, and lifestyle — not just symptoms.',    color: '#7c3aed' },
];

const MILESTONES = [
  { year: '2000', title: 'MBBS — AIIMS New Delhi',        desc: 'Graduated with distinction from India\'s premier medical institution.' },
  { year: '2004', title: 'MD Internal Medicine — AIIMS',  desc: 'Post-graduation with a focus on cardiovascular medicine.' },
  { year: '2007', title: 'DM Cardiology — PGIMER',        desc: 'Super-specialization in clinical and interventional cardiology.' },
  { year: '2009', title: 'Fellowship — Cleveland Clinic',  desc: 'Advanced interventional cardiology fellowship in the USA.' },
  { year: '2010', title: 'Returned to India',              desc: 'Established cardiac practice in Gurugram, bringing world-class care home.' },
  { year: '2026', title: 'Present — Medicity Heart Centre',desc: '18+ years, 12,000+ patients, 5,000+ procedures, 24 national awards.' },
];

function getInitials(name = 'Dr. Arjun Sharma') {
  const parts = name.replace(/^dr\.?\s+/i, '').trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return (parts[0] || 'AS').slice(0, 2).toUpperCase();
}

export default function About() {
  const { openModal, doctor } = useApp();
  const awardStat = doctor?.stats?.find(s => s.label?.toLowerCase().includes('award'));

  const displayValues = (doctor?.values && doctor.values.length ? doctor.values : VALUES).map((v, i) => {
    const iconKey = typeof v.icon === 'string' ? v.icon.toLowerCase() : '';
    const matched = VALUE_ICONS[iconKey] || Object.values(VALUE_ICONS)[i % Object.values(VALUE_ICONS).length];
    return {
      title: v.title,
      desc: v.desc,
      icon: typeof v.icon === 'function' ? v.icon : matched.icon,
      color: v.color || matched.color,
    };
  });

  const displayMilestones = doctor?.milestones && doctor.milestones.length ? doctor.milestones : MILESTONES;

  return (
    <div className="about-page">
      {/* Hero */}
      <section className="page-hero page-hero--blue">
        <div className="container page-hero__inner">
          <ScrollReveal>
            <span className="pill pill--primary">About {doctor?.name || 'Dr. Sharma'}</span>
            <h1 className="page-hero__title">
              Meet <span className="text-gradient">{doctor?.name || 'Dr. Arjun Sharma'}</span>
            </h1>
            <p className="page-hero__subtitle">
              {doctor?.shortBio || 'A distinguished Interventional Cardiologist whose expertise, compassion, and commitment have transformed thousands of lives across India.'}
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Bio Section */}
      <section className="section">
        <div className="container about-bio">
          <ScrollReveal className="about-bio__text">
            <span className="pill pill--primary">Biography</span>
            <h2>{doctor?.tagline || '18 Years of Healing Hearts with Precision & Compassion'}</h2>
            <p>
              {doctor?.bio || `Dr. Arjun Sharma is a board-certified Interventional Cardiologist with over 18 years of clinical experience. He completed his MBBS and MD from the All India Institute of Medical Sciences (AIIMS), New Delhi — India's most prestigious medical institution — followed by his DM in Cardiology from PGIMER, Chandigarh.`}
            </p>
            <div className="about-bio__cta">
              <button className="btn btn--primary btn--lg" onClick={openModal} id="about-book-btn">
                Book Consultation
              </button>
              <Button to="/experience" variant="outline" size="lg">View Credentials</Button>
            </div>
          </ScrollReveal>

          <ScrollReveal className="about-bio__card-wrap" x={60} y={0}>
            <div className="about-profile-card">
              <div className="about-profile-card__avatar">
                <div className="about-profile-card__initials">{getInitials(doctor?.name || 'Dr. Arjun Sharma')}</div>
                <div className="about-profile-card__pulse" />
              </div>
              <h3>{doctor?.name || 'Dr. Arjun Sharma'}</h3>
              <p className="about-profile-card__title">{doctor?.title || 'MD, DM (Cardiology), FESC'}</p>
              <p className="about-profile-card__specialty">{doctor?.specialty || 'Interventional Cardiologist'}</p>

              <div className="about-profile-card__stats">
                {(doctor?.stats && doctor.stats.length ? doctor.stats.slice(0, 3) : [
                  { value: '18+', label: 'Years Exp.' },
                  { value: '12K+', label: 'Patients' },
                  { value: '5K+', label: 'Procedures' },
                ]).map((st, i) => (
                  <div key={i} className="about-profile-card__stat">
                    <span className="text-gradient">{st.value}</span>
                    <span>{st.label}</span>
                  </div>
                ))}
              </div>

              <div className="about-profile-card__info">
                <div className="about-profile-card__info-item">
                  <GraduationCap size={15} />
                  <span>{doctor?.training || 'AIIMS New Delhi + Cleveland Clinic'}</span>
                </div>
                <div className="about-profile-card__info-item">
                  <Award size={15} />
                  <span>{awardStat ? `${awardStat.value} Awards Won` : '24 National Awards'}</span>
                </div>
                <div className="about-profile-card__info-item">
                  <MapPin size={15} />
                  <span>{doctor?.address ? doctor.address.split(',').slice(0, 2).join(',') : 'Medicity Tower, Gurugram'}</span>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Mission */}
      <section className="section section--alt about-mission">
        <div className="container">
          <SectionTitle
            pill="Mission"
            title="Why I Became a"
            highlight="Cardiologist"
            subtitle="Driven by a deep belief that every person deserves world-class cardiac care — regardless of circumstance."
          />
          <ScrollReveal className="about-mission__quote-card">
            <blockquote className="about-mission__quote">
              <span className="about-mission__quote-mark">"</span>
              {doctor?.mission || 'To deliver world-class cardiac care with empathy, precision, and innovation — ensuring every patient feels heard, respected, and empowered in their health journey. The heart is not just a pump. It is the center of life. I treat every patient as if they were my own family.'}
              <span className="about-mission__quote-mark">"</span>
            </blockquote>
            <div className="about-mission__author">— {doctor?.name || 'Dr. Arjun Sharma'}</div>
          </ScrollReveal>
        </div>
      </section>

      {/* Values */}
      <section className="section about-values">
        <div className="container">
          <SectionTitle
            pill="Core Values"
            title="Principles That Guide"
            highlight="Every Decision"
          />
          <div className="grid-2 about-values__grid">
            {displayValues.map((v, i) => (
              <ScrollReveal key={v.title || i} delay={i * 0.12} className="value-card">
                <div className="value-card__icon" style={{ background: `${v.color}15`, color: v.color }}>
                  <v.icon size={26} />
                </div>
                <div>
                  <h3 className="value-card__title">{v.title}</h3>
                  <p className="value-card__desc">{v.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="section section--alt about-timeline">
        <div className="container">
          <SectionTitle
            pill="Journey"
            title="A Path Built on"
            highlight="Excellence"
            subtitle="From AIIMS to Cleveland Clinic — a journey dedicated to mastering the art of cardiac care."
          />
          <div className="about-timeline__track">
            {displayMilestones.map((m, i) => (
              <ScrollReveal key={m.year + i} delay={i * 0.1} className={`timeline-item ${i % 2 === 0 ? 'timeline-item--left' : 'timeline-item--right'}`}>
                <div className="timeline-item__dot" />
                <div className="timeline-item__card">
                  <span className="timeline-item__year">{m.year}</span>
                  <h4 className="timeline-item__title">{m.title}</h4>
                  <p className="timeline-item__desc">{m.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
