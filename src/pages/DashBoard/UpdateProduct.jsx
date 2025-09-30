import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { HexColorPicker } from "react-colorful";
import useVolumeInput from "../../hooks/useVolumeInput";
import useImageGallery from "../../hooks/useImageGallery";
import { getProductById, updateProduct } from "../../services/products";
import "react-toastify/dist/ReactToastify.css";

// ---------- Constants ----------
const VOLUME_UNITS = ["ml", "liter", "gram", "kg", "dozen", "piece"];
const DEFAULT_SIZES = [
  "XS", "S", "M", "L", "XL", "XXL",
  "US 7", "US 8", "US 9", "US 10", "US 11",
  "UK 6", "UK 7", "UK 8", "UK 9", "UK 10",
  "EU 40", "EU 41", "EU 42", "EU 43", "EU 44",
  "25 cm", "26 cm", "27 cm", "28 cm", "29 cm",
  "28 in", "30 in", "32 in", "34 in", "36 in", "38 in", "40 in", "42 in", "44 in"
];
const isValidImageUrl = (url) => {
  try {
    const cleanUrl = new URL(url).pathname;
    return /\.(jpeg|jpg|jfif|pjpeg|pjp|gif|png|apng|webp|avif|bmp|ico|svg|tif|tiff|heif|heic)$/i.test(
      cleanUrl
    );
  } catch (e) {
    return false;
  }
};

const UpdateProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // ---------- States ----------
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
    stockQuantity: 0,
    colors: [],
    sizes: [],
  });

  const [selectedColor, setSelectedColor] = useState("#ffffff");
  const [thumbnail, setThumbnail] = useState(null);
  const [customSize, setCustomSize] = useState("");
  const [singleUrlInput, setSingleUrlInput] = useState("");
  const [galleryUrlInput, setGalleryUrlInput] = useState("");

  // ---------- Hooks ----------
  const { volumeAmount, volumeUnit, setVolumeAmount, setVolumeUnit, getCombinedVolume } = useVolumeInput();

  const {
    addSingleImage,
    addSingleImageFromUrl,
    setInitialSingleImage,
    images = [],
    addImage,
    removeImage,
    setInitialImages,
  } = useImageGallery();

  const addImageFromUrl = (url) => {
    if (!url) return;
    try {
      addImage(url);
    } catch (err) {
      if (typeof addSingleImageFromUrl === "function") {
        addSingleImageFromUrl(url);
      } else {
        console.error("addImage does not accept URL and addSingleImageFromUrl not available.", err);
        toast.error("Unable to add gallery image from URL (hook limitation).");
      }
    }
  };

  // ---------- Fetch Product ----------
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
          stockQuantity: data.stockQuantity ?? 0,
          colors: data.colors || [],
          sizes: data.sizes || [],
        });

        setThumbnail(data.thumbnail || (data.images?.[0] ?? null));

        const [amount, unit] = (data.volume || "").split(" ");
        setVolumeAmount(amount || "");
        setVolumeUnit(unit || "");

        // initialize hook states
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

  // ---------- Handlers ----------
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProduct((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleStockChange = (e) => {
    const value = parseInt(e.target.value);
    setProduct((prev) => ({ ...prev, stockQuantity: isNaN(value) ? 0 : value }));
  };

  const handleAddColor = () => {
    if (selectedColor && !product.colors.includes(selectedColor)) {
      setProduct((prev) => ({ ...prev, colors: [...prev.colors, selectedColor] }));
      toast.success("Color added!");
    } else {
      toast.error("Color already added or invalid!");
    }
  };

  const handleRemoveColor = (color) => {
    setProduct((prev) => ({ ...prev, colors: prev.colors.filter((c) => c !== color) }));
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
    setSubmitting(true);
    try {
      const updatedProduct = {
        ...product,
        volume: getCombinedVolume(),
        price: product.price ? parseFloat(product.price) : 0,
        discountPrice: product.discountPrice ? parseFloat(product.discountPrice) : 0,
        thumbnail,
        images,
      };

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

  if (loading) return <p className="text-center mt-8">Loading product...</p>;

  // ---------- JSX ----------
  return (
    <div className="w-full mx-auto p-4 md:p-6 lg:p-10 bg-[#f7fafa] shadow-lg rounded-xl min-h-screen">
      <h1 className="text-2xl md:text-3xl font-extrabold text-gray-800 mb-8 text-center">Update Product</h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Basic Fields */}
        {["name", "category", "brand", "price", "discountPrice"].map((field) => (
          <div key={field} className="form-control flex flex-col gap-2">
            <label className="label capitalize font-medium text-gray-700">{field}</label>
            <input
              type={["price", "discountPrice"].includes(field) ? "number" : "text"}
              name={field}
              value={product[field] ?? ""}
              onChange={handleChange}
              className="input input-bordered w-full bg-white shadow-sm"
              required={field !== "discountPrice"}
            />
          </div>
        ))}

        {/* Description */}
        <div className="form-control md:col-span-2 lg:col-span-3 flex flex-col gap-2">
          <label className="label font-medium text-gray-700">Description</label>
          <textarea
            name="description"
            value={product.description ?? ""}
            onChange={handleChange}
            className="textarea textarea-bordered w-full bg-white shadow-sm"
            rows="3"
          />
        </div>

        {/* Volume + Sizes */}
        <div className="form-control md:col-span-2 lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Volume */}
          <div className="form-control flex flex-col gap-2">
            <label className="label font-medium text-gray-700">Volume</label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                value={volumeAmount ?? ""}
                onChange={(e) => setVolumeAmount(e.target.value)}
                className="input input-bordered bg-white shadow-sm"
                placeholder="Amount"
              />
              <select
                value={volumeUnit ?? ""}
                onChange={(e) => setVolumeUnit(e.target.value)}
                className="select select-bordered bg-white shadow-sm"
              >
                <option value="" disabled>Unit</option>
                {VOLUME_UNITS.map((u) => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>
          </div>

          {/* Sizes */}
          <div className="form-control flex flex-col gap-2">
            <label className="label font-medium text-gray-700">Available Sizes</label>
            <div className="grid grid-cols-2 gap-2">
              <select onChange={(e) => { handleAddSize(e.target.value); e.target.selectedIndex = 0; }} className="select select-bordered bg-white shadow-sm" defaultValue="">
                <option value="" disabled>Select size</option>
                {DEFAULT_SIZES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>

              <div className="grid grid-cols-3 gap-2">
                <input
                  type="text"
                  value={customSize}
                  onChange={(e) => setCustomSize(e.target.value)}
                  placeholder="Custom size"
                  className="input input-bordered col-span-2 bg-white shadow-sm"
                />
                <button type="button" onClick={handleAddCustomSize} className="btn btn-outline">Add</button>
              </div>
            </div>

            {/* Display Sizes */}
            {product.sizes?.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {product.sizes.map((size, idx) => (
                  <div key={idx} className="flex items-center gap-2 border rounded px-2 py-1 shadow-sm bg-gray-50">
                    <span className="text-sm">{size}</span>
                    <button type="button" onClick={() => setProduct((prev) => ({ ...prev, sizes: prev.sizes.filter((s) => s !== size) }))} className="text-red-500 text-[11px] font-bold hover:text-red-700">✕</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="md:col-span-2 lg:col-span-3 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Colors */}
          <div className="form-control md:col-span-2 flex flex-col gap-2">
            <label className="label font-medium text-gray-700">Choose Product Colors</label>
            <div className="flex flex-col sm:flex-row gap-6">
              <HexColorPicker color={selectedColor} onChange={setSelectedColor} style={{ height: 150, width: 150 }} />
              <div>
                <input type="text" value={selectedColor} onChange={(e) => setSelectedColor(e.target.value)} className="input input-bordered w-full bg-white shadow-sm mb-2" />
                <div className="flex items-center gap-2">
                  <div className="w-12 h-12 rounded border" style={{ backgroundColor: selectedColor }} />
                  <button type="button" onClick={handleAddColor} className="btn btn-outline btn-sm">Add Color</button>
                </div>
              </div>
            </div>

            {/* Display Colors */}
            {product.colors.length > 0 && (
              <div className="flex flex-wrap gap-3 mt-3">
                {product.colors.map((c, idx) => (
                  <div key={idx} className="flex items-center gap-1 border rounded px-2 py-1 bg-gray-50 shadow-sm">
                    <div className="w-5 h-5 rounded" style={{ backgroundColor: c }} />
                    <span className="text-xs">{c}</span>
                    <button type="button" onClick={() => handleRemoveColor(c)} className="text-red-500 text-sm font-bold hover:text-red-700 ml-2">✕</button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* In Stock + Stock Quantity */}
          <div className="form-control md:col-span-2 lg:col-span-3 mt-2 gap-2">
            <div className="flex items-center gap-2">
              <input type="checkbox" name="inStock" checked={product.inStock} onChange={handleChange} className="checkbox" />
              <label className="label-text font-medium">In Stock</label>
            </div>

            <div className="flex items-center gap-2 mt-2">
              <label className="font-medium">Stock Quantity:</label>
              <input
                type="number"
                min={0}
                value={product.stockQuantity}
                onChange={handleStockChange}
                className="input input-bordered w-32 bg-white shadow-sm"
              />
            </div>
          </div>
        </div>

        {/* Thumbnail + Gallery */}
        <div className="md:col-span-2 lg:col-span-3 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Thumbnail */}
          <div className="form-control flex flex-col gap-2">
            <label className="label font-medium text-gray-700">Thumbnail Image</label>

            {thumbnail ? (
              <div className="relative w-24 h-24">
                <img src={thumbnail} alt="Thumbnail" className="w-24 h-24 object-cover rounded shadow" />
                <button type="button" onClick={() => setThumbnail(null)} className="absolute top-[-6px] right-[-6px] bg-red-500 text-white rounded-full p-1 text-xs">✕</button>
              </div>
            ) : (
              <label className="w-24 h-24 flex items-center justify-center border border-dashed border-gray-400 rounded cursor-pointer hover:bg-gray-50">
                <span className="text-3xl text-gray-400">+</span>
                <input type="file" accept="image/*" onChange={(e) => { const f = e.target.files?.[0]; if (f) { addSingleImage(f); setThumbnail(URL.createObjectURL(f)); } }} className="hidden" />
              </label>
            )}

            {/* Thumbnail URL */}
            <div className="flex items-center gap-2 mt-2">
              <input type="text" value={singleUrlInput} onChange={(e) => setSingleUrlInput(e.target.value)} placeholder="Enter thumbnail URL" className="input input-bordered w-full bg-white shadow-sm" />
              <button type="button" onClick={() => {
                if (isValidImageUrl(singleUrlInput)) {
                  addSingleImageFromUrl(singleUrlInput);
                  setThumbnail(singleUrlInput);
                  setSingleUrlInput("");
                  toast.success("Thumbnail URL added");
                } else {
                  toast.error("Invalid thumbnail URL");
                }
              }} className="btn btn-outline">Add</button>
            </div>

            {/* Choose thumbnail from gallery */}
            {images.length > 0 && (
              <div className="flex gap-2 flex-wrap mt-3">
                {images.map((imgUrl, idx) => (
                  <img
                    key={idx}
                    src={imgUrl}
                    alt={`Select thumbnail ${idx}`}
                    className={`w-16 h-16 object-cover rounded border cursor-pointer ${thumbnail === imgUrl ? "border-blue-500 border-2" : "border-gray-300"}`}
                    onClick={() => setThumbnail(imgUrl)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Gallery */}
          <div className="form-control flex flex-col gap-2">
            <label className="label font-medium text-gray-700">Gallery Images</label>

            <div className="flex gap-4 flex-wrap">
              {images.map((imgUrl, idx) => (
                <div key={idx} className="relative">
                  <img src={imgUrl} alt={`Product ${idx}`} className="w-28 h-28 object-cover rounded shadow" />
                  <button type="button" onClick={() => removeImage(idx)} className="absolute top-[-6px] right-[-6px] bg-red-500 text-white rounded-full p-1 text-xs">✕</button>
                </div>
              ))}

              <label className="w-28 h-28 flex items-center justify-center border border-dashed border-gray-400 rounded cursor-pointer hover:bg-gray-50">
                <span className="text-3xl text-gray-400">+</span>
                <input type="file" accept="image/*" multiple onChange={(e) => { const files = Array.from(e.target.files || []); files.forEach((file) => addImage(file)); }} className="hidden" />
              </label>
            </div>

            <div className="flex items-center gap-2 mt-2">
              <input type="text" value={galleryUrlInput} onChange={(e) => setGalleryUrlInput(e.target.value)} placeholder="Enter gallery image URL" className="input input-bordered w-full bg-white shadow-sm" />
              <button type="button" onClick={() => {
                if (isValidImageUrl(galleryUrlInput)) {
                  addImageFromUrl(galleryUrlInput);
                  setGalleryUrlInput("");
                  toast.success("Gallery image URL added");
                } else {
                  toast.error("Invalid gallery image URL");
                }
              }} className="btn btn-outline">Add</button>
            </div>
          </div>
        </div>



        {/* Submit */}
        <div className="col-span-full mt-6">
          <button type="submit" className="w-full btn text-white font-semibold px-4 py-3 rounded-lg bg-gradient-to-r from-[#00ad9c] via-[#3a8881] to-[#009e8e] transition-all duration-500 hover:opacity-90 shadow-md" disabled={submitting}>
            {submitting ? "Updating..." : "Update Product"}
          </button>
        </div>
      </form>

      <ToastContainer />
    </div>
  );
};

export default UpdateProduct;
