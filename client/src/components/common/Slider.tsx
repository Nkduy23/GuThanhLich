import { useEffect, useRef } from "react";

const Slider: React.FC = () => {
  const slidesRef = useRef<HTMLDivElement>(null);
  const currentIndexRef = useRef(0); // lưu currentIndex
  const intervalIdRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const slideWidth = 100; // % width of each slide

  useEffect(() => {
    const slides = slidesRef.current;
    if (slides) {
      const totalSlides = slides.children.length;
      intervalIdRef.current = setInterval(() => {
        currentIndexRef.current = (currentIndexRef.current + 1) % totalSlides;
        slides.style.transform = `translateX(-${currentIndexRef.current * slideWidth}%)`;
      }, 5000); // Auto slide every 5s
    }

    return () => {
      if (intervalIdRef.current) clearInterval(intervalIdRef.current);
    };
  }, []);

  const handlePrev = () => {
    const slides = slidesRef.current;
    if (slides) {
      const totalSlides = slides.children.length;
      currentIndexRef.current = (currentIndexRef.current - 1 + totalSlides) % totalSlides;
      slides.style.transform = `translateX(-${currentIndexRef.current * slideWidth}%)`;
    }
  };

  const handleNext = () => {
    const slides = slidesRef.current;
    if (slides) {
      const totalSlides = slides.children.length;
      currentIndexRef.current = (currentIndexRef.current + 1) % totalSlides;
      slides.style.transform = `translateX(-${currentIndexRef.current * slideWidth}%)`;
    }
  };

  return (
    <div className="relative overflow-hidden" id="slider">
      <div ref={slidesRef} className="flex transition-transform duration-500" id="slides">
        <div className="w-full flex-shrink-0">
          <img src="/images/sliders/slide1.jpg" className="w-full h-auto object-cover" />
        </div>
        <div className="w-full flex-shrink-0">
          <img src="/images/sliders/slide2.jpg" className="w-full h-auto object-cover" />
        </div>
        <div className="w-full flex-shrink-0">
          <img src="/images/sliders/slide3.jpg" className="w-full h-auto object-cover" />
        </div>
      </div>

      {/* Prev Button */}
      <button onClick={handlePrev} className="absolute top-1/2 left-4 -translate-y-1/2 bg-white p-2 rounded-full shadow">
        <svg width="35px" height="35px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15 7L10 12L15 17" stroke="#272626" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {/* Next Button */}
      <button onClick={handleNext} className="absolute top-1/2 right-4 -translate-y-1/2 bg-white p-2 rounded-full shadow rotate-180">
        <svg width="35px" height="35px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15 7L10 12L15 17" stroke="#272626" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  );
};

export default Slider;
