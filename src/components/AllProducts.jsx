import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useOrderForm from "../hooks/useOrderForm";
import { getProducts } from "../services/products";
import design from "../styles/design";
import { useCart } from "../context/CartContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AllProducts = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [orderOpen, setOrderOpen] = useState(false); // drawer toggle state

  const { orderInfo, handleOrderChange, handleOrderSubmit, setProduct } =
    useOrderForm(selectedProduct);

  const { addToCart } = useCart();

  useEffect(() => {
    getProducts()
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : [res.data];
        setProducts(data);
      })
      .catch((err) => console.error("Failed to load products:", err));
  }, []);

  const handleOrderClick = (product) => {
    setSelectedProduct(product);
    setProduct(product);
    setQuantity(1);
    setOrderOpen(true); // open drawer
  };

  const increaseQuantity = () => setQuantity((prev) => prev + 1);
  const decreaseQuantity = () =>
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  const handleAddToCart = (product) => {
    addToCart(product);
    toast.success(`🛒 ${product.name} added to cart!`);
  };

  const handleOrderFormSubmit = (e) => {
    try {
      handleOrderSubmit(e, {
        productId: selectedProduct._id || selectedProduct.id,
        productName: selectedProduct.name,
        unitPrice: selectedProduct.price,
        quantity,
        finalPrice: selectedProduct.price * quantity,
      });
      toast.success(`✅ Order for ${selectedProduct.name} submitted!`);
      setOrderOpen(false);
    } catch (err) {
      console.error(err);
      toast.error(`❌ Failed to submit order. Try again!`);
    }
  };

  return (
    <div className="sm:mb-18 md:mb-0">
      <ToastContainer position="top-right" autoClose={2500} />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 py-3">
        {Array.isArray(products) && products.length > 0 ? (
          products.map((product) => (
            <div
              key={product._id || product.id}
              className="bg-white/50 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition duration-300 flex flex-col"
            >
              <Link
                to={`/products/${product._id}`}
                className="group relative overflow-hidden shadow-md hover:shadow-xl transition"
              >
                <img
                  src={product.images}
                  alt={product.name}
                  className="w-full h-[200px] sm:h-[130px] md:h-[180px] object-cover lg:h-[210px] transition-transform duration-500 group-hover:scale-105"
                />
              </Link>

              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h1 className="text-[#0c2955] md:text-lg mb-1 font-bold">
                    {product.name}
                  </h1>
                  <p className="text-[#0c2955] text-xs md:text-sm mb-1">
                    <span className="font-semibold">Category:</span>{" "}
                    {product.category}
                  </p>
                  <p className="text-[#0c2955] text-xs md:text-sm mb-4">
                    <span className="font-semibold">Price:</span> BDT{" "}
                    {product.price}
                  </p>
                </div>

                <div className="flex gap-3 items-center">
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="bg-transparent hover:scale-110 transition cursor-pointer"
                  >
                    <img
                      src="/public/cart-icon.png"
                      alt="cart icon"
                      className="w-12"
                    />
                  </button>

                  <button
                    onClick={() => handleOrderClick(product)}
                    className={`w-full ${design.buttons}`}
                  >
                    Order Now
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center col-span-2 text-gray-500">
            No products found.
          </p>
        )}
      </div>

      {/* Drawer Side (Order Form) */}
      {orderOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* overlay */}
          <div
            className="flex-1 bg-black/50"
            onClick={() => setOrderOpen(false)}
          ></div>

          {selectedProduct && (
            <div className="flex flex-col gap-4 p-4 w-72 sm:w-96 min-h-full bg-[#ccccb7] text-base-content shadow-lg">
              {/* Selected product info */}
              <div className="flex items-center gap-3">
                <img
                  src={selectedProduct.images}
                  alt={selectedProduct.name}
                  className="w-16 h-16 object-cover rounded"
                />
                <div>
                  <h3 className="font-semibold">{selectedProduct.name}</h3>
                  <p className="text-sm text-gray-600">
                    Price: BDT {selectedProduct.price * quantity}
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
                <button type="submit" className={`${design.buttons} w-full`}>
                  Submit Order
                </button>
              </form>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AllProducts;
