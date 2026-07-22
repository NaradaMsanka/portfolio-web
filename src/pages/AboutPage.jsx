import Icon from '../components/Icon';
import SectionTitle from '../components/SectionTitle';
import { strengths } from '../data';

export default function AboutPage() {
  return (
    <>
      <section className="section about" id="about">
        <div className="container about-grid">
          <div className="about-visual reveal">
            <div className="technical-card"><span>Execution standard</span><strong>Safety. Quality.<br />Accountability.</strong><div className="blueprint"><i /><i /><i /><i /></div><small>Built into every stage</small></div>
            <div className="experience"><b>A</b><span>Engineering ideas<br />into reality</span></div>
          </div>
          <div className="about-copy reveal">
            <SectionTitle eyebrow="Who we are" title="Built on expertise. Driven by integrity." />
            <p className="lead">Aventro Projects is a dynamic project execution and contracting company specialising in MEP installations and turnkey delivery.</p>
            <p>We bring together experienced project managers, engineers, supervisors and skilled technical personnel to deliver commercial, hospitality, residential, industrial and infrastructure projects safely, efficiently and to the highest quality standards.</p>
            <div className="strengths">{strengths.map((item) => <div key={item}><span><Icon name="check" size={15} /></span>{item}</div>)}</div>
            <a href="#contact" className="text-link">Start a conversation <Icon name="arrow" size={17} /></a>
          </div>
        </div>
      </section>
      <section className="vm-section">
        <div className="container vm-grid">
          <article><div className="vm-icon"><Icon name="eye" /></div><span>Our vision</span><h3>Setting a higher standard for project execution.</h3><p>To become a trusted leader in MEP solutions by delivering safe, sustainable and high-quality projects that create long-term value for clients and communities.</p></article>
          <article className="mission"><div className="vm-icon"><Icon name="target" /></div><span>Our mission</span><h3>Making ambitious plans work in the real world.</h3><p>To provide reliable, cost-effective and technically sound solutions through professional planning, skilled execution, innovation and strong client collaboration.</p></article>
        </div>
      </section>
    </>
  );
}
