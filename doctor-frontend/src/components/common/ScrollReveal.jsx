import { useScrollReveal } from '../../hooks/useScrollReveal';

/**
 * Wrapper that applies scroll-reveal animation to its children
 */
export default function ScrollReveal({ children, className = '', delay = 0, y = 50 }) {
  const ref = useScrollReveal({ y, delay });
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
