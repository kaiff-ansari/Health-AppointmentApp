import { useScrollReveal } from '../../hooks/useScrollReveal';
import './SectionTitle.css';

/**
 * Animated section heading with optional pill label + subtitle
 */
export default function SectionTitle({
  pill,
  title,
  highlight,
  subtitle,
  center = true,
  className = '',
}) {
  const ref = useScrollReveal({ y: 30, duration: 0.7 });

  return (
    <div ref={ref} className={`section-title ${center ? 'section-title--center' : ''} ${className}`}>
      {pill && (
        <span className="section-title__pill pill pill--primary">{pill}</span>
      )}
      <h2 className="section-title__heading">
        {title}{' '}
        {highlight && (
          <span className="text-gradient">{highlight}</span>
        )}
      </h2>
      {subtitle && (
        <p className="section-title__subtitle">{subtitle}</p>
      )}
    </div>
  );
}
