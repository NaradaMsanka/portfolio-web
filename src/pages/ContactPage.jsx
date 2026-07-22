import { useState } from 'react';
import Icon from '../components/Icon';
import SectionTitle from '../components/SectionTitle';
import { services } from '../data';

export default function ContactPage() {
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();
    setStatus('sending');
    setError('');
    const form = event.currentTarget;
    const values = Object.fromEntries(new FormData(form));
    let firebaseConfigured = true;
    try {
      const firebase = await import('../firebase');
      firebaseConfigured = firebase.isFirebaseConfigured;
      await firebase.createEnquiry(values);
      form.reset();
      setStatus('sent');
    } catch (submitError) {
      setError(firebaseConfigured ? 'Your enquiry could not be sent. Please try again or contact us by phone.' : 'Firebase is not configured yet. Add the VITE_FIREBASE_* values to your .env file.');
      setStatus('error');
      console.error(submitError);
    }
  }

  return (
    <section className="section contact" id="contact">
      <div className="container contact-grid">
        <div className="contact-copy">
          <SectionTitle eyebrow="Start a project" title="Let’s build your next project together." text="Tell us what you are planning. Our team will listen, assess and help define the right path forward." />
          <div className="contact-list"><a href="tel:+94740309918"><span><Icon name="phone" /></span><div><small>Call us</small><b>074 030 9918</b></div></a><a href="mailto:suneth2003narada@gmail.com"><span><Icon name="mail" /></span><div><small>Email us</small><b>suneth2003narada@gmail.com</b></div></a><div><span><Icon name="map" /></span><div><small>Our office</small><b>Colombo, Sri Lanka</b></div></div></div>
        </div>
        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="form-top"><div><span>Project enquiry</span><p>Share a few details and our team will get back to you.</p></div><small>Required fields *</small></div>
          <div className="field-row"><label><span className="field-label"><Icon name="user" size={15} />Full name *</span><input required name="name" placeholder="Your full name" /></label><label><span className="field-label"><Icon name="email" size={15} />Business email *</span><input required type="email" name="email" placeholder="you@company.com" /></label></div>
          <div className="field-row"><label><span className="field-label"><Icon name="phone" size={15} />Phone number</span><input type="tel" name="phone" placeholder="+94 XX XXX XXXX" /></label><label><span className="field-label"><Icon name="clipboard" size={15} />Project service</span><select name="type" defaultValue=""><option value="">Select a service</option>{services.map((service) => <option key={service[1]} value={service[1]}>{service[1]}</option>)}</select></label></div>
          <label><span className="field-label"><Icon name="message" size={15} />Project brief *</span><textarea required name="message" rows="4" placeholder="Tell us about the scope, location and expected timeline..." /></label>
          <button className="btn form-btn" type="submit" disabled={status === 'sending'}><span>{status === 'sending' ? 'Sending enquiry...' : 'Send project enquiry'}</span><Icon name="send" size={18} /></button>
          <p className="form-privacy">Your project information is stored securely in Firebase and used only to respond to your enquiry.</p>
          {status === 'sent' && <div className="form-success" role="status"><Icon name="check" size={17} /> Thank you. Your enquiry was sent successfully.</div>}
          {status === 'error' && <div className="form-error" role="alert">{error}</div>}
        </form>
      </div>
    </section>
  );
}
