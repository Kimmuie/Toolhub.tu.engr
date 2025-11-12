import React, { useState, useEffect, useContext } from "react";
import { getFirestore, doc, updateDoc, increment, collection, addDoc, Timestamp, getDocs, query, where, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../components/firebase';

const convertIsoToThaiDate = (isoDate) => {
    if (!isoDate) return "";
    try {
        const [year, month, day] = isoDate.split('-');
        // Convert to Thai Buddhist Era (year + 543)
        const thaiYear = parseInt(year) + 543; 
        return `${day}/${month}/${thaiYear}`;
    } catch (error) {
        console.error("Error converting date:", error);
        return isoDate; // Return original if conversion fails
    }
};

const PageStatus = () => {
  const [usernameInput, setUsernameInput] = useState("");
  const [borrowedList, setBorrowedList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSearched, setIsSearched] = useState(false);

  // const borrowedList = [
  //     { name: "ชื่ออุปกรณ์ A", pickDate: "02/09/2550", returnDate: "03/09/2550", quantity: 4 , returned: true },
  //     { name: "ชื่ออุปกรณ์ B", pickDate: "02/09/2550", returnDate: "03/09/2550", quantity: 4 , returned: true },
  //     { name: "ชื่ออุปกรณ์ C", pickDate: "02/09/2550", returnDate: "03/09/2550", quantity: 4 , returned: true },
  //     { name: "ชื่ออุปกรณ์ C", pickDate: "02/09/2550", returnDate: "03/09/2550", quantity: 4 , returned: true },
  //     { name: "ชื่ออุปกรณ์ C", pickDate: "02/09/2550", returnDate: "03/09/2550", quantity: 4 , returned: true },
  //     { name: "ชื่ออุปกรณ์ C", pickDate: "02/09/2550", returnDate: "03/09/2550", quantity: 4 , returned: true },
  //     { name: "ชื่ออุปกรณ์ C", pickDate: "02/09/2550", returnDate: "03/09/2550", quantity: 4 , returned: true },
  //     { name: "ชื่ออุปกรณ์ C", pickDate: "02/09/2550", returnDate: "03/09/2550", quantity: 4 , returned: true },
  //     { name: "ชื่ออุปกรณ์ C", pickDate: "02/09/2550", returnDate: "03/09/2550", quantity: 4 , returned: true },
  // ];

  const fetchBorrowingHistory = async () => {
        if (!usernameInput) {
            alert("Please enter a username.");
            return;
        }

        setIsLoading(true);
        setIsSearched(true);
        setBorrowedList([]); // Clear previous list

        try {
            // 1. Create a query to filter documents by username
            const borrowRef = collection(db, "borrowRequests");
            const q = query(borrowRef, where("username", "==", usernameInput));
            
            // 2. Fetch the documents
            const querySnapshot = await getDocs(q);
            
            const fetchedList = [];
            
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                
                // The database document has a 'tools' array containing tool objects
                // We need to iterate over the tools array for each request document
                data.tools.forEach(tool => {
                    fetchedList.push({
                        // Using a combination of doc ID and tool name as a unique key for list rendering
                        id: `${doc.id}-${tool.toolName}`, 
                        name: tool.toolName, // Get the Thai tool name
                        // Convert ISO date strings to Thai date format (DD/MM/BBBB)
                        pickDate: convertIsoToThaiDate(data.pickupDate), 
                        returnDate: convertIsoToThaiDate(data.returnDate),
                        quantity: tool.quantity,
                        // Assuming 'returned' status might need to be added to the Firestore document later.
                        // For now, we'll default it based on a simple check or placeholder logic.
                        // Database currently doesn't show a 'returned' field, so we'll default to 'false' (✘)
                        // A proper implementation would check a field like 'isReturned' or a timestamp.
                        returned: false, 
                    });
                });
            });

            setBorrowedList(fetchedList);
        } catch (error) {
            console.error("Error fetching documents: ", error);
            alert("An error occurred while fetching data.");
        } finally {
            setIsLoading(false);
        }
    };

    // Handler for the "ค้นหา" (Search) button
    const handleSearchClick = () => {
        fetchBorrowingHistory();
    };
    
    // Handler for input change
    const handleUsernameChange = (event) => {
        setUsernameInput(event.target.value);
    };

  return (
    <div className="w-full h-full flex flex-row gap-8 items-center justify-center z-100 bg-customRed py-5"
          style={{
        backgroundImage: 'url("BackgroundPattern.png")',
        backgroundRepeat: 'repeat',
        backgroundBlendMode: 'overlay',
        backgroundSize: '500px'
      }}
    >
      <div className="relative flex flex-col w-sm sm:w-2xl h-full sm:h-160 xl:h-140">
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
                value={usernameInput}
                onChange={handleUsernameChange}
                className="w-full border-2 border-customYellow rounded-2xl px-4 py-2 font-noto text-customBlack text-lg focus:outline-none"
            />
            <button className="w-20 sm:w-sm border-2 border-customDarkYellow bg-customYellow hover:bg-customDarkYellow cursor-pointer rounded-2xl px-4 py-2 font-noto text-customBlack text-lg"
              onClick={handleSearchClick}
              disabled={isLoading}>
              {isLoading ? "กำลังค้นหา..." : "ค้นหา"}
            </button>
          </div>
          <div className="w-full px-4 mt-4">
            <div className=" w-full flex flex-row items-center bg-customYellow">
              <span className="flex items-center justify-center w-full font-noto font-extrabold text-customBlack text-sm sm:text-lg px-2 py-2 border-r-2 border-customYellow">ชื่ออุปกรณ์</span>
              <span className="flex items-center justify-center w-full font-noto font-extrabold text-customBlack text-sm sm:text-lg px-2 py-2 border-r-2 border-customYellow">วันรับอุปกรณ์</span>
              <span className="flex items-center justify-center w-full font-noto font-extrabold text-customBlack text-sm sm:text-lg px-2 py-2 border-r-2 border-customYellow">วันคืนอุปกรณ์</span>
              <span className="flex items-center justify-center w-full font-noto font-extrabold text-customBlack text-sm sm:text-lg px-2 py-2 border-r-2 border-customYellow">จำนวน</span>
              <span className="flex items-center justify-center w-full font-noto font-extrabold text-customBlack text-sm sm:text-lg px-2 py-2 ">สถานะ</span>
            </div>
          {borrowedList.length > 0 ? (
            <div className="max-h-110 sm:max-h-90 xl:max-h-60 overflow-y-auto">
            {borrowedList.map((item) => (
                <div key={item.id} className=" w-full flex flex-row items-center border-t-2 border-customYellow">
                  <span className="flex items-center justify-center w-full font-noto font-regular text-customBlack text-xs sm:text-md px-2 py-1 border-r-2 border-customYellow">{item.name}</span>
                  <span className="flex items-center justify-center w-full font-noto font-regular text-customBlack text-xs sm:text-md px-2 py-1 border-r-2 border-customYellow">{item.pickDate}</span>
                  <span className="flex items-center justify-center w-full font-noto font-regular text-customBlack text-xs sm:text-md px-2 py-1 border-r-2 border-customYellow">{item.returnDate}</span>
                  <span className="flex items-center justify-center w-full font-noto font-regular text-customBlack text-xs sm:text-md px-2 py-1 border-r-2 border-customYellow">{item.quantity}</span>
                  <span className="flex items-center justify-center w-full font-noto font-regular text-customBlack text-xs sm:text-md px-2 py-1 ">{item.returned ? ("✔"):("✘")}</span>
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
