import { forwardRef } from "react";
import { Download, ExternalLink, Globe2, Mail, Phone, Sparkles } from "lucide-react";
import useProfileData from "../hooks/useProfileData";

const TintedAsset = ({ src, label, className = "h-8 w-8", color = "var(--theme-icon-color)" }) => {
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

const ContactPill = ({ href, icon: Icon, label, children }) => (
  <a
    href={href || "#"}
    target={href?.startsWith("http") ? "_blank" : undefined}
    rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
    aria-label={label}
    className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-white/70 bg-white/90 px-4 text-sm font-black text-slate-700 shadow-[0_12px_28px_rgba(15,23,42,0.08)] transition hover:-translate-y-0.5 hover:border-[var(--theme-primary)] hover:text-[var(--theme-primary)] hover:shadow-[0_18px_36px_rgba(15,23,42,0.14)]"
  >
    <Icon size={17} className="shrink-0" />
    <span className="truncate">{children}</span>
  </a>
);

const ProfileInfo = forwardRef((props, ref) => {
  const { profile, loading } = useProfileData();

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="h-80 animate-pulse rounded-[32px] bg-white/60" />
      </div>
    );
  }

  if (!profile) return <p className="py-10 text-center font-bold text-white">Profile not found</p>;

  const customLinks = profile.socialLinks?.custom || [];

  return (
    <section className="mx-auto w-full max-w-6xl px-3 py-8 sm:px-5 md:py-12">
      <div className="relative overflow-hidden rounded-[34px] border border-white/25 bg-white/95 text-left shadow-[0_28px_90px_rgba(15,23,42,0.20)] backdrop-blur">
        <div className="absolute inset-x-0 top-0 h-28 bg-[linear-gradient(135deg,var(--theme-primary),var(--theme-secondary))]" />
        <div className="relative grid gap-6 p-4 sm:p-6 lg:grid-cols-[320px_minmax(0,1fr)] lg:p-8">
          <div className="rounded-[30px] border border-white/70 bg-white p-4 shadow-[0_20px_55px_rgba(15,23,42,0.12)]">
            <div className="flex items-center justify-between gap-3">
              <span className="inline-flex items-center gap-2 rounded-full bg-[var(--theme-muted-bg)] px-3 py-1.5 text-xs font-black uppercase tracking-wide text-[var(--theme-primary)]">
                <Sparkles size={14} />
                Visiting Card
              </span>
              <span className="grid h-10 w-10 place-items-center rounded-2xl bg-slate-50 text-[var(--theme-primary)]">
                <ExternalLink size={18} />
              </span>
            </div>

            <div className="mt-6 rounded-[28px] bg-[var(--theme-muted-bg)] p-5 text-center">
              <TintedAsset
                src={profile.logo}
                label="Company Logo"
                className="mx-auto h-20 w-40"
                color="var(--theme-logo-color)"
              />
              <div className="mx-auto mt-5 h-44 w-44 overflow-hidden rounded-[32px] border-4 border-white bg-white shadow-[0_18px_45px_rgba(15,23,42,0.18)] sm:h-52 sm:w-52">
                <img
                  src={profile.profileImage}
                  alt={profile.name || "Profile"}
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>

          <div className="flex min-w-0 flex-col justify-between rounded-[30px] border border-slate-100 bg-white p-5 shadow-[0_20px_55px_rgba(15,23,42,0.08)] sm:p-7">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-[var(--theme-primary)]">
                Digital identity
              </p>
              <h1 className="mt-3 text-3xl font-black leading-tight tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
                {profile.name}
              </h1>
              <p className="mt-2 text-base font-bold text-slate-600 sm:text-lg">
                {profile.title}
              </p>
              <p className="mt-5 max-w-3xl text-sm font-medium leading-7 text-slate-500 sm:text-base">
                {profile.description}
              </p>
            </div>

            <section ref={ref} className="mt-7">
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                <ContactPill href={profile.emailLink} icon={Mail} label="Email">
                  Email
                </ContactPill>
                <ContactPill href={profile.phoneLink} icon={Phone} label="Phone">
                  Call
                </ContactPill>
                <ContactPill href={profile.websiteLink} icon={Globe2} label="Website">
                  Website
                </ContactPill>
              </div>

              <div className="mt-4 flex flex-wrap gap-3">
                {profile.facebookLink && (
                  <a
                    href={profile.facebookLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Facebook"
                    className="grid h-12 w-12 place-items-center rounded-2xl border border-slate-100 bg-slate-50 transition hover:border-[var(--theme-primary)] hover:bg-[var(--theme-muted-bg)]"
                  >
                    <TintedAsset src={profile.facebookIcon} label="Facebook" className="h-5 w-5" />
                  </a>
                )}
                {customLinks.map((link, index) => (
                  <a
                    key={`${link.url}-${index}`}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={link.label || `Custom Link ${index + 1}`}
                    className="grid h-12 w-12 place-items-center rounded-2xl border border-slate-100 bg-slate-50 transition hover:border-[var(--theme-primary)] hover:bg-[var(--theme-muted-bg)]"
                  >
                    <TintedAsset src={link.icon} label={`Custom Link ${index + 1}`} className="h-5 w-5" />
                  </a>
                ))}
              </div>

              <a
                href={profile.vcfDownloadLink || "#"}
                download={profile.vcfDownloadFileName}
                className="theme-gradient theme-gradient-hover mt-6 inline-flex min-h-12 w-full items-center justify-center gap-3 rounded-2xl px-5 py-3 text-sm font-black text-white shadow-[0_18px_42px_rgba(11,125,35,0.24)] transition active:scale-[0.99] sm:w-auto"
              >
                <Download size={18} />
                Save Contact
              </a>
            </section>
          </div>
        </div>
      </div>
    </section>
  );
});

export default ProfileInfo;

