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
export const animateWords = (
  el: HTMLElement
): { timeline: gsap.core.Timeline; scrollTrigger: ScrollTrigger } => {
  // Create a stable ID for the element
  const elementId = el.id || `word-anim-${Date.now()}`;
  if (!el.id) el.id = elementId;

  // Clean up any existing animation on this element
  ScrollTrigger.getAll().forEach((trigger) => {
    if (trigger.vars.trigger === el) trigger.kill();
  });

  // Reset the element content
  try {
    // Revert any existing split
    new SplitType(el).revert();

    // Reset element properties to ensure a clean state
    gsap.set(el, {
      clearProps: 'all',
      opacity: 1,
      visibility: 'visible',
    });
  } catch (error) {
    console.error('Error resetting element:', error);
  }

  // Split the text
  const split = new SplitType(el, {
    types: 'lines,words',
    tagName: 'span',
  });

  const lines = split.lines || [];

  // Create the timeline
  const tl = gsap.timeline({
    paused: true,
    defaults: {
      duration: 0.5,
      ease: 'power1.inOut',
    },
  });

  // Set perspective for 3D animation
  tl.set(el, { perspective: 1000 });

  // Animate each line of words
  for (const [linepos, line] of lines.entries()) {
    const words = line.querySelectorAll('.word');
    if (words.length === 0) continue;

    // Set up 3D properties on the line
    gsap.set(line, {
      transformStyle: 'preserve-3d',
      position: 'relative',
      display: 'block',
    });

    // Set initial state of words
    gsap.set(words, {
      opacity: 1,
      display: 'inline-block',
      position: 'relative',
    });

    // Animate words in this line
    tl.to(
      words,
      {
        opacity: 0,
        xPercent: (pos, _, arr) => {
          const center = arr.length / 2;
          return pos < center
            ? -40 - Math.abs(pos - center) * 10
            : 40 + Math.abs(pos - center) * 10;
        },
        yPercent: -100,
        rotationY: (pos, _, arr) => {
          const center = arr.length / 2;
          return pos < center ? -15 : 15;
        },
        z: 20,
        stagger: {
          each: 0.05,
          from: 'center',
        },
      },
      linepos * 0.1
    );
  }

  // Create the ScrollTrigger
  const st = ScrollTrigger.create({
    id: `word-animation-${elementId}`,
    trigger: el,
    start: 'top center',
    end: 'bottom top',
    scrub: 1,
    pin: true,
    animation: tl,
  });

  // Return both timeline and ScrollTrigger for cleanup
  return { timeline: tl, scrollTrigger: st };
};
