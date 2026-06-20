import { useEffect, useMemo, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  Clipboard,
  Download,
  ExternalLink,
  FileText,
  Layers,
  Loader2,
  Plus,
  Search,
  Sparkles,
  Trash2,
} from "lucide-react";
import { toast } from "react-toastify";

import {
  deleteLandingPage,
  getLandingPages,
} from "../../../services/landingPages";
import { downloadCsv } from "../../../utils/csv";
import { confirmPopup } from "../../../utils/popups";

const getCreatedDate = (value) => {
  const date = value ? new Date(value) : null;
  if (!date || Number.isNaN(date.getTime())) return "Not dated";
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const getPageTitle = (page) =>
  [page.nameEn, page.nameBn].filter(Boolean).join(" / ") || "Untitled landing page";

const ExistingPages = () => {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [deletingId, setDeletingId] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    const fetchPages = async () => {
      try {
        const { data } = await getLandingPages({ signal: controller.signal });
        const pagesData = data?.data || data || [];
        setPages(Array.isArray(pagesData) ? pagesData : []);
      } catch (err) {
        if (err.name !== "CanceledError" && err.name !== "AbortError") {
          toast.error(
            err?.response?.data?.message || "Failed to fetch Landing Pages"
          );
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPages();

    return () => controller.abort();
  }, []);

  const getPublicLink = useCallback(
    (id) => `${import.meta.env.VITE_CLIENT_URL || window.location.origin}/landing-page/${id}`,
    []
  );

  const filteredPages = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return pages;

    return pages.filter((page) =>
      [page.nameEn, page.nameBn, page.productId, page._id]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(term))
    );
  }, [pages, query]);

  const latestPage = useMemo(() => {
    return [...pages].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))[0];
  }, [pages]);

  const handleCopy = useCallback(
    async (id) => {
      try {
        await navigator.clipboard.writeText(getPublicLink(id));
        toast.success("Landing page link copied.");
      } catch {
        toast.error("Clipboard is not available.");
      }
    },
    [getPublicLink]
  );

  const handleOpen = useCallback(
    (id) => {
      window.open(getPublicLink(id), "_blank", "noopener,noreferrer");
    },
    [getPublicLink]
  );

  const handleExport = () => {
    const exported = downloadCsv(
      "landing-pages.csv",
      filteredPages.map((page) => ({
        NameEnglish: page.nameEn || "",
        NameBangla: page.nameBn || "",
        ProductId: page.productId || "",
        PublicUrl: getPublicLink(page._id),
        CreatedAt: page.createdAt || "",
      }))
    );

    if (!exported) toast.error("No landing pages available to export.");
  };

  const handleDelete = async (id) => {
    const confirmed = await confirmPopup({
      title: "Delete this landing page?",
      text: "This public landing page will no longer be available.",
      confirmButtonText: "Delete Page",
    });

    if (!confirmed) return;

    try {
      setDeletingId(id);
      await deleteLandingPage(id);
      setPages((prev) => prev.filter((page) => page._id !== id));
      toast.success("Landing page deleted.");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to delete landing page.");
    } finally {
      setDeletingId("");
    }
  };

  return (
    <div className="min-h-screen w-full overflow-x-hidden theme-dashboard-bg px-2 py-4 md:px-4">
      <div className="mx-auto w-full max-w-7xl space-y-5">
        <section className="overflow-hidden rounded-[30px] border border-white/70 bg-white shadow-[0_22px_70px_rgba(15,23,42,0.08)]">
          <div className="grid gap-5 p-5 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-center">
            <div className="min-w-0">
              <p className="inline-flex items-center gap-2 rounded-full bg-[var(--theme-muted-bg)] px-3 py-1 text-xs font-black uppercase tracking-wide text-[var(--theme-primary)]">
                <Sparkles size={14} />
                Landing page studio
              </p>
              <h1 className="mt-3 text-2xl font-black tracking-tight text-slate-950 md:text-4xl">
                Existing Pages
              </h1>
              <p className="mt-2 max-w-3xl text-sm font-medium leading-6 text-slate-500 md:text-base">
                Manage all public campaign pages with quick previews, clean exports, and production links in one polished workspace.
              </p>
              <div className="mt-5 flex flex-col gap-2 sm:flex-row">
                <Link
                  to="/dashboard/create-landing"
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-[var(--theme-primary)] px-4 text-sm font-black text-white shadow-[0_14px_30px_rgba(11,125,35,0.22)] transition hover:opacity-90"
                >
                  <Plus size={17} />
                  New Landing Page
                </Link>
                <button
                  type="button"
                  onClick={handleExport}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-black text-slate-700 transition hover:border-[var(--theme-primary)] hover:text-[var(--theme-primary)]"
                >
                  <Download size={17} />
                  Export CSV
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Total Pages", value: pages.length, icon: Layers },
                { label: "Showing", value: filteredPages.length, icon: FileText },
                { label: "Latest", value: latestPage ? getCreatedDate(latestPage.createdAt) : "None", icon: Sparkles },
                { label: "Status", value: loading ? "Syncing" : "Ready", icon: ArrowUpRight },
              ].map(({ label, value, icon: Icon }) => (
                <div key={label} className="rounded-2xl bg-slate-50 p-3">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-[11px] font-black uppercase text-slate-500">{label}</p>
                    <Icon size={16} className="text-[var(--theme-primary)]" />
                  </div>
                  <p className="mt-2 truncate text-lg font-black text-slate-950">{value}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="rounded-[28px] border border-white/70 bg-white p-3 shadow-[0_18px_45px_rgba(15,23,42,0.06)] sm:p-4">
          <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
            <label className="relative block min-w-0">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search page name, Bangla title, product ID..."
                className="h-12 w-full min-w-0 rounded-2xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm font-semibold text-slate-700 outline-none transition focus:border-[var(--theme-primary)] focus:bg-white focus:ring-2 focus:ring-[var(--theme-muted-bg)]"
              />
            </label>
            <p className="rounded-2xl bg-[var(--theme-muted-bg)] px-4 py-3 text-sm font-black text-[var(--theme-primary)]">
              {filteredPages.length} of {pages.length} pages
            </p>
          </div>
        </section>

        {loading ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div
                key={idx}
                className="h-64 animate-pulse rounded-[28px] border border-white/70 bg-white/70 shadow-[0_18px_45px_rgba(15,23,42,0.05)]"
              />
            ))}
          </div>
        ) : filteredPages.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filteredPages.map((page, index) => (
              <article
                key={page._id}
                className="group overflow-hidden rounded-[30px] border border-white/70 bg-white shadow-[0_18px_45px_rgba(15,23,42,0.07)] transition hover:-translate-y-1 hover:shadow-[0_26px_70px_rgba(15,23,42,0.12)]"
              >
                <div className="relative h-28 overflow-hidden bg-[linear-gradient(135deg,var(--theme-primary),var(--theme-secondary))] p-5 text-white">
                  <div className="absolute right-4 top-4 grid h-12 w-12 place-items-center rounded-2xl bg-white/15 backdrop-blur">
                    <FileText size={22} />
                  </div>
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-white/75">
                    Campaign #{String(index + 1).padStart(2, "0")}
                  </p>
                  <p className="mt-7 text-sm font-black text-white/90">
                    {getCreatedDate(page.createdAt)}
                  </p>
                </div>

                <div className="p-5">
                  <Link to={`/landing-page/${page._id}`} className="block min-w-0">
                    <h2 className="line-clamp-2 text-xl font-black leading-tight text-slate-950 transition group-hover:text-[var(--theme-primary)]">
                      {getPageTitle(page)}
                    </h2>
                    <p className="mt-2 break-all rounded-2xl bg-slate-50 px-3 py-2 text-xs font-bold text-slate-500">
                      Product ID: {page.productId || "Not linked"}
                    </p>
                  </Link>

                  <div className="mt-4 rounded-2xl border border-slate-100 bg-slate-50 p-3">
                    <p className="text-[11px] font-black uppercase tracking-wide text-slate-500">
                      Public URL
                    </p>
                    <p className="mt-1 truncate text-xs font-semibold text-slate-600">
                      {getPublicLink(page._id)}
                    </p>
                  </div>

                  <div className="mt-4 grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      className="inline-flex h-11 items-center justify-center gap-1 rounded-2xl bg-[var(--theme-primary)] px-2 text-xs font-black text-white transition hover:opacity-90"
                      onClick={() => handleCopy(page._id)}
                    >
                      <Clipboard size={15} />
                      Copy
                    </button>
                    <button
                      type="button"
                      className="inline-flex h-11 items-center justify-center gap-1 rounded-2xl border border-slate-200 bg-white px-2 text-xs font-black text-slate-700 transition hover:border-[var(--theme-primary)] hover:text-[var(--theme-primary)]"
                      onClick={() => handleOpen(page._id)}
                    >
                      <ExternalLink size={15} />
                      Open
                    </button>
                    <button
                      type="button"
                      className="inline-flex h-11 items-center justify-center gap-1 rounded-2xl bg-rose-50 px-2 text-xs font-black text-rose-700 transition hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-60"
                      onClick={() => handleDelete(page._id)}
                      disabled={deletingId === page._id}
                    >
                      {deletingId === page._id ? <Loader2 className="animate-spin" size={15} /> : <Trash2 size={15} />}
                      Delete
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <section className="rounded-[30px] border border-dashed border-slate-200 bg-white p-8 text-center shadow-[0_18px_45px_rgba(15,23,42,0.05)]">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-[var(--theme-muted-bg)] text-[var(--theme-primary)]">
              <FileText size={24} />
            </div>
            <h2 className="mt-4 text-xl font-black text-slate-950">No landing pages found</h2>
            <p className="mt-2 text-sm font-medium text-slate-500">
              Create a campaign page or adjust your search keyword.
            </p>
            <Link
              to="/dashboard/create-landing"
              className="mt-5 inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-[var(--theme-primary)] px-4 text-sm font-black text-white"
            >
              <Plus size={17} />
              Create Landing Page
            </Link>
          </section>
        )}
      </div>
    </div>
  );
};

export default ExistingPages;
