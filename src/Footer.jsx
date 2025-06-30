import React from "react";

const Footer = () => {
  return (
    <footer className="text-center py-3 bg-light text-muted mt-auto" style={{ fontSize: "14px" }}>
      © {new Date().getFullYear()} Foo Shi Heng. All rights reserved.
    </footer>
  );
};

export default Footer;
