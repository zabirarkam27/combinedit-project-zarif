import Footer from "../components/Footer";
import NavBar from "../components/NavBar";

const MainLayout = ({ children, refs }) => {
  return (
    <>
      <NavBar refs={refs} />
      <main>{children}</main>
      <Footer/>
    </>
  );
};

export default MainLayout;
