export default function Logo({ light = false }) {
  return (
    <a href="#home" className={`logo ${light ? 'logo-light' : ''}`} aria-label="Aventro Projects home">
      <span className="logo-mark"><i /><i /><i /></span>
      <span><b>AVENTRO</b><small>PROJECTS (PVT) LTD</small></span>
    </a>
  );
}
