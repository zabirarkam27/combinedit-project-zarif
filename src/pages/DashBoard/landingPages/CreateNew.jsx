import React, { useState, useCallback } from "react";
import { createLandingPage } from "../../../services/landingPages";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";

const CreateNew = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [form, setForm] = useState({
    productId: "",
    nameBn: "",
    nameEn: "",
  });

  const [loading, setLoading] = useState(false);

  // input change handler (memoized)
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }, []);

  // submit handler (memoized)
  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      if (loading) return; // prevent double submit
      if (authLoading) return;

      if (!user) {
        toast.error("Please log in before creating a landing page.");
        return;
      }

      const payload = {
        productId: form.productId.trim(),
        nameBn: form.nameBn.trim(),
        nameEn: form.nameEn.trim(),
      };

      if (!payload.productId || !payload.nameBn || !payload.nameEn) {
        toast.error("Please fill in all fields.");
        return;
      }

      setLoading(true);

      try {
        await createLandingPage(payload);
        toast.success("Landing Page created successfully!");
        setForm({ productId: "", nameBn: "", nameEn: "" });
        navigate("/dashboard/existing-pages");
      } catch (err) {
        toast.error(
          err?.response?.data?.message || "Failed to create Landing Page"
        );
      } finally {
        setLoading(false);
      }
    },
    [authLoading, form, loading, navigate, user]
  );

  return (
    <div className="mx-auto min-h-screen w-full overflow-x-hidden theme-dashboard-bg p-3 shadow-md md:p-4">
      <div className="mb-5 rounded-3xl bg-white/80 p-4 shadow-[0_14px_34px_rgba(15,23,42,0.06)]">
        <h1 className="text-xl font-black theme-text md:text-3xl">
          Create Your Landing Page
        </h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid max-w-3xl gap-3 rounded-3xl bg-white/75 p-4 text-sm shadow-sm md:grid-cols-[140px_1fr] md:items-start">
          {/* Labels */}
          <div className="space-y-2 font-bold text-slate-700 md:space-y-8 md:pt-2">
            <p>Product ID</p>
            <p>Product Name</p>
          </div>

          {/* Inputs */}
          <div className="min-w-0 space-y-4">
            <input
              type="text"
              name="productId"
              placeholder="Enter Product ID"
              value={form.productId}
              onChange={handleChange}
              className="border border-gray-300 rounded-md px-2 py-1 w-full"
              required
            />
            <div className="flex gap-2 flex-col md:flex-row">
              <input
                type="text"
                name="nameBn"
                placeholder="Enter Product Name in Bangla"
                value={form.nameBn}
                onChange={handleChange}
                className="border border-gray-300 rounded-md px-2 py-1 w-full"
                required
              />
              <input
                type="text"
                name="nameEn"
                placeholder="Enter Product Name in English"
                value={form.nameEn}
                onChange={handleChange}
                className="border border-gray-300 rounded-md px-2 py-1 w-full"
                required
              />
            </div>
          </div>
        </div>

        {/* Submit button */}
        <div className="max-w-3xl px-0 sm:px-3">
          <button
            type="submit"
            disabled={loading || authLoading || !user}
            className={`btn w-full mt-6 text-center text-white font-semibold px-4 py-4 rounded-b-xl
              theme-gradient theme-gradient-hover border-0
              ${
                loading || authLoading || !user
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
          >
            {loading ? "Creating..." : authLoading ? "Checking login..." : "Create"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateNew;
