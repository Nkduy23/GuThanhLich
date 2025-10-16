import { Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ClientRoutes from "./routes/ClientRoutes";
import AdminRoutes from "./routes/AdminRoutes";
import ScrollToTop from "./client/components/common/ScrollToTop";
import SkeletonLoader from "./client/components/common/SkeletonLoader";
import { AuthProvider } from "./client/context/AuthContext";
import { CartProvider } from "./client/context/CartContext";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Suspense fallback={<SkeletonLoader />}>
        <AuthProvider>
          <CartProvider>
            <Routes>
              <Route path="/*" element={<ClientRoutes />} />
              <Route path="/admin/*" element={<AdminRoutes />} />
            </Routes>
          </CartProvider>
        </AuthProvider>
      </Suspense>

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
