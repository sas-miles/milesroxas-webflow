import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import SplitType from 'split-type';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

/**
 * Animates words within an element using GSAP and SplitType
 * Words fly outward from center as user scrolls
 *
 * @param {HTMLElement} el - The element containing text to animate
 */
export const animateWords = (el: HTMLElement): gsap.core.Timeline => {
  // Prevent character shifting when text is split
  gsap.set(el, { 'font-kerning': 'none' });

  // Apply SplitType
  const st = new SplitType(el, { types: 'lines,words' });

  const lines = st.lines || [];

  const tl = gsap
    .timeline({
      scrollTrigger: {
        trigger: el,
        start: 'center center',
        end: '+=75%',
        scrub: true,
        pin: el,
      },
    })
    .set(el, { perspective: 1000 });

  for (const [linepos, line] of lines.entries()) {
    gsap.set(line, { transformStyle: 'preserve-3d' });

    const words = line.querySelectorAll('.word');

    tl.to(
      words,
      {
        ease: 'power2',
        opacity: 0,
        xPercent: (pos, _, arr) =>
          pos < arr.length / 2
            ? Math.abs(pos - arr.length / 2) * gsap.utils.random(-40, -10)
            : Math.abs(pos - arr.length / 2) * gsap.utils.random(10, 40),
        yPercent: (pos, _, arr) =>
          Math.abs(pos - arr.length / 2) * gsap.utils.random(-80, -40) - 150,
        rotationY: (pos, _, arr) =>
          pos > arr.length / 2
            ? Math.abs(pos - arr.length / 2) * -15
            : Math.abs(pos - arr.length / 2) * 15,
        z: (pos, _, arr) =>
          Math.abs(pos - arr.length / 2) ? gsap.utils.random(-40, -20) : gsap.utils.random(20, 40),
        stagger: {
          each: 0.01,
          from: 'edges',
        },
      },
      linepos * 0.05
    );
  }

  return tl;
};
