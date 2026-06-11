import { useState, useEffect, useCallback, useMemo } from "react";
import useProfileData from "../../hooks/useProfileData";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useImageUpload from "../../hooks/useImageUpload";
import { updateProfile } from "../../services/profile";
import SocialLinksManager from "../../components/SocialLinksManager";
import debounce from "lodash/debounce";
import {
  applyThemeColors,
  defaultThemeColors,
  normalizeThemeColors,
} from "../../utils/theme";


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

  const themeColors = useMemo(
    () => normalizeThemeColors(formData?.themeColors),
    [formData?.themeColors]
  );

  useEffect(() => {
    if (formData?.themeColors) {
      applyThemeColors(themeColors);
    }
  }, [formData?.themeColors, themeColors]);

  const colorControls = useMemo(
    () => [
      {
        group: "Theme Palette",
        items: [
          {
            key: "primary",
            label: "Primary",
            helper: "Buttons, active routes, highlights",
          },
          {
            key: "secondary",
            label: "Secondary",
            helper: "Gradient and supporting actions",
          },
          {
            key: "accent",
            label: "Accent",
            helper: "Hover and emphasis color",
          },
        ],
      },
      {
        group: "Brand Assets",
        items: [
          {
            key: "logo",
            label: "Logo",
            helper: "Navbar and profile logo tint",
          },
          {
            key: "icon",
            label: "Profile Icons",
            helper: "Email, phone, website, social icons",
          },
          {
            key: "cartIcon",
            label: "Cart Icon",
            helper: "Desktop and mobile cart icon",
          },
        ],
      },
    ],
    []
  );

  const handleThemeColorChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      themeColors: {
        ...normalizeThemeColors(prev?.themeColors),
        [name]: value,
      },
    }));
  };

  const syncBrandColorsWithTheme = () => {
    setFormData((prev) => {
      const colors = normalizeThemeColors(prev?.themeColors);
      return {
        ...prev,
        themeColors: {
          ...colors,
          logo: colors.primary,
          icon: colors.secondary,
          cartIcon: colors.primary,
        },
      };
    });
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
    <div className="theme-dashboard-bg min-h-screen p-6 mx-auto">
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
        <section className="md:col-span-2 rounded-2xl border border-[var(--theme-border-color)] bg-white p-5 shadow-[0_14px_34px_rgba(15,23,42,0.06)]">
          <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="text-lg font-extrabold text-[var(--theme-text)]">
                Brand & Theme Colors
              </h3>
              <p className="text-sm text-[var(--theme-muted-text)]">
                Tune the shop palette, logo tint, profile icons, and cart icon from one place.
              </p>
            </div>
            <button
              type="button"
              onClick={syncBrandColorsWithTheme}
              className="w-fit rounded-lg border border-[var(--theme-primary)] px-4 py-2 text-sm font-bold text-[var(--theme-primary)] transition hover:bg-[var(--theme-primary)] hover:text-white"
            >
              Match Theme
            </button>
          </div>

          <div className="mb-5 grid gap-4 rounded-xl border border-slate-200 bg-slate-50/80 p-4 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="flex flex-wrap items-center gap-3">
              {["primary", "secondary", "accent", "logo", "icon", "cartIcon"].map(
                (key) => (
                  <div key={key} className="flex items-center gap-2 rounded-lg bg-white px-3 py-2 shadow-sm">
                    <span
                      className="h-5 w-5 rounded-full border border-slate-200"
                      style={{ backgroundColor: themeColors[key] }}
                    />
                    <span className="text-xs font-bold uppercase text-slate-600">
                      {key}
                    </span>
                  </div>
                )
              )}
            </div>
            <div className="flex items-center justify-start gap-5 rounded-xl bg-white px-4 py-3 shadow-sm lg:justify-end">
              {formData.logo && (
                <span
                  aria-label="Logo color preview"
                  className="h-14 w-24"
                  style={{
                    backgroundColor: themeColors.logo,
                    WebkitMask: `url(${formData.logo}) center / contain no-repeat`,
                    mask: `url(${formData.logo}) center / contain no-repeat`,
                  }}
                />
              )}
              <span className="h-9 w-9 rounded-full bg-[var(--theme-icon-color)]" />
              <span className="h-9 w-9 rounded-full bg-[var(--theme-cart-icon-color)]" />
            </div>
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            {colorControls.map(({ group, items }) => (
              <div key={group} className="rounded-xl border border-slate-200 p-4">
                <h4 className="mb-4 text-sm font-extrabold uppercase text-slate-500">
                  {group}
                </h4>
                <div className="grid gap-3">
                  {items.map(({ key, label, helper }) => (
                    <label
                      key={key}
                      className="grid gap-2 rounded-lg bg-slate-50 p-3 sm:grid-cols-[130px_1fr] sm:items-center"
                    >
                      <span>
                        <span className="block text-sm font-bold text-slate-900">
                          {label}
                        </span>
                        <span className="block text-xs font-medium text-slate-500">
                          {helper}
                        </span>
                      </span>
                      <span className="flex min-w-0 items-center gap-3">
                        <input
                          type="color"
                          value={themeColors[key] || defaultThemeColors[key]}
                          onChange={(e) =>
                            handleThemeColorChange(key, e.target.value)
                          }
                          className="h-10 w-12 shrink-0 cursor-pointer rounded-lg border border-slate-200 bg-white p-1"
                        />
                        <input
                          type="text"
                          value={themeColors[key] || defaultThemeColors[key]}
                          onChange={(e) =>
                            handleThemeColorChange(key, e.target.value)
                          }
                          className="input min-w-0 flex-1 border border-slate-200 bg-white text-sm font-semibold"
                        />
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

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
              <div className="mb-3 flex flex-col items-center gap-2">
                <img
                  src={formData[field]}
                  alt={field}
                  className="w-32 h-32 object-contain"
                />
                {field === "logo" && (
                  <div
                    aria-label="Logo color preview"
                    className="h-16 w-28"
                    style={{
                      backgroundColor: themeColors.logo,
                      WebkitMask: `url(${formData[field]}) center / contain no-repeat`,
                      mask: `url(${formData[field]}) center / contain no-repeat`,
                    }}
                  />
                )}
              </div>
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
                  <div className="mb-2 flex items-center gap-3">
                    <img
                      src={formData[iconField]}
                      alt={item}
                      className="h-14 w-14 object-contain"
                    />
                    <div
                      aria-label={`${item} icon color preview`}
                      className="h-12 w-12"
                      style={{
                        backgroundColor: themeColors.icon,
                        WebkitMask: `url(${formData[iconField]}) center / contain no-repeat`,
                        mask: `url(${formData[iconField]}) center / contain no-repeat`,
                      }}
                    />
                  </div>
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
            className="btn text-white font-semibold px-4 py-3 rounded-b-xl theme-gradient theme-gradient-hover mx-auto w-full"
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
