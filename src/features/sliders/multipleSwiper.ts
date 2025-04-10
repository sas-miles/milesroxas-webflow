import 'swiper/css'; // Core Swiper styles
import 'swiper/css/navigation'; // Navigation module styles
import 'swiper/css/pagination'; // Pagination module styles
import 'swiper/css/effect-fade'; // Fade effect styles

import Swiper from 'swiper';
import { Autoplay, EffectFade, Navigation, Pagination } from 'swiper/modules';
import type { SwiperOptions } from 'swiper/types';

import { ATTRIBUTE } from '../../lib/dataAttributes';
import { getAttributes } from '../../utils/attributes';

// Slider type configurations
const sliderConfigs: Record<string, (config: SwiperOptions) => SwiperOptions> = {
  default: (config) => config,

  youtube: (config) => ({
    ...config,
    slidesPerView: 1,
    spaceBetween: 20,
    centeredSlides: true,
    breakpoints: {
      768: {
        slidesPerView: 2,
        spaceBetween: 0,
      },
    },
  }),

  testimonial: (config) => {
    const modules = [...(config.modules || []), EffectFade, Autoplay];
    return {
      ...config,
      modules,
      effect: 'fade',
      autoplay: {
        delay: 3000,
        disableOnInteraction: false,
      },
      speed: 800,
    };
  },

  work: (config) => ({
    ...config,
    slidesPerView: 'auto',
    spaceBetween: 24,
    centeredSlides: false,
    loop: false,
    slideClass: 'swiper-slide',
    wrapperClass: 'swiper-wrapper',
    slideToClickedSlide: true,
    observer: true,
    observeParents: true,
    breakpoints: {
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
    },
  }),

  gallery: (config) => ({
    ...config,
    slidesPerView: 1.5,
    spaceBetween: 20,
    centeredSlides: true,
    breakpoints: {
      768: {
        slidesPerView: 1,
        spaceBetween: 40,
      },
    },
  }),
};

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
    slideClass: 'swiper-slide',
    wrapperClass: 'swiper-wrapper',
    slidesPerView: 1,
    spaceBetween: 30,
    loop: true,
    speed: 500,

    // Lenis compatibility
    nested: true,
    mousewheel: false,
    touchReleaseOnEdges: true,

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

  // Apply type-specific configuration
  const applyConfig = sliderConfigs[swiperType] || sliderConfigs.default;
  const finalConfig = applyConfig(config);

  // Initialize Swiper
  return new Swiper(element, finalConfig);
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
