import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { HexColorPicker } from "react-colorful";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import useImageUpload from "../../hooks/useImageUpload";
import { addProduct } from "../../services/products";

const emptyProduct = {
  name: "",
  category: "",
  brand: "",
  volumeAmount: "",
  volumeUnit: "",
  price: "",
  discountPrice: "",
  inStock: true,
  active: true,
  featured: false,
  thumbnail: "",
  images: [],
  description: "",
  colors: [],
};

const inputClass = "input w-full bg-white border theme-border";
const labelClass = "label-text font-medium text-gray-700";
const units = ["ml", "liter", "gram", "kg", "dozen", "piece"];

const AddProducts = () => {
  const navigate = useNavigate();
  const { uploadImage } = useImageUpload();

  const [formData, setFormData] = useState(emptyProduct);
  const [selectedColor, setSelectedColor] = useState("#ffffff");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageChange = async (event) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;

    setUploadingImage(true);
    try {
      const uploadedUrls = [];

      for (const file of files) {
        const url = await uploadImage(file);
        if (url) uploadedUrls.push(url);
      }

      if (uploadedUrls.length > 0) {
        setFormData((prev) => {
          const images = [...prev.images, ...uploadedUrls];
          return {
            ...prev,
            images,
            thumbnail: prev.thumbnail || images[0],
          };
        });
      }
    } catch (err) {
      toast.error("Image upload failed.");
      console.error(err);
    } finally {
      setUploadingImage(false);
      event.target.value = "";
    }
  };

  const handleRemoveImage = (url) => {
    setFormData((prev) => {
      const images = prev.images.filter((image) => image !== url);
      return {
        ...prev,
        images,
        thumbnail: prev.thumbnail === url ? images[0] || "" : prev.thumbnail,
      };
    });
  };

  const handleAddColor = () => {
    if (!/^#[0-9a-fA-F]{6}$/.test(selectedColor)) {
      toast.error("Use a valid hex color.");
      return;
    }

    if (formData.colors.includes(selectedColor)) {
      toast.info("This color is already added.");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      colors: [...prev.colors, selectedColor],
    }));
  };

  const handleRemoveColor = (color) => {
    setFormData((prev) => ({
      ...prev,
      colors: prev.colors.filter((item) => item !== color),
    }));
  };

  const resetForm = () => {
    setFormData(emptyProduct);
    setSelectedColor("#ffffff");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (submitting || uploadingImage) return;

    const price = Number(formData.price);
    const discountPrice = formData.discountPrice
      ? Number(formData.discountPrice)
      : null;

    if (!Number.isFinite(price) || price <= 0) {
      toast.error("Please enter a valid product price.");
      return;
    }

    if (discountPrice !== null && (!Number.isFinite(discountPrice) || discountPrice < 0)) {
      toast.error("Please enter a valid discount price.");
      return;
    }

    if (discountPrice !== null && discountPrice >= price) {
      toast.error("Discount price should be lower than regular price.");
      return;
    }

    setSubmitting(true);
    try {
      const productData = {
        name: formData.name.trim(),
        category: formData.category.trim(),
        brand: formData.brand.trim(),
        volume: [formData.volumeAmount, formData.volumeUnit].filter(Boolean).join(" "),
        price,
        discountPrice,
        inStock: formData.inStock,
        active: formData.active,
        featured: formData.featured,
        thumbnail: formData.thumbnail,
        images: formData.images,
        description: formData.description.trim(),
        colors: formData.colors,
      };

      const res = await addProduct(productData);

      if (res.data?.insertedId || res.data?.acknowledged) {
        toast.success("Product added successfully!");
        resetForm();
        navigate("/dashboard/edit-your-products/all", { replace: true });
      } else {
        toast.info("Product request completed, but no insert result was returned.");
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to add product.");
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full mx-auto p-3 md:p-6 theme-dashboard-bg min-h-screen">
      <div className="mb-6">
        <h1 className="text-xl md:text-3xl font-bold theme-text">
          Add New Product
        </h1>
        <p className="text-sm text-gray-600">
          Add product details, upload gallery images, and set catalog options.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 gap-4 rounded-lg border theme-border bg-white/80 p-4 shadow-sm md:grid-cols-2"
      >
        {[
          { label: "Product Name", name: "name" },
          { label: "Price", name: "price", type: "number", required: true },
          { label: "Discount Price", name: "discountPrice", type: "number" },
          { label: "Category", name: "category", required: true },
          { label: "Brand", name: "brand" },
        ].map(({ label, name, type = "text", required }) => (
          <label key={name} className="form-control">
            <span className="label">
              <span className={labelClass}>{label}</span>
            </span>
            <input
              type={type}
              name={name}
              value={formData[name]}
              onChange={handleChange}
              className={inputClass}
              min={type === "number" ? "0" : undefined}
              step={type === "number" ? "0.01" : undefined}
              required={required}
            />
          </label>
        ))}

        <div className="form-control md:col-span-2">
          <span className="label">
            <span className={labelClass}>Weight / Volume</span>
          </span>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_180px]">
            <input
              type="number"
              name="volumeAmount"
              value={formData.volumeAmount}
              onChange={handleChange}
              className={inputClass}
              placeholder="Amount (e.g., 500)"
              min="0"
            />
            <select
              name="volumeUnit"
              value={formData.volumeUnit}
              onChange={handleChange}
              className="select select-bordered w-full bg-white border theme-border"
            >
              <option value="" disabled>
                Unit
              </option>
              {units.map((unit) => (
                <option key={unit} value={unit}>
                  {unit}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-control md:col-span-2">
          <span className="label">
            <span className={labelClass}>Product Images</span>
          </span>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            disabled={uploadingImage}
            className="file-input w-full bg-white border theme-border"
          />
          {uploadingImage && (
            <p className="mt-2 text-sm text-gray-500">Uploading images...</p>
          )}

          {formData.images.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-3">
              {formData.images.map((url) => (
                <div key={url} className="relative">
                  <button
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({ ...prev, thumbnail: url }))
                    }
                    className="block"
                    title="Set as thumbnail"
                  >
                    <img
                      src={url}
                      alt="Uploaded product"
                      className={`h-24 w-24 rounded border object-cover ${
                        url === formData.thumbnail
                          ? "ring-2 ring-[var(--theme-secondary)]"
                          : ""
                      }`}
                    />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(url)}
                    className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs text-white"
                    aria-label="Remove image"
                  >
                    x
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="grid gap-3 md:col-span-2 md:grid-cols-3">
          {[
            { name: "inStock", label: "In Stock" },
            { name: "active", label: "Active / Visible" },
            { name: "featured", label: "Featured Product" },
          ].map((field) => (
            <label
              key={field.name}
              className="form-control flex-row items-center gap-2 rounded-lg border theme-border bg-white p-3"
            >
              <input
                type="checkbox"
                name={field.name}
                checked={formData[field.name]}
                onChange={handleChange}
                className="checkbox checked:bg-[var(--theme-secondary)] checked:border-[var(--theme-secondary)]"
              />
              <span className={labelClass}>{field.label}</span>
            </label>
          ))}
        </div>

        <div className="form-control md:col-span-2">
          <span className="label">
            <span className={labelClass}>Product Colors</span>
          </span>
          <div className="flex flex-col gap-4 md:flex-row md:items-start">
            <HexColorPicker color={selectedColor} onChange={setSelectedColor} />
            <div className="w-full md:w-64">
              <input
                type="text"
                value={selectedColor}
                onChange={(event) => setSelectedColor(event.target.value)}
                className={`${inputClass} mb-2 uppercase`}
              />
              <div className="mb-3 flex items-center gap-3">
                <div
                  className="h-12 w-12 rounded border theme-border"
                  style={{ backgroundColor: selectedColor }}
                />
                <button
                  type="button"
                  onClick={handleAddColor}
                  className="btn btn-sm border-0 text-white theme-gradient theme-gradient-hover"
                >
                  Add Color
                </button>
              </div>
            </div>
          </div>

          {formData.colors.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-3">
              {formData.colors.map((color) => (
                <div
                  key={color}
                  className="flex items-center gap-2 rounded border theme-border bg-white px-2 py-1"
                >
                  <div
                    className="h-6 w-6 rounded"
                    style={{ backgroundColor: color }}
                  />
                  <span className="text-sm uppercase">{color}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveColor(color)}
                    className="text-sm font-bold text-red-500 hover:text-red-700"
                    aria-label={`Remove ${color}`}
                  >
                    x
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <label className="form-control md:col-span-2">
          <span className="label">
            <span className={labelClass}>Description</span>
          </span>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="textarea textarea-bordered w-full bg-white border theme-border"
            rows={4}
          />
        </label>

        <div className="col-span-full mt-3">
          <button
            type="submit"
            disabled={submitting || uploadingImage}
            className="btn w-full rounded-lg border-0 px-4 py-4 font-semibold text-white theme-gradient theme-gradient-hover disabled:opacity-60"
          >
            {submitting
              ? "Adding Product..."
              : uploadingImage
                ? "Uploading images..."
                : "Add Product"}
          </button>
        </div>
      </form>

      <ToastContainer />
    </div>
  );
};

export default AddProducts;
