import 'lenis/dist/lenis.css';

import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

import { ATTRIBUTE } from '../../../lib/dataAttributes';
import { getAttributesWithValue } from '../../../utils/attributes';

/**
 * Initialize Lenis smooth scrolling for the website
 * @returns Lenis instance
 */
export function initSmoothScroll() {
  // Register ScrollTrigger plugin
  gsap.registerPlugin(ScrollTrigger);

  // Find elements with lenis-scroll="scroll-area"
  const scrollAreaElements = getAttributesWithValue(ATTRIBUTE.lenisScroll, 'scroll-area');

  // Default wrapper is the window
  let wrapper = window as unknown as HTMLElement;
  let content: HTMLElement | Element | undefined = undefined;

  // If we have a scroll area element, use it as the wrapper instead
  if (scrollAreaElements.length > 0) {
    const [scrollArea] = scrollAreaElements;
    wrapper = scrollArea;

    // The first child element is the content
    if (wrapper.firstElementChild) {
      content = wrapper.firstElementChild;
    }
  }

  // Create a new Lenis instance with basic settings
  const lenis = new Lenis({
    wrapper,
    content,
    lerp: 0.1,
    wheelMultiplier: 1,
    touchMultiplier: 2,
    orientation: 'vertical',
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Smoother easing
  });

  // Connect GSAP ScrollTrigger and Lenis
  lenis.on('scroll', ScrollTrigger.update);

  // Set up animation frame loop
  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });

  gsap.ticker.lagSmoothing(0);

  return lenis;
}

/**
 * Destroy Lenis instance and clean up event listeners
 */
export function destroyLenis(lenis: Lenis) {
  if (!lenis) return;

  // Remove GSAP ticker
  gsap.ticker.remove(lenis.raf);

  // Destroy Lenis
  lenis.destroy();
}

/**
 * Reset Lenis instance (destroy and recreate)
 */
export function resetLenis(lenis: Lenis) {
  if (!lenis) return lenis;

  // Destroy current instance
  destroyLenis(lenis);

  // Create new instance
  return initSmoothScroll();
}
