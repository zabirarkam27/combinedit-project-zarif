import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { HexColorPicker } from "react-colorful";
import {
  ArrowLeft,
  BadgeDollarSign,
  Boxes,
  CheckCircle2,
  ImagePlus,
  Loader2,
  Package,
  Palette,
  Plus,
  Save,
  Settings2,
  Tags,
  Trash2,
  X,
} from "lucide-react";

import useVolumeInput from "../../hooks/useVolumeInput";
import useImageGallery from "../../hooks/useImageGallery";
import { getProductById, updateProduct } from "../../services/products";
import {
  addUniqueColor,
  buildImageColorPairs,
  extractDominantColor,
  normalizeHexColor,
  normalizeImageColorMap,
  removeColorFromMap,
} from "../../utils/imageColors";
import "react-toastify/dist/ReactToastify.css";

const VOLUME_UNITS = ["ml", "liter", "gram", "kg", "dozen", "piece"];
const DEFAULT_SIZES = [
  "XS", "S", "M", "L", "XL", "XXL",
  "US 7", "US 8", "US 9", "US 10", "US 11",
  "UK 6", "UK 7", "UK 8", "UK 9", "UK 10",
  "EU 40", "EU 41", "EU 42", "EU 43", "EU 44",
  "25 cm", "26 cm", "27 cm", "28 cm", "29 cm",
  "28 in", "30 in", "32 in", "34 in", "36 in", "38 in", "40 in", "42 in", "44 in",
];

const inputClass =
  "h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 text-sm font-semibold text-slate-700 outline-none transition focus:border-[var(--theme-primary)] focus:bg-white focus:ring-2 focus:ring-[var(--theme-muted-bg)]";
const labelClass = "text-xs font-black uppercase tracking-wide text-slate-500";
const cardClass =
  "rounded-[28px] border border-white/70 bg-white p-5 shadow-[0_18px_45px_rgba(15,23,42,0.07)]";

const isValidImageUrl = (url) => {
  try {
    const cleanUrl = new URL(url).pathname;
    return /\.(jpeg|jpg|jfif|pjpeg|pjp|gif|png|apng|webp|avif|bmp|ico|svg|tif|tiff|heif|heic)$/i.test(
      cleanUrl
    );
  } catch {
    return false;
  }
};

const UpdateProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [product, setProduct] = useState({
    name: "",
    category: "",
    brand: "",
    price: "",
    discountPrice: "",
    description: "",
    inStock: true,
    active: true,
    featured: false,
    stockQuantity: 0,
    colors: [],
    sizes: [],
    imageColorMap: {},
  });

  const [selectedColor, setSelectedColor] = useState("#ffffff");
  const [thumbnail, setThumbnail] = useState(null);
  const [customSize, setCustomSize] = useState("");
  const [singleUrlInput, setSingleUrlInput] = useState("");
  const [galleryUrlInput, setGalleryUrlInput] = useState("");

  const { volumeAmount, volumeUnit, setVolumeAmount, setVolumeUnit, getCombinedVolume } =
    useVolumeInput();

  const {
    addSingleImage,
    addSingleImageFromUrl,
    setInitialSingleImage,
    images = [],
    addImage,
    addImageFromUrl: addGalleryImageFromUrl,
    removeImage,
    setInitialImages,
    uploading,
  } = useImageGallery();

  const addImageFromUrl = (url) => {
    if (!url) return;
    addGalleryImageFromUrl(url);
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await getProductById(id);
        const data = res.data;

        setProduct({
          name: data.name || "",
          category: data.category || "",
          brand: data.brand || "",
          price: data.price || "",
          discountPrice: data.discountPrice || "",
          description: data.description || "",
          inStock: data.inStock ?? true,
          active: data.active ?? true,
          featured: data.featured ?? false,
          stockQuantity: data.stockQuantity ?? 0,
          colors: data.colors || [],
          sizes: data.sizes || [],
          imageColorMap: normalizeImageColorMap(data),
        });

        setThumbnail(data.thumbnail || (data.images?.[0] ?? null));

        const [amount, unit] = (data.volume || "").split(" ");
        setVolumeAmount(amount || "");
        setVolumeUnit(unit || "");

        setInitialSingleImage(data.thumbnail || null);
        setInitialImages(data.images || []);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load product.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const pricePreview = useMemo(() => {
    const price = Number(product.price || 0);
    const discount = Number(product.discountPrice || 0);
    const effective = discount > 0 && discount < price ? discount : price;
    return {
      price,
      discount,
      effective,
      hasDiscount: discount > 0 && discount < price,
    };
  }, [product.price, product.discountPrice]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProduct((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleStockChange = (e) => {
    const value = parseInt(e.target.value, 10);
    setProduct((prev) => ({ ...prev, stockQuantity: isNaN(value) ? 0 : value }));
  };

  const handleAddColor = () => {
    const normalizedColor = normalizeHexColor(selectedColor);

    if (normalizedColor && !product.colors.some((color) => normalizeHexColor(color) === normalizedColor)) {
      setProduct((prev) => ({
        ...prev,
        colors: [...prev.colors, normalizedColor],
        imageColorMap: thumbnail
          ? { ...prev.imageColorMap, [thumbnail]: normalizedColor }
          : prev.imageColorMap,
      }));
      setSelectedColor(normalizedColor);
      toast.success("Color added!");
    } else {
      toast.error("Color already added or invalid!");
    }
  };

  const handleRemoveColor = (color) => {
    setProduct((prev) => ({
      ...prev,
      colors: prev.colors.filter((c) => normalizeHexColor(c) !== normalizeHexColor(color)),
      imageColorMap: removeColorFromMap(prev.imageColorMap, color),
    }));
  };

  const rememberImageColor = (imageUrl, color) => {
    const normalizedColor = normalizeHexColor(color);
    if (!imageUrl || !normalizedColor) return;

    setProduct((prev) => ({
      ...prev,
      colors: addUniqueColor(prev.colors, normalizedColor),
      imageColorMap: {
        ...prev.imageColorMap,
        [imageUrl]: normalizedColor,
      },
    }));
    setSelectedColor(normalizedColor);
  };

  const handleGalleryImageSelect = (imageUrl) => {
    setThumbnail(imageUrl);
    const mappedColor = normalizeHexColor(product.imageColorMap?.[imageUrl]);
    if (mappedColor) setSelectedColor(mappedColor);
  };

  const handleRemoveGalleryImage = (index, imageUrl) => {
    removeImage(index);
    setProduct((prev) => {
      const imageColorMap = { ...prev.imageColorMap };
      delete imageColorMap[imageUrl];
      return { ...prev, imageColorMap };
    });
    if (thumbnail === imageUrl) {
      setThumbnail(images.filter((_, imageIndex) => imageIndex !== index)[0] || null);
    }
  };

  const handleAddSize = (size) => {
    if (size && !product.sizes.includes(size)) {
      setProduct((prev) => ({ ...prev, sizes: [...prev.sizes, size] }));
    }
  };

  const handleAddCustomSize = () => {
    if (customSize.trim()) {
      handleAddSize(customSize.trim());
      setCustomSize("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting || uploading) return;

    const price = Number(product.price);
    const discountPrice = product.discountPrice ? Number(product.discountPrice) : null;

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
      const imageColors = buildImageColorPairs(
        [thumbnail, ...images].filter(Boolean),
        product.imageColorMap
      );
      const colors = imageColors.reduce(
        (items, item) => addUniqueColor(items, item.color),
        product.colors.map(normalizeHexColor).filter(Boolean)
      );

      const updatedProduct = {
        ...product,
        volume: getCombinedVolume(),
        name: product.name.trim(),
        category: product.category.trim(),
        brand: product.brand.trim(),
        description: product.description.trim(),
        price,
        discountPrice,
        thumbnail,
        images,
        colors,
        imageColors,
      };
      delete updatedProduct.imageColorMap;

      const res = await updateProduct(id, updatedProduct);
      if (res.data?.modifiedCount > 0 || res.data?.acknowledged) {
        toast.success("Product updated successfully!");
        navigate("/dashboard/edit-your-products/all");
      } else {
        toast.info("No changes detected.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to update product.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center theme-dashboard-bg px-4">
        <div className="rounded-3xl bg-white p-8 text-center shadow-[0_18px_45px_rgba(15,23,42,0.08)]">
          <Loader2 className="mx-auto animate-spin text-[var(--theme-primary)]" size={30} />
          <p className="mt-4 font-black text-slate-800">Loading product...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full theme-dashboard-bg px-2 py-4 md:px-4">
      <div className="mx-auto w-full max-w-7xl space-y-5">
        <section className="overflow-hidden rounded-[28px] border border-white/70 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
          <div className="flex flex-col gap-5 p-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <button
                type="button"
                onClick={() => navigate("/dashboard/edit-your-products/all")}
                className="mb-4 inline-flex items-center gap-2 rounded-2xl bg-slate-100 px-3 py-2 text-xs font-black text-slate-600 transition hover:bg-slate-200"
              >
                <ArrowLeft size={15} />
                Back to products
              </button>
              <p className="text-xs font-black uppercase tracking-wide text-[var(--theme-primary)]">
                Catalog editor
              </p>
              <h1 className="mt-2 text-2xl font-black tracking-tight text-slate-950 md:text-4xl">
                Update Product
              </h1>
              <p className="mt-2 max-w-2xl text-sm font-medium leading-6 text-slate-500">
                Edit product information, media, pricing, stock visibility, colors, and available sizes.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:min-w-[560px]">
              <div className="rounded-2xl bg-slate-50 p-3">
                <p className="text-[11px] font-black uppercase text-slate-500">Stock</p>
                <p className="mt-1 text-xl font-black text-slate-950">
                  {Number(product.stockQuantity || 0)}
                </p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-3">
                <p className="text-[11px] font-black uppercase text-slate-500">Colors</p>
                <p className="mt-1 text-xl font-black text-slate-950">{product.colors.length}</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-3">
                <p className="text-[11px] font-black uppercase text-slate-500">Sizes</p>
                <p className="mt-1 text-xl font-black text-slate-950">{product.sizes.length}</p>
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
                    <Package size={20} />
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
                    ["name", "Product name"],
                    ["category", "Category"],
                    ["brand", "Brand"],
                    ["price", "Regular price"],
                    ["discountPrice", "Discount price"],
                  ].map(([field, label]) => (
                    <label key={field} className="block">
                      <span className={labelClass}>{label}</span>
                      <input
                        type={["price", "discountPrice"].includes(field) ? "number" : "text"}
                        name={field}
                        value={product[field] ?? ""}
                        onChange={handleChange}
                        className={`${inputClass} mt-2`}
                        required={field !== "discountPrice"}
                      />
                    </label>
                  ))}
                </div>

                <label className="mt-4 block">
                  <span className={labelClass}>Description</span>
                  <textarea
                    name="description"
                    value={product.description ?? ""}
                    onChange={handleChange}
                    className="mt-2 min-h-32 w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm font-semibold leading-6 text-slate-700 outline-none transition focus:border-[var(--theme-primary)] focus:bg-white focus:ring-2 focus:ring-[var(--theme-muted-bg)]"
                    rows="4"
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
                      Variants
                    </p>
                    <h2 className="text-xl font-black text-slate-950">Volume and sizes</h2>
                  </div>
                </div>

                <div className="grid gap-5 lg:grid-cols-2">
                  <div>
                    <span className={labelClass}>Volume</span>
                    <div className="mt-2 grid grid-cols-2 gap-2">
                      <input
                        type="number"
                        value={volumeAmount ?? ""}
                        onChange={(e) => setVolumeAmount(e.target.value)}
                        className={inputClass}
                        placeholder="Amount"
                      />
                      <select
                        value={volumeUnit ?? ""}
                        onChange={(e) => setVolumeUnit(e.target.value)}
                        className={inputClass}
                      >
                        <option value="" disabled>
                          Unit
                        </option>
                        {VOLUME_UNITS.map((unit) => (
                          <option key={unit} value={unit}>
                            {unit}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <span className={labelClass}>Available sizes</span>
                    <div className="mt-2 grid gap-2 sm:grid-cols-[1fr_1.4fr]">
                      <select
                        onChange={(e) => {
                          handleAddSize(e.target.value);
                          e.target.selectedIndex = 0;
                        }}
                        className={inputClass}
                        defaultValue=""
                      >
                        <option value="" disabled>
                          Select size
                        </option>
                        {DEFAULT_SIZES.map((size) => (
                          <option key={size} value={size}>
                            {size}
                          </option>
                        ))}
                      </select>

                      <div className="grid grid-cols-[1fr_auto] gap-2">
                        <input
                          type="text"
                          value={customSize}
                          onChange={(e) => setCustomSize(e.target.value)}
                          placeholder="Custom size"
                          className={inputClass}
                        />
                        <button
                          type="button"
                          onClick={handleAddCustomSize}
                          className="grid h-12 w-12 place-items-center rounded-2xl bg-slate-100 text-slate-700 transition hover:bg-slate-200"
                          title="Add size"
                        >
                          <Plus size={18} />
                        </button>
                      </div>
                    </div>

                    {product.sizes?.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {product.sizes.map((size) => (
                          <span
                            key={size}
                            className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-700"
                          >
                            {size}
                            <button
                              type="button"
                              onClick={() =>
                                setProduct((prev) => ({
                                  ...prev,
                                  sizes: prev.sizes.filter((item) => item !== size),
                                }))
                              }
                              className="text-rose-600"
                            >
                              <X size={13} />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
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
                        onChange={(e) => setSelectedColor(e.target.value)}
                        className={inputClass}
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

                {product.colors.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {product.colors.map((color) => (
                      <span
                        key={color}
                        className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-700"
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
                        checked={Boolean(product[field.name])}
                        onChange={handleChange}
                        className="toggle checked:bg-[var(--theme-primary)]"
                      />
                    </label>
                  ))}
                </div>

                <label className="mt-4 block">
                  <span className={labelClass}>Stock quantity</span>
                  <input
                    type="number"
                    min={0}
                    value={product.stockQuantity}
                    onChange={handleStockChange}
                    className={`${inputClass} mt-2`}
                  />
                </label>
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
                  <p className="text-xs font-black uppercase text-slate-500">Current selling price</p>
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
                <h2 className="text-xl font-black text-slate-950">Thumbnail and gallery</h2>
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-[minmax(260px,0.8fr)_minmax(0,1.2fr)]">
              <div>
                <span className={labelClass}>Thumbnail image</span>
                <div className="mt-3">
                  {thumbnail ? (
                    <div className="relative h-48 overflow-hidden rounded-3xl border border-slate-100 bg-slate-50">
                      <img
                        src={thumbnail}
                        alt="Thumbnail"
                        className="h-full w-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => setThumbnail(null)}
                        className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-xl bg-rose-600 text-white"
                        title="Remove thumbnail"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ) : (
                    <label className="grid h-48 cursor-pointer place-items-center rounded-3xl border border-dashed border-slate-300 bg-slate-50 transition hover:bg-slate-100">
                      <span className="text-center">
                        <ImagePlus className="mx-auto text-slate-400" size={34} />
                        <span className="mt-2 block text-sm font-black text-slate-500">
                          {uploading ? "Uploading..." : "Upload thumbnail"}
                        </span>
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        disabled={uploading}
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const [autoColor, uploadedUrl] = await Promise.all([
                              extractDominantColor(file),
                              addSingleImage(file),
                            ]);
                            if (uploadedUrl) setThumbnail(uploadedUrl);
                            rememberImageColor(uploadedUrl, autoColor);
                          }
                          e.target.value = "";
                        }}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>

                <div className="mt-3 grid grid-cols-[1fr_auto] gap-2">
                  <input
                    type="text"
                    value={singleUrlInput}
                    onChange={(e) => setSingleUrlInput(e.target.value)}
                    placeholder="Enter thumbnail URL"
                    className={inputClass}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (isValidImageUrl(singleUrlInput)) {
                        addSingleImageFromUrl(singleUrlInput);
                        setThumbnail(singleUrlInput);
                        rememberImageColor(singleUrlInput, selectedColor);
                        setSingleUrlInput("");
                        toast.success("Thumbnail URL added");
                      } else {
                        toast.error("Invalid thumbnail URL");
                      }
                    }}
                    className="h-12 rounded-2xl bg-slate-100 px-4 text-sm font-black text-slate-700 transition hover:bg-slate-200"
                  >
                    Add
                  </button>
                </div>
              </div>

              <div>
                <span className={labelClass}>Gallery images</span>
                <div className="mt-3 flex flex-wrap gap-3">
                  {images.map((imgUrl, index) => (
                    <div key={`${imgUrl}-${index}`} className="group relative">
                      <button
                        type="button"
                        onClick={() => handleGalleryImageSelect(imgUrl)}
                        className={`relative block h-28 w-28 overflow-hidden rounded-2xl border bg-slate-50 ${
                          thumbnail === imgUrl
                            ? "border-[var(--theme-primary)] ring-2 ring-[var(--theme-muted-bg)]"
                            : "border-slate-100"
                        }`}
                        title="Set thumbnail and matching color"
                      >
                        <img
                          src={imgUrl}
                          alt={`Product ${index}`}
                          className="h-full w-full object-cover"
                        />
                        {product.imageColorMap?.[imgUrl] && (
                          <span
                            className="absolute bottom-2 right-2 h-5 w-5 rounded-full border-2 border-white shadow"
                            style={{ backgroundColor: product.imageColorMap[imgUrl] }}
                          />
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemoveGalleryImage(index, imgUrl)}
                        className="absolute -right-2 -top-2 grid h-7 w-7 place-items-center rounded-full bg-rose-600 text-white shadow"
                        title="Remove image"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}

                  <label className="grid h-28 w-28 cursor-pointer place-items-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 transition hover:bg-slate-100">
                    <span className="text-center">
                      <Plus className="mx-auto text-slate-400" size={28} />
                      <span className="mt-1 block text-[11px] font-black text-slate-500">Upload</span>
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      disabled={uploading}
                      onChange={async (e) => {
                        const files = Array.from(e.target.files || []);
                        for (const file of files) {
                          const [autoColor, uploadedUrl] = await Promise.all([
                            extractDominantColor(file),
                            addImage(file),
                          ]);
                          rememberImageColor(uploadedUrl, autoColor);
                        }
                        e.target.value = "";
                      }}
                      className="hidden"
                    />
                  </label>
                </div>

                {uploading && (
                  <p className="mt-3 inline-flex items-center gap-2 text-sm font-bold text-slate-500">
                    <Loader2 className="animate-spin" size={16} />
                    Uploading image...
                  </p>
                )}

                <div className="mt-3 grid grid-cols-[1fr_auto] gap-2">
                  <input
                    type="text"
                    value={galleryUrlInput}
                    onChange={(e) => setGalleryUrlInput(e.target.value)}
                    placeholder="Enter gallery image URL"
                    className={inputClass}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (isValidImageUrl(galleryUrlInput)) {
                        addImageFromUrl(galleryUrlInput);
                        rememberImageColor(galleryUrlInput, selectedColor);
                        setGalleryUrlInput("");
                        toast.success("Gallery image URL added");
                      } else {
                        toast.error("Invalid gallery image URL");
                      }
                    }}
                    className="h-12 rounded-2xl bg-slate-100 px-4 text-sm font-black text-slate-700 transition hover:bg-slate-200"
                  >
                    Add
                  </button>
                </div>
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
                  <p className="font-black text-slate-950">{product.name || "Untitled product"}</p>
                  <p className="text-xs font-semibold text-slate-500">
                    {uploading ? "Wait for images to finish uploading" : "Ready to save catalog changes"}
                  </p>
                </div>
              </div>
              <button
                type="submit"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-[var(--theme-primary)] px-5 text-sm font-black text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                disabled={submitting || uploading}
              >
                <Save size={18} />
                {submitting ? "Updating..." : uploading ? "Uploading image..." : "Update Product"}
              </button>
            </div>
          </section>
        </form>
      </div>

      <ToastContainer />
    </div>
  );
};

export default UpdateProduct;
