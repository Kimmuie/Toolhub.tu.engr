import React, { useState, useEffect } from "react";
import { doc, updateDoc, increment, collection, addDoc, Timestamp, getDocs, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../components/firebase';

const PageBorrow = () => {
  // State for form inputs
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [pickupDate, setPickupDate] = useState("");
  const [pickupTime, setPickupTime] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [returnTime, setReturnTime] = useState("");
  const [agreedToPolicy, setAgreedToPolicy] = useState(false);
  const [toolQuantities, setToolQuantities] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [toolsList, setToolsList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Default tools list (fallback if inventory is empty)
  // const defaultToolsList = [
  //   { id: 1, name: "ค้อนหงอน", image: "tools/Hammer.jpg", max: 7 },
  //   { id: 2, name: "สว่านไฟฟ้า", image: "tools/Drill.jpg", max: 4 },
  //   { id: 3, name: "ปืนยิงกาวร้อน (5/16 นิ้ว)", image: "tools/Gluegun.jpg", max: 3 },
  //   { id: 4, name: "ชุดคีมขนาดเล็ก", image: "tools/Pilers.jpg", max: 5 },
  //   { id: 5, name: "เลื่อยลันดา", image: "tools/Saw.jpg", max: 5 },
  //   { id: 6, name: "ไขควง", image: "tools/Screwdriver.jpg", max: 12 },
  //   { id: 7, name: "ตลับเมตรยาว 5 เมตร", image: "tools/TapeMeasure.jpg", max: 7 },
  // ];

  // Fetch inventory data from Firestore on component mount
  
    const fetchInventory = async () => {
      try {
        setIsLoading(true);
        const inventorySnapshot = await getDocs(collection(db, "toolsInventory"));

        if (inventorySnapshot.empty) {
          console.log("No inventory found, using default tools list");
          // setToolsList(defaultToolsList);
          return;
        }

        const inventoryData = inventorySnapshot.docs.map((doc) => {
          const data = doc.data();

          return {
            id: data.id,
            name: doc.id, // use document name (like "ค้อนหงอน")
            image: data.image ||  "",
            max: data.maxQuantity || 0,
          };
        });

        // ✅ Sort by ID
        inventoryData.sort((a, b) => a.id - b.id);

        console.log("Fetched inventory:", inventoryData);
        setToolsList(inventoryData.length > 0 ? inventoryData : []);
      } catch (error) {
        console.error("Error fetching inventory:", error);
        setToolsList([]);
      } finally {
        setIsLoading(false);
      }
    };

  useEffect(() => {
    fetchInventory();
  }, []);

  const handleToolQuantityChange = (toolId, toolName, value) => {
    const quantity = parseInt(value) || 0;
    
    if (quantity === 0) {
      const newQuantities = { ...toolQuantities };
      delete newQuantities[toolId];
      setToolQuantities(newQuantities);
    } else {
      setToolQuantities(prev => ({
        ...prev,
        [toolId]: {
          name: toolName,
          quantity: quantity
        }
      }));
    }
  };

  const handleSubmit = async () => {
    try {
      setMessage({ type: '', text: '' });
    
      if (!username.trim()) {
        setMessage({ type: 'error', text: 'กรุณากรอก Username' });
        return;
      }
      
      if (!password.trim()) {
        setMessage({ type: 'error', text: 'กรุณากรอก Password' });
        return;
      }
      
      if (!pickupDate) {
        setMessage({ type: 'error', text: 'กรุณาเลือกวันรับอุปกรณ์' });
        return;
      }
      
      if (!pickupTime) {
        setMessage({ type: 'error', text: 'กรุณาเลือกเวลารับอุปกรณ์' });
        return;
      }
      
      if (!returnDate) {
        setMessage({ type: 'error', text: 'กรุณาเลือกวันคืนอุปกรณ์' });
        return;
      }
      
      if (!returnTime) {
        setMessage({ type: 'error', text: 'กรุณาเลือกเวลาคืนอุปกรณ์' });
        return;
      }
      
      if (Object.keys(toolQuantities).length === 0) {
        setMessage({ type: 'error', text: 'กรุณาเลือกอุปกรณ์อย่างน้อย 1 รายการ' });
        return;
      }
      
      if (!agreedToPolicy) {
        setMessage({ type: 'error', text: 'กรุณายอมรับข้อกำหนดการใช้งาน' });
        return;
      }
      
      const pickupDateTime = new Date(`${pickupDate}T${pickupTime}`);
      const returnDateTime = new Date(`${returnDate}T${returnTime}`);
      
      if (returnDateTime <= pickupDateTime) {
        setMessage({ type: 'error', text: 'วันที่คืนต้องอยู่หลังวันที่รับอุปกรณ์' });
        return;
      }

      // Check if requested quantities exceed available quantities
      for (const [toolId, data] of Object.entries(toolQuantities)) {
        const tool = toolsList.find(t => t.id === parseInt(toolId));
        if (tool && data.quantity > tool.max) {
          setMessage({ 
            type: 'error', 
            text: `${tool.name} มีเพียง ${tool.max} ชิ้นที่สามารถยืมได้` 
          });
          return;
        }
      }
      
      setIsSubmitting(true);
      const borrowData = {
        username: username,
        password: password,
        tools: Object.entries(toolQuantities).map(([id, data]) => ({
          toolId: parseInt(id),
          toolName: data.name,
          quantity: data.quantity,
          status: false,
        })),
        pickupDate: pickupDate,
        pickupTime: pickupTime,
        returnDate: returnDate,
        returnTime: returnTime,
        createdAt: Timestamp.now(),
      };

      // Add borrow request to Firestore
      const borrowRef = await addDoc(collection(db, 'borrowRequests'), borrowData);
      console.log('Borrow request created with ID:', borrowRef.id);
      
      // Update Inventory
      for (const [toolId, data] of Object.entries(toolQuantities)) {
          try {
              // 1. Find the tool object from toolsList using the numeric toolId
              const toolItem = toolsList.find(t => t.id === parseInt(toolId));
              
              if (!toolItem) {
                  console.error(`Tool with ID ${toolId} not found in current inventory list.`);
                  continue; // Skip this tool if not found
              }
              const documentId = toolItem.name; 
              const toolRef = doc(db, 'toolsInventory', documentId); 
              const toolDoc = await getDoc(toolRef);
              
              if (toolDoc.exists()) {
                  // Update existing inventory
                  await updateDoc(toolRef, {
                      maxQuantity: increment(-data.quantity)
                  });
                  console.log(`Updated inventory for document ${documentId}: -${data.quantity}`);
              }
          } catch (invError) {
              console.error(`Error updating inventory for tool ${toolId}:`, invError);
          }
          fetchInventory()
      }

      // Success message
      setMessage({ 
        type: 'success', 
        text: 'ส่งคำขอยืมอุปกรณ์เรียบร้อยแล้ว! คลังอุปกรณ์ได้รับการอัปเดต' 
      });
      
      // Reset form
      setTimeout(() => {
        setUsername('');
        setPassword('');
        setPickupDate('');
        setPickupTime('');
        setReturnDate('');
        setReturnTime('');
        setAgreedToPolicy(false);
        setToolQuantities({});
        setMessage({ type: '', text: '' });
      }, 3000);
      
    } catch (error) {
      console.error('Error submitting borrow request:', error);
      setMessage({ 
        type: 'error', 
        text: `เกิดข้อผิดพลาด: ${error.message}` 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="overflow-y-auto xl:overflow-y-hidden overflow-x-hidden px-5 sm:px-0 w-full h-full flex flex-col xl:flex-row gap-8 items-center justify-start sm:justify-center z-100 bg-customRed pt-15 pb-15"
      style={{
        backgroundImage: 'url("BackgroundPattern.png")',
        backgroundRepeat: 'repeat',
        backgroundBlendMode: 'overlay',
        backgroundSize: '500px'
      }}
    >
      {/* Tool Selection */}
      <div className="relative flex flex-col w-full sm:w-3xl h-xl">
        <div className="absolute inset-0 bg-customYellow rounded-2xl translate-x-1 md:translate-x-1.5 translate-y-1 md:translate-y-1.5"></div>
        <div className="z-10 bg-customWhite h-full pt-8 flex flex-col items-center justify-center rounded-2xl border-3 border-customYellow gap-4 py-2">
          <span className="flex w-full items-center justify-center font-noto font-extrabold text-xl">เลือกจำนวนและอุปกรณ์ที่ต้องการยืม</span>
          
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <span className="font-noto text-lg text-gray-500">กำลังโหลดข้อมูลอุปกรณ์...</span>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 max-h-120 overflow-y-auto px-5">
              {toolsList.map((item) => (
                <div key={item.id} className="w-40 sm:w-50 flex flex-col items-center">
                  <img src={item.image} alt="logo" className="w-full border-2 border-customYellow rounded-t-lg" />
                  <span className="flex items-start w-full font-noto font-extrabold text-customBlack text-lg bg-customYellow px-2">{item.name}</span>
                  <div className="flex flex-row w-full">
                    <input 
                      type="number" 
                      placeholder={item.max === 0 ? "- - Out - -" : "0"}  
                      min={0} 
                      max={item.max}
                      value={toolQuantities[item.id]?.quantity || ''}
                      onChange={(e) => handleToolQuantityChange(item.id, item.name, e.target.value)}
                      disabled={item.max === 0}
                      className={`w-full border-2 border-customYellow rounded-bl-lg px-4 py-2 font-noto text-customBlack text-lg focus:outline-none ${
                        item.max === 0 ? 'cursor-not-allowed' : ''
                      }`}
                    />
                    <span className={`flex items-center justify-center w-30 rounded-br-lg font-noto font-bold text-md px-1 ${
                      item.max === 0 ? 'bg-customRed text-customWhite' : 'bg-customYellow text-customBlack '
                    }`}>
                      Max {item.max}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Input Form */}
      <div className="relative flex flex-col w-full sm:w-3xl xl:w-xl h-xl">
        <div className="absolute inset-0 bg-customYellow rounded-2xl translate-x-1 md:translate-x-1.5 translate-y-1 md:translate-y-1.5"></div>
        <div className="z-10 bg-customWhite h-full pt-8 flex flex-col items-center rounded-2xl border-3 border-customYellow pb-4">
          <img src="ToolhubLogo.png" width="70" height="80" alt="logo" />
          {message.text && (
            <div className={`absolute w-sm px-4 py-2 rounded-2xl font-noto text-center ${
              message.type === 'success' 
                ? 'bg-green-100 text-green-800 border-2 border-green-500' 
                : 'bg-red-100 text-red-800 border-2 border-red-500'
            }`}>
              {message.text}
            </div>
          )}

          <div className="px-2 sm:px-0 w-full sm:w-lg flex flex-col items-center gap-2">
            <span className="flex items-start w-full font-noto font-extrabold text-customDarkYellow text-lg">Username</span>
            <input 
              type="text" 
              placeholder="Enter Your Username"   
              maxLength={50}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full border-2 border-customYellow rounded-2xl px-4 py-2 font-noto text-customBlack text-lg focus:outline-none"
            />
            <span className="flex items-start w-full font-noto font-extrabold text-customDarkYellow text-lg">Password</span>          
            <input 
              type="password" 
              placeholder="Enter your Password"   
              maxLength={50}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border-2 border-customYellow rounded-2xl px-4 py-2 font-noto text-customBlack text-lg focus:outline-none"
            />
            
            <div className="flex flex-col sm:flex-row w-full gap-2">
              <div className="flex flex-col w-full">
                <span className="flex items-start w-full font-noto font-extrabold text-customDarkYellow text-lg">วันรับอุปกรณ์</span>
                <input 
                  type="date" 
                  value={pickupDate}
                  onChange={(e) => setPickupDate(e.target.value)}
                  className="border-2 border-customYellow rounded-2xl px-4 py-2 font-noto text-customBlack text-lg focus:outline-none"
                />
              </div>
              <div className="flex flex-col w-full">
                <span className="flex items-start w-full font-noto font-extrabold text-customDarkYellow text-lg">ช่วงเวลารับอุปกรณ์</span>
                <input 
                  type="time" 
                  value={pickupTime}
                  onChange={(e) => setPickupTime(e.target.value)}
                  className="border-2 border-customYellow rounded-2xl px-4 py-2 font-noto text-customBlack text-lg focus:outline-none"
                />
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row w-full gap-2">
              <div className="flex flex-col w-full">
                <span className="flex items-start w-full font-noto font-extrabold text-customDarkYellow text-lg">วันคืนอุปกรณ์</span>
                <input 
                  type="date" 
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                  className="border-2 border-customYellow rounded-2xl px-4 py-2 font-noto text-customBlack text-lg focus:outline-none"
                />
              </div>
              <div className="flex flex-col w-full">
                <span className="flex items-start w-full font-noto font-extrabold text-customDarkYellow text-lg">ช่วงเวลาคืนอุปกรณ์</span>
                <input 
                  type="time" 
                  value={returnTime}
                  onChange={(e) => setReturnTime(e.target.value)}
                  className="border-2 border-customYellow rounded-2xl px-4 py-2 font-noto text-customBlack text-lg focus:outline-none"
                />
              </div>
            </div>
            
            <label className="w-full flex flex-row pt-5 items-start gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={agreedToPolicy}
                onChange={(e) => setAgreedToPolicy(e.target.checked)}
                className="border-2 border-customYellow rounded-md w-5 h-5 accent-customYellow cursor-pointer"
              />
              <span className="font-noto font-extrabold text-customBlack text-md">
                ข้าพเจ้ารับทราบและยินยอมตามข้อกำหนดการใช้งานของระบบ Toolhub
              </span>
            </label>
            
            <button 
              className={`w-xs sm:w-sm border-2 border-customDarkYellow rounded-2xl px-4 py-2 font-noto text-customBlack text-lg ${
                isSubmitting 
                  ? 'bg-gray-300 cursor-not-allowed' 
                  : 'bg-customYellow hover:bg-customDarkYellow cursor-pointer'
              }`}
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'กำลังส่งคำขอ...' : 'ยืนยันการยืม'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageBorrow;