import { useEffect, useMemo, useState } from "react";
import {
  BadgeCheck,
  CheckCircle2,
  GalleryHorizontalEnd,
  ImagePlus,
  Layers3,
  Loader2,
  MonitorSmartphone,
  Palette,
  RefreshCcw,
  Save,
  Settings2,
  SlidersHorizontal,
  Sparkles,
} from "lucide-react";
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
  { key: "primary", label: "Primary", helper: "Buttons and active states" },
  { key: "secondary", label: "Secondary", helper: "Gradient support" },
  { key: "accent", label: "Accent", helper: "Hover and emphasis" },
  { key: "pageBg", label: "Website Background", helper: "Public pages" },
  { key: "dashboardBg", label: "Dashboard Background", helper: "Admin workspace" },
  { key: "text", label: "Heading Text", helper: "Primary text color" },
];

const landingColorFields = [
  { key: "pageBg", label: "Page Background" },
  { key: "contentBg", label: "Content Background" },
  { key: "sectionBg", label: "Order Section" },
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
const inputClass =
  "h-11 w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 text-sm font-semibold text-slate-700 outline-none transition focus:border-[var(--theme-primary)] focus:bg-white focus:ring-2 focus:ring-[var(--theme-muted-bg)]";
const cardClass =
  "rounded-[28px] border border-white/70 bg-white p-5 shadow-[0_18px_45px_rgba(15,23,42,0.07)]";

const ColorControl = ({ field, value, onChange }) => (
  <label className="rounded-3xl border border-slate-100 bg-slate-50 p-4">
    <span className="flex items-start justify-between gap-3">
      <span className="min-w-0">
        <span className="block text-sm font-black text-slate-950">{field.label}</span>
        {field.helper && (
          <span className="mt-1 block text-xs font-semibold leading-5 text-slate-500">
            {field.helper}
          </span>
        )}
      </span>
      <input
        type="color"
        value={value}
        onChange={(event) => onChange(field.key, event.target.value)}
        className="h-10 w-12 shrink-0 cursor-pointer rounded-xl border border-slate-200 bg-white p-1"
        aria-label={`${field.label} color`}
      />
    </span>
    <input
      type="text"
      value={value}
      onChange={(event) => onChange(field.key, event.target.value)}
      pattern="^#[0-9a-fA-F]{6}$"
      className={`${inputClass} mt-3 uppercase`}
    />
  </label>
);

const Settings = () => {
  const { profile, loading } = useProfileData();
  const [themeColors, setThemeColors] = useState(defaultThemeColors);
  const [landingTheme, setLandingTheme] = useState(defaultLandingTheme);
  const [products, setProducts] = useState([]);
  const [bannerSettings, setBannerSettings] = useState({ limit: 3, productIds: [] });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!profile) return;
    setThemeColors(normalizeThemeColors(profile.themeColors));
    setLandingTheme(normalizeLandingTheme(profile.landingTheme));
    setBannerSettings({
      limit: Number(profile.bannerSettings?.limit) || 3,
      productIds: Array.isArray(profile.bannerSettings?.productIds)
        ? profile.bannerSettings.productIds
        : [],
    });
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

  const normalizedTheme = useMemo(() => normalizeThemeColors(themeColors), [themeColors]);
  const normalizedLandingTheme = useMemo(
    () => normalizeLandingTheme(landingTheme),
    [landingTheme]
  );

  const activeProducts = useMemo(
    () => products.filter((product) => product.active !== false),
    [products]
  );

  const selectedBannerProducts = useMemo(
    () =>
      activeProducts.filter((product) =>
        bannerSettings.productIds.includes(product._id || product.id)
      ),
    [activeProducts, bannerSettings.productIds]
  );

  const handleColorChange = (name, value) => {
    setThemeColors((prev) => ({ ...normalizeThemeColors(prev), [name]: value }));
  };

  const handleLandingColorChange = (name, value) => {
    setLandingTheme((prev) => ({ ...normalizeLandingTheme(prev), [name]: value }));
  };

  const handleLandingDesignChange = (name, value) => {
    setLandingTheme((prev) => ({ ...normalizeLandingTheme(prev), [name]: `${value}px` }));
  };

  const toggleBannerProduct = (id) => {
    setBannerSettings((prev) => ({
      ...prev,
      productIds: prev.productIds.includes(id)
        ? prev.productIds.filter((productId) => productId !== id)
        : [...prev.productIds, id],
    }));
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
        toast.success("Settings updated successfully!");
      } else {
        toast.info("No changes detected.");
      }
    } catch (error) {
      toast.error("Failed to update settings.");
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
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

  return (
    <div className="min-h-screen w-full overflow-x-hidden theme-dashboard-bg px-2 py-4 md:px-4">
      <div className="mx-auto w-full max-w-7xl space-y-5">
        <section className="overflow-hidden rounded-[28px] border border-white/70 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
          <div className="grid gap-5 p-5 lg:grid-cols-[minmax(0,1fr)_430px] lg:items-center">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full bg-[var(--theme-muted-bg)] px-3 py-1 text-xs font-black uppercase tracking-wide text-[var(--theme-primary)]">
                <Settings2 size={14} />
                Design system
              </p>
              <h1 className="mt-3 text-2xl font-black tracking-tight text-slate-950 md:text-4xl">
                Settings
              </h1>
              <p className="mt-2 max-w-3xl text-sm font-medium leading-6 text-slate-500 md:text-base">
                Tune storefront colors, landing page styling, and homepage banner products from one polished workspace.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Theme Colors", value: themeFields.length, icon: Palette },
                { label: "Landing Controls", value: landingColorFields.length + landingDesignFields.length, icon: SlidersHorizontal },
                { label: "Banner Items", value: selectedBannerProducts.length, icon: GalleryHorizontalEnd },
                { label: "Max Slides", value: bannerSettings.limit, icon: ImagePlus },
              ].map(({ label, value, icon: Icon }) => (
                <div key={label} className="rounded-2xl bg-slate-50 p-3">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-[11px] font-black uppercase text-slate-500">{label}</p>
                    <Icon size={16} className="text-[var(--theme-primary)]" />
                  </div>
                  <p className="mt-2 text-xl font-black text-slate-950">{value}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <form onSubmit={handleSubmit} className="space-y-5">
          <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_380px]">
            <div className={cardClass}>
              <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-3">
                  <span className="grid h-11 w-11 place-items-center rounded-2xl bg-violet-50 text-violet-700">
                    <Palette size={20} />
                  </span>
                  <div>
                    <p className="text-xs font-black uppercase tracking-wide text-[var(--theme-primary)]">
                      Main theme
                    </p>
                    <h2 className="text-xl font-black text-slate-950">Website and dashboard colors</h2>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setThemeColors(defaultThemeColors)}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-[var(--theme-primary)] px-4 text-sm font-black text-[var(--theme-primary)] transition hover:bg-[var(--theme-primary)] hover:text-white"
                >
                  <RefreshCcw size={16} />
                  Reset Default
                </button>
              </div>

              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {themeFields.map((field) => (
                  <ColorControl
                    key={field.key}
                    field={field}
                    value={normalizedTheme[field.key]}
                    onChange={handleColorChange}
                  />
                ))}
              </div>
            </div>

            <aside className="space-y-5">
              <div className={cardClass}>
                <div className="mb-4 flex items-center gap-3">
                  <span className="grid h-11 w-11 place-items-center rounded-2xl bg-[var(--theme-muted-bg)] text-[var(--theme-primary)]">
                    <MonitorSmartphone size={20} />
                  </span>
                  <div>
                    <p className="text-xs font-black uppercase tracking-wide text-[var(--theme-primary)]">
                      Live preview
                    </p>
                    <h2 className="text-xl font-black text-slate-950">Brand sample</h2>
                  </div>
                </div>
                <div className="overflow-hidden rounded-3xl border border-slate-100">
                  <div className="theme-gradient h-16" />
                  <div className="theme-page-bg p-4">
                    <p className="theme-text font-black">Live theme preview</p>
                    <p className="mt-1 text-sm font-semibold text-slate-500">
                      Buttons, dashboard, and public pages use these values.
                    </p>
                    <button
                      type="button"
                      className="mt-4 rounded-2xl px-4 py-2 text-sm font-black text-white theme-gradient theme-gradient-hover"
                    >
                      Button Preview
                    </button>
                  </div>
                </div>
              </div>

              <div className={cardClass}>
                <div className="flex items-start gap-3">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-emerald-50 text-emerald-700">
                    <BadgeCheck size={20} />
                  </span>
                  <div>
                    <h2 className="text-xl font-black text-slate-950">Design status</h2>
                    <p className="mt-1 text-sm font-medium leading-6 text-slate-500">
                      Changes preview instantly and save to profile settings when you submit.
                    </p>
                  </div>
                </div>
              </div>
            </aside>
          </section>

          <section className={cardClass}>
            <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-2xl bg-blue-50 text-blue-700">
                  <GalleryHorizontalEnd size={20} />
                </span>
                <div>
                  <p className="text-xs font-black uppercase tracking-wide text-[var(--theme-primary)]">
                    Homepage banner
                  </p>
                  <h2 className="text-xl font-black text-slate-950">Banner product images</h2>
                  <p className="mt-1 text-sm font-medium leading-6 text-slate-500">
                    Choose the product images that appear in the homepage hero banner.
                  </p>
                </div>
              </div>
              <label className="block w-full md:w-44">
                <span className="text-xs font-black uppercase tracking-wide text-slate-500">Image count</span>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={bannerSettings.limit}
                  onChange={(event) =>
                    setBannerSettings((prev) => ({ ...prev, limit: event.target.value }))
                  }
                  className={`${inputClass} mt-2 bg-white`}
                />
              </label>
            </div>

            <div className="grid max-h-[520px] gap-3 overflow-y-auto pr-1 sm:grid-cols-2 xl:grid-cols-3">
              {activeProducts.map((product) => {
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
                    className={`overflow-hidden rounded-3xl border bg-white text-left transition hover:-translate-y-0.5 ${
                      selected
                        ? "border-[var(--theme-primary)] ring-2 ring-[var(--theme-primary)]/25"
                        : "border-slate-100 hover:border-[var(--theme-primary)]"
                    }`}
                  >
                    <div className="relative aspect-video bg-slate-100">
                      <img
                        src={image || "/nav-icon/logo.png"}
                        alt={product.name}
                        className="h-full w-full object-cover"
                      />
                      {selected && (
                        <span className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-[var(--theme-primary)] text-white shadow-lg">
                          <CheckCircle2 size={17} />
                        </span>
                      )}
                    </div>
                    <div className="p-4">
                      <p className="line-clamp-1 font-black text-slate-950">{product.name}</p>
                      <p className="mt-1 text-xs font-semibold text-slate-500">
                        {selected ? "Selected for banner" : "Click to select"}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_380px]">
            <div className={cardClass}>
              <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-3">
                  <span className="grid h-11 w-11 place-items-center rounded-2xl bg-amber-50 text-amber-700">
                    <Layers3 size={20} />
                  </span>
                  <div>
                    <p className="text-xs font-black uppercase tracking-wide text-[var(--theme-primary)]">
                      Landing pages
                    </p>
                    <h2 className="text-xl font-black text-slate-950">Landing theme and layout</h2>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setLandingTheme(defaultLandingTheme)}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-[var(--theme-primary)] px-4 text-sm font-black text-[var(--theme-primary)] transition hover:bg-[var(--theme-primary)] hover:text-white"
                >
                  <RefreshCcw size={16} />
                  Reset Landing
                </button>
              </div>

              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {landingColorFields.map((field) => (
                  <ColorControl
                    key={field.key}
                    field={field}
                    value={normalizedLandingTheme[field.key]}
                    onChange={handleLandingColorChange}
                  />
                ))}
              </div>

              <div className="mt-5 grid gap-4 md:grid-cols-2">
                {landingDesignFields.map((field) => (
                  <label key={field.key} className="rounded-3xl border border-slate-100 bg-slate-50 p-4">
                    <span className="flex items-center justify-between gap-3">
                      <span className="text-sm font-black text-slate-950">{field.label}</span>
                      <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-[var(--theme-primary)]">
                        {normalizedLandingTheme[field.key]}
                      </span>
                    </span>
                    <input
                      type="range"
                      min={field.min}
                      max={field.max}
                      step={field.step}
                      value={getPxValue(normalizedLandingTheme[field.key])}
                      onChange={(event) => handleLandingDesignChange(field.key, event.target.value)}
                      className="range range-sm mt-4"
                    />
                  </label>
                ))}
              </div>
            </div>

            <aside className={cardClass}>
              <div className="mb-4 flex items-center gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-2xl bg-[var(--theme-muted-bg)] text-[var(--theme-primary)]">
                  <Sparkles size={20} />
                </span>
                <div>
                  <p className="text-xs font-black uppercase tracking-wide text-[var(--theme-primary)]">
                    Preview
                  </p>
                  <h2 className="text-xl font-black text-slate-950">Landing sample</h2>
                </div>
              </div>
              <div className="landing-page-bg rounded-3xl border landing-border p-4">
                <div className="landing-content-bg landing-radius mx-auto p-4">
                  <h3 className="landing-text font-black">Landing page preview</h3>
                  <p className="landing-muted-text mt-1 text-sm font-semibold leading-6">
                    Background, content, text, borders, and buttons use the landing variables.
                  </p>
                  <div className="landing-section-bg border landing-border landing-radius mt-4 p-3">
                    <button
                      type="button"
                      className="rounded-2xl px-4 py-2 text-sm font-black text-white landing-gradient landing-gradient-hover"
                    >
                      Order Button
                    </button>
                    <div className="landing-notice-bg landing-radius mt-3 px-3 py-2 text-sm font-bold text-white">
                      Notice bar preview
                    </div>
                  </div>
                </div>
              </div>
            </aside>
          </section>

          <section className="sticky bottom-4 z-10 rounded-[28px] border border-white/70 bg-white/95 p-4 shadow-[0_18px_45px_rgba(15,23,42,0.14)] backdrop-blur">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="font-black text-slate-950">Save design settings</p>
                <p className="text-xs font-semibold text-slate-500">
                  Saves theme colors, landing design, and homepage banner configuration.
                </p>
              </div>
              <button
                type="submit"
                disabled={saving}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-[var(--theme-primary)] px-5 text-sm font-black text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                {saving ? "Saving..." : "Save Settings"}
              </button>
            </div>
          </section>
        </form>
      </div>

      <ToastContainer />
    </div>
  );
};

export default Settings;
