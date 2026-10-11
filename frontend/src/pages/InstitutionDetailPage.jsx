import React, { useEffect, useState } from 'react';
import { ArrowLeft, MapPin, Phone, Mail, ArrowLeft as Prev, ArrowRight as Next } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import api from '../services/api';
import Container from '../components/common/Container';
import Button from '../components/common/Button';

function InstitutionSlideshow({ item }) {
  const photos = [ ...(item.coverImageUrl ? [{ url: item.coverImageUrl, caption: item.name }] : []), ...(item.gallery || []).filter(photo => photo?.url) ];
  const [index, setIndex] = useState(0);
  useEffect(() => setIndex(0), [item._id]);
  if (!photos.length) return null;
  const photo = photos[index % photos.length];
  return <section className="institution-slideshow" aria-label={`${item.name} photo slideshow`}>
    <img key={photo.url} src={photo.url} alt={photo.caption || item.name} />
    <div className="institution-slideshow__shade" />
    {photo.caption && <p>{photo.caption}</p>}
    {photos.length > 1 && <div className="institution-slideshow__controls"><button type="button" aria-label="Previous photo" onClick={() => setIndex(i => (i - 1 + photos.length) % photos.length)}><Prev size={18}/></button><span>{index + 1} / {photos.length}</span><button type="button" aria-label="Next photo" onClick={() => setIndex(i => (i + 1) % photos.length)}><Next size={18}/></button></div>}
  </section>;
}

export default function InstitutionDetailPage() {
  const { slug } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => { setLoading(true); api.get(`/public/institutions/${slug}`).then(r => setItem(r.data.data)).catch(() => setItem(null)).finally(() => setLoading(false)); }, [slug]);
  if (loading) return <div className="page-loading">Loading institution…</div>;
  if (!item) return <div className="page-shell"><Container className="not-found"><span>404</span><h1>Institution not found.</h1><Link to="/institutions" className="arrow-link">Back to institutions</Link></Container></div>;
  return <div className="page-shell"><section className="detail-hero"><Container><Link to="/institutions" className="back-link"><ArrowLeft size={15}/> All institutions</Link><span className="detail-type">{item.type?.replaceAll('_', ' ')}</span><h1>{item.name}</h1><p>{item.shortDescription}</p></Container></section><Container><InstitutionSlideshow item={item}/></Container><section className="section"><Container className="detail-layout"><article><span className="section-heading__eyebrow">ABOUT THE INSTITUTION</span><h2>{item.name}</h2><p className="detail-copy">{item.description || item.shortDescription || 'More information about this institution will be published soon.'}</p>{item.mission && <><h3>Our mission</h3><p className="detail-copy">{item.mission}</p></>}{item.vision && <><h3>Our vision</h3><p className="detail-copy">{item.vision}</p></>}<Button to="/contact" variant="secondary">Get in touch</Button></article><aside className="detail-contact"><h3>Institution details</h3>{item.address&&<div><MapPin size={18}/><span>{item.address}</span></div>}{item.phone&&<div><Phone size={18}/><span>{item.phone}</span></div>}{item.email&&<div><Mail size={18}/><span>{item.email}</span></div>} {!item.address&&!item.phone&&!item.email&&<p>Contact details will be available soon.</p>}</aside></Container></section></div>;
}
