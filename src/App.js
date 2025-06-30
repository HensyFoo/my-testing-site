import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./HomePage";
import RockPaperScissors from "./RockPaperScissors";

function App() {
  const [language, setLanguage] = useState("zh");

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "zh" ? "en" : "zh"));
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <HomePage
              language={language}
              toggleLanguage={toggleLanguage}
            />
          }
        />
        <Route
          path="/rps"
          element={
            <RockPaperScissors
              language={language}
              toggleLanguage={toggleLanguage}
            />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
