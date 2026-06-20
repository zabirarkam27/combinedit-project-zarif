import AllProducts from "../components/AllProducts";
import Banner from "../components/Banner";
import CategorySection from "../components/CategorySection";
import ProfileInfo from "../components/ProfileInfo";
import design from "../styles/design";
import { useProfileSection } from "../context/ProfileSectionContext";
import { ArrowRight, Headphones, Leaf, ShieldCheck, Sparkles, Truck } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const Home = ({ refs }) => {
  const { profileRef, allProductsRef, contactRef } = refs;
  const { showProfileSection } = useProfileSection();
  const location = useLocation();

  useEffect(() => {
    if (location.hash === "#contact" && contactRef?.current) {
      requestAnimationFrame(() => {
        contactRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
  }, [contactRef, location.hash]);

  return (
    <div className="theme-page-bg pt-6 md:pt-28">
      <div className={`md:min-h-screen`}>
        <div className="text-center">
          {showProfileSection && (
            <div
              ref={profileRef}
              className={`theme-primary-bg shadow-2xl pb-3 ${design.heroContainer}`}
            >
              <ProfileInfo ref={contactRef} />
            </div>
          )}

          <div className={`w-full theme-page-bg pt-4 md:pt-6 ${design.heroContainer}`}>
            <Banner />
          </div>

          <div className={`${design.container} theme-page-bg md:mt-6 sm:mt-3`}>
            <div ref={allProductsRef}>
              <div className="mb-5 overflow-hidden rounded-[28px] border border-white/70 bg-white/80 p-4 text-left shadow-[0_18px_50px_rgba(15,23,42,0.07)] backdrop-blur md:p-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <p className="mb-2 inline-flex items-center gap-2 rounded-full bg-[var(--theme-muted-bg)] px-3 py-1 text-xs font-black uppercase tracking-wide text-[var(--theme-primary)]">
                      <Sparkles size={14} />
                      Curated picks
                    </p>
                    <h2 className="flex items-center gap-2 text-2xl font-black tracking-tight text-slate-950 md:text-3xl">
                      Our Best Sellers <Leaf className="text-[#66c35d]" size={23} fill="currentColor" />
                    </h2>
                    <p className="mt-1 text-sm font-semibold text-[var(--theme-muted-text)] md:text-base">
                      Best quality products for your daily needs
                    </p>
                  </div>
                  <Link
                    to="/products"
                    className="inline-flex w-fit items-center gap-2 rounded-2xl bg-[var(--theme-primary)] px-5 py-3 text-sm font-black text-white shadow-[0_14px_30px_rgba(11,125,35,0.18)] transition hover:opacity-90"
                  >
                    View All Products
                    <ArrowRight size={17} />
                  </Link>
                </div>
              </div>
              <AllProducts pageSize={6} largeColumns={4} />
              <CategorySection limit={6} />
              <div className="mb-8 mt-6 grid gap-3 rounded-[28px] border border-white/70 bg-white/70 p-3 text-left shadow-[0_18px_50px_rgba(15,23,42,0.07)] backdrop-blur sm:grid-cols-2 md:grid-cols-4 md:p-4">
                {[
                  { icon: ShieldCheck, title: "100% Quality Products", subtitle: "Premium & Fresh Products" },
                  { icon: Truck, title: "Fast Home Delivery", subtitle: "On Time Delivery" },
                  { icon: ShieldCheck, title: "Secure Payment", subtitle: "100% Secure Payment" },
                  { icon: Headphones, title: "24/7 Support", subtitle: "Dedicated Support" },
                ].map(({ icon: Icon, title, subtitle }) => (
                  <div key={title} className="flex items-center gap-3 rounded-2xl bg-white px-3 py-3 shadow-sm ring-1 ring-slate-100 transition hover:-translate-y-0.5 hover:shadow-md">
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-[var(--theme-muted-bg)] text-[var(--theme-primary)]"><Icon size={23} /></span>
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


