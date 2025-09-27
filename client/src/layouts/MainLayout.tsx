import { Outlet } from "react-router-dom";
import Header from "../components/layout/Header";
import FooterContainer from "../components/layout/FooterContainer";

const MainLayout: React.FC = () => {
  return (
    <div className="font-sans bg-slate-50">
      <Header />
      <main className="min-h-screen">
        <Outlet /> {/* tất cả route con sẽ hiển thị ở đây */}
      </main>
      <FooterContainer />
    </div>
  );
};

export default MainLayout;
