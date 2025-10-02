import { useEffect } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

const ScrollManager = () => {
  const location = useLocation();
  const navigationType = useNavigationType();

  useEffect(() => {
    if (navigationType === "POP") {
      // back / forward
      const savedY = sessionStorage.getItem(location.key);
      if (savedY) {
        window.scrollTo(0, parseInt(savedY, 10));
        return;
      }
    }
    // default scroll to top for new page
    window.scrollTo(0, 0);
  }, [location, navigationType]);

  useEffect(() => {
    const saveScroll = () => {
      sessionStorage.setItem(location.key, window.scrollY.toString());
    };
    window.addEventListener("beforeunload", saveScroll);
    return () => {
      saveScroll();
      window.removeEventListener("beforeunload", saveScroll);
    };
  }, [location]);

  return null;
};

export default ScrollManager;
