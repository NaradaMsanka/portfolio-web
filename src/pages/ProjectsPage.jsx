import { useEffect, useState } from 'react';
import Icon from '../components/Icon';
import SectionTitle from '../components/SectionTitle';
import { projects } from '../data';

function ProjectModal({ project, onClose }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const closeOnEscape = (event) => event.key === 'Escape' && onClose();
    window.addEventListener('keydown', closeOnEscape);
    return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', closeOnEscape); };
  }, [onClose]);

  return (
    <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <button className="modal-close" onClick={onClose} aria-label="Close case study"><Icon name="close" /></button>
        <div className="modal-hero"><div className="project-pattern"><Icon name={project.icon} size={62} /></div><span>{project.type} project</span><h2 id="modal-title">{project.title}</h2><p>{project.location}</p></div>
        <div className="modal-content">
          <div className="modal-facts"><div><small>Client</small><b>{project.client}</b></div><div><small>Scope</small><b>{project.scope}</b></div><div><small>Scale</small><b>{project.scale}</b></div><div><small>Timeline</small><b>{project.year}</b></div></div>
          <p className="modal-intro">{project.desc}</p>
          <div className="case-grid"><div><span>01 / Challenge</span><h3>Complexity, carefully managed.</h3><p>{project.challenge}</p></div><div><span>02 / Our solution</span><h3>Clarity in execution.</h3><p>{project.solution}</p></div></div>
          <a className="btn" href="#contact" onClick={onClose}>Discuss a similar project <Icon name="arrow" size={17} /></a>
        </div>
      </div>
    </div>
  );
}

export default function ProjectsPage() {
  const [filter, setFilter] = useState('All');
  const [selected, setSelected] = useState(null);
  const visible = filter === 'All' ? projects : projects.filter((project) => project.type === filter);

  return (
    <section className="section projects" id="projects">
      <div className="container">
        <div className="projects-head"><SectionTitle eyebrow="Selected work" title="Capability, proven in the field." text="A portfolio spanning completed delivery, active execution and the next generation of sustainable infrastructure." /><div className="filters" role="group" aria-label="Filter projects">{['All', 'Completed', 'Ongoing', 'Future'].map((item) => <button className={filter === item ? 'active' : ''} key={item} onClick={() => setFilter(item)}>{item}</button>)}</div></div>
        <div className="projects-grid">{visible.map((project, index) => <article className={`project-card p${project.id}`} key={project.id}><div className="project-art"><div className="project-pattern"><Icon name={project.icon} size={48} /></div><span className={`status ${project.type.toLowerCase()}`}>{project.type}</span><b>{String(index + 1).padStart(2, '0')}</b></div><div className="project-body"><div className="project-meta"><span><Icon name="map" size={14} />{project.location}</span><span>{project.scale}</span></div><h3>{project.title}</h3><p>{project.desc}</p><button className="project-link" onClick={() => setSelected(project)}>View case study <Icon name="arrow" size={17} /></button></div></article>)}</div>
      </div>
      {selected && <ProjectModal project={selected} onClose={() => setSelected(null)} />}
    </section>
  );
}
