import React, { useState, useEffect, useContext } from "react";

const PagePolicy = () => {

  return (
    <div className="w-full h-screen flex flex-row gap-8 items-start justify-center z-100 bg-customRed py-5"
          style={{
        backgroundImage: 'url("BackgroundPattern.png")',
        backgroundRepeat: 'repeat',
        backgroundBlendMode: 'overlay',
        backgroundSize: '500px'
      }}
    >
      <div className="text-customWhite text-lg font-inter font-extrabold">Policy</div>
    </div>
  );
};

export default PagePolicy;
