// GA initialize
export const initGA = (GA_ID) => {
  if (!GA_ID) return;

  if (!window.gtag) {
    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    function gtag() {
      window.dataLayer.push(arguments);
    }
    window.gtag = gtag;
    gtag("js", new Date());
    gtag("config", GA_ID);
  }
};

// Track page views
export const trackPage = (path) => {
  if (!window.gtag) return;
  window.gtag("event", "page_view", { page_path: path });
};
