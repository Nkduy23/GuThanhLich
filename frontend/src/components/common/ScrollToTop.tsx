import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    console.log("📍 Route changed:", pathname); // 👈 test log
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

export default ScrollToTop;
