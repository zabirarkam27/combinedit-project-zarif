import useProfileData from "../hooks/useProfileData";
import {forwardRef } from "react";

const ProfileInfo = forwardRef((props, ref) => {
  const { profile, loading } = useProfileData();

  if (loading) return <p>Loading...</p>;
  if (!profile) return <p>Profile not found</p>;

  return (
    <div className="pt-10 max-w-2xl mx-auto">
      {/* company info */}
      <div className="mx-auto pt-10">
        <img src={profile.logo} alt="Company Logo" className="w-1/3 mx-auto" />
      </div>

      {/* Profile info */}
      <div>
        <div className="max-w-3/8 mx-auto rounded-2xl bg-[#e3e3e1]">
          <img
            src={profile.profileImage}
            alt="Profile"
            className="mx-auto mt-10"
          />
        </div>
        <h1 className="text-center mt-8 font-semibold text-3xl md:text-4xl text-white">
          {profile.name}
        </h1>
        <h3 className="text-center mt-2 text-lg text-white">{profile.title}</h3>
        <p className="text-white text-justify mt-8">{profile.description}</p>
      </div>

      {/* Contacts info */}
      <section ref={ref} className="text-white my-4">
        <div className="text-white mx-auto my-4 flex gap-6 flex-wrap justify-center">
          {/* Fixed links */}
          <a href={profile.emailLink} className="hover:animate-bounce">
            <img src={profile.emailIcon} alt="Email" className="w-8 h-8" />
          </a>
          <a href={profile.phoneLink} className="hover:animate-bounce">
            <img src={profile.phoneIcon} alt="Phone" className="w-8 h-8" />
          </a>
          <a href={profile.websiteLink} className="hover:animate-bounce">
            <img src={profile.websiteIcon} alt="Website" className="w-8 h-8" />
          </a>
          <a href={profile.facebookLink} className="hover:animate-bounce">
            <img
              src={profile.facebookIcon}
              alt="Facebook"
              className="w-8 h-8"
            />
          </a>

          {/* Custom links */}
          {profile.socialLinks?.custom?.map((link, index) => (
            <a
              key={index}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:animate-bounce"
            >
              <img
                src={link.icon}
                alt={`Custom Link ${index + 1}`}
                className="w-8 h-8"
              />
            </a>
          ))}
        </div>

        <div className="pb-4">
          <a
            href={profile.vcfDownloadLink}
            download={profile.vcfDownloadFileName}
          >
            <button className="w-full btn rounded-xl">+ Save contact</button>
          </a>
        </div>
      </section>
    </div>
  );
});

export default ProfileInfo;
