import { useEffect, useRef, useState } from "react";

const Slider: React.FC = () => {
  const slidesRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const intervalIdRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [isPaused, setIsPaused] = useState(false);

  // Touch handling
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const slides = [
    "/images/sliders/slide1.jpg",
    "/images/sliders/slide2.jpg",
    "/images/sliders/slide3.jpg",
  ];

  const totalSlides = slides.length;

  // Auto slide function
  const startAutoSlide = () => {
    if (intervalIdRef.current) clearInterval(intervalIdRef.current);
    intervalIdRef.current = setInterval(() => {
      if (!isPaused) {
        setCurrentIndex((prev) => (prev + 1) % totalSlides);
      }
    }, 5000);
  };

  useEffect(() => {
    startAutoSlide();
    return () => {
      if (intervalIdRef.current) clearInterval(intervalIdRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPaused, totalSlides]);

  // Update transform when index changes
  useEffect(() => {
    if (slidesRef.current) {
      slidesRef.current.style.transform = `translateX(-${currentIndex * 100}%)`;
    }
  }, [currentIndex]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    startAutoSlide(); // Reset auto-play timer
  };

  const handlePrev = () => {
    const newIndex = (currentIndex - 1 + totalSlides) % totalSlides;
    goToSlide(newIndex);
  };

  const handleNext = () => {
    const newIndex = (currentIndex + 1) % totalSlides;
    goToSlide(newIndex);
  };

  // Touch event handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 50; // Minimum distance for swipe

    if (Math.abs(diff) > minSwipeDistance) {
      if (diff > 0) {
        // Swiped left -> next slide
        handleNext();
      } else {
        // Swiped right -> prev slide
        handlePrev();
      }
    }
  };

  // Mouse event handlers for desktop drag (optional)
  const handleMouseEnter = () => setIsPaused(true);
  const handleMouseLeave = () => setIsPaused(false);

  return (
    <div
      className="relative overflow-hidden group"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Slides Container */}
      <div ref={slidesRef} className="flex transition-transform duration-500 ease-out">
        {slides.map((src, index) => (
          <div key={index} className="w-full flex-shrink-0">
            <img
              src={src}
              alt={`Slide ${index + 1}`}
              className="w-full h-auto object-cover select-none"
              draggable={false}
            />
          </div>
        ))}
      </div>

      {/* Navigation Buttons - Hidden on mobile, visible on hover on desktop */}
      <button
        onClick={handlePrev}
        aria-label="Previous slide"
        className="absolute cursor-pointer top-1/2 left-2 md:left-4 -translate-y-1/2 bg-white/90 hover:bg-white p-2 md:p-3 rounded-full shadow-lg backdrop-blur-sm transition-all opacity-0 md:group-hover:opacity-100 hover:scale-110 active:scale-95"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          className="w-5 h-5 md:w-6 md:h-6"
        >
          <path
            d="M15 7L10 12L15 17"
            stroke="#272626"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <button
        onClick={handleNext}
        aria-label="Next slide"
        className="absolute cursor-pointer top-1/2 right-2 md:right-4 -translate-y-1/2 bg-white/90 hover:bg-white p-2 md:p-3 rounded-full shadow-lg backdrop-blur-sm transition-all opacity-0 md:group-hover:opacity-100 hover:scale-110 active:scale-95 rotate-180"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          className="w-5 h-5 md:w-6 md:h-6"
        >
          <path
            d="M15 7L10 12L15 17"
            stroke="#272626"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 md:gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
            className={`transition-all duration-300 rounded-full ${
              index === currentIndex
                ? "w-8 md:w-10 h-2 md:h-2.5 bg-white"
                : "w-2 md:w-2.5 h-2 md:h-2.5 bg-white/50 hover:bg-white/75"
            }`}
          />
        ))}
      </div>

      {/* Progress bar (optional) */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-white/20">
        <div
          className="h-full bg-white transition-all duration-300"
          style={{ width: `${((currentIndex + 1) / totalSlides) * 100}%` }}
        />
      </div>
    </div>
  );
};

export default Slider;
