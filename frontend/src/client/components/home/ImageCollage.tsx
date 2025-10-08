import React from "react";
import { Link } from "react-router-dom";
import type { CollageImage } from "../../data/imageCollageData";

interface ImageCollageProps {
  images: CollageImage[];
}

const ImageCollage: React.FC<ImageCollageProps> = ({ images }) => {
  return (
    <div className="max-w-6xl mx-auto px-4 my-16">
      <div className="grid grid-cols-6 grid-rows-1 gap-4">
        {images.map((img, index) => (
          <div key={index} className="col-span-2 row-span-1">
            <Link to={img.href}>
              <img
                src={img.src}
                alt=""
                className="w-auto h-96 object-cover rounded-lg hover:opacity-90 transition duration-300"
              />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageCollage;
