import React from 'react';

interface SpinnerProps {
  isVisible: boolean;
}

const Spinner: React.FC<SpinnerProps> = ({ isVisible }) => {
  if (!isVisible) return null;
  return (
    <div className="flex justify-center items-center">
      <div className="w-6 h-6 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin"></div>
    </div>
  );
};

export default Spinner;