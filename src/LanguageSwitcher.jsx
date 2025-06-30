import React from "react";

export default function LanguageSwitcher({ language, setLanguage }) {
  return (
    <div className="d-flex justify-content-end mb-3">
      <button
        className={`btn btn-sm me-2 ${language === 'zh' ? 'btn-primary' : 'btn-outline-primary'}`}
        onClick={() => setLanguage('zh')}
      >
        中文
      </button>
      <button
        className={`btn btn-sm ${language === 'en' ? 'btn-primary' : 'btn-outline-primary'}`}
        onClick={() => setLanguage('en')}
      >
        English
      </button>
    </div>
  );
}
