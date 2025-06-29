// generate-image-list.js
const fs = require("fs");
const path = require("path");

const galleryPath = path.join(__dirname, "public/gallery");
const outputFile = path.join(__dirname, "src/images.js");

const files = fs.readdirSync(galleryPath);
const imageFiles = files.filter(file =>
  /\.(jpg|jpeg|png|gif|webp)$/i.test(file)
);

const imageList = imageFiles.map(file => `/gallery/${file}`);

const jsContent = `// Auto-generated image list
const images = ${JSON.stringify(imageList, null, 2)};
export default images;
`;

fs.writeFileSync(outputFile, jsContent);
console.log(`✅ Wrote ${imageFiles.length} images to src/images.js`);
