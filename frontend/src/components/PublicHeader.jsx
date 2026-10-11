import React, { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Link, NavLink } from 'react-router-dom';
import Logo from './common/Logo';
import Button from './common/Button';

const links = [
  ['/', 'Home'],
  ['/about', 'About'],
  ['/institutions', 'Institutions'],
  ['/activities', 'Activities'],
  ['/news', 'News'],
  ['/events', 'Events'],
  ['/gallery', 'Gallery'],
];

export default function PublicHeader() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const close = () => setOpen(false);
    window.addEventListener('resize', close);
    return () => window.removeEventListener('resize', close);
  }, []);

  return (
    <header className="public-header">
      <div className="container public-header__inner">
        <Logo />
        <nav className={`public-nav ${open ? 'public-nav--open' : ''}`}>
          {links.map(([to, label]) => (
            <NavLink key={to} to={to} end={to === '/'} onClick={() => setOpen(false)}>{label}</NavLink>
          ))}
          <Button to="/donate" className="public-nav__donate">Support us</Button>
        </nav>
        <div className="public-header__actions">
          {/* <Button to="/donate" className="desktop-donate">Support us</Button> */}
          <button className="menu-button" onClick={() => setOpen(v => !v)} aria-label={open ? 'Close menu' : 'Open menu'}>
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
    </header>
  );
}



