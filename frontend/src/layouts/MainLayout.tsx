import { Outlet } from "react-router-dom";
import Header from "../client/layout/Header";
import FooterContainer from "../client/layout/FooterContainer";

const MainLayout: React.FC = () => {
  return (
    <div className="font-sans bg-slate-50">
      <Header />
      <main>
        <Outlet />
      </main>
      <FooterContainer />
    </div>
  );
};

export default MainLayout;
