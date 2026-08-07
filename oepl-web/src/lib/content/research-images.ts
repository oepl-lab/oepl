/** Static cover images for research area cards (tag → public path) */
export const RESEARCH_AREA_IMAGES: Partial<Record<string, string>> = {
  OSCs: "/research/oscs.png",
  PSCs: "/research/pscs.png",
  OFETs: "/research/ofets.png",
  "Metal Ink": "/research/metal-ink.png",
  ELA: "/research/ela.png",
};

export function researchAreaImage(tag: string): string | undefined {
  return RESEARCH_AREA_IMAGES[tag];
}
