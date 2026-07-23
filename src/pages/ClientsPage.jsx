import Icon from '../components/Icon';
import SectionTitle from '../components/SectionTitle';
import { clientBrands as fallbackBrands, testimonials as fallbackReviews } from '../data';
import { usePublishedContent } from '../services/contentService';

function normalizeBrand(item) {
  if (Array.isArray(item)) return { name: item[0], sector: item[1], icon: item[2] };
  return { name: item.companyName, sector: 'Industry', icon: 'company', logoUrl: item.logoUrl, websiteUrl: item.websiteUrl };
}

function normalizeReview(item) {
  if (Array.isArray(item)) return { quote: item[0], name: item[1], role: item[2], rating: 5 };
  return { quote: item.reviewText, name: item.customerName, role: item.companyName, rating: item.rating, imageUrl: item.customerImageUrl };
}

export default function ClientsPage() {
  const brandsState = usePublishedContent('companyLogos', fallbackBrands);
  const reviewsState = usePublishedContent('reviews', fallbackReviews);
  const brands = brandsState.items.map(normalizeBrand);
  const reviews = reviewsState.items.map(normalizeReview);

  return <section className="section clients" id="clients"><div className="container"><SectionTitle eyebrow="Built on trust" title="Strong projects begin with strong partnerships." text="We earn confidence through reliable execution, professional communication and consistent quality." center />{brandsState.loading && <div className="content-state">Loading company partners...</div>}{brandsState.error && <div className="content-state error">{brandsState.error}</div>}{!brandsState.loading && !brandsState.error && brands.length === 0 && <div className="content-state">No published company logos are available yet.</div>}{brands.length > 0 && <div className="client-marquee brand-marquee" aria-label="Client and industry partner brands"><div className="brand-track">{[0, 1].map((group) => <div className="brand-group" aria-hidden={group === 1} key={group}>{brands.map((brand) => { const content = <><span>{brand.logoUrl ? <img src={brand.logoUrl} alt="" /> : <Icon name={brand.icon} size={23} />}</span><div><b>{brand.name}</b><small>{brand.sector} partner</small></div></>; return brand.websiteUrl ? <a className="client-brand" href={brand.websiteUrl} target="_blank" rel="noreferrer" key={`${group}-${brand.name}`}>{content}</a> : <div className="client-brand" key={`${group}-${brand.name}`}>{content}</div>; })}</div>)}</div></div>}{reviewsState.loading && <div className="content-state">Loading customer reviews...</div>}{reviewsState.error && <div className="content-state error">{reviewsState.error}</div>}{!reviewsState.loading && !reviewsState.error && reviews.length === 0 && <div className="content-state">No published customer reviews are available yet.</div>}{reviews.length > 0 && <div className="review-marquee" aria-label="Client reviews"><div className="review-track">{[0, 1].map((group) => <div className="review-group" aria-hidden={group === 1} key={group}>{reviews.map((review) => <article className="review-card" key={`${group}-${review.name}`}><div className="review-label"><Icon name="quote" size={20} /><span>{review.rating}/5 client review</span></div><p>“{review.quote}”</p><div className="review-author">{review.imageUrl ? <img src={review.imageUrl} alt="" /> : <span>{review.name.charAt(0)}</span>}<b>{review.name}<small>{review.role}</small></b></div></article>)}</div>)}</div></div>}</div></section>;
}
