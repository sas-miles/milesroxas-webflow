// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import Swiper from 'swiper';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';

import { ATTRIBUTE } from '../../lib/dataAttributes';
import { getAttributes } from '../../utils/attributes';

/**
 * Initialize a basic Swiper slider with navigation and pagination
 * @param {HTMLElement} element - The container element for the slider
 * @returns {Swiper} The initialized Swiper instance
 */
export const initBasicSwiper = (element: HTMLElement): Swiper => {
  // Find navigation and pagination elements within the slider container
  const prevButton = element.querySelector(`[${ATTRIBUTE.swiperNavPrev}]`) as HTMLElement | null;
  const nextButton = element.querySelector(`[${ATTRIBUTE.swiperNavNext}]`) as HTMLElement | null;
  const paginationEl = element.querySelector(
    `[${ATTRIBUTE.swiperPagination}]`
  ) as HTMLElement | null;

  // Get slider configuration from data attributes
  const {
    slidesPerView = '1',
    spaceBetween = '30',
    loop = 'true',
    autoplay = 'false',
    speed = '500',
    effect = 'slide',
  } = element.dataset;

  // Initialize Swiper with options
  const swiperInstance = new Swiper(element, {
    modules: [Navigation, Pagination, Autoplay],
    slidesPerView: slidesPerView === 'auto' ? 'auto' : parseInt(slidesPerView, 10),
    spaceBetween: parseInt(spaceBetween, 10),
    loop: loop === 'true',
    effect: effect as 'slide' | 'fade' | 'cube' | 'coverflow' | 'flip' | 'creative' | 'cards',
    speed: parseInt(speed, 10),
    autoplay:
      autoplay === 'true'
        ? {
            delay: 3000,
            disableOnInteraction: false,
          }
        : false,

    // Setup navigation if buttons exist
    navigation:
      prevButton && nextButton
        ? {
            prevEl: prevButton,
            nextEl: nextButton,
          }
        : false,

    // Setup pagination if element exists
    pagination: paginationEl
      ? {
          el: paginationEl,
          clickable: true,
        }
      : false,
  });

  return swiperInstance;
};

/**
 * Initialize all Swiper sliders on the page
 * @returns {Swiper[]} Array of initialized Swiper instances
 */
export const initAllSwipers = (): Swiper[] => {
  const swipers: Swiper[] = [];
  const swiperElements = getAttributes(ATTRIBUTE.swiper);

  swiperElements.forEach((swiperEl) => {
    const swiper = initBasicSwiper(swiperEl);
    swipers.push(swiper);
  });

  return swipers;
};
