import AllProducts from "../components/AllProducts";
import Banner from "../components/Banner";
import ProfileInfo from "../components/ProfileInfo";
import design from "../styles/design";


const Home = ({ refs }) => {
  const { profileRef, allProductsRef, contactRef } = refs;

  return (
    <div className="bg-[#dcf3f1] pt-6 pb-18 md:pb-0 ">
      <div className={`md:min-h-screen  `}>
        <div className="text-center">
          <div
            ref={profileRef}
            className={`bg-[#01ad9c] shadow-2xl pb-3 ${design.container} rounded-t-full`}
          >
            <ProfileInfo ref={contactRef} />
          </div>
          <div className={`${design.container} bg-[#a8e2dd] md:mt-6 sm:mt-3`}>
            <div>
              <div className="pt-4">
                <Banner />
              </div>
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
