import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";

const PageNotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full h-full  flex  flex-col gap-2 items-center justify-center z-100 bg-customRed py-5"
          style={{
        backgroundImage: 'url("BackgroundPattern.png")',
        backgroundRepeat: 'repeat',
        backgroundBlendMode: 'overlay',
        backgroundSize: '500px'
      }}
    >
      <span className="text-customWhite text-8xl font-inter font-extrabold">404</span>
      <span className="text-customWhite text-xl font-inter font-extrabold">NotFound</span>
      <span className="text-customWhite text-lg font-inter">The requested URL was not found on this server!</span>
      <button className="w-sm border-2 border-customWhite bg-customYellow hover:bg-customDarkYellow cursor-pointer rounded-2xl px-4 py-2 font-noto text-customBlack text-lg"  onClick={() => navigate("/borrow")}>
        Go Back To Homepage
      </button>
    </div>
  );
};

export default PageNotFound;
