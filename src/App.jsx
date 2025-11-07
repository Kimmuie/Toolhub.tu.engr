import { BrowserRouter as Router, Routes, Route, useLocation, useParams } from "react-router-dom";
import { useState } from 'react'
import Navbar from "./components/Navbar";
import PageBorrow from "./pages/pageBorrow";

const AppContent = () => {
  return (
    <>
    <Navbar />
      <div
        className="navbar-container"
      >
        <Routes>
          <Route path="/" element={<PageBorrow />} />
          <Route path="/borrow" element={<PageBorrow />} />
          {/* <Route path="/" element={<Management />} />
          <Route path="/management" element={<Management />} />
          <Route path="/management/:rentalId" element={<RentalDetail />} />
          <Route path="/financial" element={<Financial />} />
          <Route path="/map" element={<GoogleMap />} />
          <Route path="/account" element={<Account />} />
          <Route path="/shareRental/:id" element={<ShareRental />} />
          <Route path="*" element={<NotFound />} /> */}
        </Routes>
      </div>
    </>
  );
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  )
}

export default App
