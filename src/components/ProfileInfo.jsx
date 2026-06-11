import useProfileData from "../hooks/useProfileData";
import {forwardRef } from "react";

const TintedAsset = ({ src, label, className = "h-8 w-8", color = "var(--theme-icon-color)" }) => {
  if (!src) return null;

  return (
    <span
      role="img"
      aria-label={label}
      className={`inline-block shrink-0 ${className}`}
      style={{
        backgroundColor: color,
        WebkitMask: `url(${src}) center / contain no-repeat`,
        mask: `url(${src}) center / contain no-repeat`,
      }}
    />
  );
};

const ProfileInfo = forwardRef((props, ref) => {
  const { profile, loading } = useProfileData();

  if (loading) return <p>Loading...</p>;
  if (!profile) return <p>Profile not found</p>;

  return (
    <div className="pt-10 max-w-2xl mx-auto ">
      {/* company info */}
      <div className="mx-auto pt-10">
        <TintedAsset
          src={profile.logo}
          label="Company Logo"
          className="mx-auto h-24 w-40"
          color="var(--theme-logo-color)"
        />
      </div>

      {/* Profile info */}
      <div className="text-gray-800">
        <div className="max-w-3/8 mx-auto rounded-2xl bg-[#e3e3e1]">
          <img
            src={profile.profileImage}
            alt="Profile"
            className="mx-auto mt-10"
          />
        </div>
        <div>
          <h1 className="text-center mt-8 font-bold text-3xl md:text-4xl text-gray-800">
            {profile.name}
          </h1>
          <h3 className="text-center mt-2 text-lg">{profile.title}</h3>
          <p className="text-justify mt-8">{profile.description}</p>
        </div>
      </div>

      {/* Contacts info */}
      <section ref={ref} className="my-4">
        <div className="mx-auto my-4 flex gap-6 flex-wrap justify-center">
          {/* Fixed links */}
          <a href={profile.emailLink} className="hover:animate-bounce">
            <TintedAsset src={profile.emailIcon} label="Email" />
          </a>
          <a href={profile.phoneLink} className="hover:animate-bounce">
            <TintedAsset src={profile.phoneIcon} label="Phone" />
          </a>
          <a href={profile.websiteLink} className="hover:animate-bounce">
            <TintedAsset src={profile.websiteIcon} label="Website" />
          </a>
          <a href={profile.facebookLink} className="hover:animate-bounce">
            <TintedAsset src={profile.facebookIcon} label="Facebook" />
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
              <TintedAsset src={link.icon} label={`Custom Link ${index + 1}`} />
            </a>
          ))}
        </div>

        <div className="pb-4">
          <a
            href={profile.vcfDownloadLink}
            download={profile.vcfDownloadFileName}
          >
            <button className="w-full btn rounded-xl shadow-none">
              + Save contact
            </button>
          </a>
        </div>
      </section>
    </div>
  );
});

export default ProfileInfo;
