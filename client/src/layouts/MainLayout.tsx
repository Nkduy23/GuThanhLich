import Header from "../components/layout/Header";
import FooterContainer from "../components/layout/FooterContainer";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="app-wrapper">
      <Header />
      <main className="main-content">{children}</main>
      <FooterContainer />
    </div>
  );
};
export default MainLayout;
