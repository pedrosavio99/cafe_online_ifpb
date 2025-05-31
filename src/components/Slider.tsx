import React, { useState, useEffect } from 'react';
import Slide from './Slide';

const Slider: React.FC = () => {
  const slides = [
    { title: "Bem-vindo ao Café Online", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit." },
    { title: "Nossos Cafés", description: "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua." },
    { title: "Junte-se a Nós", description: "Ut enim ad minim veniam, quis nostrud exercitation ullamco." },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000); // Muda a cada 2 segundos
    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <div className="relative w-full max-w-3xl mx-auto">
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {slides.map((slide, index) => (
            <div key={index} className="min-w-full">
              <Slide title={slide.title} description={slide.description} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Slider;