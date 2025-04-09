import 'swiper/css'; // Core Swiper styles
import 'swiper/css/navigation'; // Navigation module styles
import 'swiper/css/pagination'; // Pagination module styles
import 'swiper/css/effect-fade'; // Fade effect styles

import Swiper from 'swiper';
import { Autoplay, EffectFade, Navigation, Pagination } from 'swiper/modules';
import type { SwiperOptions } from 'swiper/types';

import { ATTRIBUTE } from '../../lib/dataAttributes';
import { getAttributes } from '../../utils/attributes';

/**
 * Initialize a swiper slider
 * @param {HTMLElement} element - The container element for the slider
 * @returns {Swiper} The initialized Swiper instance
 */
export const initSwiper = (element: HTMLElement): Swiper => {
  // Find navigation and pagination elements
  const prevButton = element.querySelector(`[${ATTRIBUTE.swiperNavPrev}]`) as HTMLElement | null;
  const nextButton = element.querySelector(`[${ATTRIBUTE.swiperNavNext}]`) as HTMLElement | null;
  const paginationEl = element.querySelector(
    `[${ATTRIBUTE.swiperPagination}]`
  ) as HTMLElement | null;

  // Get slider type
  const swiperType = element.dataset.swiperType || 'default';

  // Basic configuration with defaults
  const config: SwiperOptions = {
    modules: [Navigation, Pagination],
    slidesPerView: 1,
    spaceBetween: 30,
    loop: true,
    speed: 500,

    // Lenis compatibility
    nested: true, // Tells Swiper it's inside scrollable content
    mousewheel: false, // Disable mousewheel to prevent conflicts with Lenis
    touchReleaseOnEdges: true, // Allow scrolling when reaching slider edges

    // Navigation
    navigation:
      prevButton && nextButton
        ? {
            prevEl: prevButton,
            nextEl: nextButton,
          }
        : false,

    // Pagination
    pagination: paginationEl
      ? {
          el: paginationEl,
          clickable: true,
        }
      : false,
  };

  // Apply type-specific settings
  if (swiperType === 'youtube') {
    config.slidesPerView = 1;
    config.spaceBetween = 20;
    config.centeredSlides = true;
    config.breakpoints = {
      768: {
        slidesPerView: 2,
        spaceBetween: 0,
      },
    };
  } else if (swiperType === 'testimonial') {
    config.modules?.push(EffectFade, Autoplay);
    config.effect = 'fade';
    config.autoplay = {
      delay: 3000,
      disableOnInteraction: false,
    };
    config.speed = 800;
  } else if (swiperType === 'work') {
    // Fix for extremely large slides
    config.slidesPerView = 'auto'; // Use auto instead of fixed number
    config.spaceBetween = 24;
    config.centeredSlides = false;
    config.loop = false;

    // Ensure Webflow doesn't override width
    config.slideClass = 'swiper-slide';
    config.wrapperClass = 'swiper-wrapper';

    // Set slide sizing constraints
    config.slideToClickedSlide = true;

    // Override breakpoints
    config.breakpoints = {
      320: {
        slidesPerView: 'auto',
        spaceBetween: 16,
      },
      768: {
        slidesPerView: 'auto',
        spaceBetween: 24,
      },
      1200: {
        slidesPerView: 1.5,
        spaceBetween: 24,
        centeredSlides: true,
      },
      1400: {
        slidesPerView: 2,
        spaceBetween: 24,
        centeredSlides: true,
      },
    };

    // Add observer to recalculate on DOM changes
    config.observer = true;
    config.observeParents = true;
  } else if (swiperType === 'gallery') {
    config.slidesPerView = 1.5;
    config.spaceBetween = 20;
    config.centeredSlides = true;
    config.breakpoints = {
      768: {
        slidesPerView: 1,
        spaceBetween: 40,
      },
    };
  }

  // Initialize Swiper
  return new Swiper(element, config);
};

/**
 * Initialize all Swiper sliders on the page
 * @returns {Swiper[]} Array of initialized Swiper instances
 */
export const initAllSwipers = (): Swiper[] => {
  const swipers: Swiper[] = [];
  const swiperElements = getAttributes(ATTRIBUTE.swiper);

  swiperElements.forEach((swiperEl) => {
    // Skip elements that already have Swiper initialized
    if ((swiperEl as unknown as { swiper?: Swiper }).swiper instanceof Swiper) {
      swipers.push((swiperEl as unknown as { swiper: Swiper }).swiper);
      return;
    }

    const swiper = initSwiper(swiperEl);
    swipers.push(swiper);
  });

  return swipers;
};
