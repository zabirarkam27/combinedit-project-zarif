import useProfileData from "../hooks/useProfileData";
import design from "../styles/design";

const Footer = () => {
    const { profile, loading } = useProfileData();
    if (loading) return <p>Loading...</p>;
    if (!profile) return <p>Profile not found</p>;
    return (
        <footer className="footer bg-gradient-to-r from-[#00ad9c] via-[#3a8881] to-[#009e8e] bg-[length:200%_200%] transition-all duration-500 ease-in-out hover:bg-right mx-auto text-neutral-content py-5 lg:p-20">
            <div className={
                design.navbarContainer +
                "flex flex-col mx-auto"
            }>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center justify-center justify-center mb-4  xs:max-w-screen md:w-[700px] w-full">
                    <a href={profile.emailLink} target="_blank"
                        rel="noopener noreferrer">
                        <div className="bg-[#3a8881]/60 border border-[#a8e2dd] hover:shadow-xl transition duration-300 hover:-translate-y-1 ease-in-out rounded-lg grid grid-cols-5 gap-1 p-1 h-20 items-center">
                            <div className="rounded-lg col-span-1 flex items-center justify-center">
                                <img
                                    src={profile.emailIcon}
                                    alt="Email Icon"
                                    className="p-1 h-10 w-10 "
                                />
                            </div>
                            <div className="text-wite col-span-4">
                                <h2 className="text-[12px] font-black">Email Us</h2>
                                <p className="text-[11px] font-semibold break-all">zabirarkam27@gmail.com</p>
                            </div>
                        </div>
                    </a>
                    <a href={profile.phoneLink} target="_blank"
                        rel="noopener noreferrer">
                        <div className="bg-[#3a8881]/60 border border-[#a8e2dd] hover:shadow-xl transition duration-300 hover:-translate-y-1 ease-in-out rounded-lg grid grid-cols-5 gap-1 p-1 h-20 items-center">
                            <div className="rounded-lg col-span-1 flex items-center justify-center">
                                <img
                                    src={profile.phoneIcon}
                                    alt="Phone icon"
                                    className="p-2 h-10 w-10 "
                                />
                            </div>
                            <div className="text-white col-span-4">
                                <h2 className="text-[12px] font-black">Call Us</h2>
                                <p className="text-[11px] font-semibold break-all">+8801838600619</p>
                            </div>
                        </div>
                    </a>
                    <a href="https://maps.app.goo.gl/gNuBTVRF4E49yr7d7" target="_blank"
                        rel="noopener noreferrer">
                        <div className="bg-[#3a8881]/60 border border-[#a8e2dd] hover:shadow-xl transition duration-300 hover:-translate-y-1 ease-in-out rounded-lg grid grid-cols-5 gap-1 p-1 h-20 items-center">
                            <div className="rounded-lg col-span-1 flex items-center justify-center">
                                <img
                                    src="/footer-location-icon.png"
                                    alt="location icon"
                                    className="px-1 h-8 w-8 "
                                />
                            </div>
                            <div className="text-white col-span-4">
                                <h2 className="text-[12px] font-black">Visit Us</h2>
                                <p className="text-[11px] font-semibold break-all">26, Nayapaltan, Dhaka-1000</p>
                            </div>
                        </div>
                    </a>
                </div>
                <div className="bg-[#a8e2dd] h-0.5 max-w-full w-12/12 mx-auto mb-4"></div>
                <div className="flex items-center gap-4">
                    <h6 className="">Social:</h6>

                    <a>
                        <img
                            src="/footer-facebook-icon.png" alt="face icon"
                            className="h-9 w-9" />
                    </a>
                    <a>
                        <img
                            src="/footer-whatsapp-icon.png" alt="whatsapp icon" className="h-11 w-11" />
                    </a>
                    <a>
                        <img
                            src="/x-icon.png"
                            alt="x-icon"
                            className="h-8 w-8" />
                    </a>
                </div>
                <div className="mt-4 flex flex-col md:flex-row gap-1 md:gap-4 items-center justify-center">
                    <p className="text-[10px] text-center">© 2024 All Rights Reserved by Zabir Arkam</p>
                    <div className="flex gap-2 items-center">
                        <p className="text-[10px] text-center">Developed & Marketed By</p>
                        <a href=""><button className="font-semibold hover:border-b-3 hover:cursor-pointer border p-1 rounded-lg text-xs">Proo IT</button></a>
                    </div>
                </div>
            </div>
            <div className="h-20 md:h-0"></div>
        </footer>
    );
};

export default Footer;