import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { HexColorPicker } from "react-colorful";
import { toast, ToastContainer } from "react-toastify";
import {
  ArrowLeft,
  BadgeDollarSign,
  CheckCircle2,
  ImagePlus,
  Loader2,
  PackagePlus,
  Palette,
  Plus,
  Save,
  Settings2,
  Tags,
  Trash2,
  X,
} from "lucide-react";
import "react-toastify/dist/ReactToastify.css";

import useImageUpload from "../../hooks/useImageUpload";
import { addProduct } from "../../services/products";
import {
  addUniqueColor,
  buildImageColorPairs,
  extractDominantColor,
  normalizeHexColor,
  removeColorFromMap,
} from "../../utils/imageColors";

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
  imageColorMap: {},
};

const units = ["ml", "liter", "gram", "kg", "dozen", "piece"];
const inputClass =
  "h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 text-sm font-semibold text-slate-700 outline-none transition focus:border-[var(--theme-primary)] focus:bg-white focus:ring-2 focus:ring-[var(--theme-muted-bg)]";
const labelClass = "text-xs font-black uppercase tracking-wide text-slate-500";
const cardClass =
  "rounded-[28px] border border-white/70 bg-white p-5 shadow-[0_18px_45px_rgba(15,23,42,0.07)]";

const AddProducts = () => {
  const navigate = useNavigate();
  const { uploadImage } = useImageUpload();

  const [formData, setFormData] = useState(emptyProduct);
  const [selectedColor, setSelectedColor] = useState("#ffffff");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const pricePreview = useMemo(() => {
    const price = Number(formData.price || 0);
    const discount = Number(formData.discountPrice || 0);
    const effective = discount > 0 && discount < price ? discount : price;
    return {
      price,
      effective,
      hasDiscount: discount > 0 && discount < price,
    };
  }, [formData.price, formData.discountPrice]);

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
      const uploadedItems = [];

      for (const file of files) {
        const [autoColor, url] = await Promise.all([
          extractDominantColor(file),
          uploadImage(file),
        ]);
        if (url) uploadedItems.push({ url, color: autoColor });
      }

      if (uploadedItems.length > 0) {
        setFormData((prev) => {
          const images = [...prev.images, ...uploadedItems.map((item) => item.url)];
          const imageColorMap = { ...prev.imageColorMap };
          let colors = [...prev.colors];

          uploadedItems.forEach(({ url, color }) => {
            const normalizedColor = normalizeHexColor(color);
            if (!normalizedColor) return;
            imageColorMap[url] = normalizedColor;
            colors = addUniqueColor(colors, normalizedColor);
          });

          return {
            ...prev,
            images,
            colors,
            imageColorMap,
            thumbnail: prev.thumbnail || images[0],
          };
        });

        const latestColor = [...uploadedItems]
          .reverse()
          .map((item) => normalizeHexColor(item.color))
          .find(Boolean);
        if (latestColor) setSelectedColor(latestColor);
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
      const imageColorMap = { ...prev.imageColorMap };
      delete imageColorMap[url];
      return {
        ...prev,
        images,
        imageColorMap,
        thumbnail: prev.thumbnail === url ? images[0] || "" : prev.thumbnail,
      };
    });
  };

  const handleAddColor = () => {
    const normalizedColor = normalizeHexColor(selectedColor);

    if (!normalizedColor) {
      toast.error("Use a valid hex color.");
      return;
    }

    if (formData.colors.some((color) => normalizeHexColor(color) === normalizedColor)) {
      toast.info("This color is already added.");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      colors: [...prev.colors, normalizedColor],
      imageColorMap: prev.thumbnail
        ? { ...prev.imageColorMap, [prev.thumbnail]: normalizedColor }
        : prev.imageColorMap,
    }));
    setSelectedColor(normalizedColor);
  };

  const handleRemoveColor = (color) => {
    setFormData((prev) => ({
      ...prev,
      colors: prev.colors.filter((item) => normalizeHexColor(item) !== normalizeHexColor(color)),
      imageColorMap: removeColorFromMap(prev.imageColorMap, color),
    }));
  };

  const handleSelectImage = (url) => {
    const mappedColor = normalizeHexColor(formData.imageColorMap?.[url]);
    setFormData((prev) => ({ ...prev, thumbnail: url }));
    if (mappedColor) setSelectedColor(mappedColor);
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
      const imageColors = buildImageColorPairs(formData.images, formData.imageColorMap);
      const colors = imageColors.reduce(
        (items, item) => addUniqueColor(items, item.color),
        formData.colors.map(normalizeHexColor).filter(Boolean)
      );

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
        colors,
        imageColors,
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
    <div className="min-h-screen w-full theme-dashboard-bg px-2 py-4 md:px-4">
      <div className="mx-auto w-full max-w-7xl space-y-5">
        <section className="overflow-hidden rounded-[28px] border border-white/70 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
          <div className="flex flex-col gap-5 p-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <button
                type="button"
                onClick={() => navigate("/dashboard/edit-your-products")}
                className="mb-4 inline-flex items-center gap-2 rounded-2xl bg-slate-100 px-3 py-2 text-xs font-black text-slate-600 transition hover:bg-slate-200"
              >
                <ArrowLeft size={15} />
                Back to catalog
              </button>
              <p className="text-xs font-black uppercase tracking-wide text-[var(--theme-primary)]">
                Catalog creator
              </p>
              <h1 className="mt-2 text-2xl font-black tracking-tight text-slate-950 md:text-4xl">
                Add New Product
              </h1>
              <p className="mt-2 max-w-2xl text-sm font-medium leading-6 text-slate-500">
                Add product details, upload gallery images, choose colors, and configure catalog visibility.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:min-w-[560px]">
              <div className="rounded-2xl bg-slate-50 p-3">
                <p className="text-[11px] font-black uppercase text-slate-500">Images</p>
                <p className="mt-1 text-xl font-black text-slate-950">{formData.images.length}</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-3">
                <p className="text-[11px] font-black uppercase text-slate-500">Colors</p>
                <p className="mt-1 text-xl font-black text-slate-950">{formData.colors.length}</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-3">
                <p className="text-[11px] font-black uppercase text-slate-500">Status</p>
                <p className="mt-1 text-sm font-black text-slate-950">
                  {formData.active ? "Visible" : "Hidden"}
                </p>
              </div>
              <div className="rounded-2xl bg-[var(--theme-muted-bg)] p-3 text-[var(--theme-primary)]">
                <p className="text-[11px] font-black uppercase">Price</p>
                <p className="mt-1 text-lg font-black">
                  BDT {pricePreview.effective.toLocaleString("en-US")}
                </p>
              </div>
            </div>
          </div>
        </section>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid gap-5 xl:grid-cols-[minmax(0,1.35fr)_minmax(330px,0.65fr)]">
            <div className="space-y-5">
              <section className={cardClass}>
                <div className="mb-5 flex items-center gap-3">
                  <span className="grid h-11 w-11 place-items-center rounded-2xl bg-[var(--theme-muted-bg)] text-[var(--theme-primary)]">
                    <PackagePlus size={20} />
                  </span>
                  <div>
                    <p className="text-xs font-black uppercase tracking-wide text-[var(--theme-primary)]">
                      Basics
                    </p>
                    <h2 className="text-xl font-black text-slate-950">Product information</h2>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  {[
                    { label: "Product Name", name: "name", required: true },
                    { label: "Price", name: "price", type: "number", required: true },
                    { label: "Discount Price", name: "discountPrice", type: "number" },
                    { label: "Category", name: "category", required: true },
                    { label: "Brand", name: "brand" },
                  ].map(({ label, name, type = "text", required }) => (
                    <label key={name} className="block">
                      <span className={labelClass}>{label}</span>
                      <input
                        type={type}
                        name={name}
                        value={formData[name]}
                        onChange={handleChange}
                        className={`${inputClass} mt-2`}
                        min={type === "number" ? "0" : undefined}
                        step={type === "number" ? "0.01" : undefined}
                        required={required}
                      />
                    </label>
                  ))}
                </div>

                <label className="mt-4 block">
                  <span className={labelClass}>Description</span>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="mt-2 min-h-32 w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm font-semibold leading-6 text-slate-700 outline-none transition focus:border-[var(--theme-primary)] focus:bg-white focus:ring-2 focus:ring-[var(--theme-muted-bg)]"
                    rows={4}
                  />
                </label>
              </section>

              <section className={cardClass}>
                <div className="mb-5 flex items-center gap-3">
                  <span className="grid h-11 w-11 place-items-center rounded-2xl bg-blue-50 text-blue-700">
                    <Tags size={20} />
                  </span>
                  <div>
                    <p className="text-xs font-black uppercase tracking-wide text-[var(--theme-primary)]">
                      Volume
                    </p>
                    <h2 className="text-xl font-black text-slate-950">Weight / volume</h2>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_180px]">
                  <input
                    type="number"
                    name="volumeAmount"
                    value={formData.volumeAmount}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder="Amount, e.g. 500"
                    min="0"
                  />
                  <select
                    name="volumeUnit"
                    value={formData.volumeUnit}
                    onChange={handleChange}
                    className={inputClass}
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
              </section>

              <section className={cardClass}>
                <div className="mb-5 flex items-center gap-3">
                  <span className="grid h-11 w-11 place-items-center rounded-2xl bg-violet-50 text-violet-700">
                    <Palette size={20} />
                  </span>
                  <div>
                    <p className="text-xs font-black uppercase tracking-wide text-[var(--theme-primary)]">
                      Colors
                    </p>
                    <h2 className="text-xl font-black text-slate-950">Product colors</h2>
                  </div>
                </div>

                <div className="flex flex-col gap-5 sm:flex-row">
                  <HexColorPicker
                    color={selectedColor}
                    onChange={setSelectedColor}
                    style={{ height: 168, width: 168 }}
                  />
                  <div className="flex-1">
                    <span className={labelClass}>Selected color</span>
                    <div className="mt-2 grid gap-2 sm:grid-cols-[1fr_auto]">
                      <input
                        type="text"
                        value={selectedColor}
                        onChange={(event) => setSelectedColor(event.target.value)}
                        className={`${inputClass} uppercase`}
                      />
                      <button
                        type="button"
                        onClick={handleAddColor}
                        className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-slate-950 px-4 text-sm font-black text-white transition hover:bg-slate-800"
                      >
                        <Plus size={17} />
                        Add
                      </button>
                    </div>
                    <div
                      className="mt-3 h-16 rounded-2xl border border-slate-200"
                      style={{ backgroundColor: selectedColor }}
                    />
                  </div>
                </div>

                {formData.colors.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {formData.colors.map((color) => (
                      <span
                        key={color}
                        className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-black uppercase text-slate-700"
                      >
                        <span
                          className="h-4 w-4 rounded-full border border-black/10"
                          style={{ backgroundColor: color }}
                        />
                        {color}
                        <button
                          type="button"
                          onClick={() => handleRemoveColor(color)}
                          className="text-rose-600"
                          aria-label={`Remove ${color}`}
                        >
                          <X size={13} />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </section>
            </div>

            <aside className="space-y-5">
              <section className={cardClass}>
                <div className="mb-5 flex items-center gap-3">
                  <span className="grid h-11 w-11 place-items-center rounded-2xl bg-emerald-50 text-emerald-700">
                    <CheckCircle2 size={20} />
                  </span>
                  <div>
                    <p className="text-xs font-black uppercase tracking-wide text-[var(--theme-primary)]">
                      Availability
                    </p>
                    <h2 className="text-xl font-black text-slate-950">Status</h2>
                  </div>
                </div>

                <div className="grid gap-3">
                  {[
                    { name: "inStock", label: "In Stock" },
                    { name: "active", label: "Active / Visible" },
                    { name: "featured", label: "Featured Product" },
                  ].map((field) => (
                    <label
                      key={field.name}
                      className="flex items-center justify-between gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-3"
                    >
                      <span className="font-black text-slate-700">{field.label}</span>
                      <input
                        type="checkbox"
                        name={field.name}
                        checked={formData[field.name]}
                        onChange={handleChange}
                        className="toggle checked:bg-[var(--theme-primary)]"
                      />
                    </label>
                  ))}
                </div>
              </section>

              <section className={cardClass}>
                <div className="mb-5 flex items-center gap-3">
                  <span className="grid h-11 w-11 place-items-center rounded-2xl bg-amber-50 text-amber-700">
                    <BadgeDollarSign size={20} />
                  </span>
                  <div>
                    <p className="text-xs font-black uppercase tracking-wide text-[var(--theme-primary)]">
                      Pricing
                    </p>
                    <h2 className="text-xl font-black text-slate-950">Preview</h2>
                  </div>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs font-black uppercase text-slate-500">Selling price</p>
                  <p className="mt-1 text-3xl font-black text-slate-950">
                    BDT {pricePreview.effective.toLocaleString("en-US")}
                  </p>
                  {pricePreview.hasDiscount && (
                    <p className="mt-1 text-sm font-bold text-slate-400 line-through">
                      BDT {pricePreview.price.toLocaleString("en-US")}
                    </p>
                  )}
                </div>
              </section>
            </aside>
          </div>

          <section className={cardClass}>
            <div className="mb-5 flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-blue-50 text-blue-700">
                <ImagePlus size={20} />
              </span>
              <div>
                <p className="text-xs font-black uppercase tracking-wide text-[var(--theme-primary)]">
                  Media
                </p>
                <h2 className="text-xl font-black text-slate-950">Product images</h2>
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-[minmax(240px,0.75fr)_minmax(0,1.25fr)]">
              <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-5">
                <label className="grid min-h-48 cursor-pointer place-items-center text-center transition hover:bg-slate-100">
                  <span>
                    {uploadingImage ? (
                      <Loader2 className="mx-auto animate-spin text-[var(--theme-primary)]" size={36} />
                    ) : (
                      <ImagePlus className="mx-auto text-slate-400" size={38} />
                    )}
                    <span className="mt-3 block font-black text-slate-700">
                      {uploadingImage ? "Uploading images..." : "Upload product images"}
                    </span>
                    <span className="mt-1 block text-xs font-semibold text-slate-500">
                      First uploaded image becomes thumbnail automatically.
                    </span>
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                    disabled={uploadingImage}
                    className="hidden"
                  />
                </label>
              </div>

              <div>
                <span className={labelClass}>Gallery</span>
                {formData.images.length > 0 ? (
                  <div className="mt-3 flex flex-wrap gap-3">
                    {formData.images.map((url) => (
                      <div key={url} className="group relative">
                        <button
                          type="button"
                          onClick={() => handleSelectImage(url)}
                          className={`relative block h-28 w-28 overflow-hidden rounded-2xl border bg-slate-50 ${
                            url === formData.thumbnail
                              ? "border-[var(--theme-primary)] ring-2 ring-[var(--theme-muted-bg)]"
                              : "border-slate-100"
                          }`}
                          title="Set thumbnail and matching color"
                        >
                          <img
                            src={url}
                            alt="Uploaded product"
                            className="h-full w-full object-cover"
                          />
                          {formData.imageColorMap?.[url] && (
                            <span
                              className="absolute bottom-2 right-2 h-5 w-5 rounded-full border-2 border-white shadow"
                              style={{ backgroundColor: formData.imageColorMap[url] }}
                            />
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(url)}
                          className="absolute -right-2 -top-2 grid h-7 w-7 place-items-center rounded-full bg-rose-600 text-white shadow"
                          aria-label="Remove image"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="mt-3 rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center">
                    <ImagePlus className="mx-auto text-slate-400" size={34} />
                    <p className="mt-2 font-black text-slate-700">No images added yet</p>
                    <p className="mt-1 text-xs font-medium text-slate-500">
                      Upload one or more product images to continue.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </section>

          <section className="sticky bottom-4 z-10 rounded-[28px] border border-white/70 bg-white/95 p-4 shadow-[0_18px_45px_rgba(15,23,42,0.14)] backdrop-blur">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-2xl bg-[var(--theme-muted-bg)] text-[var(--theme-primary)]">
                  <Settings2 size={19} />
                </span>
                <div>
                  <p className="font-black text-slate-950">
                    {formData.name || "Untitled product"}
                  </p>
                  <p className="text-xs font-semibold text-slate-500">
                    {uploadingImage ? "Wait for images to finish uploading" : "Ready to publish catalog item"}
                  </p>
                </div>
              </div>
              <button
                type="submit"
                disabled={submitting || uploadingImage}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-[var(--theme-primary)] px-5 text-sm font-black text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Save size={18} />
                {submitting
                  ? "Adding Product..."
                  : uploadingImage
                    ? "Uploading images..."
                    : "Add Product"}
              </button>
            </div>
          </section>
        </form>
      </div>

      <ToastContainer />
    </div>
  );
};

export default AddProducts;
