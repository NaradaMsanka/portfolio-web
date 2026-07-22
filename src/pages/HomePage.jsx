import { useEffect, useRef, useState } from 'react';
import Icon from '../components/Icon';
import { certifications, heroSlides, stats } from '../data';

function Hero() {
  const [active, setActive] = useState(0);
  const next = () => setActive((current) => (current + 1) % heroSlides.length);
  const previous = () => setActive((current) => (current - 1 + heroSlides.length) % heroSlides.length);

  useEffect(() => {
    const timer = window.setInterval(next, 5000);
    return () => window.clearInterval(timer);
  }, [active]);

  return (
    <section className="hero hero-slider" id="home">
      <div className="hero-slides" aria-hidden="true">
        {heroSlides.map((item, index) => <div key={item.label} className={`hero-bg ${index === active ? 'active' : ''}`} style={{ backgroundImage: `linear-gradient(90deg,rgba(3,18,36,.96) 0%,rgba(3,20,40,.82) 38%,rgba(3,19,38,.28) 68%,rgba(3,17,34,.12)),linear-gradient(0deg,rgba(3,19,38,.58),transparent 48%),url('${item.image}')` }} />)}
      </div>
      <div className="hero-grid" />
      <div className="container hero-layout" aria-live="polite">
        <div className="hero-copy-stack">
          {heroSlides.map((item, index) => <div className={`hero-content hero-copy-slide ${index === active ? 'active' : ''}`} aria-hidden={index !== active} key={item.label}><div className="hero-kicker"><span />{item.label}</div><h1>{item.title} <em>{item.accent}</em></h1><p>{item.text}</p><div className="hero-actions"><a href="#contact" className="btn btn-light">Book a consultation <Icon name="arrow" size={18} /></a><a href="#projects" className="btn btn-ghost">View our work</a></div></div>)}
        </div>
        <div className="hero-stats-stack">
          {heroSlides.map((item, index) => <div className={`hero-stats ${index === active ? 'active' : ''}`} aria-hidden={index !== active} key={item.label}>{item.stats.map(([value, label, icon]) => <div className="hero-stat-card" key={label}><span><Icon name={icon} size={25} /></span><div><strong>{value}</strong><small>{label}</small></div></div>)}</div>)}
        </div>
      </div>
      <div className="container hero-controls">
        <div className="slide-dots" aria-label="Choose slideshow item">{heroSlides.map((item, index) => <button key={item.label} className={index === active ? 'active' : ''} onClick={() => setActive(index)} aria-label={`Show ${item.label}`}><i /></button>)}</div>
        <div className="slide-arrows"><button onClick={previous} aria-label="Previous slide"><Icon name="previous" size={25} /></button><button onClick={next} aria-label="Next slide"><Icon name="next" size={25} /></button></div>
        <div className="slide-subjects">{heroSlides.map((item, index) => <button key={item.label} className={index === active ? 'active' : ''} onClick={() => setActive(index)}>{item.label}</button>)}</div>
      </div>
    </section>
  );
}

function CountUpStat({ value, suffix, label, delay }) {
  const elementRef = useRef(null);
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setCount(value); setStarted(true); return undefined; }
    let frame;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      setStarted(true);
      const start = performance.now() + delay;
      const animate = (now) => {
        if (now < start) { frame = requestAnimationFrame(animate); return; }
        const progress = Math.min((now - start) / 1700, 1);
        setCount(Math.round(value * (1 - Math.pow(1 - progress, 4))));
        if (progress < 1) frame = requestAnimationFrame(animate);
      };
      frame = requestAnimationFrame(animate);
      observer.disconnect();
    }, { threshold: 0.45 });
    observer.observe(element);
    return () => { observer.disconnect(); cancelAnimationFrame(frame); };
  }, [value, delay]);

  return <div className={`stat ${started ? 'count-active' : ''}`} ref={elementRef} aria-label={`${value}${suffix} ${label}`}><strong><span>{count}</span><sup>{suffix}</sup></strong><span>{label}</span></div>;
}

function Trust() {
  return <><section className="trust-bar"><div className="container trust-items">{['Trusted MEP & turnkey partner', 'Safe, efficient delivery', 'Experienced technical teams', 'Multi-sector expertise'].map((item, index) => <div key={item}><b>0{index + 1}</b><span>{item}</span></div>)}</div></section><section className="stats"><div className="container stats-grid">{stats.map((item, index) => <CountUpStat {...item} delay={index * 130} key={item.label} />)}</div></section></>;
}

export function Certifications() {
  return <section className="certs"><div className="container certs-inner"><div><span className="eyebrow light">Our commitment</span><h2>Standards you can build on.</h2><p>Every project is guided by disciplined processes, responsible practice and an uncompromising focus on quality.</p></div><div className="cert-grid">{certifications.map(([icon, title, detail]) => <article key={title}><Icon name={icon} /><div><b>{title}</b><span>{detail}</span></div></article>)}</div></div></section>;
}

export default function HomePage() {
  return <><Hero /><Trust /></>;
}
