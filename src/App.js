import React from "react";
import images from "./images";

function App() {
  return (
    <div className="container py-5">
      <h1 className="text-center mb-4">My Gallery</h1>

      <div className="row g-4">
        {images.map((src, index) => (
          <div className="col-sm-6 col-md-4" key={index}>
            <div className="card shadow-sm">
              <img src={process.env.PUBLIC_URL + src} className="card-img-top" alt={`Image ${index}`} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
