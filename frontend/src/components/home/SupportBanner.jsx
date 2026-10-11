import React from 'react';
import { Heart, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Container from '../common/Container';
export default function SupportBanner(){return <section className="support-banner"><Container><div className="support-banner__icon"><Heart size={24}/></div><div><span className="section-heading__eyebrow">SUPPORT OUR WORK</span><h2>Help create more opportunities for education and care.</h2><p>Your support helps strengthen the institutions and initiatives serving our community.</p></div><Link to="/donate" className="support-banner__link">Support Al Huda <ArrowUpRight size={18}/></Link></Container></section>}
