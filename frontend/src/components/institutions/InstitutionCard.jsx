import React from 'react';
import { ArrowUpRight, School, Home, GraduationCap } from 'lucide-react';
import { Link } from 'react-router-dom';

const iconFor = type => type === 'orphanage' ? Home : type === 'college' ? GraduationCap : School;

export default function InstitutionCard({ institution, featured = false }) {
  const Icon = iconFor(institution.type);
  return (
    <article className={`institution-card ${featured ? 'institution-card--featured' : ''}`}>
      <div className="institution-card__media">
        {institution.coverImageUrl ? <img src={institution.coverImageUrl} alt="" /> : <div className="institution-card__pattern"><Icon size={42} /><span>{institution.type === 'orphanage' ? 'CARE' : 'EDUCATION'}</span></div>}
        <span className="institution-card__type">{institution.type}</span>
      </div>
      <div className="institution-card__body">
        <h3>{institution.name}</h3>
        <p>{institution.shortDescription || 'An institution working under the Al Huda Trust.'}</p>
        <Link to={`/institutions/${institution.slug}`} className="arrow-link">View institution <ArrowUpRight size={16} /></Link>
      </div>
    </article>
  );
}
