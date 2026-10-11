import React from 'react';
export default function SectionTitle({ eyebrow, title, description }) { return <div className="section-title"><span>{eyebrow}</span><h2>{title}</h2>{description && <p>{description}</p>}</div>; }

