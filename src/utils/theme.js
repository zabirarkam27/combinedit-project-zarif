export const defaultThemeColors = {
  primary: "#002252",
  secondary: "#009de6",
  accent: "#ff640a",
  pageBg: "#f3f6fa",
  dashboardBg: "#f3f6fa",
  text: "#0f223d",
};

export const defaultLandingTheme = {
  pageBg: "#f3f6fa",
  contentBg: "#ffffff",
  sectionBg: "#ffffff",
  cardBg: "#ffffff",
  border: "#e1e7ef",
  text: "#0f223d",
  mutedText: "#65758b",
  noticeBg: "#ff640a",
  buttonPrimary: "#002252",
  buttonSecondary: "#009de6",
  buttonAccent: "#ff640a",
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
  const primaryGlow = colors.primary === defaultThemeColors.primary ? "#07387e" : colors.primary;
  const accentHover = colors.accent === defaultThemeColors.accent ? "#eb5600" : colors.accent;

  root.style.setProperty("--theme-primary", colors.primary);
  root.style.setProperty("--theme-primary-glow", primaryGlow);
  root.style.setProperty("--theme-secondary", colors.secondary);
  root.style.setProperty("--theme-accent", colors.accent);
  root.style.setProperty("--theme-accent-hover", accentHover);
  root.style.setProperty("--theme-page-bg", colors.pageBg);
  root.style.setProperty("--theme-dashboard-bg", colors.dashboardBg);
  root.style.setProperty("--theme-card-bg", "#ffffff");
  root.style.setProperty("--theme-popover-bg", "#ffffff");
  root.style.setProperty("--theme-text", colors.text);
  root.style.setProperty("--theme-muted-bg", colors.pageBg);
  root.style.setProperty("--theme-muted-text", "#65758b");
  root.style.setProperty("--theme-border-color", "#e1e7ef");
  root.style.setProperty("--theme-destructive", "#ef4343");
  root.style.setProperty(
    "--theme-gradient",
    `linear-gradient(90deg, ${colors.primary}, ${primaryGlow}, ${colors.secondary})`
  );
  root.style.setProperty(
    "--theme-cta-gradient",
    `linear-gradient(90deg, ${colors.accent}, ${accentHover})`
  );
  root.style.setProperty(
    "--theme-brand-gradient",
    `linear-gradient(90deg, ${colors.primary}, ${colors.secondary})`
  );
  root.style.setProperty(
    "--theme-hero-gradient",
    `linear-gradient(135deg, ${colors.primary}, ${primaryGlow})`
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
