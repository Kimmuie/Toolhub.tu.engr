import React, { useState } from "react";

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

  const toolsList = [
    { id: 1, name: "ค้อนหงอน", image: "tools/Hammer.jpg", max: 7 },
    { id: 2, name: "สว่านไฟฟ้า", image: "tools/Drill.jpg", max: 3 },
    { id: 3, name: "ปืนยิงกาวร้อน (5/16 นิ้ว)", image: "tools/Gluegun.jpg", max: 3 },
    { id: 4, name: "ชุดคีมขนาดเล็ก", image: "tools/Pilers.jpg", max: 5 },
    { id: 5, name: "เลื่อยลันดา", image: "tools/Saw.jpg", max: 5 },
    { id: 6, name: "ไขควง", image: "tools/Screwdriver.jpg", max: 12 },
    { id: 7, name: "ตลับเมตรยาว 5 เมตร", image: "tools/TapeMeasure.jpg", max: 7 },
  ];

  const handleToolQuantityChange = (id, name, value) => {
    const quantity = Math.max(0, Math.min(value, toolsList.find(t => t.id === id).max));
    console.log('Tool quantity changed:', { id, name, quantity });
    setToolQuantities(prev => ({
      ...prev,
      [id]: { name, quantity }
    }));
  };

  const handleSubmit = async () => {
    console.log('=== SUBMIT BUTTON CLICKED ===');
    console.log('Current state:', {
      username,
      password: password ? '***' : 'empty',
      pickupDate,
      pickupTime,
      returnDate,
      returnTime,
      agreedToPolicy,
      toolQuantities
    });

    setMessage({ type: '', text: '' });
    setIsSubmitting(true);

    try {
      // Client-side validation
      if (!username || !password) {
        console.log('❌ Validation failed: Missing username or password');
        setMessage({ type: 'error', text: 'กรุณากรอก Username และ Password' });
        setIsSubmitting(false);
        return;
      }

      if (!pickupDate || !pickupTime || !returnDate || !returnTime) {
        console.log('❌ Validation failed: Missing date/time fields');
        setMessage({ type: 'error', text: 'กรุณากรอกวันและเวลาทั้งหมด' });
        setIsSubmitting(false);
        return;
      }

      if (!agreedToPolicy) {
        console.log('❌ Validation failed: Policy not agreed');
        setMessage({ type: 'error', text: 'กรุณายอมรับข้อกำหนดการใช้งาน' });
        setIsSubmitting(false);
        return;
      }

      const selectedTools = Object.values(toolQuantities).filter(tool => tool.quantity > 0);
      console.log('Selected tools:', selectedTools);
      
      if (selectedTools.length === 0) {
        console.log('❌ Validation failed: No tools selected');
        setMessage({ type: 'error', text: 'กรุณาเลือกอุปกรณ์อย่างน้อย 1 รายการ' });
        setIsSubmitting(false);
        return;
      }

      console.log('✅ All validations passed');

      const payload = {
        username,
        password,
        pickupDate,
        pickupTime,
        returnDate,
        returnTime,
        agreedToPolicy,
        toolQuantities
      };

      console.log('Sending payload to API:', payload);

      // Send to API
      const response = await fetch('/api/borrow', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);

      let data;
      try {
        data = await response.json();
      } catch {
        data = {};
      }

      console.log('Response data:', data);

      if (response.ok) {
        console.log('✅ SUCCESS: Request submitted');
        setMessage({ type: 'success', text: 'ส่งคำขอยืมสำเร็จ!' });
        // Reset form
        setUsername('');
        setPassword('');
        setPickupDate('');
        setPickupTime('');
        setReturnDate('');
        setReturnTime('');
        setAgreedToPolicy(false);
        setToolQuantities({});
        console.log('Form reset complete');
      } else {
        console.log('❌ ERROR: Server returned error');
        setMessage({ type: 'error', text: data.message || 'เกิดข้อผิดพลาด' });
      }
    } catch (error) {
      console.error('❌ CATCH ERROR:', error);
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
      setMessage({ type: 'error', text: 'ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์' });
    } finally {
      console.log('=== SUBMIT COMPLETE ===');
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
        {/* Black shadow behind the card */}
        <div className="absolute inset-0 bg-customYellow rounded-2xl translate-x-1 md:translate-x-1.5 translate-y-1 md:translate-y-1.5"></div>
        <div className="z-10 bg-customWhite h-full pt-8 flex flex-col items-center justify-center rounded-2xl border-3 border-customYellow gap-4 py-2">
          <span className="flex w-full items-center justify-center font-noto font-extrabold text-xl">เลือกจำนวนและอุปกรณ์ที่ต้องการยืม</span>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 max-h-120 overflow-y-auto px-5">
            {toolsList.map((item) => (
              <div key={item.id} className="w-40 sm:w-50 flex flex-col items-center">
                <img src={item.image} alt="logo" className="w-full border-2 border-customYellow rounded-t-lg" />
                <span className="flex items-start w-full font-noto font-extrabold text-customBlack text-lg bg-customYellow px-2">{item.name}</span>
                <div className="flex flex-row w-full">
                  <input 
                    type="number" 
                    placeholder="0"  
                    min={0} 
                    max={item.max}
                    value={toolQuantities[item.id]?.quantity || ''}
                    onChange={(e) => handleToolQuantityChange(item.id, item.name, e.target.value)}
                    className="w-full border-2 border-customYellow rounded-bl-lg px-4 py-2 font-noto text-customBlack text-lg focus:outline-none"
                  />
                  <span className="flex items-center justify-center w-30 rounded-br-lg font-noto font-bold text-customBlack text-md bg-customYellow px-1">Max {item.max}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Input Form */}
      <div className="relative flex flex-col w-full sm:w-3xl xl:w-xl h-xl">
        {/* Black shadow behind the card */}
        <div className="absolute inset-0 bg-customYellow rounded-2xl translate-x-1 md:translate-x-1.5 translate-y-1 md:translate-y-1.5"></div>
        <div className="z-10 bg-customWhite h-full pt-8 flex flex-col items-center rounded-2xl border-3 border-customYellow pb-4">
          <img src="ToolhubLogo.png" width="70" height="80" alt="logo" />
          <div className="px-2 sm:px-0 w-full sm:w-lg flex flex-col items-center gap-2">
            {/* Message Display */}
            {message.text && (
              <div className={`w-full px-4 py-2 rounded-2xl font-noto text-center ${
                message.type === 'success' 
                  ? 'bg-green-100 text-green-800 border-2 border-green-500' 
                  : 'bg-red-100 text-red-800 border-2 border-red-500'
              }`}>
                {message.text}
              </div>
            )}

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
            
            {/* Pickup Date */}
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
            
            {/* Return Date */}
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
            
            {/* Policy Approval */}
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
            
            {/* Submit Button */}
            <button 
              className={`w-xs sm:w-sm border-2 border-customDarkYellow rounded-2xl px-4 py-2 font-noto text-customBlack text-lg ${
                isSubmitting 
                  ? 'bg-gray-300 cursor-not-allowed' 
                  : 'bg-customYellow hover:bg-customDarkYellow cursor-pointer'
              }`}
              onClick={(e) => {
                console.log('Button clicked, event:', e);
                handleSubmit();
              }}
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