import { useParams } from "react-router-dom";
import useProductDetails from "../hooks/useProductDetails";
import useOrderForm from "../hooks/useOrderForm";

const ProductDetails = () => {
  const { id } = useParams();
  const { product, mainImage, setMainImage } = useProductDetails(id);
  const { orderInfo, handleOrderChange, handleOrderSubmit } =
    useOrderForm(product);

  if (!product) {
    return (
      <div className="text-center text-xl text-[#318fe8] font-medium mt-10">
        Loading Product Details...
      </div>
    );
  }
  return (
    <div className="drawer drawer-end">
      <input id="order-drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content">
        {/* Product Card */}
        <div className="min-h-[calc(100vh-48px)] my-6 flex items-center justify-center bg-gradient-to-b from-[#06b5d4] to-[#3b82f5] p-4 rounded-xl max-w-2xl mx-auto">
          <div className="bg-white/95 rounded-2xl shadow-2xl">
            <div className="p-8 max-w-md w-full">
              <img
                src={mainImage}
                alt={product.name}
                className="w-full h-64 object-cover rounded-xl mb-6"
              />
              <div className="flex gap-2 overflow-x-auto">
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
                <span className="font-semibold">Price:</span> BDT{" "}
                {product.price}
              </p>
              <p className="text-[#0c2955] text-base mb-3">
                <span className="font-semibold">In Stock:</span>{" "}
                {product.inStock ? "Yes" : "No"}
              </p>
              <p className="text-[#4a4a4a] text-base font-normal mb-4">
                {product.description}
              </p>

              <label
                htmlFor="order-drawer"
                className="block text-center bg-[#8f94a0] text-white font-semibold px-4 py-2 rounded-md hover:bg-black transition cursor-pointer"
              >
                Order Now
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Drawer Content */}
      <div className="drawer-side z-50">
        <label htmlFor="order-drawer" className="drawer-overlay"></label>
        <div className="menu p-4 w-80 min-h-full bg-white text-base-content">
          <h2 className="text-xl font-semibold mb-4 text-center">
            Confirm Your Order
          </h2>
          <form onSubmit={handleOrderSubmit} className="space-y-3">
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={orderInfo.name}
              onChange={handleOrderChange}
              className="input input-bordered w-full"
              required
            />
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={orderInfo.phone}
              onChange={handleOrderChange}
              className="input input-bordered w-full"
              required
            />
            <textarea
              name="address"
              placeholder="Delivery Address"
              value={orderInfo.address}
              onChange={handleOrderChange}
              className="textarea textarea-bordered w-full"
              rows="3"
              required
            />
            <textarea
              name="note"
              placeholder="Note"
              value={orderInfo.note}
              onChange={handleOrderChange}
              className="textarea textarea-bordered w-full"
              rows="3"
              required
            />
            <button type="submit" className="btn btn-primary w-full mt-2">
              Submit Order
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
