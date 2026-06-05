export const defaultThemeColors = {
  primary: "#00ad9c",
  secondary: "#3a8881",
  accent: "#009e8e",
  pageBg: "#a8e2dd",
  dashboardBg: "#ebf0f0",
  text: "#0c2955",
};

export const defaultLandingTheme = {
  pageBg: "#fcefdb",
  contentBg: "#fcf7ef",
  sectionBg: "#ffffff",
  cardBg: "#ffffff",
  border: "#d1d5db",
  text: "#0c2955",
  mutedText: "#4b5563",
  noticeBg: "#eb920d",
  buttonPrimary: "#398881",
  buttonSecondary: "#00ad9c",
  buttonAccent: "#009e8e",
  maxWidth: "980px",
  radius: "8px",
};

const isHexColor = (value) =>
  typeof value === "string" && /^#[0-9a-fA-F]{6}$/.test(value);

const isCssLength = (value) =>
  typeof value === "string" && /^(\d+(\.\d+)?)(px|rem|em|%)$/.test(value);

export const normalizeThemeColors = (themeColors = {}) => {
  return Object.entries(defaultThemeColors).reduce((colors, [key, fallback]) => {
    colors[key] = isHexColor(themeColors?.[key]) ? themeColors[key] : fallback;
    return colors;
  }, {});
};

export const normalizeLandingTheme = (landingTheme = {}) => {
  const colorKeys = [
    "pageBg",
    "contentBg",
    "sectionBg",
    "cardBg",
    "border",
    "text",
    "mutedText",
    "noticeBg",
    "buttonPrimary",
    "buttonSecondary",
    "buttonAccent",
  ];

  return Object.entries(defaultLandingTheme).reduce(
    (settings, [key, fallback]) => {
      if (colorKeys.includes(key)) {
        settings[key] = isHexColor(landingTheme?.[key])
          ? landingTheme[key]
          : fallback;
        return settings;
      }

      settings[key] = isCssLength(landingTheme?.[key])
        ? landingTheme[key]
        : fallback;
      return settings;
    },
    {}
  );
};

export const applyThemeColors = (themeColors = {}) => {
  const colors = normalizeThemeColors(themeColors);
  const root = document.documentElement;

  root.style.setProperty("--theme-primary", colors.primary);
  root.style.setProperty("--theme-secondary", colors.secondary);
  root.style.setProperty("--theme-accent", colors.accent);
  root.style.setProperty("--theme-page-bg", colors.pageBg);
  root.style.setProperty("--theme-dashboard-bg", colors.dashboardBg);
  root.style.setProperty("--theme-text", colors.text);
  root.style.setProperty(
    "--theme-gradient",
    `linear-gradient(90deg, ${colors.primary}, ${colors.secondary}, ${colors.accent})`
  );
};

export const applyLandingTheme = (landingTheme = {}) => {
  const settings = normalizeLandingTheme(landingTheme);
  const root = document.documentElement;

  root.style.setProperty("--landing-page-bg", settings.pageBg);
  root.style.setProperty("--landing-content-bg", settings.contentBg);
  root.style.setProperty("--landing-section-bg", settings.sectionBg);
  root.style.setProperty("--landing-card-bg", settings.cardBg);
  root.style.setProperty("--landing-border", settings.border);
  root.style.setProperty("--landing-text", settings.text);
  root.style.setProperty("--landing-muted-text", settings.mutedText);
  root.style.setProperty("--landing-notice-bg", settings.noticeBg);
  root.style.setProperty("--landing-button-primary", settings.buttonPrimary);
  root.style.setProperty("--landing-button-secondary", settings.buttonSecondary);
  root.style.setProperty("--landing-button-accent", settings.buttonAccent);
  root.style.setProperty("--landing-max-width", settings.maxWidth);
  root.style.setProperty("--landing-radius", settings.radius);
  root.style.setProperty(
    "--landing-gradient",
    `linear-gradient(90deg, ${settings.buttonPrimary}, ${settings.buttonSecondary}, ${settings.buttonAccent})`
  );
};
