import { useState } from "react";
import { createLandingPage } from "../../../services/landingPages";
import { toast } from "react-toastify";

const CreateNew = () => {
  const [form, setForm] = useState({
    productId: "",
    nameBn: "",
    nameEn: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createLandingPage(form);
      toast.success("Landing Page created successfully!");
      setForm({ productId: "", nameBn: "", nameEn: "" });
    } catch (err) {
      toast.error("Failed to create Landing Page");
    }
  };

  return (
    <div className="w-full mx-auto p-2 md:p-4 bg-[#ebf0f0] shadow-md min-h-screen">
      <h1 className="text-lg md:text-3xl font-bold text-black my-10">
        Create Your Landing Page
      </h1>
      <form onSubmit={handleSubmit}>
        <div className="grid gap-1 grid-cols-8 px-2 md:px-4 md:items-center text-sm max-w-3xl">
          <div className="col-span-3 md:col-span-1 space-y-6 mt-2 md:mt-0">
            <p>Product ID</p>
            <p>Product Name</p>
          </div>
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
        <div className="px-3">
          <button className="btn mt-5 w-full max-w-3xl mx-auto">Create</button>
        </div>
      </form>
    </div>
  );
};

export default CreateNew;
