// src/components/home/ImageCollage.tsx
import React from "react";

interface ImageCollageProps {
  images: string[];
}

const ImageCollage: React.FC<ImageCollageProps> = ({ images }) => {
  return (
    <div className="max-w-6xl mx-auto px-4 my-16">
      <div className="grid grid-cols-6 grid-rows-1 gap-4">
        {/* Ảnh 1 */}
        <div className="col-span-2 row-span-1">
          <img src={images[0]} alt="" className="w-auto h-96 object-cover rounded-lg" />
        </div>

        {/* Ảnh 2 */}
        <div className="col-span-2 row-span-1">
          <img src={images[1]} alt="" className="w-auto h-96 object-cover rounded-lg" />
        </div>

        {/* Ảnh 3 */}
        <div className="col-span-2 row-span-1">
          <img src={images[2]} alt="" className="w-auto h-96 object-cover rounded-lg" />
        </div>

        {/* Ảnh 4 */}
        <div className="col-span-2 row-span-1">
          <img src={images[3]} alt="" className="w-auto h-96 object-cover rounded-lg" />
        </div>

        {/* Ảnh 5 */}
        {images[4] && (
          <div className="col-span-2 row-span-1">
            <img src={images[4]} alt="" className="w-auto h-96 object-cover rounded-lg" />
          </div>
        )}
        {images[5] && (
          <div className="col-span-2 row-span-1">
            <img src={images[5]} alt="" className="w-auto h-96 object-cover rounded-lg" />
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageCollage;
