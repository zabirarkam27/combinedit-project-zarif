import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import useVolumeInput from "../../hooks/useVolumeInput";
import useImageGallery from "../../hooks/useImageGallery";
import { getProductById, updateProduct } from "../../services/products";
import "react-toastify/dist/ReactToastify.css";

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
  });

  // volume hook
  const {
    volumeAmount,
    volumeUnit,
    setVolumeAmount,
    setVolumeUnit,
    getCombinedVolume,
  } = useVolumeInput();

  // image gallery hook (single + multiple)
  const {
    image,
    addSingleImage,
    addSingleImageFromUrl,
    removeSingleImage,
    setInitialSingleImage,

    images,
    addImage,
    removeImage,
    setInitialImages,
    addImageFromUrl,

    uploading,
  } = useImageGallery();

  const [urlInput, setUrlInput] = useState("");
  const [singleUrlInput, setSingleUrlInput] = useState("");

  // fetch product once
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
        });

        const [amount, unit] = (data.volume || "").split(" ");
        setVolumeAmount(amount || "");
        setVolumeUnit(unit || "");

        // set initial single + multiple images
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
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProduct((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const isValidImageUrl = (url) =>
    /\.(jpeg|jpg|gif|png|webp|bmp|svg)$/i.test(url);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const updatedProduct = {
        ...product,
        volume: getCombinedVolume(),
        price: parseFloat(product.price),
        discountPrice: parseFloat(product.discountPrice) || 0,
        thumbnail: image, // single image
        images, // multiple images
      };

      const res = await updateProduct(id, updatedProduct);

      if (res.data.modifiedCount > 0) {
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

  return (
    <div className="w-full mx-auto p-2 md:p-4 bg-[#ebf0f0] shadow-md min-h-screen">
      <h1 className="text-lg md:text-3xl font-bold text-black my-10">
        Update Product
      </h1>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        {["name", "category", "brand", "price"].map((field) => (
          <div
            key={field}
            className="form-control flex flex-col gap-1 justify-between"
          >
            <label className="label capitalize">
              <span className="label-text">{field}</span>
            </label>
            <input
              type={field === "price" ? "number" : "text"}
              name={field}
              value={product[field] || ""}
              onChange={handleChange}
              className="input max-w-80 w-full bg-[#ebf0f0]"
              required
            />
          </div>
        ))}

        {/* Description */}
        <div className="form-control flex flex-col gap-1 justify-between">
          <label className="label capitalize">
            <span className="label-text">Description</span>
          </label>
          <textarea
            name="description"
            value={product.description || ""}
            onChange={handleChange}
            className="textarea max-w-80 w-full bg-[#ebf0f0]"
            rows="3"
          />
        </div>

        {/* Discount Price */}
        <div className="form-control flex flex-col gap-1 justify-between">
          <label className="label capitalize">
            <span className="label-text">Discount Price</span>
          </label>
          <input
            type="number"
            name="discountPrice"
            value={product.discountPrice || ""}
            onChange={handleChange}
            className="input max-w-80 w-full bg-[#ebf0f0]"
            placeholder="Enter discount price"
          />
        </div>

        {/* Volume Section */}
        <div className="form-control md:col-span-2">
          <label className="label">
            <span className="label-text">Volume</span>
          </label>
          <div className="flex gap-4">
            <input
              type="number"
              value={volumeAmount}
              onChange={(e) => setVolumeAmount(e.target.value)}
              className="input max-w-80 w-full bg-[#ebf0f0]"
              placeholder="Amount"
              required
            />
            <select
              value={volumeUnit}
              onChange={(e) => setVolumeUnit(e.target.value)}
              className="select max-w-80 w-full bg-[#ebf0f0]"
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

        {/* Single Thumbnail Image */}
        <div className="form-control md:col-span-2">
          <label className="label">
            <span className="label-text">Thumbnail Image</span>
          </label>
          {image ? (
            <div className="relative w-28 h-28">
              <img
                src={image}
                alt="Thumbnail"
                className="w-28 h-28 object-cover rounded shadow"
              />
              <button
                type="button"
                onClick={removeSingleImage}
                className="absolute top-[-6px] right-[-6px] bg-red-500 text-white rounded-full p-1 text-xs opacity-90 hover:opacity-100"
              >
                ✕
              </button>
            </div>
          ) : (
            <label className="w-28 h-28 flex items-center justify-center border border-dashed border-gray-400 rounded cursor-pointer hover:bg-gray-100">
              <span className="text-3xl text-gray-500">+</span>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => addSingleImage(e.target.files[0])}
                className="hidden"
              />
            </label>
          )}

          {/* OR from URL */}
          <div className="flex items-center gap-2 mt-2">
            <input
              type="text"
              value={singleUrlInput}
              onChange={(e) => setSingleUrlInput(e.target.value)}
              placeholder="Enter thumbnail URL"
              className="input max-w-80 w-full bg-[#ebf0f0]"
            />
            <button
              type="button"
              onClick={() => {
                if (isValidImageUrl(singleUrlInput)) {
                  addSingleImageFromUrl(singleUrlInput);
                  setSingleUrlInput("");
                  toast.success("Thumbnail URL added");
                } else {
                  toast.error("Invalid thumbnail URL");
                }
              }}
              className="btn btn-outline"
            >
              Add
            </button>
          </div>
        </div>

        {/* Multiple Images */}
        <div className="form-control md:col-span-2">
          <label className="label">
            <span className="label-text">Gallery Images</span>
          </label>
          <div className="flex gap-4 flex-wrap my-2">
            {images.map((imgUrl, index) => (
              <div key={index} className="relative group">
                <img
                  src={imgUrl}
                  alt={`Product ${index}`}
                  className="w-28 h-28 object-cover rounded shadow"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-[-6px] right-[-6px] bg-red-500 text-white rounded-full p-1 text-xs opacity-90 hover:opacity-100 cursor-pointer"
                  title="Remove"
                >
                  ✕
                </button>
              </div>
            ))}
            <label className="w-28 h-28 flex items-center justify-center border border-dashed border-gray-400 rounded cursor-pointer hover:bg-gray-100">
              <span className="text-3xl text-gray-500">+</span>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => addImage(e.target.files[0])}
                className="hidden"
              />
            </label>
          </div>

          {/* OR from URL */}
          <div className="flex items-center gap-2 mt-2">
            <input
              type="text"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="Enter image URL"
              className="input max-w-80 w-full bg-[#ebf0f0]"
            />
            <button
              type="button"
              onClick={() => {
                if (isValidImageUrl(urlInput)) {
                  addImageFromUrl(urlInput);
                  setUrlInput("");
                  toast.success("Image URL added");
                } else {
                  toast.error("Invalid image URL");
                }
              }}
              className="btn btn-outline"
            >
              Add
            </button>
          </div>

          {uploading && (
            <p className="text-sm text-gray-500 mt-1">Uploading...</p>
          )}
        </div>

        {/* In Stock */}
        <div className="form-control flex-row items-center mt-4">
          <input
            type="checkbox"
            name="inStock"
            checked={product.inStock}
            onChange={handleChange}
            className="checkbox mr-2"
          />
          <label className="label-text">In Stock</label>
        </div>

        {/* Submit */}
        <div className="col-span-full mt-4 text-center">
          <button
            type="submit"
            className="w-full btn text-center text-white font-semibold px-4 py-3 rounded-b-xl bg-gradient-to-r from-[#00ad9c] via-[#3a8881] to-[#009e8e] bg-[length:200%_200%] transition-all duration-500 ease-in-out hover:bg-right mt-4"
            disabled={submitting}
          >
            {submitting ? "Updating..." : "Update Product"}
          </button>
        </div>
      </form>

      <ToastContainer />
    </div>
  );
};

export default UpdateProduct;
