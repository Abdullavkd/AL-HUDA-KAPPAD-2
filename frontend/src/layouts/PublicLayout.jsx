import React from 'react';
import { ArrowUpRight, Facebook, Instagram, Youtube } from 'lucide-react';
import { Link, Outlet } from 'react-router-dom';
import PublicHeader from '../components/PublicHeader';
import Logo from '../components/common/Logo';
import Container from '../components/common/Container';

export default function PublicLayout(){
  return <div className="public-site"><PublicHeader/><main><div id="page-top"><Outlet /></div></main><footer className="site-footer"><Container><div className="footer-main"><div><Logo light/><p className="footer-intro">A family of institutions working together for education, care and meaningful service.</p><div className="footer-social"><a href="#" aria-label="Facebook"><Facebook size={17}/></a><a href="#" aria-label="Instagram"><Instagram size={17}/></a><a href="#" aria-label="YouTube"><Youtube size={17}/></a></div></div><div><span className="footer-label">EXPLORE</span><Link to="/about">About us</Link><Link to="/institutions">Institutions</Link><Link to="/activities">Activities</Link><Link to="/gallery">Gallery</Link></div><div><span className="footer-label">CONNECT</span><Link to="/news">News & stories</Link><Link to="/events">Events</Link><Link to="/contact">Contact</Link><Link to="/donate">Support our work</Link></div><div><span className="footer-label">VISIT</span><p>Al Huda Trust<br/>Kappad, Kerala, India</p><Link to="/contact" className="footer-arrow">Get in touch <ArrowUpRight size={15}/></Link></div></div><div className="footer-bottom"><span>© {new Date().getFullYear()} Al Huda Trust. All rights reserved.</span><span>Built with purpose.</span></div></Container></footer></div>;
}
