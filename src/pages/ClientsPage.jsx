import Icon from '../components/Icon';
import SectionTitle from '../components/SectionTitle';
import { clientBrands, testimonials } from '../data';

export default function ClientsPage() {
  return (
    <section className="section clients" id="clients">
      <div className="container">
        <SectionTitle eyebrow="Built on trust" title="Strong projects begin with strong partnerships." text="We earn confidence through reliable execution, professional communication and consistent quality." center />
        <div className="client-marquee brand-marquee" aria-label="Client and industry partner brands"><div className="brand-track">{[0, 1].map((group) => <div className="brand-group" aria-hidden={group === 1} key={group}>{clientBrands.map(([name, sector, icon]) => <div className="client-brand" key={`${group}-${name}`}><span><Icon name={icon} size={23} /></span><div><b>{name}</b><small>{sector} partner</small></div></div>)}</div>)}</div></div>
        <div className="review-marquee" aria-label="Client reviews"><div className="review-track">{[0, 1].map((group) => <div className="review-group" aria-hidden={group === 1} key={group}>{testimonials.map(([quote, name, role]) => <article className="review-card" key={`${group}-${name}`}><div className="review-label"><Icon name="quote" size={20} /><span>Client review</span></div><p>“{quote}”</p><div className="review-author"><span>{name.charAt(0)}</span><b>{name}<small>{role}</small></b></div></article>)}</div>)}</div></div>
      </div>
    </section>
  );
}
