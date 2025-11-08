import React, { useState, useEffect, useContext } from "react";

const PagePolicy = () => {
  const [changeLanguage, setChangeLanguage] = useState(true);

  return (
    <div className="w-full h-full flex flex-row gap-8 items-start justify-center z-100 bg-customRed py-5"
          style={{
        backgroundImage: 'url("BackgroundPattern.png")',
        backgroundRepeat: 'repeat',
        backgroundBlendMode: 'overlay',
        backgroundSize: '500px'
      }}
    >
        <div className="relative flex flex-col w-xl h-140">
        {/* Black shadow behind the card */}
        <div className="absolute inset-0 bg-customYellow rounded-2xl translate-x-1 md:translate-x-1.5 translate-y-1 md:translate-y-1.5"></div>
        <div className="z-10 bg-customWhite h-full pt-8 flex flex-col items-center rounded-2xl border-3 border-customYellow">
          {/* Change Language */}
          <div className="w-lg flex justify-end absolute">
            <button className="flex flex-row gap-2 justify-between items-center w-32 border-3 border-customDarkYellow bg-customWhite hover:bg-customDarkYellow cursor-pointer rounded-4xl px-4 py-1 font-noto font-extrabold text-customYellow text-lg"
              onClick={() => setChangeLanguage(prev => !prev)}>
              <img src="iconWorld.svg" width="25" height="25" alt="logo" />
              <span className="flex justify-center w-full">
              {changeLanguage ? (
                "Thai"
              ):(
                "English"
              )}
              </span>
            </button>
          </div>
          <img src="ToolhubLogo.png" width="80" height="80" alt="logo" />
          <span className="flex justify-center w-full font-noto font-extrabold text-customBlack text-xl mt-3">Toolhub Policy</span>
          <span className="flex justify-start w-lg font-noto font-extrabold text-customBlack text-lg mt-3">
            {changeLanguage ? (
            <>
              {"1. หากผู้ยืมไม่ทำการคืนจะปรับวันล่ะ 10 บาท และไม่สามารถเข้าห้องสอบได้จนกว่าจะคืนอุปกรณ์ครบทุกชิ้น"}
              <br />
              <br />
              {"2. หากอุปกรณ์เกิดการชำรุดและสูญหายผู้ยืมต้องเป็นคนรับผิดชอบค่าใช้จ่ายทั้งหมดที่เกิดขี้น"}
              <br />
              <br />
              {"3. หากผู้ยืมกดยืนยันว่ามารับอุปกรณ์ แต่ไม่สามารถมาได้ต้องแจ้งแจ้งไปยังเบอร์ที่อยู่ด้านล่าง"}
              <br />
              <br />
              {"4. กรุณาแสดงตนด้วยบัตรนักศึกษาหรือแอป TU Great Virtual ID เมื่อมารับอุปกรณ์"}
            </>
            ):(
            <>
              {"1. Unreturned equipment incurs a 10 Baht daily fine and blocks exam room entry until all items are returned."}
              <br />
              <br />
              {"2. Borrowers are responsible for all costs resulting from damaged or lost equipment."}
              <br />
              <br />
              {"3. If you confirm pickup but cannot attend, you must notify the contact number below."}
              <br />
              <br />
              {"4. Present your Student ID or TU Great Virtual ID when picking up the equipment."}
            </>
            )}
          </span>
          <span className="flex justify-center w-lg font-noto font-regular text-customBlack text-md mt-8">
            {changeLanguage ? (
            "เบอร์โทรศัพท์ผู้รับผิดชอบโครงการ 092-332-2813"
            ):(
            "Contact Number for Project Manager: 092-332-2813"
            )}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PagePolicy;
