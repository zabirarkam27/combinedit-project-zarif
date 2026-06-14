import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { Check, ChevronRight, Minus, Plus, ShieldCheck, ShoppingCart, Truck } from "lucide-react";
import Slider from "react-slick";
import "react-toastify/dist/ReactToastify.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import api from "../api";
import { useCart } from "../context/CartContext";
import useOrderForm from "../hooks/useOrderForm";
import { useOrderDrawer } from "../hooks/useOrderDrawer";
import useProductDetails from "../hooks/useProductDetails";
import useProfileData from "../hooks/useProfileData";
import OrderDrawer from "../components/OrderDrawer";

const getProductImages = (product) => {
  if (!product) return [];
  const images = [
    product.thumbnail,
    product.image,
    ...(Array.isArray(product.images) ? product.images : [product.images]),
  ].filter(Boolean);

  return [...new Set(images)];
};

const getEffectivePrice = (product) =>
  Number(product?.discountPrice || product?.price || 0);

const buildSelectedProduct = (product, selectedOptions) => {
  const productId = product._id || product.id;
  const cartKey = [
    productId,
    selectedOptions.size || "default-size",
    selectedOptions.color || "default-color",
    selectedOptions.image || "default-image",
  ].join("|");

  return {
    ...product,
    cartKey,
    selectedOptions,
    selectedImage: selectedOptions.image,
    images: selectedOptions.image
      ? [selectedOptions.image, ...getProductImages(product).filter((image) => image !== selectedOptions.image)]
      : getProductImages(product),
  };
};

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { product, mainImage, setMainImage } = useProductDetails(id);
  const orderFormHook = useOrderForm(product);
  const { addToCart } = useCart();
  const { profile, loading: profileLoading } = useProfileData();

  const [popularProducts, setPopularProducts] = useState([]);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [quantityPreview, setQuantityPreview] = useState(1);

  const productImages = useMemo(() => getProductImages(product), [product]);
  const productSizes = useMemo(
    () => (Array.isArray(product?.sizes) ? product.sizes.filter(Boolean) : []),
    [product]
  );
  const productColors = useMemo(
    () => (Array.isArray(product?.colors) ? product.colors.filter(Boolean) : []),
    [product]
  );
  const activeImage = mainImage || productImages[0] || "";
  const selectedOptions = useMemo(
    () => ({
      size: selectedSize,
      color: selectedColor,
      image: activeImage,
    }),
    [activeImage, selectedColor, selectedSize]
  );

  const selectedProductForCheckout = useMemo(
    () => (product ? buildSelectedProduct(product, selectedOptions) : null),
    [product, selectedOptions]
  );

  useEffect(() => {
    if (!product) return;
    if (!selectedColor && productColors.length > 0) setSelectedColor(productColors[0]);
    if (!selectedSize && productSizes.length > 0) setSelectedSize(productSizes[0]);
  }, [product, productColors, productSizes, selectedColor, selectedSize]);

  useEffect(() => {
    const fetchPopular = async () => {
      try {
        const res = await api.get("/products");
        setPopularProducts(
          Array.isArray(res.data)
            ? res.data.filter((item) => item.active !== false).slice(0, 8)
            : []
        );
      } catch (err) {
        console.error("Failed to fetch popular products:", err);
      }
    };
    fetchPopular();
  }, []);

  const sliderSettings = {
    dots: true,
    infinite: popularProducts.length > 3,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 640, settings: { slidesToShow: 1 } },
    ],
  };

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

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await originalHandleSubmit(event);
      toast.success("Order placed successfully!", { autoClose: 2000 });
      closeDrawer();
      setTimeout(() => navigate("/"), 2100);
    } catch (err) {
      console.error("Order failed:", err);
      toast.error("Failed to place order. Try again!");
    }
  };

  const handleAddToCart = () => {
    if (!selectedProductForCheckout) return;
    addToCart(selectedProductForCheckout, quantityPreview);
    toast.success(`${product.name} added to cart`);
  };

  const handleOrderNow = () => {
    if (!selectedProductForCheckout) return;
    openDrawer(selectedProductForCheckout, quantityPreview);
  };

  if (!product) {
    return (
      <div className="theme-page-bg min-h-screen px-4 py-24">
        <div className="mx-auto max-w-6xl animate-pulse rounded-3xl bg-white p-6 shadow-sm">
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="aspect-square rounded-3xl bg-gray-200" />
            <div className="space-y-4">
              <div className="h-8 w-2/3 rounded bg-gray-200" />
              <div className="h-5 w-1/2 rounded bg-gray-200" />
              <div className="h-32 rounded bg-gray-200" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  const effectivePrice = getEffectivePrice(product);
  const regularPrice = Number(product.price || 0);
  const hasDiscount = Number(product.discountPrice) > 0;
  const totalPreview = effectivePrice * quantityPreview;

  return (
    <div className="theme-page-bg min-h-screen pb-12 pt-6 md:pt-28">
      <ToastContainer position="top-right" autoClose={2500} />

      <section className="mx-auto grid max-w-7xl gap-6 px-3 md:grid-cols-[minmax(0,1.04fr)_minmax(360px,0.96fr)] md:px-6">
        <div className="rounded-3xl border border-[var(--theme-border-color)] bg-white p-3 shadow-[0_20px_60px_rgba(15,23,42,0.08)] md:p-5">
          <div className="relative aspect-square overflow-hidden rounded-2xl bg-[var(--theme-muted-bg)]">
            {activeImage ? (
              <img
                src={activeImage}
                alt={product.name}
                className="h-full w-full object-contain p-4 transition duration-500 hover:scale-[1.03]"
              />
            ) : (
              <div className="grid h-full place-items-center text-sm font-semibold text-[var(--theme-muted-text)]">
                No image available
              </div>
            )}
            {hasDiscount && (
              <span className="absolute left-4 top-4 rounded-full bg-red-600 px-3 py-1 text-xs font-extrabold text-white shadow-lg">
                SALE
              </span>
            )}
          </div>

          {productImages.length > 1 && (
            <div className="mt-4 grid grid-cols-5 gap-2 sm:grid-cols-6 md:grid-cols-7">
              {productImages.map((image) => (
                <button
                  key={image}
                  type="button"
                  onClick={() => setMainImage(image)}
                  className={`aspect-square overflow-hidden rounded-xl border bg-white p-1 transition ${
                    activeImage === image
                      ? "border-[var(--theme-primary)] ring-2 ring-[var(--theme-primary)]/25"
                      : "border-[var(--theme-border-color)] hover:border-[var(--theme-primary)]"
                  }`}
                  aria-label="Select product image"
                >
                  <img src={image} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-3xl border border-[var(--theme-border-color)] bg-white p-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)] md:p-7">
          <div className="mb-4 flex flex-wrap items-center gap-2">
            {product.category && (
              <span className="rounded-full bg-[var(--theme-muted-bg)] px-3 py-1 text-xs font-bold text-[var(--theme-primary)]">
                {product.category}
              </span>
            )}
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
              {product.inStock ? "In stock" : "Out of stock"}
            </span>
          </div>

          <h1 className="text-3xl font-extrabold leading-tight text-slate-950 md:text-5xl">
            {product.name}
          </h1>

          <div className="mt-4 flex flex-wrap items-end gap-3">
            <span className="text-3xl font-black text-[var(--theme-primary)]">
              BDT {effectivePrice}
            </span>
            {hasDiscount && (
              <span className="pb-1 text-base font-bold text-gray-400 line-through">
                BDT {regularPrice}
              </span>
            )}
          </div>

          <p className="mt-5 text-sm leading-7 text-[var(--theme-muted-text)] md:text-base">
            {product.description || "Premium quality product selected for daily use."}
          </p>

          <div className="mt-6 grid gap-3 rounded-2xl bg-[var(--theme-muted-bg)] p-4 text-left sm:grid-cols-3">
            <div>
              <p className="text-xs font-bold uppercase text-[var(--theme-muted-text)]">Brand</p>
              <p className="mt-1 font-bold text-slate-950">{product.brand || "N/A"}</p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase text-[var(--theme-muted-text)]">Weight</p>
              <p className="mt-1 font-bold text-slate-950">{product.weight || product.volume || "Standard"}</p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase text-[var(--theme-muted-text)]">Stock</p>
              <p className="mt-1 font-bold text-slate-950">{product.inStock ? "Available" : "Unavailable"}</p>
            </div>
          </div>

          {productSizes.length > 0 && (
            <div className="mt-6">
              <p className="mb-3 text-sm font-extrabold text-slate-950">Select variation / size</p>
              <div className="flex flex-wrap gap-2">
                {productSizes.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setSelectedSize(size)}
                    className={`rounded-xl border px-4 py-2 text-sm font-bold transition ${
                      selectedSize === size
                        ? "border-[var(--theme-primary)] bg-[var(--theme-primary)] text-white"
                        : "border-[var(--theme-border-color)] bg-white text-slate-700 hover:border-[var(--theme-primary)]"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {productColors.length > 0 && (
            <div className="mt-6">
              <p className="mb-3 text-sm font-extrabold text-slate-950">Select color</p>
              <div className="flex flex-wrap gap-3">
                {productColors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setSelectedColor(color)}
                    className={`grid h-11 w-11 place-items-center rounded-full border transition ${
                      selectedColor === color
                        ? "border-[var(--theme-primary)] ring-2 ring-[var(--theme-primary)]/25"
                        : "border-[var(--theme-border-color)]"
                    }`}
                    aria-label={`Select color ${color}`}
                  >
                    <span className="h-8 w-8 rounded-full border border-black/10" style={{ backgroundColor: color }} />
                  </button>
                ))}
              </div>
              {selectedColor && (
                <p className="mt-2 text-xs font-semibold uppercase text-[var(--theme-muted-text)]">
                  Selected: {selectedColor}
                </p>
              )}
            </div>
          )}

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <div className="inline-flex items-center rounded-2xl border border-[var(--theme-border-color)] bg-white">
              <button
                type="button"
                onClick={() => setQuantityPreview((value) => Math.max(1, value - 1))}
                className="grid h-12 w-12 place-items-center rounded-l-2xl text-slate-700 hover:bg-gray-50"
                aria-label="Decrease quantity"
              >
                <Minus size={18} />
              </button>
              <span className="min-w-10 text-center font-extrabold">{quantityPreview}</span>
              <button
                type="button"
                onClick={() => setQuantityPreview((value) => value + 1)}
                className="grid h-12 w-12 place-items-center rounded-r-2xl text-slate-700 hover:bg-gray-50"
                aria-label="Increase quantity"
              >
                <Plus size={18} />
              </button>
            </div>
            <span className="text-sm font-bold text-[var(--theme-muted-text)]">
              Subtotal: BDT {totalPreview}
            </span>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-[auto_1fr]">
            <button
              type="button"
              onClick={handleAddToCart}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[var(--theme-primary)] px-5 py-3 font-extrabold text-[var(--theme-primary)] transition hover:bg-[var(--theme-primary)] hover:text-white"
            >
              <ShoppingCart size={20} />
              Add to Cart
            </button>
            <button
              type="button"
              onClick={handleOrderNow}
              className="inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3 font-extrabold text-white shadow-[0_14px_30px_rgba(11,125,35,0.22)] theme-gradient theme-gradient-hover"
            >
              Order Now <ChevronRight size={20} />
            </button>
          </div>

          {!profileLoading && profile?.phoneLink && (
            <a
              href={profile.phoneLink}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 py-3 font-bold text-white transition hover:bg-slate-800"
            >
              Call for help: {profile.phone || "01838600619"}
            </a>
          )}

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {[
              { icon: Truck, text: "Fast delivery" },
              { icon: ShieldCheck, text: "Secure checkout" },
              { icon: Check, text: "Quality checked" },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-2 rounded-2xl bg-[var(--theme-muted-bg)] px-3 py-2 text-sm font-bold text-slate-700">
                <Icon size={18} className="text-[var(--theme-primary)]" />
                {text}
              </div>
            ))}
          </div>
        </div>
      </section>

      {popularProducts.length > 0 && (
        <section className="mx-auto mt-10 max-w-7xl px-3 md:px-6">
          <div className="mb-5 flex items-end justify-between gap-3">
            <div>
              <h2 className="text-2xl font-black text-slate-950">Popular Products</h2>
              <p className="text-sm font-medium text-[var(--theme-muted-text)]">
                More items your customers often choose
              </p>
            </div>
            <Link to="/products" className="hidden text-sm font-extrabold text-[var(--theme-primary)] sm:inline-flex">
              View all
            </Link>
          </div>

          <Slider {...sliderSettings}>
            {popularProducts.map((item) => {
              const image = getProductImages(item)[0];
              return (
                <div key={item._id || item.id} className="px-2">
                  <article className="overflow-hidden rounded-2xl border border-[var(--theme-border-color)] bg-white shadow-[0_14px_34px_rgba(15,23,42,0.08)]">
                    <div className="aspect-[4/3] bg-[var(--theme-muted-bg)]">
                      {image && <img src={image} alt={item.name} className="h-full w-full object-cover" />}
                    </div>
                    <div className="p-4 text-left">
                      <h3 className="line-clamp-2 font-extrabold text-slate-950">{item.name}</h3>
                      <p className="mt-1 font-black text-[var(--theme-primary)]">
                        BDT {item.discountPrice || item.price}
                      </p>
                      <button
                        type="button"
                        onClick={() => navigate(`/products/${item._id || item.id}`)}
                        className="mt-3 w-full rounded-xl px-3 py-2 text-sm font-bold text-white theme-gradient theme-gradient-hover"
                      >
                        View Details
                      </button>
                    </div>
                  </article>
                </div>
              );
            })}
          </Slider>
        </section>
      )}

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
