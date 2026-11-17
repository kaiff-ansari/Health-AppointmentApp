import { GraduationCap, Award, Briefcase, CheckCircle } from 'lucide-react';
import SectionTitle from '../components/common/SectionTitle';
import ScrollReveal from '../components/common/ScrollReveal';
import './Experience.css';

const EDUCATION = [
  { year: '2000', degree: 'MBBS', institution: 'All India Institute of Medical Sciences (AIIMS)', location: 'New Delhi, India', note: 'Graduated with Distinction' },
  { year: '2004', degree: 'MD — Internal Medicine', institution: 'All India Institute of Medical Sciences (AIIMS)', location: 'New Delhi, India', note: 'Gold Medalist' },
  { year: '2007', degree: 'DM — Cardiology', institution: 'PGIMER', location: 'Chandigarh, India', note: 'Super-specialist in Cardiology' },
  { year: '2009', degree: 'Interventional Cardiology Fellowship', institution: 'Cleveland Clinic', location: 'Cleveland, Ohio, USA', note: 'Advanced Structural & Interventional Cardiology' },
];

const EXPERIENCE = [
  { period: '2010 – 2013', role: 'Consultant Cardiologist', org: 'Fortis Memorial Research Institute', location: 'Gurugram', desc: 'Led the interventional cardiology unit performing complex PCI procedures.' },
  { period: '2013 – 2018', role: 'Senior Consultant Cardiologist', org: 'Medanta – The Medicity', location: 'Gurugram', desc: 'Established structural heart disease program; trained 15+ junior cardiologists.' },
  { period: '2018 – Present', role: 'Director of Interventional Cardiology', org: 'Medicity Heart Centre', location: 'Gurugram', desc: 'Heads the full-service cardiac department with a 24/7 STEMI program.' },
];

const CERTIFICATIONS = [
  'Board Certified — Cardiology (NBE)', 'Fellow of the European Society of Cardiology (FESC)',
  'Fellow of the American College of Cardiology (FACC)', 'Certified in Echocardiography — IAE',
  'Advanced Cardiac Life Support (ACLS)', 'TAVR & Structural Heart Disease Certification — CCF',
  'Complex PCI Certification', 'Basic Life Support Instructor — AHA',
];

const AWARDS = [
  { year: '2022', title: 'Excellence in Cardiology Award', org: 'Delhi Medical Association' },
  { year: '2021', title: 'ICS Gold Medal — Best Research Paper', org: 'Indian College of Cardiology' },
  { year: '2020', title: "India's Top 50 Cardiologists", org: 'Times Health Survey' },
  { year: '2019', title: 'Best Interventional Cardiologist — NCR', org: 'Healthcare Excellence Awards' },
  { year: '2018', title: 'Young Achiever in Cardiology', org: 'Cardiological Society of India' },
  { year: '2017', title: 'National Health Hero Award', org: 'Ministry of Health, India' },
];

export default function Experience() {
  return (
    <div className="experience-page">
      <section className="page-hero">
        <div className="container page-hero__inner">
          <ScrollReveal>
            <span className="pill pill--primary">Experience & Qualifications</span>
            <h1 className="page-hero__title">
              Credentials Built on <span className="text-gradient">Excellence</span>
            </h1>
            <p className="page-hero__subtitle">
              18+ years of rigorous training, clinical practice, and academic achievement in cardiology.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Education */}
      <section className="section">
        <div className="container">
          <SectionTitle pill="Education" title="Academic" highlight="Background" />
          <div className="edu-list">
            {EDUCATION.map((e, i) => (
              <ScrollReveal key={e.year} delay={i * 0.1} className="edu-card">
                <div className="edu-card__year">{e.year}</div>
                <div className="edu-card__line"><GraduationCap size={20} /></div>
                <div className="edu-card__content">
                  <h3 className="edu-card__degree">{e.degree}</h3>
                  <p className="edu-card__inst">{e.institution}</p>
                  <p className="edu-card__loc">📍 {e.location}</p>
                  <span className="edu-card__note">{e.note}</span>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Work Experience */}
      <section className="section section--alt">
        <div className="container">
          <SectionTitle pill="Career" title="Professional" highlight="Experience" />
          <div className="exp-list">
            {EXPERIENCE.map((e, i) => (
              <ScrollReveal key={e.period} delay={i * 0.12} className="exp-card">
                <div className="exp-card__icon"><Briefcase size={22} /></div>
                <div className="exp-card__body">
                  <div className="exp-card__header">
                    <div>
                      <h3 className="exp-card__role">{e.role}</h3>
                      <p className="exp-card__org">{e.org} — <span>{e.location}</span></p>
                    </div>
                    <span className="exp-card__period">{e.period}</span>
                  </div>
                  <p className="exp-card__desc">{e.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="section">
        <div className="container">
          <SectionTitle pill="Certifications" title="Professional" highlight="Certifications" />
          <div className="cert-grid">
            {CERTIFICATIONS.map((c, i) => (
              <ScrollReveal key={c} delay={i * 0.06} className="cert-item">
                <CheckCircle size={18} className="cert-item__icon" />
                <span>{c}</span>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Awards */}
      <section className="section section--alt">
        <div className="container">
          <SectionTitle pill="Recognition" title="Awards &" highlight="Accolades" />
          <div className="awards-grid">
            {AWARDS.map((a, i) => (
              <ScrollReveal key={a.title} delay={i * 0.1} className="award-card">
                <div className="award-card__year">{a.year}</div>
                <Award size={28} className="award-card__icon" />
                <h4 className="award-card__title">{a.title}</h4>
                <p className="award-card__org">{a.org}</p>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
