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

  // Store ALL original styles that could be affected
  const originalStyles = {
    position: window.getComputedStyle(el).position,
    display: window.getComputedStyle(el).display,
    visibility: window.getComputedStyle(el).visibility,
    opacity: window.getComputedStyle(el).opacity,
    transform: window.getComputedStyle(el).transform,
    transformStyle: window.getComputedStyle(el).transformStyle,
    perspective: window.getComputedStyle(el).perspective,
    scale: window.getComputedStyle(el).scale,
  };

  // Store the original HTML content for restoration
  const originalContent = el.innerHTML;

  // Clean up any existing animation on this element
  ScrollTrigger.getAll().forEach((trigger) => {
    if (trigger.vars.trigger === el || trigger.vars.id?.includes(elementId)) {
      trigger.kill();
    }
  });

  // Reset the element content
  try {
    // Revert any existing split
    const split = new SplitType(el);
    split.revert();

    // Reset element to original content if needed
    el.innerHTML = originalContent;

    // Reset element properties while preserving original styles
    gsap.set(el, {
      clearProps: 'all', // Clear all GSAP-modified properties
      position: originalStyles.position !== 'static' ? originalStyles.position : 'relative',
      display: originalStyles.display !== 'none' ? originalStyles.display : 'block',
      opacity: originalStyles.opacity !== '0' ? originalStyles.opacity : '1',
      visibility: originalStyles.visibility !== 'hidden' ? originalStyles.visibility : 'visible',
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
      ease: 'power2.out',
    },
  });

  // Set perspective for 3D animation and ensure initial visibility
  tl.set(el, {
    perspective: 1000,
    opacity: 1,
    visibility: 'visible',
    position: originalStyles.position !== 'static' ? originalStyles.position : 'relative',
    display: originalStyles.display !== 'none' ? originalStyles.display : 'block',
    left: '50%',
    x: '-50%',
    width: 'auto',
    transformOrigin: 'center center',
  });

  // Animate each line of words
  lines.forEach((line, linepos) => {
    const words = line.querySelectorAll('.word');
    if (words.length === 0) return;

    // Store original line styles
    const lineStyles = {
      position: window.getComputedStyle(line).position,
      display: window.getComputedStyle(line).display,
    };

    // Set up 3D properties on the line while preserving original styles
    gsap.set(line, {
      transformStyle: 'preserve-3d',
      position: lineStyles.position !== 'static' ? lineStyles.position : 'relative',
      display: lineStyles.display !== 'none' ? lineStyles.display : 'block',
      opacity: 1,
      left: '50%',
      x: '-50%',
      width: 'auto',
      textAlign: 'center',
    });

    // Set initial state of words with style preservation
    gsap.set(words, {
      opacity: 1,
      display: 'inline-block',
      position: 'relative',
      immediateRender: true,
      transformOrigin: 'center center',
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
        immediateRender: false,
      },
      linepos * 0.1
    );
  });

  // Create the ScrollTrigger with adjusted settings
  const st = ScrollTrigger.create({
    id: `word-animation-${elementId}`,
    trigger: el,
    start: 'center center',
    end: '+=300%',
    scrub: 0.5,
    pin: true,
    pinSpacing: true,
    pinType: 'transform',
    animation: tl,
    onRefresh: () => {
      st.refresh();
    },
    onUpdate: (self) => {
      tl.progress(self.progress);
    },
    onEnter: () => {
      // Restore styles when entering viewport
      gsap.set(el, {
        position: originalStyles.position !== 'static' ? originalStyles.position : 'relative',
        display: originalStyles.display !== 'none' ? originalStyles.display : 'block',
        opacity: originalStyles.opacity !== '0' ? originalStyles.opacity : '1',
        visibility: originalStyles.visibility !== 'hidden' ? originalStyles.visibility : 'visible',
        left: '50%',
        x: '-50%',
        width: 'auto',
      });
    },
    onLeave: () => {
      // Preserve styles when leaving viewport
      gsap.set(el, {
        position: originalStyles.position !== 'static' ? originalStyles.position : 'relative',
        display: originalStyles.display !== 'none' ? originalStyles.display : 'block',
        left: '50%',
        x: '-50%',
        width: 'auto',
      });
    },
    onKill: () => {
      // Restore original styles when the ScrollTrigger is killed
      gsap.set(el, {
        clearProps: 'all',
        ...originalStyles,
      });
      // Revert split if it exists
      const split = new SplitType(el);
      split.revert();
      // Restore original content
      el.innerHTML = originalContent;
    },
  });

  return { timeline: tl, scrollTrigger: st };
};
