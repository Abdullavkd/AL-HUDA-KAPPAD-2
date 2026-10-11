import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';

export default function Button({ to, children, variant = 'primary', icon = true, className = '' }) {
  const content = <>{children}{icon && <ArrowUpRight size={17} strokeWidth={2.2} />}</>;
  return to ? <Link to={to} className={`button button--${variant} ${className}`}>{content}</Link> : <button className={`button button--${variant} ${className}`}>{content}</button>;
}
