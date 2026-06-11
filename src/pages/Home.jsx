import AllProducts from "../components/AllProducts";
import Banner from "../components/Banner";
import ProfileInfo from "../components/ProfileInfo";
import design from "../styles/design";
import { useProfileSection } from "../context/ProfileSectionContext";
import { Headphones, Leaf, ShieldCheck, Truck } from "lucide-react";

const Home = ({ refs }) => {
  const { profileRef, allProductsRef, contactRef } = refs;
  const { showProfileSection } = useProfileSection();

  return (
    <div className="theme-page-bg pt-6 md:pt-24">
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
            <div className="pt-4 md:pt-0">
              <Banner />
            </div>
            <div ref={allProductsRef}>
              <div className="mb-4 flex flex-col gap-3 text-left sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h2 className="flex items-center gap-2 text-2xl font-extrabold text-slate-950 md:text-3xl">
                    Our Best Sellers <Leaf className="text-[#66c35d]" size={24} fill="currentColor" />
                  </h2>
                  <p className="mt-1 text-sm font-medium text-[var(--theme-muted-text)] md:text-base">
                    Best quality products for your daily needs
                  </p>
                </div>
                <button
                  type="button"
                  className="w-fit rounded-lg border border-[var(--theme-primary)] px-5 py-2.5 text-sm font-bold text-[var(--theme-primary)] transition-colors hover:bg-[var(--theme-primary)] hover:text-white"
                >
                  View All Products
                </button>
              </div>
              <AllProducts />
              <div className="mb-8 mt-6 grid gap-0 overflow-hidden rounded-2xl bg-white/80 p-4 text-left shadow-[0_14px_40px_rgba(15,23,42,0.06)] backdrop-blur md:grid-cols-4">
                {[
                  { icon: ShieldCheck, title: "100% Quality Products", subtitle: "Premium & Fresh Products" },
                  { icon: Truck, title: "Fast Home Delivery", subtitle: "On Time Delivery" },
                  { icon: ShieldCheck, title: "Secure Payment", subtitle: "100% Secure Payment" },
                  { icon: Headphones, title: "24/7 Support", subtitle: "Dedicated Support" },
                ].map(({ icon: Icon, title, subtitle }) => (
                  <div key={title} className="flex items-center gap-4 border-[var(--theme-border-color)] px-4 py-3 md:border-r last:border-r-0">
                    <Icon className="shrink-0 text-[var(--theme-primary)]" size={34} />
                    <div>
                      <p className="font-bold text-slate-950">{title}</p>
                      <p className="text-sm text-[var(--theme-muted-text)]">{subtitle}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
