# Rakesh K — Full-Stack & AI Systems Developer Portfolio

A personalized portfolio for **Rakesh K**, a Computer Science and Engineering student based in Bangalore, Karnataka, India. The site presents full-stack web applications, AI and LLM integrations, hackathon achievements, education, certifications, and project-based engineering experience.

## Technology Stack

| Layer | Technology |
|---|---|
| Framework | Next.js App Router |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Motion | Framer Motion, GSAP, Lenis smooth scrolling |
| 3D showcase | Three.js / React Three Fiber scene transitions |
| AI | Anthropic API for the portfolio assistant; Gemini and Genkit are represented in project descriptions |
| Email | Resend contact-form integration |
| Data | GitHub profile API and contribution data |
| Media | Next.js Image, Sharp, custom video and poster assets |
| Deployment | Suitable for Vercel or another Node-compatible hosting platform |

## Portfolio Features

The portfolio includes a cinematic loader, a custom cursor, smooth scrolling, scroll-triggered transitions, animated hero and experience sections, a 3D project showcase, responsive mobile project cards, expandable project architecture panels, GitHub and LinkedIn links, an uploaded resume, dynamic metadata, an Open Graph image, a web manifest, robots metadata, and sitemap generation.

The featured projects are the Faculty Appraisal Portal, Pediatric Vaccination Management System, and Target-X: CRISPR Target Analysis. Each project includes technology tags and an architecture explanation. Repository and live-demo buttons remain pending until project-specific URLs are supplied.

## Running Locally

```bash
npm ci
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) after the development server starts.

For a production preview:

```bash
npm run build
npm start
```

## Environment Variables

Create a `.env.local` file when enabling the external integrations. Never commit this file or any secret values.

```bash
NEXT_PUBLIC_SITE_URL=http://localhost:3000
ANTHROPIC_API_KEY=your_anthropic_key
RESEND_API_KEY=your_resend_key
GITHUB_TOKEN=optional_github_token
```

The homepage and static portfolio content work without these external keys. The AI assistant requires `ANTHROPIC_API_KEY`, the contact form requires `RESEND_API_KEY`, and GitHub activity data can use `GITHUB_TOKEN` when higher API limits are needed.

## Repository Structure

```text
src/app/                 Next.js routes, metadata, API routes, and dynamic images
src/components/          Portfolio sections and reusable UI components
src/lib/                 Smooth scrolling and shared utilities
public/                  Images, videos, fonts, the resume, and RK branding assets
```

The downloadable resume is stored at `public/resume/Rakesh_K_Resume.pdf`. The temporary initials logo is stored at `public/rk-icon.svg` and can later be replaced when a profile photograph or custom logo is provided.

## Verification

The production build has been verified with Next.js and TypeScript. The project also includes a lint command; existing animation-heavy code may require additional React Compiler rule cleanup before the lint command becomes fully clean.

## License

The repository includes the MIT license. Replace or adjust the license text if a different publishing policy is preferred before deploying the site publicly.

© 2026 Rakesh K
