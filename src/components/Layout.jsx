import { useEffect, useState } from 'react';
import { navItems, services } from '../data';
import Icon from './Icon';
import Logo from './Logo';

function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const sectionIds = [...navItems.map((item) => item.path), '#contact'];
    const sections = sectionIds.map((path) => document.querySelector(path)).filter(Boolean);
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible) setActiveSection(visible.target.id);
    }, { rootMargin: '-28% 0px -58% 0px', threshold: [0, 0.15, 0.35] });
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <header className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="nav-inner container">
        <Logo light />
        <nav className={open ? 'open' : ''} aria-label="Main navigation">
          {navItems.map((item) => (
            <a className={activeSection === item.path.slice(1) ? 'active' : ''} key={item.path} href={item.path} onClick={() => setOpen(false)}>
              <Icon name={item.icon} size={14} /><span>{item.label}</span>
            </a>
          ))}
        </nav>
        <a href="#contact" className={`btn btn-sm nav-cta ${activeSection === 'contact' ? 'active' : ''}`}>
          <span>Book consultation</span><Icon name="arrow" size={17} />
        </a>
        <button className="menu-btn" onClick={() => setOpen(!open)} aria-label="Toggle menu" aria-expanded={open}>
          <Icon name={open ? 'close' : 'menu'} />
        </button>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer>
      <div className="container footer-main">
        <div className="footer-brand"><Logo light /><p>Delivering safe, efficient and technically sound MEP and turnkey project solutions across Sri Lanka.</p><span>Where vision meets execution.</span></div>
        <div><b>Company</b>{[...navItems.slice(1), { label: 'Contact', path: '#contact' }].map((item) => <a href={item.path} key={item.path}>{item.label}</a>)}</div>
        <div><b>Core services</b>{services.slice(0, 5).map((service) => <a href="#services" key={service[1]}>{service[1]}</a>)}</div>
        <div><b>Contact</b><a href="tel:+94740309918">074 030 9918</a><a href="mailto:suneth2003narada@gmail.com">suneth2003narada@gmail.com</a><span>Colombo, Sri Lanka</span></div>
      </div>
      <div className="container footer-bottom"><span>© 2026 Aventro Projects (Pvt) Ltd. All Rights Reserved.</span><a href="#home">Back to top ↑</a></div>
    </footer>
  );
}

function PageLoader({ state }) {
  if (state === 'hidden') return null;
  return <div className={`page-loader ${state}`} role="status" aria-live="polite" aria-label="Loading Aventro Projects"><div className="loader-grid" /><div className="loader-content"><div className="loader-mark"><i /><i /><i /></div><div className="loader-name">AVENTRO</div><div className="loader-company">PROJECTS (PVT) LTD</div><div className="loader-progress"><span /></div><p>Where vision meets execution.</p></div></div>;
}

export default function Layout({ children }) {
  const [loaderState, setLoaderState] = useState('visible');

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add('visible')), { threshold: 0.08 });
    document.querySelectorAll('.reveal').forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    document.body.classList.add('page-loading');
    const leaveTimer = window.setTimeout(() => setLoaderState('leaving'), 550);
    const hideTimer = window.setTimeout(() => { setLoaderState('hidden'); document.body.classList.remove('page-loading'); }, 1250);
    return () => { window.clearTimeout(leaveTimer); window.clearTimeout(hideTimer); document.body.classList.remove('page-loading'); };
  }, []);

  return <><PageLoader state={loaderState} /><Navbar /><main>{children}</main><Footer /></>;
}
