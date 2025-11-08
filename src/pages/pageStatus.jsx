import React, { useState, useEffect, useContext } from "react";

const PageStatus = () => {
  const [changeLanguage, setChangeLanguage] = useState(true);
  const borrowedList = [
      { name: "ชื่ออุปกรณ์ A", pickDate: "02/09/2550", returnDate: "03/09/2550", quantity: 4 , returned: 2 },
      { name: "ชื่ออุปกรณ์ B", pickDate: "02/09/2550", returnDate: "03/09/2550", quantity: 4 , returned: 2 },
      { name: "ชื่ออุปกรณ์ C", pickDate: "02/09/2550", returnDate: "03/09/2550", quantity: 4 , returned: 2 },
      { name: "ชื่ออุปกรณ์ C", pickDate: "02/09/2550", returnDate: "03/09/2550", quantity: 4 , returned: 2 },
      { name: "ชื่ออุปกรณ์ C", pickDate: "02/09/2550", returnDate: "03/09/2550", quantity: 4 , returned: 2 },
      { name: "ชื่ออุปกรณ์ C", pickDate: "02/09/2550", returnDate: "03/09/2550", quantity: 4 , returned: 2 },
      { name: "ชื่ออุปกรณ์ C", pickDate: "02/09/2550", returnDate: "03/09/2550", quantity: 4 , returned: 2 },
      { name: "ชื่ออุปกรณ์ C", pickDate: "02/09/2550", returnDate: "03/09/2550", quantity: 4 , returned: 2 },
      { name: "ชื่ออุปกรณ์ C", pickDate: "02/09/2550", returnDate: "03/09/2550", quantity: 4 , returned: 2 },
  ];
  return (
    <div className="w-full h-full flex flex-row gap-8 items-start justify-center z-100 bg-customRed py-5"
          style={{
        backgroundImage: 'url("BackgroundPattern.png")',
        backgroundRepeat: 'repeat',
        backgroundBlendMode: 'overlay',
        backgroundSize: '500px'
      }}
    >
      <div className="relative flex flex-col w-2xl h-140">
        {/* Black shadow behind the card */}
        <div className="absolute inset-0 bg-customYellow rounded-2xl translate-x-1 md:translate-x-1.5 translate-y-1 md:translate-y-1.5"></div>
        <div className="z-10 bg-customWhite h-full pt-8 flex flex-col items-center rounded-2xl border-3 border-customYellow">
          <img src="ToolhubLogo.png" width="80" height="80" alt="logo" />
          <span className="flex justify-center w-full font-noto font-extrabold text-customBlack text-xl mt-3">Toolhub Status</span>
          <span className="flex items-start w-full font-noto font-extrabold text-customDarkYellow text-lg px-4 ">Username</span>
          <div className="flex flex-row px-4 gap-2">
            <input 
                type="text" 
                placeholder="Enter Your Username"   
                maxLength={10}
                className="w-full border-2 border-customYellow rounded-2xl px-4 py-2 font-noto text-customBlack text-lg focus:outline-none"
            />
            <button className="w-sm border-2 border-customDarkYellow bg-customYellow hover:bg-customDarkYellow cursor-pointer rounded-2xl px-4 py-2 font-noto text-customBlack text-lg">
              ค้นหา
            </button>
          </div>
          <div className="w-full px-4 mt-4">
            <div className=" w-full flex flex-row items-center bg-customYellow">
              <span className="flex items-center justify-center w-full font-noto font-extrabold text-customBlack text-lg px-2 py-2 border-r-2 border-customYellow">ชื่ออุปกรณ์</span>
              <span className="flex items-center justify-center w-full font-noto font-extrabold text-customBlack text-lg px-2 py-2 border-r-2 border-customYellow">วันรับอุปกรณ์</span>
              <span className="flex items-center justify-center w-full font-noto font-extrabold text-customBlack text-lg px-2 py-2 border-r-2 border-customYellow">วันคืนอุปกรณ์</span>
              <span className="flex items-center justify-center w-full font-noto font-extrabold text-customBlack text-lg px-2 py-2 border-r-2 border-customYellow">จำนวน</span>
              <span className="flex items-center justify-center w-full font-noto font-extrabold text-customBlack text-lg px-2 py-2 ">จำนวนที่คืน</span>
              <span className="w-18"></span>
            </div>
          {borrowedList.length > 0 ? (
            <div className="max-h-60 overflow-y-auto">
            {borrowedList.map((item) => (
                <div key={item.id} className=" w-full flex flex-row items-center border-t-2 border-customYellow">
                  <span className="flex items-center justify-center w-full font-noto font-regular text-customBlack text-md px-2 py-1 border-r-2 border-customYellow">{item.name}</span>
                  <span className="flex items-center justify-center w-full font-noto font-regular text-customBlack text-md px-2 py-1 border-r-2 border-customYellow">{item.pickDate}</span>
                  <span className="flex items-center justify-center w-full font-noto font-regular text-customBlack text-md px-2 py-1 border-r-2 border-customYellow">{item.returnDate}</span>
                  <span className="flex items-center justify-center w-full font-noto font-regular text-customBlack text-md px-2 py-1 border-r-2 border-customYellow">{item.quantity}</span>
                  <span className="flex items-center justify-center w-full font-noto font-regular text-customBlack text-md px-2 py-1 ">{item.returned}</span>
                </div>
            ))}
            </div>
          ):(
              <span className="flex items-center justify-center w-full font-noto font-extrabold text-customBlack text-lg px-2 py-2">ไม่พบข้อมูล</span>
          )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageStatus;
