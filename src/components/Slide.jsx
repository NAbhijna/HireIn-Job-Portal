import React, { useState, useEffect } from 'react';

import logo1 from '../assets/logo1.webp';
import logo2 from '../assets/logo2.webp';
import logo3 from '../assets/logo3.webp';
import logo4 from '../assets/logo4.webp';
import logo5 from '../assets/logo5.webp';
import logo6 from '../assets/logo6.webp';
import logo7 from '../assets/logo7.png';
import logo8 from '../assets/logo8.png';
import logo9 from '../assets/logo9.webp';
import logo10 from '../assets/logo10.png';
import logo11 from '../assets/logo11.png';

const Slide = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const logos = [logo1, logo2, logo3, logo4, logo5, logo6,logo7,logo8,logo10,logo11];
  const logoCount = logos.length;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % logoCount);
    }, 5000);

    return () => clearInterval(interval);
  }, [logoCount]);

  return (
    <div className="logo-slider flex items-center h-full overflow-hidden">
      <div
        className="logo-strip flex h-20"
        style={{
          transform: `translateX(-${currentIndex * (100 / logoCount)}%)`,
          width: `${logoCount * 200}%`, // Increase width to accommodate duplicate logos
          transition: 'transform 5s linear',
        }}
      >
        {[...logos, ...logos].map((logo, index) => (
          <img
            key={index}
            src={logo}
            alt={`Logo ${index + 1}`}
            className="logo w-[200px] h-auto object-contain"
            style={{ width: `${100 / logoCount}%` }}
          />
        ))}
      </div>
    </div>
  );
};

export default Slide;