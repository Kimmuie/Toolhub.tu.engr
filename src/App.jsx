import { BrowserRouter as Router, Routes, Route, useLocation, useParams } from "react-router-dom";
import { useState } from 'react'
import Navbar from "./components/Navbar";
import PageBorrow from "./pages/pageBorrow";
import PageStatus from "./pages/pageStatus";
import PagePolicy from "./pages/pagePolicy";
import PageNotFound from "./pages/pageNotFound";

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
          <Route path="/status" element={<PageStatus />} />
          <Route path="/policy" element={<PagePolicy />} />
          <Route path="*" element={<PageNotFound />} />
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
