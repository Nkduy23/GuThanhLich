import { Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ClientRoutes from "./routes/ClientRoutes";
import AdminRoutes from "./routes/AdminRoutes";
import ScrollToTop from "./client/components/common/ScrollToTop";
// import { ScrollRestoration } from "react-router-dom";
import SkeletonLoader from "./client/components/common/SkeletonLoader";
import { AuthProvider } from "./client/context/AuthContext";

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <Suspense fallback={<SkeletonLoader />}>
          <Routes>
            <Route path="/*" element={<ClientRoutes />} />
            <Route path="/admin/*" element={<AdminRoutes />} />
          </Routes>
        </Suspense>
      </Router>
    </AuthProvider>
  );
};

export default App;
