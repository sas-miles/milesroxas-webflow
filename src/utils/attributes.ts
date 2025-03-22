export const getAttribute = (attr: string): HTMLElement | null => {
  return document.querySelector(`[${attr}]`) as HTMLElement | null;
};

export const getAttributes = (attr: string): NodeListOf<HTMLElement> => {
  return document.querySelectorAll(`[${attr}]`);
};
