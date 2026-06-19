import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import useProfileData from "../../hooks/useProfileData";
import { updateProfile } from "../../services/profile";
import { getProducts } from "../../services/products";
import {
  applyLandingTheme,
  applyThemeColors,
  defaultLandingTheme,
  defaultThemeColors,
  normalizeLandingTheme,
  normalizeThemeColors,
} from "../../utils/theme";

const themeFields = [
  { key: "primary", label: "Primary" },
  { key: "secondary", label: "Secondary" },
  { key: "accent", label: "Accent" },
  { key: "pageBg", label: "Website Background" },
  { key: "dashboardBg", label: "Dashboard Background" },
  { key: "text", label: "Heading Text" },
];

const landingColorFields = [
  { key: "pageBg", label: "Page Background" },
  { key: "contentBg", label: "Content Background" },
  { key: "sectionBg", label: "Order Section Background" },
  { key: "cardBg", label: "Card Background" },
  { key: "border", label: "Border" },
  { key: "text", label: "Text" },
  { key: "mutedText", label: "Muted Text" },
  { key: "noticeBg", label: "Notice Bar" },
  { key: "buttonPrimary", label: "Button Primary" },
  { key: "buttonSecondary", label: "Button Secondary" },
  { key: "buttonAccent", label: "Button Accent" },
];

const landingDesignFields = [
  { key: "maxWidth", label: "Page Width", min: 720, max: 1280, step: 20 },
  { key: "radius", label: "Corner Radius", min: 0, max: 28, step: 1 },
];

const getPxValue = (value) => Number.parseInt(value, 10) || 0;

const Settings = () => {
  const { profile, loading } = useProfileData();
  const [themeColors, setThemeColors] = useState(defaultThemeColors);
  const [landingTheme, setLandingTheme] = useState(defaultLandingTheme);
  const [products, setProducts] = useState([]);
  const [bannerSettings, setBannerSettings] = useState({
    limit: 3,
    productIds: [],
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setThemeColors(normalizeThemeColors(profile.themeColors));
      setLandingTheme(normalizeLandingTheme(profile.landingTheme));
      setBannerSettings({
        limit: Number(profile.bannerSettings?.limit) || 3,
        productIds: Array.isArray(profile.bannerSettings?.productIds)
          ? profile.bannerSettings.productIds
          : [],
      });
    }
  }, [profile]);

  useEffect(() => {
    getProducts()
      .then((res) => setProducts(Array.isArray(res.data) ? res.data : []))
      .catch((error) => {
        console.error("Failed to load banner products:", error);
        setProducts([]);
      });
  }, []);

  useEffect(() => {
    applyThemeColors(themeColors);
  }, [themeColors]);

  useEffect(() => {
    applyLandingTheme(landingTheme);
  }, [landingTheme]);

  const handleColorChange = (name, value) => {
    setThemeColors((prev) => ({
      ...normalizeThemeColors(prev),
      [name]: value,
    }));
  };

  const handleReset = () => {
    setThemeColors(defaultThemeColors);
  };

  const handleLandingColorChange = (name, value) => {
    setLandingTheme((prev) => ({
      ...normalizeLandingTheme(prev),
      [name]: value,
    }));
  };

  const handleLandingDesignChange = (name, value) => {
    setLandingTheme((prev) => ({
      ...normalizeLandingTheme(prev),
      [name]: `${value}px`,
    }));
  };

  const handleLandingReset = () => {
    setLandingTheme(defaultLandingTheme);
  };

  const toggleBannerProduct = (id) => {
    setBannerSettings((prev) => {
      const productIds = prev.productIds.includes(id)
        ? prev.productIds.filter((productId) => productId !== id)
        : [...prev.productIds, id];

      return { ...prev, productIds };
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);

    try {
      const payload = {
        ...(profile || {}),
        themeColors: normalizeThemeColors(themeColors),
        landingTheme: normalizeLandingTheme(landingTheme),
        bannerSettings: {
          limit: Math.max(1, Math.min(10, Number(bannerSettings.limit) || 3)),
          productIds: bannerSettings.productIds,
        },
      };
      const res = await updateProfile(payload);

      if (res.data.modifiedCount > 0 || res.data.acknowledged) {
        toast.success("Theme settings updated successfully!");
      } else {
        toast.info("No changes detected.");
      }
    } catch (error) {
      toast.error("Failed to update theme settings.");
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="theme-dashboard-bg min-h-screen p-3 sm:p-4 md:p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-300 rounded w-48" />
          <div className="h-60 bg-white/70 rounded-lg" />
        </div>
      </div>
    );
  }

  const normalizedTheme = normalizeThemeColors(themeColors);
  const normalizedLandingTheme = normalizeLandingTheme(landingTheme);

  return (
    <div className="theme-dashboard-bg min-h-screen overflow-x-hidden p-3 sm:p-4 md:p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold theme-text">Settings</h2>
        <p className="text-sm text-gray-600">
          Manage website theme colors from one place.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="rounded-lg bg-white/75 border border-gray-200 p-4 shadow-sm"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
          <div>
            <h3 className="text-lg font-bold theme-text">Theme Colors</h3>
            <p className="text-sm text-gray-600">
              These colors apply to the public site, dashboard nav, buttons, and
              key backgrounds.
            </p>
          </div>
          <button
            type="button"
            onClick={handleReset}
            className="btn btn-sm w-full border-0 text-white theme-gradient theme-gradient-hover sm:w-auto"
          >
            Reset Default
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {themeFields.map((field) => (
            <label key={field.key} className="form-control">
              <span className="label-text mb-1">{field.label}</span>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={normalizedTheme[field.key]}
                  onChange={(event) =>
                    handleColorChange(field.key, event.target.value)
                  }
                  className="h-10 w-12 rounded border border-gray-300 bg-white p-1"
                  aria-label={`${field.label} color`}
                />
                <input
                  type="text"
                  value={normalizedTheme[field.key]}
                  onChange={(event) =>
                    handleColorChange(field.key, event.target.value)
                  }
                  pattern="^#[0-9a-fA-F]{6}$"
                  className="input input-sm w-full bg-[#ebf0f0] border border-gray-300 uppercase"
                />
              </div>
            </label>
          ))}
        </div>

        <div className="mt-4 rounded-lg overflow-hidden border border-gray-200">
          <div className="theme-gradient h-12" />
          <div className="theme-page-bg p-4">
            <p className="theme-text font-semibold">Live theme preview</p>
            <button
              type="button"
              className="mt-3 btn btn-sm border-0 text-white theme-gradient theme-gradient-hover"
            >
              Button Preview
            </button>
          </div>
        </div>

        <div className="mt-6 border-t border-gray-200 pt-6">
          <div className="mb-6 rounded-lg border border-gray-200 bg-white/80 p-4">
            <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <h3 className="text-lg font-bold theme-text">Homepage Banner Images</h3>
                <p className="text-sm text-gray-600">
                  Select which product images appear in the homepage banner and how many slides to show.
                </p>
              </div>
              <label className="form-control w-full md:w-44">
                <span className="label-text mb-1">Image count</span>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={bannerSettings.limit}
                  onChange={(event) =>
                    setBannerSettings((prev) => ({
                      ...prev,
                      limit: event.target.value,
                    }))
                  }
                  className="input input-bordered bg-white"
                />
              </label>
            </div>

            <div className="grid max-h-[420px] grid-cols-1 gap-3 overflow-y-auto pr-1 sm:grid-cols-2 lg:grid-cols-3">
              {products
                .filter((product) => product.active !== false)
                .map((product) => {
                  const id = product._id || product.id;
                  const image = Array.isArray(product.images)
                    ? product.images.find(Boolean)
                    : product.thumbnail || product.image || product.images;
                  const selected = bannerSettings.productIds.includes(id);

                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => toggleBannerProduct(id)}
                      className={`overflow-hidden rounded-xl border text-left transition ${
                        selected
                          ? "border-[var(--theme-primary)] ring-2 ring-[var(--theme-primary)]"
                          : "border-gray-200 hover:border-[var(--theme-primary)]"
                      }`}
                    >
                      <div className="aspect-video bg-gray-100">
                        <img
                          src={image || "/nav-icon/logo.png"}
                          alt={product.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="p-3">
                        <p className="line-clamp-1 font-bold theme-text">{product.name}</p>
                        <p className="text-xs text-gray-500">
                          {selected ? "Selected for banner" : "Click to select"}
                        </p>
                      </div>
                    </button>
                  );
                })}
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
            <div>
              <h3 className="text-lg font-bold theme-text">
                Landing Page Theme & Design
              </h3>
              <p className="text-sm text-gray-600">
                Control landing page colors, button style, width, and corner
                radius separately from the main website theme.
              </p>
            </div>
            <button
              type="button"
              onClick={handleLandingReset}
              className="btn btn-sm w-full border-0 text-white landing-gradient landing-gradient-hover sm:w-auto"
            >
              Reset Landing
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {landingColorFields.map((field) => (
              <label key={field.key} className="form-control">
                <span className="label-text mb-1">{field.label}</span>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={normalizedLandingTheme[field.key]}
                    onChange={(event) =>
                      handleLandingColorChange(field.key, event.target.value)
                    }
                    className="h-10 w-12 rounded border border-gray-300 bg-white p-1"
                    aria-label={`${field.label} landing color`}
                  />
                  <input
                    type="text"
                    value={normalizedLandingTheme[field.key]}
                    onChange={(event) =>
                      handleLandingColorChange(field.key, event.target.value)
                    }
                    pattern="^#[0-9a-fA-F]{6}$"
                    className="input input-sm w-full bg-[#ebf0f0] border border-gray-300 uppercase"
                  />
                </div>
              </label>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
            {landingDesignFields.map((field) => (
              <label key={field.key} className="form-control">
                <span className="label-text mb-1">
                  {field.label}: {normalizedLandingTheme[field.key]}
                </span>
                <input
                  type="range"
                  min={field.min}
                  max={field.max}
                  step={field.step}
                  value={getPxValue(normalizedLandingTheme[field.key])}
                  onChange={(event) =>
                    handleLandingDesignChange(field.key, event.target.value)
                  }
                  className="range range-sm"
                />
              </label>
            ))}
          </div>

          <div className="landing-page-bg mt-5 rounded-lg border landing-border p-4">
            <div className="landing-content-bg landing-max-width landing-radius mx-auto p-4">
              <h4 className="landing-text font-bold">Landing page preview</h4>
              <p className="landing-muted-text text-sm">
                Background, content area, text, borders, and button design use
                the landing page variables.
              </p>
              <div className="landing-section-bg border landing-border landing-radius mt-3 p-3">
                <button
                  type="button"
                  className="btn btn-sm border-0 text-white landing-gradient landing-gradient-hover"
                >
                  Order Button
                </button>
                <div className="landing-notice-bg landing-radius mt-3 px-3 py-2 text-sm text-white">
                  Notice bar preview
                </div>
              </div>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="btn mt-5 w-full border-0 text-white theme-gradient theme-gradient-hover"
        >
          {saving ? "Saving..." : "Save Settings"}
        </button>
      </form>

      <ToastContainer />
    </div>
  );
};

export default Settings;
