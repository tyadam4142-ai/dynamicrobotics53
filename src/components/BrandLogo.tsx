import React from 'react';
import { asset } from '../lib/asset';

interface BrandLogoProps {
  className?: string;
  /** Only pass href when the logo itself should be a link. Otherwise it renders as a plain image
   *  so it can sit inside another link without creating invalid nested anchors. */
  href?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({ className = 'w-12 h-12', href }) => {
  const classes = `relative rounded-xl overflow-hidden border border-[#f1ca62]/50 shadow-[0_0_15px_rgba(201,154,46,0.25)] bg-[#050e1c] flex-shrink-0 flex items-center justify-center ${className}`;
  const img = (
    <img
      src={asset('assets/logo.png')}
      alt="Dynamic Robotics 53 logo"
      className="w-full h-full object-cover"
    />
  );
  return href ? (
    <a href={href} className={classes} title="Dynamic Robotics 53">{img}</a>
  ) : (
    <span className={classes}>{img}</span>
  );
};
