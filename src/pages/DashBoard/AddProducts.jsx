import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useImageUpload from "../../hooks/useImageUpload";
import { useNavigate } from "react-router-dom";
import { addProduct } from "../../services/products";

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
    image: "",
    images: "",
    description: "",
  };

  const [formData, setFormData] = useState(initialState);
  const [uploadingImage, setUploadingImage] = useState(false);

  // handle input
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // image upload
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingImage(true);
    await toast.promise(
      uploadImage(file).then((url) => {
        if (url) {
          setFormData((prev) => ({
            ...prev,
            image: url,
            images: url,
          }));
        } else {
          throw new Error("Upload failed");
        }
      }),
      {
        pending: "Uploading image...",
        success: "Image uploaded successfully 👌",
        error: "Image upload failed 🤯",
      }
    );
    setUploadingImage(false);
  };


  // reset form
  const resetForm = () => setFormData(initialState);

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
        {[
          { label: "Product Name", name: "name" },
          { label: "Price", name: "price", type: "number" },
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

        {/* Category */}
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
            required
          />
        </div>

        {/* Volume */}
        <div className="form-control md:col-span-2">
          <label className="label">
            <span className="label-text">Volume</span>
          </label>
          <div className="flex gap-4">
            <input
              type="number"
              name="volumeAmount"
              value={formData.volumeAmount}
              onChange={handleChange}
              className="input w-full bg-[#ebf0f0] border border-gray-300"
              placeholder="Amount (e.g., 500)"
              required
            />
            <select
              name="volumeUnit"
              value={formData.volumeUnit}
              onChange={handleChange}
              className="select select-bordered w-1/2 bg-[#ebf0f0] border border-gray-300"
              required
            >
              <option value="" disabled>
                Unit
              </option>
              <option value="ml">ml</option>
              <option value="liter">liter</option>
              <option value="gram">gram</option>
              <option value="kg">kg</option>
              <option value="dozen">dozen</option>
              <option value="piece">piece</option>
            </select>
          </div>
        </div>

        {/* Image Upload */}
        <div className="form-control md:col-span-2">
          <label className="label">
            <span className="label-text">Product Image</span>
          </label>
          {formData.image && (
            <img
              src={formData.images || formData.image}
              alt="Preview"
              className="w-32 h-32 object-cover mb-2 rounded"
            />
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="file-input w-full bg-[#ebf0f0] border border-gray-300"
          />
          {uploadingImage && (
            <p className="text-sm text-gray-500 mt-1">Uploading image...</p>
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
