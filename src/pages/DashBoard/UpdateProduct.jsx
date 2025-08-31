import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import useVolumeInput from "../../hooks/useVolumeInput";
import useImageGallery from "../../hooks/useImageGallery";
import { getProductById, updateProduct } from "../../services/products"; // ✅ use services
import "react-toastify/dist/ReactToastify.css";

const UpdateProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [urlInput, setUrlInput] = useState("");

  const {
    volumeAmount,
    volumeUnit,
    setVolumeAmount,
    setVolumeUnit,
    getCombinedVolume,
  } = useVolumeInput();

  const {
    images,
    uploading,
    addImage,
    removeImage,
    setInitialImages,
    addImageFromUrl,
  } = useImageGallery();

  useEffect(() => {
    getProductById(id)
      .then((res) => {
        const fetchedProduct = res.data;
        setProduct(fetchedProduct);

        const [amount, unit] = (fetchedProduct.volume || "").split(" ");
        setVolumeAmount(amount || "");
        setVolumeUnit(unit || "");
        setInitialImages(fetchedProduct.images || []);
      })
      .catch((err) => {
        console.error(err);
        toast.error("Failed to load product.");
      });
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
    try {
      const { _id, ...rest } = product;
      const updatedProduct = {
        ...rest,
        volume: getCombinedVolume(),
        price: parseFloat(product.price),
        images,
      };

      const res = await updateProduct(id, updatedProduct); // ✅ service used

      if (res.data.modifiedCount > 0) {
        toast.success("Product updated successfully!");
        navigate("/dashboard/edit-your-products/all");
      } else {
        toast.info("No changes detected.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to update product.");
    }
  };

  if (!product) return <p className="text-center mt-8">Loading...</p>;

  return (
    <div className="max-w-7xl w-full mx-auto p-6 bg-[#e6e6d7] shadow-md rounded-xl mt-6">
      <h2 className="text-2xl font-bold text-center mb-4">Update Product</h2>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        {["name", "category", "brand", "price", "description"].map((field) => (
          <div key={field} className="form-control">
            <label className="label capitalize">
              <span className="label-text">{field}</span>
            </label>
            <input
              type={field === "price" ? "number" : "text"}
              name={field}
              value={product[field] || ""}
              onChange={handleChange}
              className="input w-full md:w-80 bg-[#f7f7e7] border border-gray-300 focus:border-[#c0c08c] focus:ring focus:ring-[#c0c08c] focus:ring-opacity-30"
              required
            />
          </div>
        ))}

        <div className="form-control md:col-span-2">
          <label className="label">
            <span className="label-text">Volume</span>
          </label>
          <div className="flex gap-4">
            <input
              type="number"
              value={volumeAmount}
              onChange={(e) => setVolumeAmount(e.target.value)}
              className="input w-full md:w-80 bg-[#f7f7e7] border border-gray-300 focus:border-[#c0c08c] focus:ring focus:ring-[#c0c08c] focus:ring-opacity-30"
              placeholder="Amount"
              required
            />
            <select
              value={volumeUnit}
              onChange={(e) => setVolumeUnit(e.target.value)}
              className="select w-full md:w-80 bg-[#f7f7e7] border border-gray-300 focus:border-[#c0c08c] focus:ring focus:ring-[#c0c08c] focus:ring-opacity-30"
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

        <div className="form-control md:col-span-2 ">
          <div>
            <label className="label">
              <span className="label-text">Product Images</span>
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
          </div>
          <label className="label">
            <span className="label-text">----------OR----------</span>
          </label>
          <div className="flex items-center gap-2 mt-2">
            <input
              type="text"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="Enter image URL"
              className="input w-full md:w-80 bg-[#f7f7e7] border border-gray-300 focus:border-[#c0c08c] focus:ring focus:ring-[#c0c08c] focus:ring-opacity-30"
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

        <div className="col-span-full mt-4 text-center">
          <button type="submit" className="btn btn-primary">
            Update Product
          </button>
        </div>
      </form>

      <ToastContainer />
    </div>
  );
};

export default UpdateProduct;
