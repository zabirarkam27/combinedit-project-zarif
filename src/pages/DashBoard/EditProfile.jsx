import { useState, useEffect, useCallback, useMemo } from "react";
import useProfileData from "../../hooks/useProfileData";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useImageUpload from "../../hooks/useImageUpload";
import { updateProfile } from "../../services/profile";
import SocialLinksManager from "../../components/SocialLinksManager";
import debounce from "lodash/debounce";


const EditProfile = () => {
  const { profile, loading } = useProfileData();
  const { uploadImage } = useImageUpload();

  // initialize once when profile loads
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    if (profile) {
      setFormData(profile);
    }
  }, [profile]);

  // Toggle handler
  const handleToggle = (e) => {
    const value = e.target.checked;
    setFormData((prev) => ({ ...prev, showProfileSection: value }));
  };

  // debounced change handler (typing এ কম render হবে)
  const handleChange = useCallback(
    debounce((name, value) => {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }, 300),
    []
  );

  const handleImageUpload = async (e, fieldName) => {
    const file = e.target.files[0];
    if (!file) return;

    const imageUrl = await uploadImage(file);
    if (imageUrl) {
      setFormData((prev) => ({ ...prev, [fieldName]: imageUrl }));
    }
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const res = await updateProfile(formData); 
    if (res.data.modifiedCount > 0 || res.data.acknowledged) {
      toast.success("Profile updated successfully!");
    } else {
      toast.info("No changes detected.");
    }
  } catch (err) {
    toast.error("Failed to update profile.");
    console.error(err);
  }
};

  if (loading || !formData) {
    return (
      <div className="p-6 text-center">
        {/* Skeleton Loader */}
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-300 rounded w-1/3 mx-auto"></div>
          <div className="h-40 bg-gray-200 rounded"></div>
          <div className="h-6 bg-gray-300 rounded w-1/2 mx-auto"></div>
        </div>
      </div>
    );
  }

  const textFields = [
    "name",
    "title",
    "vcfDownloadFileName",
    "vcfDownloadLink",
  ];
  const contactFields = ["email", "phone", "website", "facebook"];

  return (
    <div className="bg-[#d8e2e2] min-h-screen p-6 mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <h2 className="text-2xl font-bold">Edit Profile</h2>
        {/* Controlled toggle: */}
        <input
          type="checkbox"
          aria-label="Show profile section on home"
          checked={!!formData?.showProfileSection}
          onChange={handleToggle}
          className="toggle"
        />

      </div>
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        {/* Logo & Profile Image */}
        {["logo", "profileImage"].map((field) => (
          <div
            key={field}
            className="form-control flex flex-col items-center md:items-start"
          >
            <label className="label capitalize">
              <span className="label-text">
                {field.replace(/([A-Z])/g, " $1")}
              </span>
            </label>
            {formData[field] && (
              <img
                src={formData[field]}
                alt={field}
                className="w-32 h-32 object-contain mb-2"
              />
            )}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageUpload(e, field)}
              className="input w-full bg-[#ebf0f0] border border-gray-300"
            />
          </div>
        ))}

        {/* Text Fields */}
        {textFields.map((field) => (
          <div key={field} className="form-control">
            <label className="label capitalize">
              <span className="label-text">
                {field.replace(/([A-Z])/g, " $1")}
              </span>
            </label>
            <input
              type="text"
              name={field}
              defaultValue={formData[field] || ""}
              onChange={(e) => handleChange(field, e.target.value)}
              className="input w-full border border-gray-300 bg-[#ebf0f0]"
            />
          </div>
        ))}

        {/* Description */}
        <div className="form-control md:col-span-2">
          <label className="label capitalize">
            <span className="label-text">Description</span>
          </label>
          <textarea
            name="description"
            defaultValue={formData.description || ""}
            onChange={(e) => handleChange("description", e.target.value)}
            rows={4}
            className="textarea w-full bg-[#ebf0f0] border border-gray-300"
          />
        </div>
        {/* Address */}
        <div className="form-control md:col-span-2">
          <label className="label capitalize">
            <span className="label-text">Address</span>
          </label>
          <textarea
            name="address"
            defaultValue={formData.address || ""}
            onChange={(e) => handleChange("address", e.target.value)}
            rows={4}
            className="textarea w-full bg-[#ebf0f0] border border-gray-300"
          />
        </div>

        {/* Contact & Social Links */}
        {contactFields.map((item) => {
          const iconField = `${item}Icon`;
          const linkField = `${item}Link`;
          return (
            <div
              key={item}
              className="form-control md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4 items-center"
            >
              <div className="col-span-1 flex flex-col items-center">
                {formData[iconField] && (
                  <img
                    src={formData[iconField]}
                    alt={item}
                    className="w-16 h-16 object-contain mb-2"
                  />
                )}
              </div>
              <div className="col-span-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, iconField)}
                  className="input w-full bg-[#ebf0f0] border border-gray-300 mb-1"
                />
                <input
                  type="text"
                  defaultValue={formData[linkField] || ""}
                  onChange={(e) => handleChange(linkField, e.target.value)}
                  placeholder={`Enter ${item} link`}
                  className="input w-full bg-[#ebf0f0] border border-gray-300"
                />
              </div>
            </div>
          );
        })}

        {/* Custom Social Links Manager */}
        <SocialLinksManager
          socialLinks={formData.socialLinks?.custom || []}
          onChange={(newLinks) =>
            setFormData((prev) => ({
              ...prev,
              socialLinks: { ...prev.socialLinks, custom: newLinks },
            }))
          }
        />

        {/* Submit Button */}
        <div className="col-span-full md:mt-6 text-center">
          <button
            type="submit"
            className={`btn text-white font-semibold px-4 py-3 rounded-b-xl bg-gradient-to-r from-[#00ad9c] via-[#3a8881] to-[#009e8e] bg-[length:200%_200%] transition-all duration-500 ease-in-out hover:bg-right mx-auto w-full`}
          >
            Update Profile
          </button>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
};

export default EditProfile;
