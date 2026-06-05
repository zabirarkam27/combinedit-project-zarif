import { createContext, useContext, useState, useEffect } from "react";
import useProfileData from "../hooks/useProfileData";
import { applyLandingTheme, applyThemeColors } from "../utils/theme";

const ProfileSectionContext = createContext({
  showProfileSection: true,
  setShowProfileSection: () => {},
});

export const ProfileSectionProvider = ({ children }) => {
  const { profile, loading } = useProfileData();
  const [showProfileSection, setShowProfileSection] = useState(true);

  // backend থেকে মান এলে Context এ বসাও
  useEffect(() => {
    if (profile && typeof profile.showProfileSection === "boolean") {
      setShowProfileSection(profile.showProfileSection);
    }

    if (profile) {
      applyThemeColors(profile.themeColors);
      applyLandingTheme(profile.landingTheme);
    }
  }, [profile]);

  return (
    <ProfileSectionContext.Provider value={{ showProfileSection, setShowProfileSection }}>
      {!loading && children}
    </ProfileSectionContext.Provider>
  );
};

export const useProfileSection = () => useContext(ProfileSectionContext);
export default ProfileSectionContext;
