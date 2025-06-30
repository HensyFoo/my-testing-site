// src/LanguageSwitcher.jsx
import React from "react";
import { Button } from "react-bootstrap";

export default function LanguageSwitcher({ language, toggleLanguage }) {
  return (
    <Button
      variant="outline-light"
      size="sm"
      onClick={toggleLanguage}
      className="me-3"
    >
      {language === "zh" ? "English" : "中文"}
    </Button>
  );
}
