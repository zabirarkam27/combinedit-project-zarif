import { useEffect, useState, useCallback } from "react";
import {
  deleteLandingPage,
  getLandingPages,
} from "../../../services/landingPages";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { downloadCsv } from "../../../utils/csv";

const ExistingPages = () => {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);

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

    return () => controller.abort(); // cancel request if unmount
  }, []);

  const handleCopy = useCallback((id) => {
    const link = `${
      import.meta.env.VITE_CLIENT_URL || window.location.origin
    }/landing-page/${id}`;
    navigator.clipboard.writeText(link);
    toast.success("Link copied!");
  }, []);

  const getPublicLink = useCallback(
    (id) => `${import.meta.env.VITE_CLIENT_URL || window.location.origin}/landing-page/${id}`,
    []
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
      pages.map((page) => ({
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
    if (!window.confirm("Delete this landing page?")) return;

    try {
      await deleteLandingPage(id);
      setPages((prev) => prev.filter((page) => page._id !== id));
      toast.success("Landing page deleted.");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to delete landing page.");
    }
  };

  return (
    <div className="w-full mx-auto p-2 md:p-4 theme-dashboard-bg shadow-md min-h-screen">
      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-lg md:text-3xl font-bold theme-text">
            Your Landing Pages
          </h1>
          <p className="text-sm text-gray-600">
            Copy, open, export, or remove landing pages from one place.
          </p>
        </div>
        <button
          type="button"
          onClick={handleExport}
          className="btn border-0 text-white theme-gradient theme-gradient-hover"
        >
          Export CSV
        </button>
      </div>

      {/* Loading state */}
      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, idx) => (
            <div
              key={idx}
              className="card card-bordered bg-gray-200 animate-pulse h-40"
            />
          ))}
        </div>
      ) : pages.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {pages.map((page) => (
            <div
              key={page._id}
              className="card card-bordered bg-base-100 hover:scale-105 transition-transform duration-200 ease-in-out"
            >
              <div className="card-body shadow-xl">
                <Link to={`/landing-page/${page._id}`}>
                  <h2 className="card-title">
                    {page.nameEn} || {page.nameBn}
                  </h2>
                  <p>Product ID: {page.productId}</p>
                </Link>
                <div className="card-actions grid grid-cols-1 gap-2 sm:grid-cols-3">
                  <button
                    className="btn btn-sm text-white theme-gradient theme-gradient-hover border-0"
                    onClick={() => handleCopy(page._id)}
                  >
                    Copy
                  </button>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline"
                    onClick={() => handleOpen(page._id)}
                  >
                    Open
                  </button>
                  <button
                    type="button"
                    className="btn btn-sm btn-error text-white"
                    onClick={() => handleDelete(page._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-600">No landing pages found.</p>
      )}
    </div>
  );
};

export default ExistingPages;
