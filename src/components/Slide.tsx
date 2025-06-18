import React from 'react';

interface SlideProps {
  image: string;
}

const Slide: React.FC<SlideProps> = ({ image }) => {
  return (
    <div className="bg-gray-300 p-2 sm:p-4 rounded-md text-center animate-fade-in">
      <img
        src={image}
        alt="Slide"
        className="w-full h-32 sm:h-40 md:h-48 lg:h-64 object-cover rounded-md"
      />
    </div>
  );
};

export default Slide;