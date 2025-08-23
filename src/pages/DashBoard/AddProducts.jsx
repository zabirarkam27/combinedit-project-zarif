import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useImageUpload from "../../hooks/useImageUpload";
import { useNavigate } from "react-router-dom";
import { addProduct } from "../../services/products"; 

const AddProducts = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    brand: "",
    volumeAmount: "",
    volumeUnit: "",
    price: "",
    inStock: true,
    image: "",
    images: "",
    description: "",
  });

  const { uploadImage } = useImageUpload();
  const [uploadingImage, setUploadingImage] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === "checkbox" ? checked : value;
    setFormData((prev) => ({ ...prev, [name]: val }));
  };

  const handleImageChange = async (e) => {
    const imageFile = e.target.files[0];
    if (!imageFile) return;

    setUploadingImage(true);
    const imageUrl = await uploadImage(imageFile);
    if (imageUrl) {
      setFormData((prev) => ({ ...prev, image: imageUrl }));
      toast.success("Image uploaded successfully!");
    } else {
      toast.error("Image upload failed!");
    }
    setUploadingImage(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const volume = `${formData.volumeAmount} ${formData.volumeUnit}`;
      const productData = {
        ...formData,
        volume,
        price: parseFloat(formData.price),
      };

      delete productData.volumeAmount;
      delete productData.volumeUnit;

      const res = await addProduct(productData);

      if (res.data.insertedId || res.data.acknowledged) {
        toast.success("✅ Product added successfully!", {
          position: "top-right",
        });
        setFormData({
          name: "",
          category: "",
          brand: "",
          volumeAmount: "",
          volumeUnit: "",
          price: "",
          inStock: true,
          image: "",
          description: "",
        });
        setTimeout(() => {
          navigate("/dashboard/edit-your-products/all");
        }, 1000);
      }
    } catch (err) {
      toast.error("❌ Failed to add product.");
      console.error(err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-[#e6e6d7] rounded-xl shadow-md mt-6">
      <h2 className="text-3xl font-bold text-center mb-6 text-primary">
        Add New Product
      </h2>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        {/* Basic Info Fields */}
        {[
          { label: "Product Name", name: "name" },
          { label: "Category", name: "category" },
          { label: "Brand", name: "brand" },
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
              className="input w-full bg-[#f7f7e7] border border-gray-300 focus:border-[#c0c08c] focus:ring focus:ring-[#c0c08c] focus:ring-opacity-30"
              required
            />
          </div>
        ))}

        {/* Volume Input */}
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
              className="input w-full bg-[#f7f7e7] border border-gray-300 focus:border-[#c0c08c] focus:ring focus:ring-[#c0c08c] focus:ring-opacity-30"
              placeholder="Amount (e.g., 500)"
              required
            />
            <select
              name="volumeUnit"
              value={formData.volumeUnit}
              onChange={handleChange}
              className="select select-bordered w-1/2 bg-[#f7f7e7] border border-gray-300 focus:border-[#c0c08c] focus:ring focus:ring-[#c0c08c] focus:ring-opacity-30"
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
              src={formData.image || formData.images}
              alt="Preview"
              className="w-32 h-32 object-cover mb-2 rounded"
            />
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="file-input w-full bg-[#f7f7e7] border border-gray-300 focus:border-[#c0c08c] focus:ring focus:ring-[#c0c08c] focus:ring-opacity-30"
          />
          {uploadingImage && (
            <p className="text-sm text-gray-500 mt-1">Uploading image...</p>
          )}
        </div>

        {/* In Stock Toggle */}
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
            className="textarea textarea-bordered w-full bg-[#f7f7e7] border border-gray-300 focus:border-[#c0c08c] focus:ring focus:ring-[#c0c08c] focus:ring-opacity-30"
            rows={4}
            required
          ></textarea>
        </div>

        {/* Submit Button */}
        <div className="col-span-full mt-6 text-center">
          <button type="submit" className="btn btn-primary px-10">
            Add Product
          </button>
        </div>
      </form>

      <ToastContainer />
    </div>
  );
};

export default AddProducts;
