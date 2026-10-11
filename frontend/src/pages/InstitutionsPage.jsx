import React, { useEffect, useState } from 'react';
import api from '../services/api';
import Container from '../components/common/Container';
import SectionHeading from '../components/common/SectionHeading';
import InstitutionCard from '../components/institutions/InstitutionCard';

export default function InstitutionsPage(){
  const [items,setItems]=useState([]);
  useEffect(()=>{api.get('/public/institutions').then(r=>setItems(r.data.data||[])).catch(()=>{});},[]);
  return <div className="page-shell"><section className="page-hero"><Container><span className="section-heading__eyebrow">OUR INSTITUTIONS</span><h1>Many institutions.<br/><em>One shared purpose.</em></h1><p>Discover the schools, learning spaces and care initiatives that form the Ainul Huda Orphanage Kappad community.</p></Container></section><section className="section"><Container><div className="institution-list-head"><SectionHeading title="Our institution family" text="Each institution has its own identity and role, connected by a shared commitment to education and service."/><span className="institution-count">0{items.length || 6}<small>institutions</small></span></div><div className="institution-grid institution-grid--page">{items.map(item=><InstitutionCard key={item._id||item.slug} institution={item}/>)}</div></Container></section></div>;
}

