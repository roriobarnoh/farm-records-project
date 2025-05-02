import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Cows from "./pages/Cows";
import Chicken from "./pages/Chicken";
import Horticulture from "./pages/Horticulture";
import Navbar from "./components/Navbar";

function App() {
  return (
    <Router>
      <Navbar />
      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<Cows />} />
          <Route path="/chicken" element={<Chicken />} />
          <Route path="/horticulture" element={<Horticulture />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
