// src/components/NavBar.jsx
import React from "react";
import "./NavBar.css";
import { Link } from "react-router-dom";
import LanguageSwitcher from "./LanguageSwitcher";

export default function NavBar({ language, toggleLanguage }) {
  return (
    <nav className="custom-navbar">
      <div className="navbar-left">
        <Link to="/" className="brand-link">
          <img
            src="/logo192.png"
            alt="Logo"
            className="logo-image"
          />
          <span className="brand-text">Foo Mini Games</span>
        </Link>
      </div>

      <div className="navbar-right">
        <LanguageSwitcher language={language} toggleLanguage={toggleLanguage} />
      </div>
    </nav>
  );
}
