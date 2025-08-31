import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; // <-- useNavigate import
import useProductDetails from "../hooks/useProductDetails";
import useOrderForm from "../hooks/useOrderForm";
import design from "../styles/design";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate(); // <-- hook init
  const { product, mainImage, setMainImage } = useProductDetails(id);
  const [orderOpen, setOrderOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const { orderInfo, handleOrderChange, handleOrderSubmit, setProduct } =
    useOrderForm(product);

  if (!product) {
    return (
      <div className="text-center text-xl text-[#318fe8] font-medium mt-10">
        Loading Product Details...
      </div>
    );
  }

  const increaseQuantity = () => setQuantity((prev) => prev + 1);
  const decreaseQuantity = () =>
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  const handleOrderFormSubmit = (e) => {
    try {
      handleOrderSubmit(e, {
        productId: product._id || product.id,
        productName: product.name,
        unitPrice: product.price,
        quantity,
        finalPrice: product.price * quantity,
      });
      toast.success(`✅ Order for ${product.name} submitted!`);
      setOrderOpen(false);

      // Redirect to home page after a short delay (to show toast)
      setTimeout(() => {
        navigate("/"); // <-- home page route
      }, 1000);
    } catch (err) {
      console.error(err);
      toast.error(`❌ Failed to submit order. Try again!`);
    }
  };

  return (
    <div className="relative">
      <ToastContainer position="top-right" autoClose={2500} />

      {/* Product Card */}
      <div className="min-h-[calc(100vh-48px)] my-6 flex items-center justify-center bg-gradient-to-b from-[#06b5d4] to-[#3b82f5] p-4 rounded-xl max-w-2xl mx-auto">
        <div className="bg-white/95 rounded-2xl shadow-2xl">
          <div className="p-8 max-w-md w-full">
            <img
              src={mainImage}
              alt={product.name}
              className="w-full h-64 object-cover rounded-xl mb-6"
            />
            <div className="flex gap-2 overflow-x-auto mb-4">
              {product.images?.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`thumbnail-${idx}`}
                  onClick={() => setMainImage(img)}
                  className={`w-16 h-16 object-cover rounded border cursor-pointer ${
                    mainImage === img
                      ? "ring-2 ring-blue-500"
                      : "opacity-80 hover:opacity-100"
                  }`}
                />
              ))}
            </div>

            <h2 className="text-2xl font-semibold text-[#0c2955] mb-2">
              {product.name}
            </h2>
            <p className="text-[#0c2955] text-base mb-1">
              <span className="font-semibold">Category:</span>{" "}
              {product.category}
            </p>
            <p className="text-[#0c2955] text-base mb-1">
              <span className="font-semibold">Brand:</span> {product.brand}
            </p>
            <p className="text-[#0c2955] text-base mb-1">
              <span className="font-semibold">Weight:</span>{" "}
              {product.weight || product.volume}
            </p>
            <p className="text-[#0c2955] text-base mb-1">
              <span className="font-semibold">Price:</span> BDT {product.price}
            </p>
            <p className="text-[#0c2955] text-base mb-3">
              <span className="font-semibold">In Stock:</span>{" "}
              {product.inStock ? "Yes" : "No"}
            </p>
            <p className="text-[#4a4a4a] text-base font-normal mb-4">
              {product.description}
            </p>

            <button
              onClick={() => setOrderOpen(true)}
              className={`w-full ${design.buttons}`}
            >
              Order Now
            </button>
          </div>
        </div>
      </div>

      {/* Drawer Side (Order Form) */}
      {orderOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Overlay */}
          <div
            className="flex-1 bg-black/50"
            onClick={() => setOrderOpen(false)}
          ></div>

          {/* Drawer */}
          <div className="flex flex-col gap-4 p-4 w-72 sm:w-96 min-h-full bg-[#ccccb7] text-base-content shadow-lg">
            <h2 className="text-xl font-semibold mb-4 text-center">
              Confirm Your Order
            </h2>

            {/* Product Info + Quantity */}
            <div className="flex items-center gap-3 mb-4">
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-16 h-16 object-cover rounded"
              />
              <div>
                <h3 className="font-semibold">{product.name}</h3>
                <p className="text-sm text-gray-600">
                  Price: BDT {product.price * quantity}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <button
                    onClick={decreaseQuantity}
                    className="px-2 py-1 bg-gray-300 rounded"
                  >
                    -
                  </button>
                  <span>{quantity}</span>
                  <button
                    onClick={increaseQuantity}
                    className="px-2 py-1 bg-gray-300 rounded"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Order Form */}
            <form onSubmit={handleOrderFormSubmit} className="space-y-3">
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={orderInfo.name}
                onChange={handleOrderChange}
                className={design.inputs}
                required
              />
              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                value={orderInfo.phone}
                onChange={handleOrderChange}
                className={design.inputs}
                required
              />
              <textarea
                name="address"
                placeholder="Delivery Address"
                value={orderInfo.address}
                onChange={handleOrderChange}
                className={design.inputs}
                rows="3"
                required
              />
              <textarea
                name="note"
                placeholder="Note"
                value={orderInfo.note}
                onChange={handleOrderChange}
                className={design.inputs}
                rows="3"
              />
              <button type="submit" className={`w-full ${design.buttons}`}>
                Submit Order
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
