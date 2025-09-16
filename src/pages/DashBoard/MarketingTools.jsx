import { useEffect, useState } from "react";
import {
  fetchMarketingSettings,
  updateMarketingSettings,
} from "../../services/marketing";
import useMarketingTool from "../../hooks/useMarketingTool";
import MarketingToolCard from "../../components/MarketingToolCard";

const MarketingTools = () => {
  const [loading, setLoading] = useState(true);

  // Hooks for each tool
  const googleAnalytics = useMarketingTool();
  const googleTagManager = useMarketingTool();
  const metaPixel = useMarketingTool();
  const tiktokPixel = useMarketingTool();
  const twitterPixel = useMarketingTool();
  const snapchatPixel = useMarketingTool();

  useEffect(() => {
    const loadSettings = async () => {
      const data = await fetchMarketingSettings();
      if (data) {
        googleAnalytics.setToolId(data.gaMeasurementId || "");
        googleTagManager.setToolId(data.gtmId || "");
        metaPixel.setToolId(data.metaPixelId || "");
        tiktokPixel.setToolId(data.tiktokPixelId || "");
        twitterPixel.setToolId(data.twitterPixelId || "");
        snapchatPixel.setToolId(data.snapPixelId || "");
      }
      setLoading(false);
    };
    loadSettings();
  }, []);

  const handleSave = async (key, value) => {
    await updateMarketingSettings({ [key]: value });
    alert(`✅ ${key} saved to database!`);
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="bg-[#ebf0f0] p-6 mx-auto">
      <h2 className="text-2xl font-bold mb-6">Marketing Tools Setup</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MarketingToolCard
          name="Google Analytics"
          placeholder="Enter GA Measurement ID (G-XXXXXXX)"
          hook={googleAnalytics}
          onSave={(val) => handleSave("gaMeasurementId", val)}
          howItWorksContent="Login to GA → Admin → Data Streams → Copy Measurement ID."
        />

        <MarketingToolCard
          name="Google Tag Manager"
          placeholder="Enter GTM ID (GTM-XXXX)"
          hook={googleTagManager}
          onSave={(val) => handleSave("gtmId", val)}
          howItWorksContent="Login to GTM → Admin → Container ID → Copy GTM-XXXX."
        />

        <MarketingToolCard
          name="Meta Pixel"
          placeholder="Enter Meta Pixel ID"
          hook={metaPixel}
          onSave={(val) => handleSave("metaPixelId", val)}
          howItWorksContent="Login to Meta Business → Events Manager → Copy Pixel ID."
        />

        <MarketingToolCard
          name="TikTok Pixel"
          placeholder="Enter TikTok Pixel ID"
          hook={tiktokPixel}
          onSave={(val) => handleSave("tiktokPixelId", val)}
          howItWorksContent="Login to TikTok Ads Manager → Events → Copy Pixel ID."
        />

        <MarketingToolCard
          name="Twitter Pixel"
          placeholder="Enter Twitter Pixel ID"
          hook={twitterPixel}
          onSave={(val) => handleSave("twitterPixelId", val)}
          howItWorksContent="Login to X Ads → Tools → Copy Pixel ID."
        />

        <MarketingToolCard
          name="Snapchat Pixel"
          placeholder="Enter Snap Pixel ID"
          hook={snapchatPixel}
          onSave={(val) => handleSave("snapPixelId", val)}
          howItWorksContent="Login to Snapchat Ads → Events Manager → Copy Pixel ID."
        />
      </div>
    </div>
  );
};

export default MarketingTools;
