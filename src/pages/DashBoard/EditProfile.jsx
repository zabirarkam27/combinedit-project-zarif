import { useEffect, useMemo, useState } from "react";
import {
  AtSign,
  BadgeCheck,
  Camera,
  Eye,
  EyeOff,
  Facebook,
  FileDown,
  Globe,
  ImagePlus,
  Link as LinkIcon,
  Mail,
  MapPin,
  Palette,
  Phone,
  Save,
  Sparkles,
  Upload,
  UserRound,
} from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import SocialLinksManager from "../../components/SocialLinksManager";
import useImageUpload from "../../hooks/useImageUpload";
import useProfileData from "../../hooks/useProfileData";
import { updateProfile } from "../../services/profile";
import {
  applyThemeColors,
  defaultThemeColors,
  normalizeThemeColors,
} from "../../utils/theme";

const inputClass =
  "h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 text-sm font-semibold text-slate-700 outline-none transition focus:border-[var(--theme-primary)] focus:bg-white focus:ring-2 focus:ring-[var(--theme-muted-bg)]";
const textareaClass =
  "w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm font-semibold leading-6 text-slate-700 outline-none transition focus:border-[var(--theme-primary)] focus:bg-white focus:ring-2 focus:ring-[var(--theme-muted-bg)]";
const labelClass = "text-xs font-black uppercase tracking-wide text-slate-500";
const cardClass =
  "rounded-[28px] border border-white/70 bg-white p-5 shadow-[0_18px_45px_rgba(15,23,42,0.07)]";

const textFields = [
  { key: "name", label: "Business name", icon: UserRound },
  { key: "title", label: "Tagline / title", icon: BadgeCheck },
  { key: "vcfDownloadFileName", label: "VCF file name", icon: FileDown },
  { key: "vcfDownloadLink", label: "VCF download link", icon: LinkIcon },
];

const contactFields = [
  { key: "email", label: "Email", icon: Mail },
  { key: "phone", label: "Phone", icon: Phone },
  { key: "website", label: "Website", icon: Globe },
  { key: "facebook", label: "Facebook", icon: Facebook },
];

const colorControls = [
  {
    group: "Theme Palette",
    items: [
      { key: "primary", label: "Primary", helper: "Buttons, active routes, highlights" },
      { key: "secondary", label: "Secondary", helper: "Gradient and supporting actions" },
      { key: "accent", label: "Accent", helper: "Hover and emphasis color" },
    ],
  },
  {
    group: "Brand Assets",
    items: [
      { key: "logo", label: "Logo", helper: "Navbar and profile logo tint" },
      { key: "icon", label: "Profile Icons", helper: "Email, phone, website, social icons" },
      { key: "cartIcon", label: "Cart Icon", helper: "Desktop and mobile cart icon" },
    ],
  },
];

const EditProfile = () => {
  const { profile, loading } = useProfileData();
  const { uploadImage } = useImageUpload();

  const [formData, setFormData] = useState(null);
  const [saving, setSaving] = useState(false);
  const [uploadingField, setUploadingField] = useState("");

  useEffect(() => {
    if (profile) setFormData(profile);
  }, [profile]);

  const themeColors = useMemo(
    () => normalizeThemeColors(formData?.themeColors),
    [formData?.themeColors]
  );

  useEffect(() => {
    if (formData?.themeColors) applyThemeColors(themeColors);
  }, [formData?.themeColors, themeColors]);

  const handleFieldChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (event, fieldName) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadingField(fieldName);
    try {
      const imageUrl = await uploadImage(file);
      if (imageUrl) {
        setFormData((prev) => ({ ...prev, [fieldName]: imageUrl }));
        toast.success("Image uploaded successfully.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Image upload failed.");
    } finally {
      setUploadingField("");
      event.target.value = "";
    }
  };

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

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (saving) return;

    setSaving(true);
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
    } finally {
      setSaving(false);
    }
  };

  if (loading || !formData) {
    return (
      <div className="grid min-h-screen place-items-center theme-dashboard-bg px-4">
        <div className="w-full max-w-4xl animate-pulse rounded-[28px] bg-white p-6 shadow-[0_18px_45px_rgba(15,23,42,0.08)]">
          <div className="h-6 w-44 rounded bg-slate-200" />
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            <div className="h-48 rounded-3xl bg-slate-100" />
            <div className="h-48 rounded-3xl bg-slate-100 md:col-span-2" />
          </div>
        </div>
      </div>
    );
  }

  const profileVisible = !!formData?.showProfileSection;

  return (
    <div className="min-h-screen w-full overflow-x-hidden theme-dashboard-bg px-2 py-4 md:px-4">
      <div className="mx-auto w-full max-w-7xl space-y-5">
        <section className="overflow-hidden rounded-[28px] border border-white/70 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
          <div className="grid gap-5 p-5 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-center">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full bg-[var(--theme-muted-bg)] px-3 py-1 text-xs font-black uppercase tracking-wide text-[var(--theme-primary)]">
                <Sparkles size={14} />
                Business profile
              </p>
              <h1 className="mt-3 text-2xl font-black tracking-tight text-slate-950 md:text-4xl">
                Edit Your Profile
              </h1>
              <p className="mt-2 max-w-2xl text-sm font-medium leading-6 text-slate-500">
                Manage brand identity, contact links, theme colors, and the profile section customers see on the storefront.
              </p>
            </div>

            <div className="rounded-3xl bg-slate-950 p-4 text-white">
              <div className="flex items-center gap-3">
                <div className="grid h-14 w-14 place-items-center overflow-hidden rounded-2xl bg-white/10">
                  {formData.logo ? (
                    <span
                      className="h-10 w-10"
                      style={{
                        backgroundColor: themeColors.logo,
                        WebkitMask: `url(${formData.logo}) center / contain no-repeat`,
                        mask: `url(${formData.logo}) center / contain no-repeat`,
                      }}
                    />
                  ) : (
                    <UserRound size={24} />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-lg font-black">{formData.name || "Your business"}</p>
                  <p className="truncate text-sm font-semibold text-white/60">{formData.title || "Profile title"}</p>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2">
                {["primary", "secondary", "accent"].map((key) => (
                  <div key={key} className="rounded-2xl bg-white/10 p-3">
                    <span className="block text-[10px] font-black uppercase text-white/50">{key}</span>
                    <span className="mt-2 block h-6 rounded-full" style={{ backgroundColor: themeColors[key] }} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <form onSubmit={handleSubmit} className="space-y-5">
          <section className={cardClass}>
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex items-start gap-3">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-[var(--theme-muted-bg)] text-[var(--theme-primary)]">
                  {profileVisible ? <Eye size={20} /> : <EyeOff size={20} />}
                </span>
                <div>
                  <h2 className="text-xl font-black text-slate-950">Storefront visibility</h2>
                  <p className="mt-1 text-sm font-medium leading-6 text-slate-500">
                    Control whether the profile section appears on the home page.
                  </p>
                </div>
              </div>
              <label className="inline-flex cursor-pointer items-center justify-between gap-4 rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
                <span className="text-sm font-black text-slate-700">
                  {profileVisible ? "Visible on home" : "Hidden from home"}
                </span>
                <input
                  type="checkbox"
                  aria-label="Show profile section on home"
                  checked={profileVisible}
                  onChange={(event) =>
                    setFormData((prev) => ({ ...prev, showProfileSection: event.target.checked }))
                  }
                  className="toggle checked:bg-[var(--theme-primary)]"
                />
              </label>
            </div>
          </section>

          <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_390px]">
            <div className="space-y-5">
              <section className={cardClass}>
                <div className="mb-5 flex items-center gap-3">
                  <span className="grid h-11 w-11 place-items-center rounded-2xl bg-blue-50 text-blue-700">
                    <UserRound size={20} />
                  </span>
                  <div>
                    <p className="text-xs font-black uppercase tracking-wide text-[var(--theme-primary)]">
                      Identity
                    </p>
                    <h2 className="text-xl font-black text-slate-950">Business information</h2>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  {textFields.map(({ key, label, icon: Icon }) => (
                    <label key={key} className="block">
                      <span className={labelClass}>{label}</span>
                      <span className="relative mt-2 block">
                        <Icon
                          size={17}
                          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                        />
                        <input
                          type="text"
                          value={formData[key] || ""}
                          onChange={(event) => handleFieldChange(key, event.target.value)}
                          className={`${inputClass} pl-10`}
                        />
                      </span>
                    </label>
                  ))}
                </div>

                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <label className="block md:col-span-2">
                    <span className={labelClass}>Description</span>
                    <textarea
                      value={formData.description || ""}
                      onChange={(event) => handleFieldChange("description", event.target.value)}
                      rows={5}
                      className={`${textareaClass} mt-2`}
                    />
                  </label>

                  <label className="block md:col-span-2">
                    <span className={labelClass}>Address</span>
                    <span className="relative mt-2 block">
                      <MapPin
                        size={18}
                        className="pointer-events-none absolute left-3 top-4 text-slate-400"
                      />
                      <textarea
                        value={formData.address || ""}
                        onChange={(event) => handleFieldChange("address", event.target.value)}
                        rows={4}
                        className={`${textareaClass} pl-10`}
                      />
                    </span>
                  </label>
                </div>
              </section>

              <section className={cardClass}>
                <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div className="flex items-center gap-3">
                    <span className="grid h-11 w-11 place-items-center rounded-2xl bg-violet-50 text-violet-700">
                      <Palette size={20} />
                    </span>
                    <div>
                      <p className="text-xs font-black uppercase tracking-wide text-[var(--theme-primary)]">
                        Theme
                      </p>
                      <h2 className="text-xl font-black text-slate-950">Brand and asset colors</h2>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={syncBrandColorsWithTheme}
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-[var(--theme-primary)] px-4 text-sm font-black text-[var(--theme-primary)] transition hover:bg-[var(--theme-primary)] hover:text-white"
                  >
                    <Sparkles size={16} />
                    Match Theme
                  </button>
                </div>

                <div className="mb-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {["primary", "secondary", "accent", "logo", "icon", "cartIcon"].map((key) => (
                    <div key={key} className="rounded-2xl border border-slate-100 bg-slate-50 p-3">
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-xs font-black uppercase text-slate-500">{key}</span>
                        <span
                          className="h-7 w-7 rounded-full border border-black/10 shadow-sm"
                          style={{ backgroundColor: themeColors[key] }}
                        />
                      </div>
                      <p className="mt-2 truncate text-sm font-black text-slate-900">
                        {themeColors[key]}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="grid gap-5 lg:grid-cols-2">
                  {colorControls.map(({ group, items }) => (
                    <div key={group} className="rounded-3xl border border-slate-100 bg-slate-50 p-4">
                      <h3 className="mb-4 text-sm font-black uppercase tracking-wide text-slate-500">
                        {group}
                      </h3>
                      <div className="grid gap-3">
                        {items.map(({ key, label, helper }) => (
                          <label key={key} className="rounded-2xl bg-white p-3">
                            <span className="flex items-start justify-between gap-3">
                              <span>
                                <span className="block text-sm font-black text-slate-900">
                                  {label}
                                </span>
                                <span className="mt-1 block text-xs font-semibold leading-5 text-slate-500">
                                  {helper}
                                </span>
                              </span>
                              <input
                                type="color"
                                value={themeColors[key] || defaultThemeColors[key]}
                                onChange={(event) => handleThemeColorChange(key, event.target.value)}
                                className="h-10 w-12 shrink-0 cursor-pointer rounded-xl border border-slate-200 bg-white p-1"
                              />
                            </span>
                            <input
                              type="text"
                              value={themeColors[key] || defaultThemeColors[key]}
                              onChange={(event) => handleThemeColorChange(key, event.target.value)}
                              className={`${inputClass} mt-3 uppercase`}
                            />
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            <aside className="space-y-5">
              <section className={cardClass}>
                <div className="mb-5 flex items-center gap-3">
                  <span className="grid h-11 w-11 place-items-center rounded-2xl bg-emerald-50 text-emerald-700">
                    <ImagePlus size={20} />
                  </span>
                  <div>
                    <p className="text-xs font-black uppercase tracking-wide text-[var(--theme-primary)]">
                      Media
                    </p>
                    <h2 className="text-xl font-black text-slate-950">Logo and profile image</h2>
                  </div>
                </div>

                <div className="grid gap-4">
                  {[
                    { key: "logo", label: "Logo", fit: "object-contain" },
                    { key: "profileImage", label: "Profile image", fit: "object-cover" },
                  ].map(({ key, label, fit }) => (
                    <div key={key} className="rounded-3xl border border-slate-100 bg-slate-50 p-4">
                      <div className="flex items-center gap-4">
                        <div className="grid h-24 w-24 shrink-0 place-items-center overflow-hidden rounded-3xl bg-white">
                          {formData[key] ? (
                            <img src={formData[key]} alt={label} className={`h-full w-full ${fit} p-2`} />
                          ) : (
                            <Camera size={26} className="text-slate-300" />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-black text-slate-950">{label}</p>
                          <p className="mt-1 text-xs font-semibold leading-5 text-slate-500">
                            Upload a clear, high contrast asset for storefront and navbar use.
                          </p>
                          <label className="mt-3 inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-2xl bg-slate-950 px-4 text-xs font-black text-white transition hover:bg-slate-800">
                            <Upload size={15} />
                            {uploadingField === key ? "Uploading..." : "Upload"}
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(event) => handleImageUpload(event, key)}
                              className="hidden"
                            />
                          </label>
                        </div>
                      </div>
                      {key === "logo" && formData.logo && (
                        <div className="mt-4 rounded-2xl bg-white p-3">
                          <p className="mb-2 text-xs font-black uppercase text-slate-500">
                            Logo color preview
                          </p>
                          <span
                            className="block h-12 w-28"
                            style={{
                              backgroundColor: themeColors.logo,
                              WebkitMask: `url(${formData.logo}) center / contain no-repeat`,
                              mask: `url(${formData.logo}) center / contain no-repeat`,
                            }}
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>

              <section className={cardClass}>
                <div className="mb-5 flex items-center gap-3">
                  <span className="grid h-11 w-11 place-items-center rounded-2xl bg-amber-50 text-amber-700">
                    <AtSign size={20} />
                  </span>
                  <div>
                    <p className="text-xs font-black uppercase tracking-wide text-[var(--theme-primary)]">
                      Contact
                    </p>
                    <h2 className="text-xl font-black text-slate-950">Channels and icons</h2>
                  </div>
                </div>

                <div className="grid gap-3">
                  {contactFields.map(({ key, label, icon: Icon }) => {
                    const iconField = `${key}Icon`;
                    const linkField = `${key}Link`;

                    return (
                      <div key={key} className="rounded-3xl border border-slate-100 bg-slate-50 p-4">
                        <div className="mb-3 flex items-center gap-3">
                          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-white text-[var(--theme-primary)]">
                            <Icon size={18} />
                          </span>
                          <div>
                            <p className="font-black text-slate-950">{label}</p>
                            <p className="text-xs font-semibold text-slate-500">Icon and destination URL</p>
                          </div>
                        </div>

                        <div className="grid gap-3 sm:grid-cols-[74px_1fr]">
                          <div className="grid h-[74px] place-items-center rounded-2xl bg-white">
                            {formData[iconField] ? (
                              <span
                                className="h-10 w-10"
                                style={{
                                  backgroundColor: themeColors.icon,
                                  WebkitMask: `url(${formData[iconField]}) center / contain no-repeat`,
                                  mask: `url(${formData[iconField]}) center / contain no-repeat`,
                                }}
                              />
                            ) : (
                              <Icon size={24} className="text-slate-300" />
                            )}
                          </div>
                          <div className="min-w-0 space-y-2">
                            <label className="inline-flex h-10 w-full cursor-pointer items-center justify-center gap-2 rounded-2xl bg-white px-3 text-xs font-black text-slate-700 ring-1 ring-slate-200 transition hover:ring-[var(--theme-primary)]">
                              <Upload size={15} />
                              {uploadingField === iconField ? "Uploading..." : "Upload icon"}
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(event) => handleImageUpload(event, iconField)}
                                className="hidden"
                              />
                            </label>
                            <input
                              type="text"
                              value={formData[linkField] || ""}
                              onChange={(event) => handleFieldChange(linkField, event.target.value)}
                              placeholder={`Enter ${label.toLowerCase()} link`}
                              className={inputClass}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            </aside>
          </div>

          <section className={cardClass}>
            <SocialLinksManager
              socialLinks={formData.socialLinks?.custom || []}
              onChange={(newLinks) =>
                setFormData((prev) => ({
                  ...prev,
                  socialLinks: { ...prev.socialLinks, custom: newLinks },
                }))
              }
            />
          </section>

          <section className="sticky bottom-4 z-10 rounded-[28px] border border-white/70 bg-white/95 p-4 shadow-[0_18px_45px_rgba(15,23,42,0.14)] backdrop-blur">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="font-black text-slate-950">Save profile changes</p>
                <p className="text-xs font-semibold text-slate-500">
                  Updates apply to storefront branding, profile information, and contact actions.
                </p>
              </div>
              <button
                type="submit"
                disabled={saving || Boolean(uploadingField)}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-[var(--theme-primary)] px-5 text-sm font-black text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Save size={18} />
                {saving ? "Updating..." : uploadingField ? "Uploading..." : "Update Profile"}
              </button>
            </div>
          </section>
        </form>
      </div>

      <ToastContainer />
    </div>
  );
};

export default EditProfile;
