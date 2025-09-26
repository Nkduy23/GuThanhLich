import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
// import Header from "./components/layout/Header";
import Slider from "./components/common/Slider";
// import FooterContainer from "./components/FooterContainer";
import Home from "./pages/client/Home";
import ProductDetail from "./pages/client/ProductDetail";
import ScrollToTop from "./components/common/ScrollToTop";
import LoginPage from "./pages/client/LoginPage";
import RegisterPage from "./pages/client/RegisterPage";
import ForgotPage from "./pages/client/ForgotPage";
import MainLayout from "./layouts/MainLayout";
import ProtectedRoute from "./routes/ProtectedRoute";
import ProfilePage from "./pages/client/ProfilePage";
import CartPage from "./pages/client/CartPage";

const App: React.FC = () => {
  return (
    <Router>
      <MainLayout>
        <div className="font-sans bg-slate-50">
          {/* <Header /> */}
          <ScrollToTop />
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <Slider />
                  <Home />
                </>
              }
            />
            <Route path="/products/:slug" element={<ProductDetail />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPage />} />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
            <Route path="/cart" element={<CartPage />} />
          </Routes>
          {/* <FooterContainer /> */}
        </div>
      </MainLayout>
    </Router>
  );
};

export default App;
