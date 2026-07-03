import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  ArrowRight, AtSign, Award, BriefcaseBusiness, Building2, Cable, Check,
  ChevronLeft, ChevronRight, ClipboardList, Clock3, Droplets, Eye, Factory, Fan, Flame, Handshake, Hotel,
  House, KeyRound, Landmark, Mail, MapPin, Menu, Network, Phone, Quote, ShieldCheck,
  MessageSquareText, Send, SolarPanel, Target, UserRound, Workflow, Wrench, X
} from 'lucide-react';
import './styles.css';

const Icon = ({ name, size = 22 }) => {
  const icons = {
    arrow: ArrowRight, bolt: Cable, wind: Fan, drop: Droplets,
    shield: ShieldCheck, signal: Network, sun: SolarPanel,
    key: KeyRound, layers: Workflow, check: Check, target: Target,
    eye: Eye, map: MapPin, mail: Mail, phone: Phone, clock: Clock3,
    close: X, menu: Menu, quote: Quote, award: Award,
    home: House, company: Building2, services: Wrench,
    projects: BriefcaseBusiness, clients: Handshake, fire: Flame,
    hospitality: Hotel, industrial: Factory, infrastructure: Landmark,
    user: UserRound, email: AtSign, clipboard: ClipboardList,
    message: MessageSquareText, send: Send,
    previous: ChevronLeft, next: ChevronRight
  };
  const LucideIcon = icons[name] || Building2;
  return <LucideIcon className="icon" size={size} strokeWidth={1.8} aria-hidden="true" />;
};

const Logo = ({ light = false }) => <a href="#home" className={`logo ${light ? 'logo-light' : ''}`} aria-label="Aventro Projects home">
  <span className="logo-mark"><i></i><i></i><i></i></span>
  <span><b>AVENTRO</b><small>PROJECTS (PVT) LTD</small></span>
</a>;

const navItems = ['Home', 'About', 'Services', 'Projects', 'Clients'];
const navIcons = { Home: 'home', About: 'company', Services: 'services', Projects: 'projects', Clients: 'clients' };

function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll(); window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  useEffect(() => {
    const sections = [...navItems, 'Contact'].map(item => document.getElementById(item.toLowerCase())).filter(Boolean);
    const observer = new IntersectionObserver(entries => {
      const visible = entries.filter(entry => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible) setActiveSection(visible.target.id);
    }, { rootMargin: '-28% 0px -58% 0px', threshold: [0, .15, .35] });
    sections.forEach(section => observer.observe(section));
    return () => observer.disconnect();
  }, []);
  return <header className={`navbar ${scrolled ? 'scrolled' : ''}`}>
    <div className="nav-inner container">
      <Logo light/>
      <nav className={open ? 'open' : ''} aria-label="Main navigation">
        {navItems.map(item => <a className={activeSection === item.toLowerCase() ? 'active' : ''} key={item} href={`#${item.toLowerCase()}`} onClick={() => { setOpen(false); setActiveSection(item.toLowerCase()); }}><Icon name={navIcons[item]} size={14}/><span>{item}</span></a>)}
      </nav>
      <a href="#contact" className={`btn btn-sm nav-cta ${activeSection === 'contact' ? 'active' : ''}`} onClick={() => setActiveSection('contact')}><span>Book consultation</span><Icon name="arrow" size={17}/></a>
      <button className="menu-btn" onClick={() => setOpen(!open)} aria-label="Toggle menu"><Icon name={open ? 'close' : 'menu'}/></button>
    </div>
  </header>;
}

const SectionTitle = ({ eyebrow, title, text, center = false }) => <div className={`section-title ${center ? 'center' : ''}`}>
  <span className="eyebrow">{eyebrow}</span><h2>{title}</h2>{text && <p>{text}</p>}
</div>;

const stats = [
  { value: 25, suffix: '+', label: 'Projects successfully delivered' },
  { value: 10, suffix: '+', label: 'Trusted industry partners' },
  { value: 5, suffix: '+', label: 'Core sectors served' },
  { value: 100, suffix: '%', label: 'Commitment to quality' }
];
const strengths = ['End-to-end project execution', 'MEP installations', 'Turnkey project delivery', 'Safety & quality assurance', 'On-time, within-budget delivery', 'Sustainable engineering solutions'];
const services = [
  ['bolt','Electrical Installations','Safe, efficient electrical infrastructure designed, installed and tested to exacting standards.'],
  ['wind','HVAC Systems','Comfort-driven ventilation and climate systems engineered for performance and energy efficiency.'],
  ['drop','Plumbing & Drainage','Reliable water supply, sanitation and drainage systems for complex developments.'],
  ['fire','Fire Protection','Integrated detection, alarm and suppression systems that protect people and property.'],
  ['signal','ELV Systems','Structured cabling, security, data and building management systems that keep spaces connected.'],
  ['sun','Renewable Energy','Practical solar and energy-efficient solutions that reduce impact and operating cost.'],
  ['key','Turnkey Delivery','One accountable partner from early planning and procurement through commissioning and handover.'],
  ['layers','Project Coordination','Disciplined technical coordination that aligns trades, stakeholders, quality and schedules.']
];

const projects = [
  {id:1, type:'Completed', title:'Commercial MEP Installation', location:'Colombo, Sri Lanka', client:'Confidential Client', scope:'Full MEP Installation', scale:'45,000 sq. ft.', year:'2025', icon:'bolt', desc:'Delivered complete electrical, plumbing, HVAC and fire protection systems while maintaining strict safety, quality and timeline requirements.', challenge:'Coordinating multiple disciplines within an active commercial programme and a tightly controlled schedule.', solution:'A coordinated BIM-led services strategy, phased installation and rigorous inspection checkpoints kept delivery safe and predictable.'},
  {id:2, type:'Completed', title:'Industrial Services Upgrade', location:'Biyagama, Sri Lanka', client:'Industrial Partner', scope:'Electrical & Mechanical Upgrade', scale:'12 MW facility', year:'2024', icon:'layers', desc:'Modernised critical building services to improve operational reliability, compliance and energy performance.', challenge:'Executing upgrades without disrupting business-critical operations.', solution:'Night-shift execution, prefabricated assemblies and precise shutdown planning reduced operational impact.'},
  {id:3, type:'Ongoing', title:'Hospitality Development MEP', location:'Southern Coast, Sri Lanka', client:'Hospitality Group', scope:'HVAC, Plumbing, Electrical & ELV', scale:'120-key property', year:'Completion 2026', icon:'wind', desc:'Integrated MEP delivery for a premium hospitality development, focused on efficient coordination and quality workmanship.', challenge:'Integrating high-comfort systems within an architecturally complex coastal property.', solution:'Early services coordination and corrosion-resistant specifications support both design intent and long-term durability.'},
  {id:4, type:'Ongoing', title:'Urban Residential Towers', location:'Colombo, Sri Lanka', client:'Property Developer', scope:'Building Services Coordination', scale:'180 residences', year:'Completion 2027', icon:'drop', desc:'Coordinating essential services across two residential towers with a focus on efficiency and future maintainability.', challenge:'Vertical distribution across repeat floors while protecting saleable area.', solution:'Standardised riser modules and coordinated ceiling zones simplify installation and future service access.'},
  {id:5, type:'Future', title:'Sustainable Infrastructure', location:'Sri Lanka', client:'Development Partner', scope:'Renewable Energy & Building Services', scale:'Multi-site programme', year:'Planned', icon:'sun', desc:'A future-focused programme supporting sustainable infrastructure through modern engineering and energy-efficient systems.', challenge:'Creating a scalable technical standard for diverse sites.', solution:'A modular renewable-energy and smart-metering framework designed for repeatable, measurable performance.'},
  {id:6, type:'Future', title:'Smart Logistics Hub', location:'Western Province, Sri Lanka', client:'Logistics Partner', scope:'Turnkey MEP & ELV', scale:'100,000 sq. ft.', year:'Planned', icon:'signal', desc:'A resilient, connected logistics facility planned around efficient operations, safety and intelligent controls.', challenge:'Balancing rapid throughput, life safety and operational energy demands.', solution:'A high-availability services concept with smart controls, zoned ventilation and resilient power distribution.'}
];

const heroSlides = [
  {
    label: 'Turnkey Projects',
    title: <>Vision to <em>Execution</em></>,
    text: 'End-to-end project delivery built on disciplined planning, technical coordination, safety and accountable execution.',
    image: '/assets/aventro-hero.png',
    stats: [['25+', 'Projects delivered', 'key'], ['100%', 'Quality focus', 'shield']]
  },
  {
    label: 'Electrical Systems',
    title: <>Powering Modern <em>Infrastructure</em></>,
    text: 'Safe, reliable electrical installations engineered for commercial, industrial and infrastructure developments.',
    image: '/assets/hero-electrical.png',
    stats: [['100%', 'Safety focused', 'shield'], ['24/7', 'Project support', 'bolt']]
  },
  {
    label: 'HVAC Engineering',
    title: <>Comfort Through <em>Precision</em></>,
    text: 'High-performance HVAC and ventilation systems designed for efficiency, comfort and dependable long-term operation.',
    image: '/assets/hero-hvac.png',
    stats: [['5+', 'Core sectors', 'layers'], ['100%', 'System coordination', 'wind']]
  },
  {
    label: 'Renewable Energy',
    title: <>Engineering a <em>Sustainable Future</em></>,
    text: 'Practical renewable-energy solutions that improve efficiency, reduce operating cost and create lasting value.',
    image: '/assets/hero-renewable.png',
    stats: [['100%', 'Sustainable focus', 'sun'], ['10+', 'Industry partners', 'target']]
  }
];

function Hero() {
  const [active, setActive] = useState(0);
  const next = () => setActive(current => (current + 1) % heroSlides.length);
  const previous = () => setActive(current => (current - 1 + heroSlides.length) % heroSlides.length);

  useEffect(() => {
    const timer = window.setInterval(next, 3000);
    return () => window.clearInterval(timer);
  }, [active]);

  return <section className="hero hero-slider" id="home">
    <div className="hero-slides" aria-hidden="true">
      {heroSlides.map((item, index) => <div key={item.label} className={`hero-bg ${index === active ? 'active' : ''}`} style={{backgroundImage:`linear-gradient(90deg,rgba(3,18,36,.96) 0%,rgba(3,20,40,.82) 38%,rgba(3,19,38,.28) 68%,rgba(3,17,34,.12)),linear-gradient(0deg,rgba(3,19,38,.58),transparent 48%),url('${item.image}')`}}/>) }
    </div>
    <div className="hero-grid"/>
    <div className="container hero-layout" aria-live="polite">
      <div className="hero-copy-stack">
        {heroSlides.map((item, index) => <div className={`hero-content hero-copy-slide ${index === active ? 'active' : ''}`} aria-hidden={index !== active} key={item.label}>
          <div className="hero-kicker"><span></span>{item.label}</div>
          <h1>{item.title}</h1>
          <p>{item.text}</p>
          <div className="hero-actions"><a href="#contact" className="btn btn-light">Book a consultation <Icon name="arrow" size={18}/></a><a href="#projects" className="btn btn-ghost">View our work</a></div>
        </div>)}
      </div>
      <div className="hero-stats-stack">
        {heroSlides.map((item, index) => <div className={`hero-stats ${index === active ? 'active' : ''}`} aria-hidden={index !== active} key={item.label}>
          {item.stats.map(([value, label, icon]) => <div className="hero-stat-card" key={label}><span><Icon name={icon} size={25}/></span><div><strong>{value}</strong><small>{label}</small></div></div>)}
        </div>)}
      </div>
    </div>
    <div className="container hero-controls">
      <div className="slide-dots" aria-label="Choose slideshow item">{heroSlides.map((item,index)=><button key={item.label} className={index===active?'active':''} onClick={()=>setActive(index)} aria-label={`Show ${item.label}`}><i></i></button>)}</div>
      <div className="slide-arrows"><button onClick={previous} aria-label="Previous slide"><Icon name="previous" size={25}/></button><button onClick={next} aria-label="Next slide"><Icon name="next" size={25}/></button></div>
      <div className="slide-subjects">{heroSlides.map((item,index)=><button key={item.label} className={index===active?'active':''} onClick={()=>setActive(index)}>{item.label}</button>)}</div>
    </div>
  </section>
}

function CountUpStat({ value, suffix, label, delay }) {
  const elementRef = useRef(null);
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setCount(value);
      setStarted(true);
      return undefined;
    }

    let frame;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      setStarted(true);
      const start = performance.now() + delay;
      const duration = 1700;
      const animate = now => {
        if (now < start) {
          frame = requestAnimationFrame(animate);
          return;
        }
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 4);
        setCount(Math.round(value * eased));
        if (progress < 1) frame = requestAnimationFrame(animate);
      };
      frame = requestAnimationFrame(animate);
      observer.disconnect();
    }, { threshold: .45 });

    observer.observe(element);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [value, delay]);

  return <div className={`stat ${started ? 'count-active' : ''}`} ref={elementRef} aria-label={`${value}${suffix} ${label}`}>
    <strong><span>{count}</span><sup>{suffix}</sup></strong>
    <span>{label}</span>
  </div>;
}

function Trust() { return <><section className="trust-bar" id="trust"><div className="container trust-items">
  {['Trusted MEP & turnkey partner','Safe, efficient delivery','Experienced technical teams','Multi-sector expertise'].map((x,i)=><div key={x}><b>0{i+1}</b><span>{x}</span></div>)}
 </div></section><section className="stats"><div className="container stats-grid">{stats.map((item,index)=><CountUpStat {...item} delay={index * 130} key={item.label}/>)}</div></section></> }

function About() { return <section className="section about" id="about"><div className="container about-grid">
  <div className="about-visual reveal"><div className="technical-card"><span>Execution standard</span><strong>Safety. Quality.<br/>Accountability.</strong><div className="blueprint"><i></i><i></i><i></i><i></i></div><small>Built into every stage</small></div><div className="experience"><b>A</b><span>Engineering ideas<br/>into reality</span></div></div>
  <div className="about-copy reveal"><SectionTitle eyebrow="Who we are" title="Built on expertise. Driven by integrity."/><p className="lead">Aventro Projects is a dynamic project execution and contracting company specialising in MEP installations and turnkey delivery.</p><p>We bring together experienced project managers, engineers, supervisors and skilled technical personnel to deliver commercial, hospitality, residential, industrial and infrastructure projects safely, efficiently and to the highest quality standards.</p><div className="strengths">{strengths.map(x=><div key={x}><span><Icon name="check" size={15}/></span>{x}</div>)}</div><a href="#contact" className="text-link">Start a conversation <Icon name="arrow" size={17}/></a></div>
 </div></section> }

function VisionMission() { return <section className="vm-section"><div className="container vm-grid">
  <article><div className="vm-icon"><Icon name="eye"/></div><span>Our vision</span><h3>Setting a higher standard for project execution.</h3><p>To become a trusted leader in MEP solutions by delivering safe, sustainable and high-quality projects that create long-term value for clients and communities.</p></article>
  <article className="mission"><div className="vm-icon"><Icon name="target"/></div><span>Our mission</span><h3>Making ambitious plans work in the real world.</h3><p>To provide reliable, cost-effective and technically sound solutions through professional planning, skilled execution, innovation and strong client collaboration.</p></article>
 </div></section> }

function Services() { return <section className="section services" id="services"><div className="container"><SectionTitle eyebrow="Our expertise" title="One team. Complete project capability." text="Integrated technical services delivered with precision—from first coordination to final commissioning."/>
  <div className="services-grid">{services.map(([icon,title,desc],i)=><article className="service-card reveal" key={title}><span className="service-num">{String(i+1).padStart(2,'0')}</span><div className="service-icon"><Icon name={icon}/></div><h3>{title}</h3><p>{desc}</p><a href="#contact" aria-label={`Enquire about ${title}`}><Icon name="arrow" size={18}/></a></article>)}</div>
 </div></section> }

function ProjectModal({ project, onClose }) {
  useEffect(()=>{document.body.style.overflow='hidden'; const e=x=>x.key==='Escape'&&onClose(); window.addEventListener('keydown',e); return()=>{document.body.style.overflow='';window.removeEventListener('keydown',e)}},[onClose]);
  return <div className="modal-backdrop" onMouseDown={e=>e.target===e.currentTarget&&onClose()}><div className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title"><button className="modal-close" onClick={onClose}><Icon name="close"/></button><div className="modal-hero"><div className="project-pattern"><Icon name={project.icon} size={62}/></div><span>{project.type} project</span><h2 id="modal-title">{project.title}</h2><p>{project.location}</p></div><div className="modal-content"><div className="modal-facts"><div><small>Client</small><b>{project.client}</b></div><div><small>Scope</small><b>{project.scope}</b></div><div><small>Scale</small><b>{project.scale}</b></div><div><small>Timeline</small><b>{project.year}</b></div></div><p className="modal-intro">{project.desc}</p><div className="case-grid"><div><span>01 / Challenge</span><h3>Complexity, carefully managed.</h3><p>{project.challenge}</p></div><div><span>02 / Our solution</span><h3>Clarity in execution.</h3><p>{project.solution}</p></div></div><a className="btn" href="#contact" onClick={onClose}>Discuss a similar project <Icon name="arrow" size={17}/></a></div></div></div>
}

function Projects() {
  const [filter,setFilter]=useState('All'); const [selected,setSelected]=useState(null);
  const visible=filter==='All'?projects:projects.filter(x=>x.type===filter);
  return <section className="section projects" id="projects"><div className="container"><div className="projects-head"><SectionTitle eyebrow="Selected work" title="Capability, proven in the field." text="A portfolio spanning completed delivery, active execution and the next generation of sustainable infrastructure."/><div className="filters" role="group" aria-label="Filter projects">{['All','Completed','Ongoing','Future'].map(x=><button className={filter===x?'active':''} key={x} onClick={()=>setFilter(x)}>{x}</button>)}</div></div>
  <div className="projects-grid">{visible.map((p,i)=><article className={`project-card p${p.id}`} key={p.id}><div className="project-art"><div className="project-pattern"><Icon name={p.icon} size={48}/></div><span className={`status ${p.type.toLowerCase()}`}>{p.type}</span><b>{String(i+1).padStart(2,'0')}</b></div><div className="project-body"><div className="project-meta"><span><Icon name="map" size={14}/>{p.location}</span><span>{p.scale}</span></div><h3>{p.title}</h3><p>{p.desc}</p><button className="project-link" onClick={()=>setSelected(p)}>View case study <Icon name="arrow" size={17}/></button></div></article>)}</div>
  </div>{selected&&<ProjectModal project={selected} onClose={()=>setSelected(null)}/>}</section>
}

const testimonials=[['Team Aventro delivered our requirements with professionalism, technical expertise and a strong attention to quality.','Project Director','Commercial Development'],['Reliable coordination, timely execution and a safety-focused approach made Aventro a valuable project partner.','Consultant Engineer','Hospitality Sector'],['Their ability to manage MEP works efficiently helped us complete key project milestones with confidence.','Client Representative','Industrial Sector']];
const clientBrands = [
  ['Nexa Developments', 'Commercial', 'company'],
  ['Ceylon Hospitality', 'Hotels & Resorts', 'hospitality'],
  ['Vertex Industries', 'Industrial', 'industrial'],
  ['Urban Living', 'Residential', 'home'],
  ['Lanka InfraWorks', 'Infrastructure', 'infrastructure']
];

function Clients() { return <section className="section clients" id="clients"><div className="container"><SectionTitle eyebrow="Built on trust" title="Strong projects begin with strong partnerships." text="We earn confidence through reliable execution, professional communication and consistent quality." center/>
 <div className="client-marquee brand-marquee" aria-label="Client and industry partner brands"><div className="brand-track">{[0,1].map(group=><div className="brand-group" aria-hidden={group===1} key={group}>{clientBrands.map(([name,sector,icon])=><div className="client-brand" key={`${group}-${name}`}><span><Icon name={icon} size={23}/></span><div><b>{name}</b><small>{sector} partner</small></div></div>)}</div>)}</div></div>
 <div className="review-marquee" aria-label="Client reviews"><div className="review-track">{[0,1].map(group=><div className="review-group" aria-hidden={group===1} key={group}>{testimonials.map(([quote,name,role])=><article className="review-card" key={`${group}-${name}`}><div className="review-label"><Icon name="quote" size={20}/><span>Client review</span></div><p>“{quote}”</p><div className="review-author"><span>{name.charAt(0)}</span><b>{name}<small>{role}</small></b></div></article>)}</div>)}</div></div>
 </div></section> }

const certs=[['shield','Quality systems','Structured inspection and quality assurance'],['award','Industry standards','Compliance-led technical execution'],['shield','Safety first','Proactive site safety and risk control'],['award','Professional delivery','Accountable teams and documented handover']];
function Certifications(){return <section className="certs"><div className="container certs-inner"><div><span className="eyebrow light">Our commitment</span><h2>Standards you can build on.</h2><p>Every project is guided by disciplined processes, responsible practice and an uncompromising focus on quality.</p></div><div className="cert-grid">{certs.map(([i,t,d])=><article key={t}><Icon name={i}/><div><b>{t}</b><span>{d}</span></div></article>)}</div></div></section>}

function Contact(){const [sent,setSent]=useState(false); return <section className="section contact" id="contact"><div className="container contact-grid"><div className="contact-copy"><SectionTitle eyebrow="Start a project" title="Let’s build your next project together." text="Tell us what you are planning. Our team will listen, assess and help define the right path forward."/><div className="contact-list"><a href="tel:+94740309918"><span><Icon name="phone"/></span><div><small>Call us</small><b>074 030 9918</b></div></a><a href="mailto:suneth2003narada@gmail.com"><span><Icon name="mail"/></span><div><small>Email us</small><b>suneth2003narada@gmail.com</b></div></a><div><span><Icon name="map"/></span><div><small>Our office</small><b>Colombo, Sri Lanka</b></div></div></div><div className="socials"><a href="#" aria-label="LinkedIn">in</a><a href="#" aria-label="Facebook">f</a><a href="#" aria-label="Instagram">ig</a></div></div>
 <form className="contact-form" onSubmit={e=>{e.preventDefault();setSent(true);e.currentTarget.reset()}}>
  <div className="form-top"><div><span>Project enquiry</span><p>Share a few details and our team will get back to you.</p></div><small>Required fields *</small></div>
  <div className="field-row"><label><span className="field-label"><Icon name="user" size={15}/>Full name *</span><input required name="name" placeholder="Your full name"/></label><label><span className="field-label"><Icon name="email" size={15}/>Business email *</span><input required type="email" name="email" placeholder="you@company.com"/></label></div>
  <div className="field-row"><label><span className="field-label"><Icon name="phone" size={15}/>Phone number</span><input type="tel" name="phone" placeholder="+94 XX XXX XXXX"/></label><label><span className="field-label"><Icon name="clipboard" size={15}/>Project service</span><select name="type" defaultValue=""><option value="" disabled>Select a service</option>{services.slice(0,7).map(x=><option key={x[1]}>{x[1]}</option>)}</select></label></div>
  <label><span className="field-label"><Icon name="message" size={15}/>Project brief *</span><textarea required name="message" rows="4" placeholder="Tell us about the scope, location and expected timeline..."></textarea></label>
  <button className="btn form-btn" type="submit"><span>Send project enquiry</span><Icon name="send" size={18}/></button>
  <p className="form-privacy">Your project information is treated as private and used only to respond to your enquiry.</p>
  {sent&&<div className="form-success" role="status"><Icon name="check" size={17}/> Thank you. Your enquiry has been prepared successfully.</div>}
 </form>
 </div></section>}

function Footer(){return <footer><div className="container footer-main"><div className="footer-brand"><Logo light/><p>Delivering safe, efficient and technically sound MEP and turnkey project solutions across Sri Lanka.</p><span>Where vision meets execution.</span></div><div><b>Company</b>{['About','Services','Projects','Clients','Contact'].map(x=><a href={`#${x.toLowerCase()}`} key={x}>{x}</a>)}</div><div><b>Core services</b>{services.slice(0,5).map(x=><a href="#services" key={x[1]}>{x[1]}</a>)}</div><div><b>Contact</b><a href="tel:+94740309918">074 030 9918</a><a href="mailto:suneth2003narada@gmail.com">suneth2003narada@gmail.com</a><span>Colombo, Sri Lanka</span></div></div><div className="container footer-bottom"><span>© 2026 Aventro Projects (Pvt) Ltd. All Rights Reserved.</span><a href="#home">Back to top ↑</a></div></footer>}

function PageLoader({ state }) {
  if (state === 'hidden') return null;
  return <div className={`page-loader ${state}`} role="status" aria-live="polite" aria-label="Loading Aventro Projects">
    <div className="loader-grid"/>
    <div className="loader-content">
      <div className="loader-mark"><i></i><i></i><i></i></div>
      <div className="loader-name">AVENTRO</div>
      <div className="loader-company">PROJECTS (PVT) LTD</div>
      <div className="loader-progress"><span></span></div>
      <p>Where vision meets execution.</p>
    </div>
  </div>;
}

function App(){
  const [loaderState,setLoaderState]=useState('visible');
  useEffect(()=>{
    const obs=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)e.target.classList.add('visible')}),{threshold:.08});
    document.querySelectorAll('.reveal').forEach(x=>obs.observe(x));
    return()=>obs.disconnect();
  },[]);
  useEffect(()=>{
    let leaveTimer;
    let hideTimer;
    const finish=()=>{
      leaveTimer=window.setTimeout(()=>setLoaderState('leaving'),550);
      hideTimer=window.setTimeout(()=>{setLoaderState('hidden');document.body.classList.remove('page-loading')},1250);
    };
    document.body.classList.add('page-loading');
    if(document.readyState==='complete') finish();
    else window.addEventListener('load',finish,{once:true});
    return()=>{window.removeEventListener('load',finish);window.clearTimeout(leaveTimer);window.clearTimeout(hideTimer);document.body.classList.remove('page-loading')};
  },[]);
  return <><PageLoader state={loaderState}/><Navbar/><main><Hero/><Trust/><About/><VisionMission/><Services/><Projects/><Clients/><Certifications/><Contact/></main><Footer/></>
}

createRoot(document.getElementById('root')).render(<React.StrictMode><App/></React.StrictMode>);
