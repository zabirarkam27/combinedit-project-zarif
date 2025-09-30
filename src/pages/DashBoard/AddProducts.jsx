import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useImageUpload from "../../hooks/useImageUpload";
import { useNavigate } from "react-router-dom";
import { addProduct } from "../../services/products";
import { HexColorPicker } from "react-colorful";

const AddProducts = () => {
  const navigate = useNavigate();
  const { uploadImage } = useImageUpload();

  const initialState = {
    name: "",
    category: "",
    brand: "",
    volumeAmount: "",
    volumeUnit: "",
    price: "",
    discountPrice: "",
    inStock: true,
    thumbnail: "", // প্রথম ইমেজ ডিফল্ট থাম্বনেইল হবে
    images: [], // multiple images
    description: "",
    colors: [], // multiple colors
  };

  const [formData, setFormData] = useState(initialState);
  const [uploadingImage, setUploadingImage] = useState(false);

  // single picker state
  const [selectedColor, setSelectedColor] = useState("#ffffff");

  // handle input
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // image upload (multiple)
  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    setUploadingImage(true);

    try {
      const uploadedUrls = [];
      for (let file of files) {
        const url = await uploadImage(file);
        if (url) uploadedUrls.push(url);
      }

      if (uploadedUrls.length > 0) {
        setFormData((prev) => {
          const newImages = [...prev.images, ...uploadedUrls];
          return {
            ...prev,
            images: newImages,
            thumbnail: prev.thumbnail || newImages[0], // প্রথম ইমেজকে thumbnail
          };
        });
        toast.success("✅ Images uploaded successfully!");
      }
    } catch (err) {
      toast.error("❌ Image upload failed");
    } finally {
      setUploadingImage(false);
    }
  };

  // remove single image
  const handleRemoveImage = (url) => {
    setFormData((prev) => {
      const updatedImages = prev.images.filter((img) => img !== url);
      return {
        ...prev,
        images: updatedImages,
        thumbnail: updatedImages[0] || "", // প্রথম ইমেজ আবার thumbnail হবে
      };
    });
  };

  // reset form
  const resetForm = () => {
    setFormData(initialState);
    setSelectedColor("#ffffff");
  };

  // add color
  const handleAddColor = () => {
    if (!selectedColor) return;
    if (formData.colors.includes(selectedColor)) {
      toast.info("⚠️ This color is already added!");
      return;
    }
    setFormData((prev) => ({
      ...prev,
      colors: [...prev.colors, selectedColor],
    }));
    toast.success("🎨 Color added!");
  };

  // remove color
  const handleRemoveColor = (color) => {
    setFormData((prev) => ({
      ...prev,
      colors: prev.colors.filter((c) => c !== color),
    }));
  };

  // handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const volume = `${formData.volumeAmount} ${formData.volumeUnit}`;
      const productData = {
        ...formData,
        volume,
        price: parseFloat(formData.price),
        discountPrice: formData.discountPrice
          ? parseFloat(formData.discountPrice)
          : null,
      };

      delete productData.volumeAmount;
      delete productData.volumeUnit;

      const res = await addProduct(productData);

      if (res.data?.insertedId || res.data?.acknowledged) {
        toast.success("✅ Product added successfully!");
        resetForm();
        navigate("/dashboard/edit-your-products/all", { replace: true });
      }
    } catch (err) {
      toast.error("❌ Failed to add product.");
      console.error(err);
    }
  };

  return (
    <div className="w-full mx-auto p-2 md:p-4 bg-[#ebf0f0] shadow-md min-h-screen">
      <h1 className="text-lg md:text-3xl font-bold text-black my-10">
        Add New Product
      </h1>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        {/* Basic Info */}
        {[{ label: "Product Name", name: "name" },
          { label: "Price", name: "price", type: "number" }
        ].map(({ label, name, type = "text" }) => (
          <div key={name} className="form-control">
            <label className="label">
              <span className="label-text">{label}</span>
            </label>
            <input
              type={type}
              name={name}
              value={formData[name]}
              onChange={handleChange}
              className="input w-full bg-[#ebf0f0] border border-gray-300"
              required
            />
          </div>
        ))}

        {/* Discount Price */}
        <div className="form-control">
          <label className="label">
            <span className="label-text">Discount Price</span>
          </label>
          <input
            name="discountPrice"
            type="number"
            value={formData.discountPrice}
            onChange={handleChange}
            className="input w-full bg-[#ebf0f0] border border-gray-300"
          />
        </div>

        {/* Category */}
        <div className="form-control">
          <label className="label">
            <span className="label-text">Category</span>
          </label>
          <input
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="input w-full bg-[#ebf0f0] border border-gray-300"
            required
          />
        </div>

        {/* Brand */}
        <div className="form-control">
          <label className="label">
            <span className="label-text">Brand</span>
          </label>
          <input
            type="text"
            name="brand"
            value={formData.brand}
            onChange={handleChange}
            className="input w-full bg-[#ebf0f0] border border-gray-300"
          />
        </div>

        {/* Weight */}
        <div className="form-control md:col-span-2">
          <label className="label">
            <span className="label-text">Weight</span>
          </label>
          <div className="flex gap-4">
            <input
              type="number"
              name="volumeAmount"
              value={formData.volumeAmount}
              onChange={handleChange}
              className="input w-full bg-[#ebf0f0] border border-gray-300"
              placeholder="Amount (e.g., 500)"
            />
            <select
              name="volumeUnit"
              value={formData.volumeUnit}
              onChange={handleChange}
              className="select select-bordered w-1/2 bg-[#ebf0f0] border border-gray-300"
            >
              <option value="" disabled>Unit</option>
              <option value="ml">ml</option>
              <option value="liter">liter</option>
              <option value="gram">gram</option>
              <option value="kg">kg</option>
              <option value="dozen">dozen</option>
              <option value="piece">piece</option>
            </select>
          </div>
        </div>

        {/* Multiple Image Upload */}
        <div className="form-control md:col-span-2">
          <label className="label">
            <span className="label-text">Product Images</span>
          </label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            className="file-input w-full bg-[#ebf0f0] border border-gray-300"
          />
          {uploadingImage && (
            <p className="text-sm text-gray-500 mt-1">Uploading images...</p>
          )}

          {/* Show uploaded images */}
          {formData.images.length > 0 && (
            <div className="flex flex-wrap gap-3 mt-3">
              {formData.images.map((url, idx) => (
                <div key={idx} className="relative">
                  <img
                    src={url}
                    alt={`uploaded-${idx}`}
                    className={`w-24 h-24 object-cover rounded border ${url === formData.thumbnail ? "ring-2 ring-green-500" : ""}`}
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(url)}
                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full px-1"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* In Stock */}
        <div className="form-control flex-row items-center mt-4">
          <input
            type="checkbox"
            name="inStock"
            checked={formData.inStock}
            onChange={handleChange}
            className="checkbox mr-2"
          />
          <label className="label-text">In Stock</label>
        </div>

        {/* Multiple Color Picker */}
        <div className="form-control md:col-span-2">
          <label className="label">
            <span className="label-text">Choose Product Colors</span>
          </label>
          <div className="flex flex-col md:flex-row gap-4 items-start">
            <HexColorPicker color={selectedColor} onChange={setSelectedColor} />
            <div>
              <input
                type="text"
                value={selectedColor}
                onChange={(e) => setSelectedColor(e.target.value)}
                className="input w-full bg-[#ebf0f0] border border-gray-300 mb-2"
              />
              <div
                className="w-12 h-12 rounded border mb-2"
                style={{ backgroundColor: selectedColor }}
              />
              <button
                type="button"
                onClick={handleAddColor}
                className="btn btn-outline btn-sm"
              >
                Add Color
              </button>
            </div>
          </div>

          {/* Display added colors */}
          {formData.colors.length > 0 && (
            <div className="flex flex-wrap gap-3 mt-4">
              {formData.colors.map((c, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-1 border rounded px-2 py-1"
                >
                  <div className="w-6 h-6 rounded" style={{ backgroundColor: c }} />
                  <span className="text-sm">{c}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveColor(c)}
                    className="ml-1 text-red-500 hover:text-red-700"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Description */}
        <div className="col-span-full">
          <label className="label">
            <span className="label-text">Description</span>
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="textarea textarea-bordered w-full bg-[#ebf0f0] border border-gray-300"
            rows={4}
          ></textarea>
        </div>

        {/* Submit Button */}
        <div className="col-span-full mt-6 text-center">
          <button
            type="submit"
            className="btn w-full mt-6 text-center text-white font-semibold px-4 py-4 rounded-b-xl
              bg-gradient-to-r from-[#00ad9c] via-[#3a8881] to-[#009e8e]
              bg-[length:200%_200%] transition-all duration-500 ease-in-out hover:bg-right"
          >
            Add Product
          </button>
        </div>
      </form>

      <ToastContainer />
    </div>
  );
};

export default AddProducts;
