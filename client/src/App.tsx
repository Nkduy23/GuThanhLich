import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Slider from "./components/Slider";
import FooterContainer from "./components/FooterContainer";
import Home from "./pages/Home";
import ProductDetail from "./pages/ProductDetail";

const App: React.FC = () => {
  return (
    <Router>
      <div className="font-sans bg-slate-50">
        <Header />
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
          <Route path="/products/:id" element={<ProductDetail />} />
        </Routes>
        <FooterContainer />
      </div>
    </Router>
  );
};

export default App;
