import { createContext, useEffect, useState, useContext } from "react";

const ProfileSectionContext = createContext();

const getInitial = () => {
  try {
    if (typeof window === "undefined") return true;
    const stored = localStorage.getItem("showProfileSection");
    return stored !== null ? JSON.parse(stored) : true;
  } catch (err) {
    return true;
  }
};

export const ProfileSectionProvider = ({ children }) => {
  const [showProfileSection, setShowProfileSection] = useState(getInitial);

  // Persist to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem("showProfileSection", JSON.stringify(showProfileSection));
    } catch (err) {
      console.warn("Could not write showProfileSection to localStorage", err);
    }
  }, [showProfileSection]);

  return (
    <ProfileSectionContext.Provider value={{ showProfileSection, setShowProfileSection }}>
      {children}
    </ProfileSectionContext.Provider>
  );
};

export const useProfileSection = () => useContext(ProfileSectionContext);
export default ProfileSectionContext;