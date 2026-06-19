import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  BadgeCheck,
  BarChart3,
  CheckCircle2,
  Clipboard,
  Code2,
  Facebook,
  Info,
  Loader2,
  Megaphone,
  Save,
  Search,
  Settings2,
  Share2,
  Sparkles,
  Tag,
  ToggleLeft,
  ToggleRight,
  Video,
  Zap,
} from "lucide-react";
import { toast } from "react-toastify";

import {
  fetchMarketingSettings,
  updateMarketingSettings,
} from "../../services/marketing";
import { initMarketingTool } from "../../analytics/marketingTools";

const inputClass =
  "h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 text-sm font-semibold text-slate-700 outline-none transition focus:border-[var(--theme-primary)] focus:bg-white focus:ring-2 focus:ring-[var(--theme-muted-bg)]";

const toolsConfig = [
  {
    key: "gaMeasurementId",
    enabledKey: "gaMeasurementEnabled",
    name: "Google Analytics",
    shortName: "GA4",
    placeholder: "G-XXXXXXXXXX",
    icon: BarChart3,
    tone: "bg-blue-50 text-blue-700",
    regex: /^G-[A-Z0-9-]{6,}$/i,
    guide: "Google Analytics > Admin > Data streams > Web stream > Measurement ID.",
    event: "Tracks storefront page views with GA4 gtag.",
  },
  {
    key: "gtmId",
    enabledKey: "gtmEnabled",
    name: "Google Tag Manager",
    shortName: "GTM",
    placeholder: "GTM-XXXXXXX",
    icon: Code2,
    tone: "bg-indigo-50 text-indigo-700",
    regex: /^GTM-[A-Z0-9]+$/i,
    guide: "Google Tag Manager > Admin > Container ID.",
    event: "Loads GTM container and pushes SPA page_view events.",
  },
  {
    key: "metaPixelId",
    enabledKey: "metaPixelEnabled",
    name: "Meta Pixel",
    shortName: "Meta",
    placeholder: "123456789012345",
    icon: Facebook,
    tone: "bg-sky-50 text-sky-700",
    regex: /^\d{5,30}$/,
    guide: "Meta Business Suite > Events Manager > Data sources > Pixel ID.",
    event: "Loads fbevents.js and sends PageView events.",
  },
  {
    key: "tiktokPixelId",
    enabledKey: "tiktokPixelEnabled",
    name: "TikTok Pixel",
    shortName: "TikTok",
    placeholder: "CXXXXXXXXXXXXXXXXXXX",
    icon: Video,
    tone: "bg-slate-100 text-slate-800",
    regex: /^[A-Z0-9]{8,40}$/i,
    guide: "TikTok Ads Manager > Assets > Events > Web Events > Pixel ID.",
    event: "Loads TikTok Events SDK and sends page events.",
  },
  {
    key: "twitterPixelId",
    enabledKey: "twitterPixelEnabled",
    name: "X / Twitter Pixel",
    shortName: "X Pixel",
    placeholder: "o1234",
    icon: Share2,
    tone: "bg-zinc-100 text-zinc-800",
    regex: /^[a-z0-9_-]{3,40}$/i,
    guide: "X Ads > Tools > Events manager > Universal website tag ID.",
    event: "Loads X universal website tag and tracks PageView.",
  },
  {
    key: "snapPixelId",
    enabledKey: "snapPixelEnabled",
    name: "Snapchat Pixel",
    shortName: "Snap",
    placeholder: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
    icon: Zap,
    tone: "bg-amber-50 text-amber-700",
    regex: /^[a-z0-9-]{8,60}$/i,
    guide: "Snapchat Ads > Events Manager > Pixel details > Pixel ID.",
    event: "Loads Snap Pixel and sends PAGE_VIEW events.",
  },
];

const normalizeSettings = (data = {}) =>
  toolsConfig.reduce((acc, tool) => {
    const id = data[tool.key] || "";
    acc[tool.key] = id;
    acc[tool.enabledKey] = data[tool.enabledKey] ?? Boolean(id);
    return acc;
  }, {});

const getToolValidation = (tool, id) => {
  const value = String(id || "").trim();
  if (!value) return { valid: false, message: "Tracking ID is required before enabling." };
  if (!tool.regex.test(value)) {
    return { valid: false, message: `Expected format: ${tool.placeholder}` };
  }
  return { valid: true, message: "Ready to connect." };
};

const MarketingTools = () => {
  const [settings, setSettings] = useState(() => normalizeSettings());
  const [loading, setLoading] = useState(true);
  const [savingKey, setSavingKey] = useState("");
  const [testingKey, setTestingKey] = useState("");
  const [openKey, setOpenKey] = useState(toolsConfig[0].key);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        setLoading(true);
        const data = await fetchMarketingSettings();
        setSettings(normalizeSettings(data || {}));
      } catch (err) {
        console.error("Failed to load marketing settings:", err);
        toast.error("Failed to load marketing settings.");
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, []);

  const stats = useMemo(() => {
    const configured = toolsConfig.filter((tool) => settings[tool.key]).length;
    const enabled = toolsConfig.filter(
      (tool) => settings[tool.key] && settings[tool.enabledKey]
    ).length;
    const invalid = toolsConfig.filter((tool) => {
      const id = settings[tool.key];
      return id && !getToolValidation(tool, id).valid;
    }).length;

    return { configured, enabled, invalid, total: toolsConfig.length };
  }, [settings]);

  const updateToolValue = (tool, value) => {
    setSettings((prev) => ({
      ...prev,
      [tool.key]: value,
      [tool.enabledKey]: value.trim() ? prev[tool.enabledKey] : false,
    }));
  };

  const toggleTool = (tool) => {
    const nextEnabled = !settings[tool.enabledKey];
    const validation = getToolValidation(tool, settings[tool.key]);

    if (nextEnabled && !validation.valid) {
      toast.error(validation.message);
      setOpenKey(tool.key);
      return;
    }

    setSettings((prev) => ({
      ...prev,
      [tool.enabledKey]: nextEnabled,
    }));
  };

  const saveTool = async (tool) => {
    const id = String(settings[tool.key] || "").trim();
    const enabled = Boolean(settings[tool.enabledKey]);
    const validation = getToolValidation(tool, id);

    if ((enabled || id) && !validation.valid) {
      toast.error(validation.message);
      setOpenKey(tool.key);
      return;
    }

    setSavingKey(tool.key);
    try {
      await updateMarketingSettings({
        [tool.key]: id,
        [tool.enabledKey]: enabled && validation.valid,
      });
      setSettings((prev) => ({
        ...prev,
        [tool.key]: id,
        [tool.enabledKey]: enabled && validation.valid,
      }));
      toast.success(`${tool.name} saved.`);
    } catch (err) {
      console.error(`Failed to save ${tool.name}:`, err);
      toast.error(`Failed to save ${tool.name}.`);
    } finally {
      setSavingKey("");
    }
  };

  const saveAll = async () => {
    const invalidTool = toolsConfig.find((tool) => {
      const id = settings[tool.key];
      return (id || settings[tool.enabledKey]) && !getToolValidation(tool, id).valid;
    });

    if (invalidTool) {
      setOpenKey(invalidTool.key);
      toast.error(`${invalidTool.name}: ${getToolValidation(invalidTool, settings[invalidTool.key]).message}`);
      return;
    }

    setSavingKey("all");
    try {
      const payload = toolsConfig.reduce((acc, tool) => {
        const id = String(settings[tool.key] || "").trim();
        acc[tool.key] = id;
        acc[tool.enabledKey] = Boolean(id && settings[tool.enabledKey]);
        return acc;
      }, {});
      await updateMarketingSettings(payload);
      setSettings((prev) => ({ ...prev, ...payload }));
      toast.success("Marketing tools saved.");
    } catch (err) {
      console.error("Failed to save marketing tools:", err);
      toast.error("Failed to save marketing tools.");
    } finally {
      setSavingKey("");
    }
  };

  const testTool = async (tool) => {
    const id = String(settings[tool.key] || "").trim();
    const validation = getToolValidation(tool, id);
    if (!validation.valid) {
      toast.error(validation.message);
      setOpenKey(tool.key);
      return;
    }

    setTestingKey(tool.key);
    try {
      const loaded = initMarketingTool(tool.key, id);
      if (loaded) toast.success(`${tool.name} script loaded for this browser session.`);
      else toast.info(`${tool.name} is ready, but no script was loaded.`);
    } catch (err) {
      console.error(`Failed to test ${tool.name}:`, err);
      toast.error(`Failed to load ${tool.name} script.`);
    } finally {
      setTestingKey("");
    }
  };

  const copyId = async (tool) => {
    const id = String(settings[tool.key] || "").trim();
    if (!id) {
      toast.info("No ID to copy.");
      return;
    }

    try {
      await navigator.clipboard.writeText(id);
      toast.success(`${tool.shortName} ID copied.`);
    } catch {
      toast.error("Clipboard is not available.");
    }
  };

  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center theme-dashboard-bg px-4">
        <div className="rounded-3xl bg-white p-8 text-center shadow-[0_18px_45px_rgba(15,23,42,0.08)]">
          <Loader2 className="mx-auto animate-spin text-[var(--theme-primary)]" size={30} />
          <p className="mt-4 font-black text-slate-800">Loading marketing tools...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full overflow-x-hidden theme-dashboard-bg px-2 py-4 md:px-4">
      <div className="mx-auto w-full max-w-7xl space-y-5">
        <section className="overflow-hidden rounded-[28px] border border-white/70 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
          <div className="grid gap-5 p-5 lg:grid-cols-[minmax(0,1fr)_440px] lg:items-center">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full bg-[var(--theme-muted-bg)] px-3 py-1 text-xs font-black uppercase tracking-wide text-[var(--theme-primary)]">
                <Megaphone size={14} />
                Marketing operations
              </p>
              <h1 className="mt-3 text-2xl font-black tracking-tight text-slate-950 md:text-4xl">
                Marketing Tools
              </h1>
              <p className="mt-2 max-w-3xl text-sm font-medium leading-6 text-slate-500 md:text-base">
                Connect analytics, pixels, and campaign tags from one workspace. Enabled tools load automatically on the storefront and track SPA page views.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Configured", value: `${stats.configured}/${stats.total}`, icon: Settings2 },
                { label: "Enabled", value: stats.enabled, icon: Activity },
                { label: "Needs Fix", value: stats.invalid, icon: Info },
                { label: "Events", value: "PageView", icon: BadgeCheck },
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

        <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
          <div className="grid gap-4 lg:grid-cols-2">
            {toolsConfig.map((tool) => {
              const Icon = tool.icon;
              const id = settings[tool.key] || "";
              const enabled = Boolean(settings[tool.enabledKey]);
              const validation = getToolValidation(tool, id);
              const open = openKey === tool.key;

              return (
                <article
                  key={tool.key}
                  className="overflow-hidden rounded-[28px] border border-white/70 bg-white shadow-[0_18px_45px_rgba(15,23,42,0.07)]"
                >
                  <button
                    type="button"
                    onClick={() => setOpenKey(open ? "" : tool.key)}
                    className="flex w-full items-start gap-4 p-5 text-left"
                  >
                    <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl ${tool.tone}`}>
                      <Icon size={22} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex flex-wrap items-center gap-2">
                        <span className="text-lg font-black text-slate-950">{tool.name}</span>
                        <span
                          className={`rounded-full px-2.5 py-1 text-[11px] font-black uppercase ${
                            enabled && validation.valid
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-slate-100 text-slate-500"
                          }`}
                        >
                          {enabled && validation.valid ? "Active" : "Paused"}
                        </span>
                      </span>
                      <span className="mt-1 block text-sm font-medium leading-6 text-slate-500">
                        {tool.event}
                      </span>
                    </span>
                    <span className="pt-1 text-slate-400">
                      {enabled ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
                    </span>
                  </button>

                  {open && (
                    <div className="border-t border-slate-100 p-5 pt-4">
                      <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
                        <label className="block min-w-0">
                          <span className="text-xs font-black uppercase tracking-wide text-slate-500">
                            Tracking ID
                          </span>
                          <input
                            type="text"
                            value={id}
                            onChange={(event) => updateToolValue(tool, event.target.value)}
                            placeholder={tool.placeholder}
                            className={`${inputClass} mt-2`}
                          />
                        </label>
                        <div className="grid grid-cols-2 gap-2 self-end sm:grid-cols-1">
                          <button
                            type="button"
                            onClick={() => copyId(tool)}
                            className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-slate-100 px-4 text-sm font-black text-slate-700 transition hover:bg-slate-200"
                          >
                            <Clipboard size={16} />
                            Copy
                          </button>
                          <button
                            type="button"
                            onClick={() => testTool(tool)}
                            disabled={testingKey === tool.key}
                            className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-slate-950 px-4 text-sm font-black text-white transition hover:bg-slate-800 disabled:opacity-60"
                          >
                            {testingKey === tool.key ? <Loader2 className="animate-spin" size={16} /> : <CheckCircle2 size={16} />}
                            Test
                          </button>
                        </div>
                      </div>

                      <div className="mt-3 rounded-2xl bg-slate-50 p-3">
                        <p className={`text-sm font-black ${validation.valid ? "text-emerald-700" : "text-amber-700"}`}>
                          {validation.message}
                        </p>
                        <p className="mt-1 text-xs font-semibold leading-5 text-slate-500">
                          {tool.guide}
                        </p>
                      </div>

                      <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <button
                          type="button"
                          onClick={() => toggleTool(tool)}
                          className={`inline-flex h-11 items-center justify-center gap-2 rounded-2xl px-4 text-sm font-black transition ${
                            enabled
                              ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                          }`}
                        >
                          {enabled ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
                          {enabled ? "Enabled" : "Disabled"}
                        </button>
                        <button
                          type="button"
                          onClick={() => saveTool(tool)}
                          disabled={savingKey === tool.key}
                          className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-[var(--theme-primary)] px-4 text-sm font-black text-white transition hover:opacity-90 disabled:opacity-60"
                        >
                          {savingKey === tool.key ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                          Save {tool.shortName}
                        </button>
                      </div>
                    </div>
                  )}
                </article>
              );
            })}
          </div>

          <aside className="space-y-4">
            <section className="rounded-[28px] border border-white/70 bg-white p-5 shadow-[0_18px_45px_rgba(15,23,42,0.07)]">
              <div className="mb-4 flex items-center gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-2xl bg-[var(--theme-muted-bg)] text-[var(--theme-primary)]">
                  <Sparkles size={20} />
                </span>
                <div>
                  <p className="text-xs font-black uppercase tracking-wide text-[var(--theme-primary)]">
                    Setup quality
                  </p>
                  <h2 className="text-xl font-black text-slate-950">Launch checklist</h2>
                </div>
              </div>
              <div className="grid gap-3">
                {[
                  "Use production tracking IDs only.",
                  "Enable a tool after validating the ID format.",
                  "Use Test to load the script in this browser session.",
                  "Save all changes before leaving this page.",
                ].map((item) => (
                  <div key={item} className="flex gap-3 rounded-2xl bg-slate-50 p-3">
                    <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-[var(--theme-primary)]" />
                    <p className="text-sm font-semibold leading-6 text-slate-600">{item}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="sticky top-4 rounded-[28px] border border-white/70 bg-white p-5 shadow-[0_18px_45px_rgba(15,23,42,0.07)]">
              <div className="flex items-start gap-3">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-emerald-50 text-emerald-700">
                  <Tag size={20} />
                </span>
                <div>
                  <h2 className="text-xl font-black text-slate-950">Save workspace</h2>
                  <p className="mt-1 text-sm font-medium leading-6 text-slate-500">
                    This saves IDs and enabled states for every marketing integration.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={saveAll}
                disabled={savingKey === "all"}
                className="mt-5 inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[var(--theme-primary)] px-5 text-sm font-black text-white transition hover:opacity-90 disabled:opacity-60"
              >
                {savingKey === "all" ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                Save All Tools
              </button>
            </section>
          </aside>
        </section>
      </div>
    </div>
  );
};

export default MarketingTools;
