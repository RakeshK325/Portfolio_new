import { ImageResponse } from 'next/og';
export const runtime = 'nodejs';
export const alt =
  'Rakesh K — Full-Stack & AI Systems Developer in Bangalore, Karnataka, India';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const STACK = ['Java', 'React', 'Python', 'Flask', 'SQL', 'REST APIs'];

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#0A0A0A',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          padding: '72px 80px',
          position: 'relative',
          fontFamily: 'Arial, sans-serif',
        }}
      >
        {/* Top white rule */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '2px',
            background: '#FFFFFF',
          }}
        />

        {/* RK initials mark */}
        <div style={{ display: 'flex', marginBottom: 'auto' }}>
          <div
            aria-label="Rakesh K"
            style={{
              width: '104px',
              height: '66px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid rgba(255,255,255,0.28)',
              borderRadius: '16px',
              background: 'linear-gradient(145deg, #17232b 0%, #0a0a0a 62%, #07151c 100%)',
              color: '#ffffff',
              fontSize: '27px',
              fontWeight: 800,
              letterSpacing: '-0.08em',
            }}
          >
            RK
          </div>
        </div>

        {/* Name + role block */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <span
            style={{
              color: 'rgba(255,255,255,0.38)',
              fontSize: '15px',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
            }}
          >
            Full-Stack &amp; AI Systems Developer — Bangalore, India
          </span>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span
              style={{
                color: '#FFFFFF',
                fontSize: '82px',
                fontWeight: 700,
                lineHeight: 0.92,
                letterSpacing: '-0.03em',
              }}
            >
              Rakesh
            </span>
            <span
              style={{
                color: '#FFFFFF',
                fontSize: '82px',
                fontWeight: 700,
                lineHeight: 0.92,
                letterSpacing: '-0.03em',
              }}
            >
              K
            </span>
          </div>

          <p
            style={{
              color: 'rgba(255,255,255,0.48)',
              fontSize: '20px',
              lineHeight: 1.55,
              maxWidth: '560px',
              margin: '6px 0 0',
            }}
          >
            Engineering scalable full-stack web applications, AI integration engines, and enterprise software solutions.
            Computer Science and Engineering student with 2+ years of project-building experience.
          </p>
        </div>

        {/* Divider + footer */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '44px',
            paddingTop: '22px',
            borderTop: '1px solid rgba(255,255,255,0.1)',
          }}
        >
          {/* Tech stack pills */}
          <div style={{ display: 'flex', gap: '10px' }}>
            {STACK.map((tech) => (
              <span
                key={tech}
                style={{
                  color: 'rgba(255,255,255,0.52)',
                  fontSize: '13px',
                  border: '1px solid rgba(255,255,255,0.14)',
                  padding: '5px 13px',
                  letterSpacing: '0.04em',
                }}
              >
                {tech}
              </span>
            ))}
          </div>

          <span
            style={{
              color: 'rgba(255,255,255,0.22)',
              fontSize: '13px',
              letterSpacing: '0.08em',
            }}
          >
            Rakesh K · Portfolio
          </span>
        </div>
      </div>
    ),
    { ...size },
  );
}
