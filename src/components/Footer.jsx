import { ExternalLink, Mail, MapPin, PhoneCall } from "lucide-react";

import useProfileData from "../hooks/useProfileData";
import design from "../styles/design";

const TintedAsset = ({ src, label, className = "h-6 w-6", color = "currentColor" }) => {
  if (!src) return null;

  return (
    <span
      role="img"
      aria-label={label}
      className={`inline-block shrink-0 ${className}`}
      style={{
        backgroundColor: color,
        WebkitMask: `url(${src}) center / contain no-repeat`,
        mask: `url(${src}) center / contain no-repeat`,
      }}
    />
  );
};

const ContactCard = ({ href, icon: Icon, label, value }) => (
  <a
    href={href || "#"}
    target="_blank"
    rel="noopener noreferrer"
    className="group flex min-h-[88px] items-center gap-4 rounded-2xl border border-white/20 bg-white/10 p-4 text-white shadow-[0_18px_45px_rgba(0,0,0,0.10)] backdrop-blur transition hover:-translate-y-1 hover:border-white/45 hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--theme-primary)]"
  >
    <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-white text-[var(--theme-primary)] shadow-lg shadow-black/10 transition group-hover:scale-105">
      <Icon size={22} strokeWidth={2.3} />
    </span>
    <span className="min-w-0">
      <span className="block text-xs font-black uppercase tracking-[0.16em] text-white/70">{label}</span>
      <span className="mt-1 block break-words text-sm font-extrabold leading-5 text-white md:text-[13px] lg:text-sm">
        {value}
      </span>
    </span>
  </a>
);

const SocialButton = ({ href, label, asset, icon: Icon }) => (
  <a
    href={href || "#"}
    target="_blank"
    rel="noopener noreferrer"
    aria-label={label}
    className="group inline-flex min-h-11 items-center gap-2 rounded-2xl border border-white/80 bg-white px-4 py-2 text-sm font-black text-slate-900 shadow-[0_14px_34px_rgba(0,0,0,0.12)] transition hover:-translate-y-0.5 hover:text-[var(--theme-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--theme-primary)]"
  >
    <span className="grid h-8 w-8 place-items-center rounded-xl bg-[var(--theme-muted-bg)] text-[var(--theme-primary)] transition group-hover:bg-[var(--theme-primary)] group-hover:text-white">
      {asset ? (
        <TintedAsset src={asset} label={`${label} icon`} className="h-[18px] w-[18px]" />
      ) : (
        <Icon size={17} strokeWidth={2.4} />
      )}
    </span>
    <span>{label}</span>
  </a>
);

const Footer = () => {
  const { profile, loading } = useProfileData();

  if (loading) return null;
  if (!profile) return null;

  const customSocialLinks = Array.isArray(profile.socialLinks?.custom)
    ? profile.socialLinks.custom.filter((link) => link?.url && link?.label)
    : [];

  const contactCards = [
    {
      href: profile.emailLink,
      icon: Mail,
      label: "Email Us",
      value: profile.email || "zabirarkam27@gmail.com",
    },
    {
      href: profile.phoneLink,
      icon: PhoneCall,
      label: "Call Us",
      value: profile.phone || "+8801838600619",
    },
    {
      href: profile.mapLink || "https://maps.app.goo.gl/gNuBTVRF4E49yr7d7",
      icon: MapPin,
      label: "Visit Us",
      value: profile.address || "26, Nayapaltan, Dhaka-1000",
    },
  ];

  const socialLinks = [
    {
      href: profile.facebookLink,
      label: "Facebook",
      asset: profile.facebookIcon || "/footer-facebook-icon.png",
    },
    {
      href: profile.phoneLink,
      label: "WhatsApp",
      asset: "/footer-whatsapp-icon.png",
    },
    {
      href: profile.websiteLink,
      label: "Website",
      icon: ExternalLink,
    },
    ...customSocialLinks.map((link) => ({
      href: link.url,
      label: link.label,
      asset: link.icon,
      icon: ExternalLink,
    })),
  ].filter((link) => link.href && link.href !== "#");

  return (
    <footer className="theme-gradient mx-auto overflow-hidden text-white">
      <div className={`${design.navbarContainer} flex flex-col py-8 md:py-10 lg:py-14`}>
        <div className="grid gap-4 md:grid-cols-3">
          {contactCards.map((card) => (
            <ContactCard key={card.label} {...card} />
          ))}
        </div>

        <div className="my-7 h-px w-full bg-white/20" />

        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-xl">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-white/65">Connect With Us</p>
            <h2 className="mt-2 text-2xl font-black leading-tight text-white md:text-3xl">
              Follow updates, offers, and product news.
            </h2>
          </div>

          <div className="flex flex-wrap gap-3">
            {socialLinks.length > 0 ? (
              socialLinks.map((link) => <SocialButton key={`${link.label}-${link.href}`} {...link} />)
            ) : (
              <span className="rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-sm font-bold text-white/75">
                Social links will appear here after setup.
              </span>
            )}
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 border-t border-white/15 pt-5 text-xs font-semibold text-white/70 md:flex-row md:items-center md:justify-between">
          <p className="text-center md:text-left">© 2024 All Rights Reserved by Zabir Arkam</p>
          <div className="flex items-center justify-center gap-2">
            <span>Developed & Marketed By</span>
            <span className="rounded-xl border border-white/25 bg-white/10 px-3 py-1 font-black text-white">Proo IT</span>
          </div>
        </div>
      </div>
      <div className="h-20 md:h-0" />
    </footer>
  );
};

export default Footer;
