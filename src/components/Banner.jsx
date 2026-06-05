import { useEffect, useState } from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Link } from "react-router-dom";
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
    <div className="max-w-5xl mx-auto mt-6 pb-8">
      
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
              <div className="group relative overflow-hidden rounded-xl bg-[radial-gradient(circle_at_center,#f8fffe_0%,#e7f4f1_42%,#193c43_100%)] shadow-xl">
                <img
                  src={getProductImage(product)}
                  alt=""
                  aria-hidden="true"
                  className="absolute inset-0 h-full w-full scale-110 object-cover opacity-30 blur-2xl saturate-125 transition-transform duration-700 group-hover:scale-[1.15]"
                />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.72)_0%,rgba(255,255,255,0.28)_45%,rgba(0,0,0,0.30)_100%)]" />
                <div className="absolute bottom-0 left-0 right-0 z-20 h-24 bg-gradient-to-t from-black/45 to-transparent" />
                <img
                  src={getProductImage(product)}
                  alt={product.name || "Featured product"}
                  loading="eager"
                  className="relative z-10 h-[190px] sm:h-[240px] md:h-[420px] w-full object-contain mix-blend-multiply drop-shadow-2xl transition-transform duration-500 group-hover:scale-[1.02]"
                />
                <div className="absolute bottom-4 left-1/2 z-30 w-[min(88%,560px)] -translate-x-1/2">
                  <div className="mx-auto border border-white/40 bg-black/55 px-4 py-2 text-center text-sm font-semibold text-white shadow-lg backdrop-blur-md sm:text-base">
                    {product.name || "Featured product"}
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
