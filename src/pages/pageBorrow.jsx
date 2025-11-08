import React, { useState, useEffect, useContext } from "react";

const PageBorrow = () => {
  const toolsList = [
      { id: 1, name: "ชื่ออุปกรณ์ A", image: "SHIRT (1).png", max: 70 },
      { id: 2, name: "ชื่ออุปกรณ์ B", image: "SHIRT (1).png", max: 7 },
      { id: 3, name: "ชื่ออุปกรณ์ C", image: "SHIRT (1).png", max: 7 },
      { id: 4, name: "ชื่ออุปกรณ์ C", image: "SHIRT (1).png", max: 7 },
      { id: 5, name: "ชื่ออุปกรณ์ C", image: "SHIRT (1).png", max: 7 },
      { id: 6, name: "ชื่ออุปกรณ์ C", image: "SHIRT (1).png", max: 7 },
      { id: 7, name: "ชื่ออุปกรณ์ C", image: "SHIRT (1).png", max: 7 },
  ];
  return (
    <div className="w-full h- flex flex-row gap-8 items-start justify-center z-100 bg-customRed pt-5 pb-15"
          style={{
        backgroundImage: 'url("BackgroundPattern.png")',
        backgroundRepeat: 'repeat',
        backgroundBlendMode: 'overlay',
        backgroundSize: '500px'
      }}
      >
      {/* Tool Selection */}
      <div className="relative flex flex-col w-3xl">
        {/* Black shadow behind the card */}
        <div className="absolute inset-0 bg-customYellow rounded-2xl translate-x-1 md:translate-x-1.5 translate-y-1 md:translate-y-1.5"></div>
        <div className="z-10 bg-customWhite h-full pt-8 flex flex-col items-center justify-center rounded-2xl border-3 border-customYellow py-6">
          <span className="flex w-full items-center justify-center font-noto font-extrabold text-แีหะนทฺสฟแา text-xl">เลือกจำนวนและอุปกรณ์ที่ต้องการยืม</span>
          <div className="grid grid-cols-3 gap-6 pt-5">
          {toolsList.map((item) => (
            <div key={item.id} className=" w-50 flex flex-col items-center">
              <img src="SHIRT (1).png" alt="logo" className="w-full border-2 border-customYellow rounded-t-lg" />
              <span className="flex items-start w-full font-noto font-extrabold text-customBlack text-lg bg-customYellow px-2">{item.name}</span>
              <div className="flex flex-row w-full">
                <input 
                    type="number" 
                    placeholder=""  
                    min={0} 
                    max={item.max}
                    className="w-full border-2 border-customYellow rounded-bl-lg px-4 py-2 font-noto text-customBlack text-lg focus:outline-none"
                />
                <span className="flex items-center justify-center w-30 rounded-br-lg font-noto font-bold text-customBlack text-md bg-customYellow px-1">Max {item.max}</span>
              </div>
            </div>
          ))}
          </div>
        </div>
      </div>
      {/* Input From */}
      <div className="relative flex flex-col w-xl h-148">
        {/* Black shadow behind the card */}
        <div className="absolute inset-0 bg-customYellow rounded-2xl translate-x-1 md:translate-x-1.5 translate-y-1 md:translate-y-1.5"></div>
        <div className="z-10 bg-customWhite h-full pt-8 flex flex-col items-center rounded-2xl border-3 border-customYellow">
          <img src="ToolhubLogo.png" width="80" height="80" alt="logo" />
          <div className="w-lg flex flex-col items-center gap-2">
          <span className="flex items-start w-full font-noto font-extrabold text-customDarkYellow text-lg">Username</span>
          <input 
              type="text" 
              placeholder="Enter Your Username"   
              maxLength={10}
              className="w-full border-2 border-customYellow rounded-2xl px-4 py-2 font-noto text-customBlack text-lg focus:outline-none"
          />
          <span className="flex items-start w-full font-noto font-extrabold text-customDarkYellow text-lg ">Password</span>          
          <input 
              type="text" 
              placeholder="Enter your Password"   
              maxLength={13}
              className="w-full border-2 border-customYellow rounded-2xl px-4 py-2 font-noto text-customBlack text-lg focus:outline-none"
          />
          {/* Pickup Date */}
          <div className="flex flex-row w-full gap-2">
            <div className="flex flex-col w-full">
              <span className="flex items-start w-full font-noto font-extrabold text-customDarkYellow text-lg">วันรับอุปกรณ์</span>
              <input 
                  type="text" 
                  placeholder="Enter Date"   
                  maxLength={10}
                  className="border-2 border-customYellow rounded-2xl px-4 py-2 font-noto text-customBlack text-lg focus:outline-none"
              />
            </div>
            <div className="flex flex-col w-full">
              <span className="flex items-start w-full font-noto font-extrabold text-customDarkYellow text-lg">ช่วงเวลารับอุปกรณ์</span>
              <input 
                  type="text" 
                  placeholder="Enter Time"   
                  maxLength={10}
                  className="border-2 border-customYellow rounded-2xl px-4 py-2 font-noto text-customBlack text-lg focus:outline-none"
              />
            </div>
          </div>
          {/* Return Date */}
          <div className="flex flex-row w-full gap-2">
            <div className="flex flex-col w-full">
              <span className="flex items-start w-full font-noto font-extrabold text-customDarkYellow text-lg">วันคืนอุปกรณ์</span>
              <input 
                  type="text" 
                  placeholder="Enter Date"   
                  maxLength={10}
                  className="border-2 border-customYellow rounded-2xl px-4 py-2 font-noto text-customBlack text-lg focus:outline-none"
              />
            </div>
            <div className="flex flex-col w-full">
              <span className="flex items-start w-full font-noto font-extrabold text-customDarkYellow text-lg">ช่วงเวลาคืนอุปกรณ์</span>
              <input 
                  type="text" 
                  placeholder="Enter Time"   
                  maxLength={10}
                  className="border-2 border-customYellow rounded-2xl px-4 py-2 font-noto text-customBlack text-lg focus:outline-none"
              />
            </div>
          </div>
          {/* Policy Approvement */}
          <label className="w-full flex flex-row pt-5 items-start gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              className="border-2 border-customYellow rounded-md w-5 h-5 accent-customYellow cursor-pointer"
            />
            <span className="font-noto font-extrabold text-customBlack text-md">
              ข้าพเจ้ารับทราบและยินยอมตามข้อกำหนดการใช้งานของระบบ Toolhub
            </span>
          </label>
          {/* Submit Button */}
          <button className="w-sm border-2 border-customDarkYellow bg-customYellow hover:bg-customDarkYellow cursor-pointer rounded-2xl px-4 py-2 font-noto text-customBlack text-lg">
            ยืนยันการยืม
          </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageBorrow;
