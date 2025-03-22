import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

/**
 * Initialize Lenis smooth scrolling for the website
 * @returns Lenis instance
 */
export function initSmoothScroll() {
  // Register ScrollTrigger plugin
  gsap.registerPlugin(ScrollTrigger);

  const lenis = new Lenis({
    wrapper: window as unknown as HTMLElement,
    lerp: 0.1,
    wheelMultiplier: 1,
    touchMultiplier: 2,
    orientation: 'vertical',
  });

  // Connect GSAP ScrollTrigger and Lenis
  lenis.on('scroll', ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });

  gsap.ticker.lagSmoothing(0);

  return lenis;
}
