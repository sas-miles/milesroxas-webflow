// Global type declarations
import Lenis from 'lenis';

declare global {
  interface Window {
    Webflow: Webflow;
    lenis?: Lenis;
  }
}

interface Webflow extends Array<() => void> {
  push(fn: () => void): number;
}

export interface DataAttributes {
  [key: string]: string;
}
