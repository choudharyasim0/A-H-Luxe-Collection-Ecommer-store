// Lightweight vector art used until real product photography is dropped in.
const S = { fill: 'none', stroke: 'currentColor', strokeWidth: 3, strokeLinecap: 'round', strokeLinejoin: 'round' }
export function Icon({ k }) {
  const p = {
    wallets: <><rect x="8" y="18" width="48" height="34" rx="8" {...S}/><path d="M8 28h48" {...S}/><circle cx="46" cy="40" r="3" fill="currentColor"/></>,
    rings: <><circle cx="32" cy="38" r="16" {...S}/><path d="M24 17l8-8 8 8-8 8z" {...S}/></>,
    bracelets: <><ellipse cx="32" cy="32" rx="22" ry="14" {...S}/><ellipse cx="32" cy="32" rx="14" ry="8" {...S}/></>,
    chains: <><rect x="8" y="22" width="22" height="14" rx="7" {...S}/><rect x="24" y="30" width="22" height="14" rx="7" {...S}/><rect x="38" y="22" width="18" height="14" rx="7" {...S}/></>,
    caps: <><path d="M10 38c0-14 10-22 22-22s22 8 22 22z" {...S}/><path d="M54 38c6 0 4 8-8 8H18" {...S}/></>,
  }[k]
  return <svg viewBox="0 0 64 64" aria-hidden="true">{p}</svg>
}
function Watch({ c, w }) {
  return (
    <g>
      <rect x="82" y="8" width="36" height="184" rx="14" fill={c} opacity=".92" />
      {[...Array(6)].map((_, i) => <circle key={i} cx="100" cy={152 + i * 7 > 186 ? 0 : 152 + i * 7} r="2" fill="#fff" opacity=".4" />)}
      <circle cx="100" cy="100" r={w ? 44 : 52} fill="#fff" stroke="#c9ccd2" strokeWidth="5" />
      <circle cx="100" cy="100" r={w ? 36 : 43} fill="#0d3b66" />
      <circle cx="100" cy="100" r={w ? 36 : 43} fill="none" stroke="#7aa6ea" strokeWidth="1.5" opacity=".6" />
      {[...Array(12)].map((_, i) => { const a = i * Math.PI / 6, r1 = w ? 30 : 37, r2 = w ? 34 : 41; return <line key={i} x1={100 + r1 * Math.sin(a)} y1={100 - r1 * Math.cos(a)} x2={100 + r2 * Math.sin(a)} y2={100 - r2 * Math.cos(a)} stroke="#fff" strokeWidth="2" /> })}
      <line x1="100" y1="100" x2="100" y2="76" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" />
      <line x1="100" y1="100" x2="116" y2="108" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
      <rect x="150" y="94" width="8" height="12" rx="3" fill="#c9ccd2" />
    </g>
  )
}
export default function Art({ type, color = '#0047ab', big }) {
  const bg = { wallet: '#f4f1ea', chain: '#eef2f8', cap: '#f1f1f1' }[type] || 'linear-gradient(145deg,#eef3fb,#f9f8f3)'
  return (
    <div style={{ background: bg, position: 'absolute', inset: 0, display: 'grid', placeItems: 'center' }}>
      {type === 'watch' || type === 'watch-w' ? (
        <svg viewBox="0 0 200 200" style={{ width: '70%', height: '70%' }}><Watch c={color} w={type === 'watch-w'} /></svg>
      ) : type === 'pair' ? (
        <svg viewBox="0 0 400 200" style={{ width: '90%', height: '70%' }}><Watch c={color} /><g transform="translate(200 0)"><Watch c="#111" w /></g></svg>
      ) : (
        <div style={{ width: '46%', height: '46%', color }}><Icon k={{ wallet: 'wallets', chain: 'chains', cap: 'caps' }[type]} /></div>
      )}
    </div>
  )
}
