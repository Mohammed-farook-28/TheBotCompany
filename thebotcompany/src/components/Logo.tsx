import React from 'react';

const Logo = () => {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <img 
        src="/logo.svg" 
        alt="TheBotCompany Logo" 
        className="w-10 h-10 md:w-12 md:h-12 object-contain"
      />
    </div>
  );
};

export default Logo;
