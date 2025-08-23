import { useState, useEffect } from "react";
import { getProfile } from "../services/profile";

const useProfileData = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProfile()
      .then((res) => {
        setProfile(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch profile:", err);
        setLoading(false);
      });
  }, []);

  return { profile, loading };
};

export default useProfileData;
