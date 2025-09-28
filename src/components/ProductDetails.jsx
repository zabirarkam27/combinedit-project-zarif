import { useParams, useNavigate } from "react-router-dom";
import useProductDetails from "../hooks/useProductDetails";
import useProfileData from "../hooks/useProfileData";
import { useEffect, useState } from "react";
import useOrderForm from "../hooks/useOrderForm";
import { useOrderDrawer } from "../hooks/useOrderDrawer";
import OrderDrawer from "../components/OrderDrawer";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useCart } from "../context/CartContext";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";



const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { product, mainImage, setMainImage } = useProductDetails(id);
  const orderFormHook = useOrderForm(product);
  const { addToCart } = useCart();
  const { profile, loading: profileLoading } = useProfileData();

  const [popularProducts, setPopularProducts] = useState([]);

  // Fetch popular products
  useEffect(() => {
    const fetchPopular = async () => {
      try {
        const res = await fetch("http://localhost:5000/popular-products");
        const data = await res.json();
        setPopularProducts(data);
      } catch (err) {
        console.error("Failed to fetch popular products:", err);
      }
    };
    fetchPopular();
  }, []);


  // Slick slider settings
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3, // একসাথে ৩টা কার্ড দেখাবে
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024, // ট্যাব
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 640, // মোবাইল
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };


  // Drawer Hook
  const {
    selectedProduct,
    isOpen,
    quantity,
    grandTotal,
    productTotal,
    openDrawer,
    closeDrawer,
    increaseQuantity,
    decreaseQuantity,
    handleOrderChange,
    handleSubmit: originalHandleSubmit,
  } = useOrderDrawer(orderFormHook);

  // Wrapped handleSubmit for toast & navigate
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await originalHandleSubmit(e);
      toast.success("✅ Order placed successfully!", { autoClose: 2000 });
      closeDrawer();
      setTimeout(() => navigate("/"), 2100);
    } catch (err) {
      console.error("Order failed:", err);
      toast.error("❌ Failed to place order. Try again!");
    }
  };

  // handleAddToCart function
  const handleAddToCart = () => {
    if (product) {
      addToCart(product);
      toast.success(`🛒 ${product.name} added to cart!`);
    }
  };

  if (!product) {
    return (
      <div className="text-center text-xl text-[#318fe8] font-medium mt-10">
        Loading Product Details...
      </div>
    );
  }

  return (
    <div className="bg-[#a8e2dd] py-6 md:mt-18">
      <ToastContainer position="top-right" autoClose={2500} />

      {/* Product Card */}
      <div className="bg-[#a8e2dd] max-w-2xl md:max-w-4xl w-full mx-auto flex rounded-xl items-center justify-center">
        <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full">
          <div className="p-4 md:p-8 flex flex-col md:flex-row gap-6">
            {/* Image Section */}
            <div className="max-w-sm w-full">
              <div className="overflow-hidden rounded-xl mb-6 relative w-fit mx-auto">
                <img
                  src={mainImage || product.thumbnail || product.image || product.images?.[0]}
                  alt={product.name}
                  className="transition-transform duration-500 ease-in-out hover:scale-110"
                />
              </div>
              <div className="flex gap-2 overflow-x-auto mb-4">
                {product.images?.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt={`thumbnail-${idx}`}
                    onClick={() => setMainImage(img)}
                    className={`w-16 h-16 object-cover rounded border cursor-pointer ${mainImage === img ? "ring-2 ring-blue-500" : "opacity-80 hover:opacity-100"
                      }`}
                  />
                ))}
              </div>
            </div>

            {/* Product Info Section */}
            <div className="md:max-w-2xl w-full">
              <h2 className="text-2xl font-semibold text-[#0c2955] mb-2">{product.name}</h2>

              <p className="text-[#0c2955] text-base mb-1">
                <span className="font-semibold">Price:</span>{" "}
                {product.discountPrice ? (
                  <>
                    <span className="text-red-600 font-bold text-xl mr-3">
                      BDT {product.discountPrice}
                    </span>
                    <span className="line-through text-gray-500 text-[13px]">
                      BDT {product.price}
                    </span>
                  </>
                ) : (
                  <span className="text-red-600 font-bold text-xl mr-3">BDT {product.price}</span>
                )}
              </p>

              {/* Cart & Order Buttons */}
              <div className="flex gap-4 mt-4 mb-2 w-full items-center justify-center">
                <button
                  onClick={handleAddToCart}
                  className="hover:scale-110 hover:cursor-pointer transition-all duration-500 ease-in-out"
                >
                  <img src="/cart-icon.svg" alt="cart icon" className="w-12 p-1" />
                </button>

                <button
                  onClick={() => openDrawer(product)}
                  className="btn text-center text-white font-semibold px-4 py-3 rounded-md bg-gradient-to-r from-[#00ad9c] via-[#3a8881] to-[#009e8e] bg-[length:200%_200%] transition-all duration-500 ease-in-out hover:bg-right border-0 shadow-none flex-1 max-w-md"
                >
                  Order Now
                </button>
              </div>

              {/* call us */}
              {!profileLoading && profile && (
                <a
                  href={profile.phoneLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn mb-4 text-center text-white font-semibold px-4 py-3 rounded-md bg-gradient-to-r from-[#00ad9c] via-[#3a8881] to-[#009e8e] bg-[length:200%_200%] transition-all duration-500 ease-in-out hover:bg-right border-0 shadow-none w-full flex items-center justify-center gap-2"
                >
                  <img src={profile.phoneIcon} alt="Phone icon" className="p-2 h-10 w-10" />
                  01838600619
                </a>
              )}

              {/* Product Details */}
              <div>
                <div className="flex gap-2 justify-between w-full">
                  <p className="text-[#0c2955] text-base mb-1">
                    <span className="font-semibold">Category:</span> {product.category}
                  </p>
                  <p className="text-[#0c2955] text-base">
                    <span className="font-semibold">In Stock:</span> {product.inStock ? "Yes" : "No"}
                  </p>
                </div>
                <div className="flex gap-2 justify-between w-full">
                  <p className="text-[#0c2955] text-base mb-1">
                    <span className="font-semibold">Brand:</span> {product.brand}
                  </p>
                  <p className="text-[#0c2955] text-base mb-1">
                    <span className="font-semibold">Weight:</span> {product.weight || product.volume}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Product Description */}
          <div className="flex">
            <p className="text-[#4a4a4a] text-base font-normal px-4 md:px-8">
              {product.description}
            </p>
          </div>
          <div className="w-11/12 h-1 bg-[#39857e] mx-auto my-3"></div>

          {/* Popular products */}
          <div className="max-w-6xl mx-auto mt-10 mb-16 px-4">
            <h2 className="text-2xl font-bold text-[#0c2955] mb-6">
              Popular Products
            </h2>

            {popularProducts.length > 0 ? (
              <Slider {...sliderSettings}>
                {popularProducts.map((p) => (
                  <div key={p._id} className="px-2">
                    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                      <img
                        src={p.thumbnail || p.image || p.images?.[0]}
                        alt={p.name}
                        className="w-full h-48 object-cover"
                      />
                      <div className="p-4">
                        <h3 className="text-lg font-semibold text-[#0c2955]">
                          {p.name}
                        </h3>
                        <p className="text-red-600 font-bold">
                          BDT {p.discountPrice || p.price}
                        </p>
                        <button
                          onClick={() => navigate(`/product/${p._id}`)}
                          className="mt-3 w-full px-3 py-2 text-white font-semibold rounded-lg bg-gradient-to-r from-[#00ad9c] to-[#009e8e] hover:opacity-90"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </Slider>
            ) : (
              <p className="text-center text-gray-600">No popular products found.</p>
            )}
          </div>

        </div>
      </div>

      {/* OrderDrawer Component */}
      <OrderDrawer
        selectedProduct={selectedProduct}
        isOpen={isOpen}
        quantity={quantity}
        grandTotal={grandTotal}
        productTotal={productTotal}
        closeDrawer={closeDrawer}
        increaseQuantity={increaseQuantity}
        decreaseQuantity={decreaseQuantity}
        handleOrderChange={handleOrderChange}
        handleSubmit={handleSubmit}
        orderInfo={orderFormHook.orderInfo}
      />
    </div>
  );
};

export default ProductDetails;
