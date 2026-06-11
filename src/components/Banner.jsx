import { useEffect, useState } from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Link } from "react-router-dom";
import { ChevronRight, Leaf } from "lucide-react";
import { getProducts } from "../services/products";

const getProductImage = (product) => {
  if (!product) return "";

  if (product.image) return product.image;
  if (product.thumbnail) return product.thumbnail;
  if (Array.isArray(product.images)) return product.images.find(Boolean) || "";
  if (typeof product.images === "string") return product.images;

  return "";
};

const Banner = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    getProducts()
      .then((res) => {
        const data = res.data;

        if (Array.isArray(data)) {
          setProducts(
            data
              .filter((product) => product.active !== false)
              .filter((product) => getProductImage(product))
              .sort(
                (a, b) =>
                  Number(Boolean(b.featured)) - Number(Boolean(a.featured))
              )
          );
        } else if (typeof data === "object" && data !== null) {
          setProducts(getProductImage(data) ? [data] : []);
        } else {
          console.error("Unexpected response format:", data);
          setProducts([]);
        }
      })
      .catch((err) => {
        console.error("Failed to load products:", err);
        setProducts([]);
      });
  }, []);

  return (
    <div className="mx-auto mt-6 pb-6">
      
      {products.length > 0 ? (
        <Carousel
          autoPlay
          infiniteLoop
          showThumbs={false}
          showStatus={false}
          interval={5000}
          transitionTime={800}
          swipeable
          emulateTouch
        >
          {products.map((product) => (
            <Link to={`/products/${product._id}`} key={product._id}>
              <div className="group relative overflow-hidden rounded-3xl bg-[#061d0c] shadow-[0_24px_70px_rgba(6,29,12,0.28)]">
                <img
                  src={getProductImage(product)}
                  alt=""
                  aria-hidden="true"
                  className="absolute inset-0 h-full w-full scale-105 object-cover opacity-80 saturate-110 transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#061d0c]/92 via-[#061d0c]/62 to-transparent" />
                <div className="relative z-10 flex min-h-[250px] items-center px-6 py-8 text-left sm:min-h-[330px] md:min-h-[390px] md:px-14">
                  <div className="max-w-[520px] text-white">
                    <div className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-[#b8f261]">
                      <Leaf size={18} fill="currentColor" />
                      Premium Quality
                    </div>
                    <h2 className="text-3xl font-extrabold leading-tight sm:text-5xl">
                      Pure & Healthy
                      <span className="mt-1 block text-[#66d65d]">
                        {product.category || product.name || "Fresh Products"}
                      </span>
                    </h2>
                    <p className="mt-4 max-w-md text-base font-medium leading-relaxed text-white/92 sm:text-xl">
                      Best quality products for your daily needs.
                    </p>
                    <span className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[var(--theme-primary)] px-6 py-3 text-sm font-bold text-white shadow-[0_12px_24px_rgba(11,125,35,0.35)] transition-transform group-hover:translate-x-1">
                      Shop Now <ChevronRight size={18} />
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </Carousel>
      ) : (
        <p className="text-center text-gray-300">No products available</p>
      )}
    </div>
  );
};

export default Banner;
