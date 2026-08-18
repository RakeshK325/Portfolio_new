import type { Metadata, Viewport } from 'next';
import { Instrument_Serif } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import { headers } from 'next/headers';
import './globals.css';

const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  style: ['normal', 'italic'],
  variable: '--font-instrument',
  display: 'swap',
});

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),

  title: {
    default:
      'Rakesh K — Full-Stack & AI Systems Developer (Bangalore, Karnataka, India)',
    template: '%s | Rakesh K — Full-Stack & AI Systems Developer',
  },

  description:
    'Rakesh K is a Computer Science and Engineering student and Full-Stack & AI Systems Developer based in Bangalore, Karnataka, India. He builds scalable full-stack web applications, AI integration engines, and enterprise software solutions using Java, React, Python, Flask, SQL, and REST APIs.',

  keywords: [
    // Identity / location
    'Rakesh K',
    'Rakesh K developer',
    'Full-Stack & AI Systems Developer',
    'Computer Science and Engineering student',
    'software developer in Bangalore',
    'software engineer in Karnataka',
    'software developer in India',
    'Bangalore full-stack developer',
    'AI developer in India',
    // Services & opportunities
    'full-stack web development',
    'MERN developer',
    'Next.js developer',
    'REST API developer',
    'backend systems developer',
    'AI and LLM integration',
    'hackathon project developer',
    'entry-level software developer',
    // Role
    'Full-Stack & AI Systems Developer',
    'Computer Science and Engineering Student',
    'Full Stack Developer',
    'Backend Developer',
    'AI Integration Developer',
    'Java Developer',
    'Python Developer',
    'React Developer',
    'Node.js Developer',
    'Flask Developer',
    // Opportunity intent
    'hire full-stack developer',
    'hire AI developer',
    'entry-level software developer',
    'student developer portfolio',
    'available for internships',
    'available for projects',
    // Tech stack
    'Java',
    'Python',
    'C',
    'JavaScript',
    'React',
    'Next.js',
    'Node.js',
    'Flask',
    'HTML5',
    'CSS3',
    'REST APIs',
    'MySQL',
    'MongoDB',
    'Firebase Firestore',
    'Git',
    'Git Bash',
    'Docker',
    'Kubernetes',
    'Data Structures and Algorithms',
    'OOP',
    'DBMS',
    'Gemini',
    'Google Genkit',
    'Machine Learning',
    // Portfolio / reach
    'Full-Stack Developer portfolio',
    'AI Systems Developer portfolio',
    'student software developer portfolio',
    'remote developer worldwide',
    'enterprise web development',
    'scalable web applications',
    'production-ready web systems',
    'high-performance web apps',
    // Focus areas
    'AI engineer',
    'LLM integration developer',
    'machine learning applications',
    'bioinformatics software',
    'hackathon developer',
  ],

  authors: [{ name: 'Rakesh K', url: BASE_URL }],
  creator: 'Rakesh K',
  publisher: 'Rakesh K',

  icons: {
    icon: [
      { url: '/rk-icon.svg', sizes: 'any', type: 'image/svg+xml' },
    ],
    apple: [{ url: '/rk-icon.svg', sizes: 'any' }],
    shortcut: '/rk-icon.svg',
  },

  openGraph: {
    type: 'profile',
    firstName: 'Rakesh',
    lastName: 'K',
    username: 'RakeshK325',
    url: BASE_URL,
    siteName: 'Rakesh K — Portfolio',
    title:
      'Rakesh K — Full-Stack & AI Systems Developer',
    description:
      'Full-Stack & AI Systems Developer in Bangalore, Karnataka, India. Computer Science and Engineering student with 2+ years of project-building experience in Java, React, Python, Flask, SQL, and REST APIs.',
    locale: 'en_US',
    images: [
      {
        url: `${BASE_URL}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: 'Rakesh K — Full-Stack & AI Systems Developer',
        type: 'image/png',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title:
      'Rakesh K — Full-Stack & AI Systems Developer',
    description:
      'Engineering scalable full-stack web applications, AI integration engines, and enterprise software solutions.',
    images: [`${BASE_URL}/opengraph-image`],
  },

  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  alternates: {
    canonical: BASE_URL,
    languages: {
      'en-US': BASE_URL,
      'en-GB': BASE_URL,
      'en-CA': BASE_URL,
      'en-AU': BASE_URL,
      'en-IN': BASE_URL,
      'x-default': BASE_URL,
    },
  },

  category: 'technology',

  appleWebApp: {
    capable: true,
    title: 'Rakesh K',
    statusBarStyle: 'black-translucent',
  },

  other: {
    'theme-color': '#0A0A0A',
    'msapplication-TileColor': '#0A0A0A',
    'application-name': 'Rakesh K Portfolio',
    // Geo targeting — Bangalore, Karnataka, India
    'geo.region': 'IN-KA',
    'geo.placename': 'Bangalore, Karnataka, India',
    'geo.position': '12.9716;77.5946',
    ICBM: '12.9716, 77.5946',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0A0A0A',
};

/* ── Structured data — single @graph so every entity cross-references ── */

const BANGALORE = {
  '@type': 'Place',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Bangalore',
    addressRegion: 'Karnataka',
    addressCountry: 'IN',
  },
};

const headshot = {
  '@type': 'ImageObject',
  '@id': `${BASE_URL}/#headshot`,
  url: `${BASE_URL}/opengraph-image`,
  contentUrl: `${BASE_URL}/opengraph-image`,
  width: 1200,
  height: 630,
  caption:
    'Rakesh K initials mark — Full-Stack & AI Systems Developer based in Bangalore, Karnataka, India',
  creditText: 'Rakesh K',
  representativeOfPage: true,
};

const personSchema = {
  '@type': 'Person',
  '@id': `${BASE_URL}/#person`,
  name: 'Rakesh K',
  givenName: 'Rakesh',
  familyName: 'K',
  alternateName: ['Rakesh K Portfolio'],
  url: BASE_URL,
  image: { '@id': `${BASE_URL}/#headshot` },
  jobTitle: ['Full-Stack & AI Systems Developer', 'Computer Science and Engineering Student'],
  description:
    'Rakesh K is a Computer Science and Engineering student and Full-Stack & AI Systems Developer based in Bangalore, Karnataka, India, with 2+ years of project-building experience in full-stack web applications and AI-integrated systems.',
  email: 'rakesh160982@gmail.com',
  nationality: { '@type': 'Country', name: 'India' },
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Bangalore',
    addressRegion: 'Karnataka',
    addressCountry: 'IN',
  },
  homeLocation: BANGALORE,
  workLocation: [
    BANGALORE,
    { '@type': 'Place', name: 'Remote — Worldwide' },
  ],
  worksFor: { '@id': `${BASE_URL}/#org` },
  hasOccupation: [
    {
      '@type': 'Occupation',
      name: 'Full-Stack & AI Systems Developer',
      description:
        'Builds full-stack web applications, REST APIs, and AI-integrated software systems through hands-on project engineering from Bangalore, Karnataka, India.',
      occupationLocation: [
        { '@type': 'City', name: 'Bangalore' },
        { '@type': 'Country', name: 'India' },
      ],
      skills:
        'Java, Python, JavaScript, React, Next.js, Node.js, Flask, TypeScript, MySQL, MongoDB, Firebase Firestore, REST APIs, Docker, Kubernetes',
    },
  ],
  knowsAbout: [
    'Full-Stack Web Development', 'AI and LLM Integration', 'Java', 'Python', 'C', 'JavaScript',
    'React', 'Next.js', 'Node.js', 'Flask', 'HTML5', 'CSS3', 'REST APIs',
    'MySQL', 'MongoDB', 'Firebase Firestore', 'Git', 'Docker', 'Kubernetes',
    'Data Structures and Algorithms', 'Object-Oriented Programming', 'DBMS',
  ],
  knowsLanguage: ['English'],
  alumniOf: [
    {
      '@type': 'EducationalOrganization',
      name: 'Alva’s Institute of Engineering and Technology',
      address: { '@type': 'PostalAddress', addressLocality: 'Mangalore', addressRegion: 'Karnataka', addressCountry: 'IN' },
    },
    { '@type': 'EducationalOrganization', name: 'ASC PU College' },
    { '@type': 'EducationalOrganization', name: 'ST Xavier High School' },
  ],
  hasCredential: [
    {
      '@type': 'EducationalOccupationalCredential',
      name: 'Cloud Computing',
      credentialCategory: 'certificate',
      recognizedBy: { '@type': 'EducationalOrganization', name: 'NPTEL' },
    },
    {
      '@type': 'EducationalOccupationalCredential',
      name: 'Data Analytics Job Simulation',
      credentialCategory: 'certificate',
      recognizedBy: { '@type': 'Organization', name: 'Deloitte via Forage' },
    },
    {
      '@type': 'EducationalOccupationalCredential',
      name: 'Fundamentals of Docker & Kubernetes',
      credentialCategory: 'certificate',
      recognizedBy: { '@type': 'EducationalOrganization', name: 'Scaler Masterclass' },
    },
  ],
  sameAs: [
    'https://github.com/RakeshK325',
    'https://www.linkedin.com/in/rakesh-k325/',
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    email: 'rakesh160982@gmail.com',
    contactType: 'professional inquiry',
    availableLanguage: 'English',
    areaServed: 'Worldwide',
  },
};

const orgSchema = {
  '@type': 'ProfessionalService',
  '@id': `${BASE_URL}/#org`,
  name: 'Rakesh K',
  legalName: 'Rakesh K — Full-Stack & AI Systems Developer',
  url: BASE_URL,
  logo: {
    '@type': 'ImageObject',
    url: `${BASE_URL}/rk-icon.svg`,
    width: 512,
    height: 512,
  },
  image: { '@id': `${BASE_URL}/#headshot` },
  description:
    'Full-Stack & AI Systems Developer portfolio of Rakesh K, a Computer Science and Engineering student based in Bangalore, Karnataka, India, building scalable web applications and AI-integrated software solutions.',
  founder: { '@id': `${BASE_URL}/#person` },
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Bangalore',
    addressRegion: 'Karnataka',
    addressCountry: 'IN',
  },
  areaServed: [
    { '@type': 'Country', name: 'India' },
    'Remote',
  ],
  knowsAbout: [
    'Full-Stack Web Development', 'AI and LLM Integration', 'Java', 'Python', 'C', 'JavaScript',
    'React', 'Next.js', 'Node.js', 'Flask', 'REST APIs', 'MySQL', 'MongoDB',
    'Firebase Firestore', 'Git', 'Docker', 'Kubernetes', 'Data Structures and Algorithms', 'DBMS',
  ],
  email: 'rakesh160982@gmail.com',
  sameAs: [
    'https://github.com/RakeshK325',
    'https://www.linkedin.com/in/rakesh-k325/',
  ],
};

const websiteSchema = {
  '@type': 'WebSite',
  '@id': `${BASE_URL}/#website`,
  url: BASE_URL,
  name: 'Rakesh K — Full-Stack & AI Systems Developer Portfolio',
  alternateName: ['Rakesh K Portfolio', 'Full-Stack & AI Systems Developer Portfolio'],
  description:
    'Portfolio and professional profile of Rakesh K — Full-Stack & AI Systems Developer in Bangalore, Karnataka, India.',
  author: { '@id': `${BASE_URL}/#person` },
  publisher: { '@id': `${BASE_URL}/#org` },
  inLanguage: 'en',
  copyrightYear: new Date().getFullYear(),
};

const profilePageSchema = {
  '@type': 'ProfilePage',
  '@id': `${BASE_URL}/#profilepage`,
  url: BASE_URL,
  name: 'Rakesh K — Full-Stack & AI Systems Developer (Bangalore, Karnataka, India)',
  description:
    'Professional portfolio of Rakesh K, a Computer Science and Engineering student and Full-Stack & AI Systems Developer based in Bangalore, Karnataka, India, with 2+ years of project-building experience.',
  isPartOf: { '@id': `${BASE_URL}/#website` },
  about: { '@id': `${BASE_URL}/#person` },
  mainEntity: { '@id': `${BASE_URL}/#person` },
  primaryImageOfPage: { '@id': `${BASE_URL}/#headshot` },
  dateCreated: '2024-01-01',
  dateModified: new Date().toISOString().split('T')[0],
  inLanguage: 'en',
  breadcrumb: {
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
    ],
  },
  speakable: {
    '@type': 'SpeakableSpecification',
    cssSelector: ['h1', 'h2', '#about p'],
  },
};

const projectItemListSchema = {
  '@type': 'ItemList',
  '@id': `${BASE_URL}/#projects-list`,
  name: 'Featured Engineering Projects by Rakesh K',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      item: {
        '@type': 'SoftwareApplication',
        name: 'Faculty Appraisal Portal',
        operatingSystem: 'Web-based',
        applicationCategory: 'BusinessApplication',
        description: 'Full-stack MERN faculty self-appraisal platform with JWT authentication, RBAC, uploads, and Puppeteer PDF generation across four roles.',
      },
    },
    {
      '@type': 'ListItem',
      position: 2,
      item: {
        '@type': 'SoftwareApplication',
        name: 'Pediatric Vaccination Management System',
        operatingSystem: 'Web-based',
        applicationCategory: 'HealthApplication',
        description: 'Next.js and Firestore vaccination platform for UIP/IAP schedules with atomic batch writes and a Gemini/Genkit Smart Availability assistant.',
      },
    },
    {
      '@type': 'ListItem',
      position: 3,
      item: {
        '@type': 'SoftwareApplication',
        name: 'Target-X: CRISPR Target Analysis',
        operatingSystem: 'Web-based',
        applicationCategory: 'DeveloperApplication',
        description: 'React and Flask platform with a machine-learning gRNA ranking engine for on-target efficiency and off-target risk analysis.',
      },
    },
  ],
};

const schemaGraph = {
  '@context': 'https://schema.org',
  '@graph': [
    headshot,
    personSchema,
    orgSchema,
    websiteSchema,
    profilePageSchema,
    projectItemListSchema,
  ],
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const nonce = (await headers()).get('x-nonce') ?? undefined;

  return (
    <html lang="en" className={instrumentSerif.variable} suppressHydrationWarning>
      <head>
        <link rel="alternate" type="text/plain" href="/llms.txt" title="LLM Machine Readable Profile" />
        <script
          type="application/ld+json"
          nonce={nonce}
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaGraph) }}
        />
      </head>
      <body className="antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
