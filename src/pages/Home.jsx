import AllProducts from "../components/AllProducts";
import Banner from "../components/Banner";
import ProfileInfo from "../components/ProfileInfo";
import NavBar from "../components/NavBar";
import design from "../styles/design";

const Home = () => {
  return (
    <section
      className={`min-h-screen ${design.container} ${design.colors.primaryGradient} rounded-xl my-6`}
    >
      <div className={` text-white text-center`}>
        <NavBar/>
        <ProfileInfo />
        <Banner />
        <AllProducts />
      </div>
    </section>
  );
};

export default Home;
