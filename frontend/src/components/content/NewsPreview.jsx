import React from 'react';
import { ArrowUpRight, CalendarDays } from 'lucide-react';
import { Link } from 'react-router-dom';
import Container from '../common/Container';
import SectionHeading from '../common/SectionHeading';

export default function NewsPreview({ news = [] }) {
  return (
    <section className="section section--cream">
      <Container>
        <div className="section-topline"><SectionHeading eyebrow="FROM AL HUDA" title="News, stories & moments." text="Stay connected with the people and activities across our institutions." /><Link to="/news" className="arrow-link arrow-link--large">All news <ArrowUpRight size={18} /></Link></div>
        {news.length ? <div className="story-grid">{news.slice(0, 3).map((item, index) => <article className={`story-card ${index === 0 ? 'story-card--featured' : ''}`} key={item._id}><div className="story-card__image">{item.imageUrl ? <img src={item.imageUrl} alt="" /> : <div><CalendarDays size={28}/><span>AL HUDA</span></div>}</div><div className="story-card__body"><small>{item.institutionId?.name || 'Al Huda Trust'}</small><h3>{item.title}</h3><p>{item.excerpt || 'Read the latest update from Al Huda Trust.'}</p><Link to="/news" className="text-link">Read story <ArrowUpRight size={15}/></Link></div></article>)}</div> : <div className="empty-content"><span>01</span><div><h3>Stories are coming soon.</h3><p>The latest news and updates from our institutions will appear here.</p></div></div>}
      </Container>
    </section>
  );
}
