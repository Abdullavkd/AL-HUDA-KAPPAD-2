import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Container from '../common/Container';
import SectionHeading from '../common/SectionHeading';
import InstitutionCard from '../institutions/InstitutionCard';

export default function InstitutionsSection({ institutions = [] }) {
  return (
    <section className="section section--white">
      <Container>
        <div className="section-topline"><SectionHeading eyebrow="OUR INSTITUTIONS" title="A family of places to learn, grow and belong." text="Explore the institutions that carry the shared vision of Ainul Huda Orphanage Kappad and Al Huda Trust into education and care." /><Link to="/institutions" className="arrow-link arrow-link--large">View all institutions <ArrowUpRight size={18} /></Link></div>
        <div className="institution-grid">{institutions.slice(0, 6).map((item, index) => <InstitutionCard key={item._id || item.slug} institution={item} featured={index === 0} />)}</div>
      </Container>
    </section>
  );
}
