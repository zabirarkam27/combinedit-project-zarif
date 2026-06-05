import useProfileData from "../hooks/useProfileData";
import design from "../styles/design";

const Footer = () => {
  const { profile, loading } = useProfileData();

  if (loading) return null;
  if (!profile) return null;

  return (
    <footer className="footer theme-gradient theme-gradient-hover mx-auto text-neutral-content py-5 lg:p-20">
      <div className={`${design.navbarContainer} flex flex-col mx-auto`}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center justify-center mb-4 xs:max-w-screen md:w-[700px] w-full">
          <a href={profile.emailLink} target="_blank" rel="noopener noreferrer">
            <div className="theme-secondary-bg border border-white/50 hover:shadow-xl transition duration-300 hover:-translate-y-1 ease-in-out rounded-lg grid grid-cols-5 gap-1 p-1 h-20 items-center opacity-90">
              <div className="rounded-lg col-span-1 flex items-center justify-center">
                <img src={profile.emailIcon} alt="Email Icon" className="p-1 h-10 w-10" loading="lazy" />
              </div>
              <div className="text-white col-span-4">
                <h2 className="text-[12px] font-black">Email Us</h2>
                <p className="text-[11px] font-semibold break-all">zabirarkam27@gmail.com</p>
              </div>
            </div>
          </a>

          <a href={profile.phoneLink} target="_blank" rel="noopener noreferrer">
            <div className="theme-secondary-bg border border-white/50 hover:shadow-xl transition duration-300 hover:-translate-y-1 ease-in-out rounded-lg grid grid-cols-5 gap-1 p-1 h-20 items-center opacity-90">
              <div className="rounded-lg col-span-1 flex items-center justify-center">
                <img src={profile.phoneIcon} alt="Phone icon" className="p-2 h-10 w-10" loading="lazy" />
              </div>
              <div className="text-white col-span-4">
                <h2 className="text-[12px] font-black">Call Us</h2>
                <p className="text-[11px] font-semibold break-all">+8801838600619</p>
              </div>
            </div>
          </a>

          <a href="https://maps.app.goo.gl/gNuBTVRF4E49yr7d7" target="_blank" rel="noopener noreferrer">
            <div className="theme-secondary-bg border border-white/50 hover:shadow-xl transition duration-300 hover:-translate-y-1 ease-in-out rounded-lg grid grid-cols-5 gap-1 p-1 h-20 items-center opacity-90">
              <div className="rounded-lg col-span-1 flex items-center justify-center">
                <img src="/footer-location-icon.png" alt="location icon" className="px-1 h-8 w-8" loading="lazy" />
              </div>
              <div className="text-white col-span-4">
                <h2 className="text-[12px] font-black">Visit Us</h2>
                <p className="text-[11px] font-semibold break-all">26, Nayapaltan, Dhaka-1000</p>
              </div>
            </div>
          </a>
        </div>

        <div className="theme-page-bg h-0.5 max-w-full w-full mx-auto mb-4" />

        <div className="flex items-center gap-4">
          <h6>Social:</h6>
          <a href={profile.facebookLink || "#"} aria-label="Facebook">
            <img src="/footer-facebook-icon.png" alt="facebook icon" className="h-9 w-9" loading="lazy" />
          </a>
          <a href={profile.phoneLink || "#"} aria-label="WhatsApp">
            <img src="/footer-whatsapp-icon.png" alt="whatsapp icon" className="h-11 w-11" loading="lazy" />
          </a>
          <a href={profile.websiteLink || "#"} aria-label="X">
            <img src="/x-icon.png" alt="x icon" className="h-8 w-8" loading="lazy" />
          </a>
        </div>

        <div className="mt-4 flex flex-col md:flex-row gap-1 md:gap-4 items-center justify-center">
          <p className="text-[10px] text-center">© 2024 All Rights Reserved by Zabir Arkam</p>
          <div className="flex gap-2 items-center">
            <p className="text-[10px] text-center">Developed & Marketed By</p>
            <span className="font-semibold border p-1 rounded-lg text-xs">Proo IT</span>
          </div>
        </div>
      </div>
      <div className="h-20 md:h-0" />
    </footer>
  );
};

export default Footer;
