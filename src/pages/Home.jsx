import AllProducts from "../components/AllProducts";
import Banner from "../components/Banner";
import ProfileInfo from "../components/ProfileInfo";
import design from "../styles/design";

const Home = ({ refs }) => {
  const { profileRef, allProductsRef, contactRef } = refs;

  return (
    <section
      className={`min-h-screen ${design.container} ${design.colors.primaryGradient} rounded-xl md:my-6 sm:mt-3`}
    >
      <div className="text-white text-center">
        <div ref={profileRef}>
          <ProfileInfo ref={contactRef} />
        </div>
        <Banner />
        <div ref={allProductsRef}>
          <AllProducts />
        </div>
      </div>
    </section>
  );
};

export default Home;
