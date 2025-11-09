import React, { useState, useContext, useRef, useEffect } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuItems = [
    { name: "การยืมอุปกรณ์", paths: ["/borrow", "/"] },
    { name: "สถานะการยืม", paths: ["/status"] },
    { name: "ข้อกำหนดการยืม", paths: ["/policy"] },
  ];

  return (
    <>
      <div className="relative flex w-full h-20 bg-customWhite items-center border-b-3 border-b-customYellow z-40">
        <div className="flex w-full items-center justify-between pl-6 pr-6">
          <div className="flex flex-row items-center gap-2 cursor-pointer" onClick={() => navigate("/borrow")}>
            <img src="ToolhubLogo.png" width="65" height="65" alt="logo" />
            <div className="text-customBlack text-lg font-noto font-semibold">ToolHub</div>
          </div>
          {/* Desktop Navigation */}
          <div className="hidden md:flex gap-6">
            {menuItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.paths[0]}
                className={({ isActive }) =>
                  `relative text-lg font-noto text-customBlack font-semibold ${
                    item.paths.includes(location.pathname)
                      ? "text-customYellow cursor-default  pointer-events-none"
                      : "hover:opacity-50"
                  }`
                }
              >
                {item.name}
                <div className="flex justify-center">
                  {item.paths.includes(location.pathname) && (
                    <div className="absolute w-15 h-2 bg-customYellow mt-4.5"></div>
                  )}
                </div>
              </NavLink>
            ))}
          </div>

          {/* Mobile Menu Icon */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setMenuOpen(!menuOpen)}>
              <img src={menuOpen ? "iconMenuOpen.svg" : "iconMenuClose.svg"} width="70" height="55" alt="menu icon" />
            </button>
          </div>
        </div>
      </div>

      {/* Gray Overlay When Mobile Menu is Open */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-customBlack opacity-50 z-30"
          onClick={() => setMenuOpen(false)}
        ></div>
      )}

      {/* Mobile Navigation */}
      {menuOpen && (
        <div className="fixed top-20 left-0 w-full bg-customWhite flex flex-col items-center md:hidden z-40 animate-fadeDown">
          {menuItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.paths[0]}
              className={`w-full text-center text-customBlackw py-2 text-lg font-noto font-semibold border-b border-customYellow 
                ${item.paths.includes(location.pathname) && "text-customYellow"}`}
              onClick={() => setMenuOpen(false)}
            >
              {item.name}
              <div className="flex justify-center">
                {item.paths.includes(location.pathname) && (
                  <div className="absolute w-15 h-1.5 mt-0.5 bg-customYellow"></div>
                )}
              </div>
            </NavLink>
          ))}
        </div>
      )}
    </>
  );
};

export default Navbar;
