import AllProducts from "../components/AllProducts";
import Banner from "../components/Banner";
import ProfileInfo from "../components/ProfileInfo";
import design from "../styles/design";
import { useProfileSection } from "../context/ProfileSectionContext";

const Home = ({ refs }) => {
  const { profileRef, allProductsRef, contactRef } = refs;
  const { showProfileSection } = useProfileSection();

  return (
    <div className="theme-page-bg pt-6 ">
      <div className={`md:min-h-screen`}>
        <div className="text-center">
          {showProfileSection && (
            <div
              ref={profileRef}
              className={`theme-primary-bg shadow-2xl pb-3 ${design.container}`}
            >
              <ProfileInfo ref={contactRef} />
            </div>
          )}

          <div className={`${design.container} theme-page-bg md:mt-6 sm:mt-3`}>
            <div className="pt-4">
              <Banner />
            </div>
            <div ref={allProductsRef}>
              <AllProducts />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
