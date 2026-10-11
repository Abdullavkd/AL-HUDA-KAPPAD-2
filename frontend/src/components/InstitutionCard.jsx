import React from 'react';
import { Link } from 'react-router-dom';
export default function InstitutionCard({ institution }) { return <article className="institution-card"><div className="institution-image">{institution.coverImageUrl ? <img src={institution.coverImageUrl} alt={institution.name}/> : <span>{institution.name.charAt(0)}</span>}</div><div className="institution-body"><small>{institution.type?.replace('_',' ')}</small><h3>{institution.name}</h3><p>{institution.shortDescription}</p><Link to={`/institutions/${institution.slug}`}>Explore institution →</Link></div></article>; }

