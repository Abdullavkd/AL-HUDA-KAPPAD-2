import React, { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';

export default function HomeSlideshow({ slides = [] }) {
  const activeSlides = slides.filter(slide => slide?.imageUrl);
  const [index, setIndex] = useState(0);
  useEffect(() => { setIndex(0); }, [activeSlides.length]);
  useEffect(() => {
    if (activeSlides.length < 2) return undefined;
    const timer = window.setInterval(() => setIndex(current => (current + 1) % activeSlides.length), 6500);
    return () => window.clearInterval(timer);
  }, [activeSlides.length]);
  if (!activeSlides.length) return null;
  const slide = activeSlides[index % activeSlides.length];
  return <section className="home-slideshow" aria-label="Featured photos">
    {activeSlides.map((item, i) => <div key={`${item.imageUrl}-${i}`} className={`home-slideshow__image ${i === index ? 'is-active' : ''}`} style={{ backgroundImage: `url("${item.imageUrl}")` }} aria-hidden="true" />)}
    <div className="home-slideshow__shade" />
    <div className="home-slideshow__content container" key={index}>
      <span className="home-slideshow__eyebrow">AINUL HUDA ORPHANAGE KAPPAD</span>
      <h1>{slide.title || 'A place to learn, grow and belong.'}</h1>
      {slide.description && <p>{slide.description}</p>}
    </div>
    {activeSlides.length > 1 && <div className="home-slideshow__controls">
      <button type="button" aria-label="Previous slide" onClick={() => setIndex(i => (i - 1 + activeSlides.length) % activeSlides.length)}><ArrowLeft size={18}/></button>
      <div className="home-slideshow__dots">{activeSlides.map((item, i) => <button key={`${item.imageUrl}-dot`} type="button" aria-label={`Show slide ${i+1}`} aria-current={i === index} className={i === index ? 'is-active' : ''} onClick={() => setIndex(i)}/>)}</div>
      <button type="button" aria-label="Next slide" onClick={() => setIndex(i => (i + 1) % activeSlides.length)}><ArrowRight size={18}/></button>
    </div>}
  </section>;
}

