import React, { useState, useEffect } from 'react';
import Slide from './Slide';
import img1 from '../imgs/img1.png';
import img2 from '../imgs/img2.png';
import img3 from '../imgs/img3.png';

const Slider: React.FC = () => {
  const slides = [
    { image: img1 },
    { image: img2 },
    { image: img3 },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000); // Muda a cada 4 segundos
    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <div className="relative w-full max-w-3xl sm:max-w-4xl lg:w-[95%] lg:max-w-5xl mx-auto px-4">
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {slides.map((slide, index) => (
            <div key={index} className="min-w-full">
              <Slide image={slide.image} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Slider;