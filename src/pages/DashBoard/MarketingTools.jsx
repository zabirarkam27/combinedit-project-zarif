import { useEffect, useState } from "react";
import {
  fetchMarketingSettings,
  updateMarketingSettings,
} from "../../services/marketing";
import useMarketingTool from "../../hooks/useMarketingTool";
import MarketingToolCard from "../../components/MarketingToolCard";
import { toast } from "react-toastify";

// Tool configuration
const toolsConfig = [
  {
    key: "gaMeasurementId",
    name: "Google Analytics",
    placeholder: "Enter GA Measurement ID (G-XXXXXXX)",
    howItWorksContent:
      "Login to GA → Admin → Data Streams → Copy Measurement ID.",
  },
  {
    key: "gtmId",
    name: "Google Tag Manager",
    placeholder: "Enter GTM ID (GTM-XXXX)",
    howItWorksContent: "Login to GTM → Admin → Container ID → Copy GTM-XXXX.",
  },
  {
    key: "metaPixelId",
    name: "Meta Pixel",
    placeholder: "Enter Meta Pixel ID",
    howItWorksContent:
      "Login to Meta Business → Events Manager → Copy Pixel ID.",
  },
  {
    key: "tiktokPixelId",
    name: "TikTok Pixel",
    placeholder: "Enter TikTok Pixel ID",
    howItWorksContent: "Login to TikTok Ads Manager → Events → Copy Pixel ID.",
  },
  {
    key: "twitterPixelId",
    name: "Twitter Pixel",
    placeholder: "Enter Twitter Pixel ID",
    howItWorksContent: "Login to X Ads → Tools → Copy Pixel ID.",
  },
  {
    key: "snapPixelId",
    name: "Snapchat Pixel",
    placeholder: "Enter Snap Pixel ID",
    howItWorksContent:
      "Login to Snapchat Ads → Events Manager → Copy Pixel ID.",
  },
];

const MarketingTools = () => {
  const [loading, setLoading] = useState(true);

  // ✅ Call hooks directly at top-level
  const googleAnalytics = useMarketingTool();
  const googleTagManager = useMarketingTool();
  const metaPixel = useMarketingTool();
  const tiktokPixel = useMarketingTool();
  const twitterPixel = useMarketingTool();
  const snapchatPixel = useMarketingTool();

  const toolsHooks = [
    googleAnalytics,
    googleTagManager,
    metaPixel,
    tiktokPixel,
    twitterPixel,
    snapchatPixel,
  ];

  // Load settings from backend
  useEffect(() => {
    const loadSettings = async () => {
      try {
        setLoading(true);
        const data = await fetchMarketingSettings();
        if (data) {
          toolsConfig.forEach((tool, idx) => {
            toolsHooks[idx].setToolId(data[tool.key] || "");
          });
        }
      } catch (err) {
        console.error("Failed to load marketing settings:", err);
        toast.error("Failed to load marketing settings");
      } finally {
        setLoading(false);
      }
    };
    loadSettings();
  }, []);

  const handleSave = async (key, value) => {
    try {
      await updateMarketingSettings({ [key]: value });
      toast.success(`${key} saved successfully!`);
    } catch (err) {
      console.error(`Failed to save ${key}:`, err);
      toast.error(`Failed to save ${key}`);
    }
  };

  if (loading) return <p className="mt-10 text-center">Loading...</p>;

  return (
    <div className="mx-auto min-h-screen w-full overflow-x-hidden bg-[#ebf0f0] p-3 sm:p-4 md:p-6">
      <div className="mb-4 rounded-3xl bg-white/80 p-4 shadow-[0_18px_45px_rgba(15,23,42,0.07)] md:p-5">
        <p className="text-xs font-black uppercase tracking-wide text-[var(--theme-primary)]">
          Operations
        </p>
        <h2 className="mt-1 text-2xl font-black text-slate-950">Marketing Tools Setup</h2>
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-6">
        {toolsConfig.map((tool, idx) => (
          <MarketingToolCard
            key={tool.key}
            name={tool.name}
            placeholder={tool.placeholder}
            hook={toolsHooks[idx]}
            onSave={(val) => handleSave(tool.key, val)}
            howItWorksContent={tool.howItWorksContent}
          />
        ))}
      </div>
    </div>
  );
};

export default MarketingTools;
