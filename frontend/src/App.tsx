import { useEffect, useState, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ClientRoutes from "./routes/ClientRoutes";
import AdminRoutes from "./routes/AdminRoutes";
import ScrollToTop from "@/components/common/ScrollToTop";
import LoadingOverlay from "@/components/common/LoadingOverlay";
import { AuthProvider } from "@/context/auth/AuthProvider";
import { CartProvider } from "@/context/cart/CartProvider";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App: React.FC = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <BrowserRouter>
      <ScrollToTop />
      <AuthProvider>
        <CartProvider>
          <div className="relative">
            <Suspense fallback={null}>
              <Routes>
                <Route path="/*" element={<ClientRoutes />} />
                <Route path="/admin/*" element={<AdminRoutes />} />
              </Routes>
            </Suspense>

            <LoadingOverlay visible={loading} />
          </div>
        </CartProvider>
      </AuthProvider>

      <ToastContainer
        position="top-right"
        autoClose={2000}
        theme="colored"
        style={{ top: "88px" }}
      />
    </BrowserRouter>
  );
};

export default App;
