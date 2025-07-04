import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./HomePage";
import RockPaperScissors from "./RockPaperScissors";
import TicTacToe from "./TicTacToe"; 
import NavBar from "./NavBar"; 

{/* import Layout from "./Layout"; */}

function App() {
  const [language, setLanguage] = useState("zh");

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "zh" ? "en" : "zh"));
  };

  return (
    <Router>
      {/* <Layout language={language} toggleLanguage={toggleLanguage}>
        
      </Layout> */}

      <NavBar language={language} toggleLanguage={toggleLanguage} />

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
        <Route path="/tictactoe" element={<TicTacToe />} />

      </Routes>

      {/* <TicTacToe /> */}
    </Router>

    
  );
}

export default App;
