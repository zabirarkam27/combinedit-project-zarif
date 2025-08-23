import { useState, useEffect } from "react";
import useProfileData from "../../hooks/useProfileData";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useImageUpload from "../../hooks/useImageUpload";
import { updateProfile } from "../../services/profile";
import SocialLinksManager from "../../components/SocialLinksManager";
import design from "../../styles/design";

const EditProfile = () => {
  const { profile, loading } = useProfileData();
  const [formData, setFormData] = useState(null);
  const { uploadImage } = useImageUpload();

  useEffect(() => {
    if (profile) setFormData(profile);
  }, [profile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e, fieldName) => {
    const imageFile = e.target.files[0];
    if (!imageFile) return;

    const imageUrl = await uploadImage(imageFile);
    if (imageUrl) setFormData((prev) => ({ ...prev, [fieldName]: imageUrl }));
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
    } catch (error) {
      toast.error("Failed to update profile.");
      console.error(error);
    }
  };

  if (loading || !formData) return <p className="text-center">Loading...</p>;

  const imageFields = ["logo", "profileImage"];

  return (
    <div className="max-w-3xl mx-auto p-6 rounded-xl shadow-md mt-6 bg-[#e6e6d7]">
      <h2 className="text-3xl font-bold text-center mb-6">Edit Profile</h2>

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
              className="input w-full bg-[#f7f7e7] border border-gray-300 focus:border-[#c0c08c] focus:ring focus:ring-[#c0c08c] focus:ring-opacity-30"
            />
          </div>
        ))}

        {/* Text Fields */}
        {["name", "title", "vcfDownloadFileName", "vcfDownloadLink"].map(
          (field) => (
            <div key={field} className="form-control">
              <label className="label capitalize">
                <span className="label-text">
                  {field.replace(/([A-Z])/g, " $1")}
                </span>
              </label>
              <input
                type="text"
                name={field}
                value={formData[field] || ""}
                onChange={handleChange}
                className="input w-full bg-[#f7f7e7] border border-gray-300 focus:border-[#c0c08c] focus:ring focus:ring-[#c0c08c] focus:ring-opacity-30"
              />
            </div>
          )
        )}

        {/* Description */}
        <div className="form-control md:col-span-2">
          <label className="label capitalize">
            <span className="label-text">Description</span>
          </label>
          <textarea
            name="description"
            value={formData.description || ""}
            onChange={handleChange}
            rows={4}
            className="textarea w-full bg-[#f7f7e7] border border-gray-300 focus:border-[#c0c08c] focus:ring focus:ring-[#c0c08c] focus:ring-opacity-30 rounded-md p-2"
          />
        </div>

        {/* Contact & Social Links: Icon + Link */}
        {["email", "phone", "website", "facebook"].map((item) => {
          const iconField = `${item}Icon`;
          const linkField = `${item}Link`;
          return (
            <div
              key={item}
              className="form-control md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4 items-center"
            >
              {/* Icon Preview */}
              <div className="col-span-1 flex flex-col items-center">
                {formData[iconField] && (
                  <img
                    src={formData[iconField]}
                    alt={item}
                    className="w-16 h-16 object-contain mb-2"
                  />
                )}
              </div>

              {/* Link & Image Input */}
              <div className="col-span-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, iconField)}
                  className="input w-full bg-[#f7f7e7] border border-gray-300 focus:border-[#c0c08c] focus:ring focus:ring-[#c0c08c] focus:ring-opacity-30"
                />
                <input
                  type="text"
                  name={linkField}
                  value={formData[linkField] || ""}
                  onChange={handleChange}
                  placeholder={`Enter ${item} link`}
                  className="input w-full bg-[#f7f7e7] border border-gray-300 focus:border-[#c0c08c] focus:ring focus:ring-[#c0c08c] focus:ring-opacity-30"
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
        <div className="col-span-full mt-6 text-center">
          <button type="submit" className={`${design.buttons} mx-auto max-w-full w-xl`}>
            Update Profile
          </button>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
};

export default EditProfile;
