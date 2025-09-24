import React, { useState, useCallback } from "react";
import { createLandingPage } from "../../../services/landingPages";
import { toast } from "react-toastify";

const CreateNew = () => {
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
      setLoading(true);

      try {
        await createLandingPage(form);
        toast.success("Landing Page created successfully!");
        setForm({ productId: "", nameBn: "", nameEn: "" });
      } catch (err) {
        toast.error(
          err?.response?.data?.message || "Failed to create Landing Page"
        );
      } finally {
        setLoading(false);
      }
    },
    [form, loading]
  );

  return (
    <div className="w-full mx-auto p-2 md:p-4 bg-[#ebf0f0] shadow-md min-h-screen">
      <h1 className="text-lg md:text-3xl font-bold text-black my-10">
        Create Your Landing Page
      </h1>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-1 grid-cols-8 px-2 md:px-4 md:items-center text-sm max-w-3xl">
          {/* Labels */}
          <div className="col-span-3 md:col-span-1 space-y-6 mt-2 md:mt-0">
            <p>Product ID</p>
            <p>Product Name</p>
          </div>

          {/* Inputs */}
          <div className="col-span-5 md:col-span-7 space-y-5">
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
        <div className="px-3">
          <button
            type="submit"
            disabled={loading}
            className={`btn w-full mt-6 text-center text-white font-semibold px-4 py-4 rounded-b-xl
              bg-gradient-to-r from-[#00ad9c] via-[#3a8881] to-[#009e8e]
              bg-[length:200%_200%] transition-all duration-500 ease-in-out hover:bg-right
              ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {loading ? "Creating..." : "Create"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateNew;
