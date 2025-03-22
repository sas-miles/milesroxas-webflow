import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

export default function useLenisScroll() {
  gsap.registerPlugin(ScrollTrigger);

  const lenis = new Lenis({
    wrapper: window as unknown as HTMLElement,
    lerp: 0.1,
    wheelMultiplier: 1,
    touchMultiplier: 2,
    orientation: 'vertical',
  });

  lenis.on('scroll', ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });

  gsap.ticker.lagSmoothing(0);

  return lenis;
}
