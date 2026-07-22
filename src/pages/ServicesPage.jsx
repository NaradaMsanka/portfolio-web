import Icon from '../components/Icon';
import SectionTitle from '../components/SectionTitle';
import { services } from '../data';

export default function ServicesPage() {
  return (
    <section className="section services" id="services">
      <div className="container">
        <SectionTitle eyebrow="Our expertise" title="One team. Complete project capability." text="Integrated technical services delivered with precision, from first coordination to final commissioning." />
        <div className="services-grid">
          {services.map(([icon, title, desc], index) => <article className="service-card reveal" key={title}><span className="service-num">{String(index + 1).padStart(2, '0')}</span><div className="service-icon"><Icon name={icon} /></div><h3>{title}</h3><p>{desc}</p><a href="#contact" aria-label={`Enquire about ${title}`}><Icon name="arrow" size={18} /></a></article>)}
        </div>
      </div>
    </section>
  );
}
