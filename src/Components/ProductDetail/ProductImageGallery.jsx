import React, { useState } from 'react';

const ProductImageGallery = ({ images }) => {
  const [selectedImage, setSelectedImage] = useState(images[0]);

  return (
    <div className="w-full">
      <div className="grid grid-cols-[120px_380px] grid-rows-[380px_120px] gap-4 w-[515px] h-[515px]">
        {/* Left Thumbnails */}
        <div className="flex flex-col gap-4">
          {images.slice(0, 3).map((image, index) => (
            <div
              key={index}
              className={`w-[120px] h-[120px] cursor-pointer overflow-hidden transition-colors duration-300
                ${image === selectedImage ? 'border border-black' : 'border border-transparent'}
                hover:border-black`}
              onMouseEnter={() => setSelectedImage(image)}
            >
              <img 
                src={image} 
                alt={`Thumbnail ${index + 1}`} 
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>

        {/* Main Image */}
        <div className="w-[380px] h-[380px]">
          <img 
            src={selectedImage} 
            alt="Selected product" 
            className="w-full h-full object-cover transition-all duration-300 ease-in-out"
          />
        </div>

        {/* Bottom Thumbnails */}
        <div className="col-span-2 flex gap-4">
          <div
            className={`w-[120px] h-[120px] cursor-pointer overflow-hidden transition-colors duration-300
              ${images[3] === selectedImage ? 'border border-black' : 'border border-transparent'}
              hover:border-black`}
            onMouseEnter={() => setSelectedImage(images[3])}
          >
            <img 
              src={images[3]} 
              alt="Corner Thumbnail" 
              className="w-full h-full object-cover"
            />
          </div>
          {images.slice(4).map((image, index) => (
            <div
              key={index + 4}
              className={`w-[120px] h-[120px] cursor-pointer overflow-hidden transition-colors duration-300
                ${image === selectedImage ? 'border border-black' : 'border border-transparent'}
                hover:border-black`}
              onMouseEnter={() => setSelectedImage(image)}
            >
              <img 
                src={image} 
                alt={`Thumbnail ${index + 5}`} 
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductImageGallery;