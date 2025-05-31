import React from 'react';

interface SlideProps {
  title: string;
  description: string;
}

const Slide: React.FC<SlideProps> = ({ title, description }) => {
  return (
    <div className="bg-gray-300 p-4 rounded-md text-center animate-fade-in">
      <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
      <p className="text-sm text-gray-700 mt-1">{description}</p>
    </div>
  );
};

export default Slide;