import React, { useEffect, useState } from 'react';
import api from '../services/api';
import Hero from '../components/home/Hero';
import HomeSlideshow from '../components/home/HomeSlideshow';
import TrustIntro from '../components/home/TrustIntro';
import InstitutionsSection from '../components/home/InstitutionsSection';
import MissionVision from '../components/home/MissionVision';
import NewsPreview from '../components/content/NewsPreview';
import SupportBanner from '../components/home/SupportBanner';

const fallback = { settings: {}, institutions: [], news: [] };
export default function HomePage() {
  const [data, setData] = useState(fallback);
  useEffect(() => { api.get('/public/home').then(res => setData(res.data.data || fallback)).catch(() => {}); }, []);
  return <>
    {data.settings.homepageSlides?.some(slide => slide.imageUrl)
      ? <HomeSlideshow slides={data.settings.homepageSlides} />
      : <Hero hero={data.settings.hero} institutionCount={data.institutions.length || 6} />}
    <TrustIntro site={data.settings.site} count={data.institutions.length || 6} />
    <InstitutionsSection institutions={data.institutions} />
    <MissionVision mission={data.settings.mission} vision={data.settings.vision} />
    <NewsPreview news={data.news} />
    <SupportBanner />
  </>;
}

