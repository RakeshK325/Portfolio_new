import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Rakesh K — Full-Stack & AI Systems Developer | Bangalore, India',
    short_name: 'Rakesh K',
    description:
      'Portfolio of Rakesh K — Full-Stack & AI Systems Developer and Computer Science and Engineering student based in Bangalore, Karnataka, India.',
    id: '/',
    start_url: '/',
    display: 'standalone',
    background_color: '#0A0A0A',
    theme_color: '#0A0A0A',
    categories: ['technology', 'business', 'portfolio'],
    lang: 'en',
    icons: [
      {
        src: '/rk-icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'any',
      },
    ],
  };
}
