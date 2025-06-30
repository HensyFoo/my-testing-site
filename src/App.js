import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./HomePage";
import RockPaperScissors from "./RockPaperScissors";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/rps" element={<RockPaperScissors />} />
      </Routes>
    </Router>
  );
}

export default App;
