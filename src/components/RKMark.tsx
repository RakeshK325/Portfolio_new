type RKMarkProps = {
  size?: 'sm' | 'md' | 'lg';
  theme?: 'dark' | 'light';
  label?: string;
};

const SIZES = {
  sm: { box: '2.1rem', text: '0.78rem', radius: '0.55rem' },
  md: { box: '4.8rem', text: '1.55rem', radius: '1.2rem' },
  lg: { box: '8rem', text: '2.6rem', radius: '1.8rem' },
} as const;

export function RKMark({ size = 'sm', theme = 'dark', label = 'Rakesh K' }: RKMarkProps) {
  const dims = SIZES[size];
  const dark = theme === 'dark';

  return (
    <span
      role="img"
      aria-label={label}
      title={label}
      style={{
        display: 'inline-flex',
        width: dims.box,
        height: dims.box,
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        borderRadius: dims.radius,
        border: dark ? '1px solid rgba(255,255,255,0.28)' : '1px solid rgba(10,10,10,0.24)',
        background: dark
          ? 'linear-gradient(145deg, #17232b 0%, #0a0a0a 62%, #07151c 100%)'
          : 'linear-gradient(145deg, #f1f5f7 0%, #0a0a0a 100%)',
        color: '#ffffff',
        fontFamily: 'Satoshi, system-ui, sans-serif',
        fontSize: dims.text,
        fontWeight: 900,
        letterSpacing: '-0.08em',
        lineHeight: 1,
        boxShadow: dark
          ? '0 0 0 1px rgba(79,209,255,0.08), 0 10px 32px rgba(0,0,0,0.28)'
          : '0 8px 24px rgba(0,0,0,0.18)',
      }}
    >
      <span style={{ transform: 'translateX(-0.04em)' }}>RK</span>
    </span>
  );
}
