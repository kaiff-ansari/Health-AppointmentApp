import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Fade-in-up reveal for a single element or NodeList
 * @param {Element|NodeList|string} targets
 * @param {object} options
 */
export function revealUp(targets, options = {}) {
  return gsap.fromTo(
    targets,
    { opacity: 0, y: 50 },
    {
      opacity: 1,
      y: 0,
      duration: options.duration || 0.8,
      ease: options.ease || 'power3.out',
      stagger: options.stagger || 0,
      delay: options.delay || 0,
      scrollTrigger: options.scrollTrigger || null,
    }
  );
}

/**
 * Staggered card reveal
 */
export function staggerReveal(targets, scrollTriggerEl, options = {}) {
  return gsap.fromTo(
    targets,
    { opacity: 0, y: 60, scale: 0.96 },
    {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: options.duration || 0.7,
      ease: 'power3.out',
      stagger: options.stagger || 0.12,
      scrollTrigger: {
        trigger: scrollTriggerEl,
        start: 'top 80%',
        once: true,
        ...options.scrollTrigger,
      },
    }
  );
}

/**
 * Slide in from left
 */
export function slideInLeft(target, options = {}) {
  return gsap.fromTo(
    target,
    { opacity: 0, x: -60 },
    {
      opacity: 1,
      x: 0,
      duration: options.duration || 0.8,
      ease: 'power3.out',
      delay: options.delay || 0,
      scrollTrigger: options.scrollTrigger || null,
    }
  );
}

/**
 * Slide in from right
 */
export function slideInRight(target, options = {}) {
  return gsap.fromTo(
    target,
    { opacity: 0, x: 60 },
    {
      opacity: 1,
      x: 0,
      duration: options.duration || 0.8,
      ease: 'power3.out',
      delay: options.delay || 0,
      scrollTrigger: options.scrollTrigger || null,
    }
  );
}

/**
 * Counter animation from 0 to target number
 */
export function countUp(target, endValue, options = {}) {
  const obj = { val: 0 };
  return gsap.to(obj, {
    val: endValue,
    duration: options.duration || 2,
    ease: 'power2.out',
    delay: options.delay || 0,
    onUpdate: () => {
      if (target) target.textContent = options.format
        ? options.format(Math.round(obj.val))
        : Math.round(obj.val);
    },
    scrollTrigger: options.scrollTrigger || null,
  });
}

export { gsap, ScrollTrigger };
