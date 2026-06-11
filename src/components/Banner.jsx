import { useEffect, useState } from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, Leaf } from "lucide-react";
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
    <section className="mx-auto mt-4 pb-6 md:mt-0">
      {products.length > 0 ? (
        <Carousel
          autoPlay
          infiniteLoop
          showThumbs={false}
          showStatus={false}
          showArrows
          interval={5000}
          transitionTime={800}
          swipeable
          emulateTouch
          renderArrowPrev={(clickHandler, hasPrev) =>
            hasPrev && (
              <button
                type="button"
                onClick={clickHandler}
                aria-label="Previous banner"
                className="absolute left-4 top-1/2 z-20 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-white/15 text-white shadow-lg backdrop-blur-md transition hover:bg-white/25 md:left-5"
              >
                <ChevronLeft size={28} strokeWidth={2.4} />
              </button>
            )
          }
          renderArrowNext={(clickHandler, hasNext) =>
            hasNext && (
              <button
                type="button"
                onClick={clickHandler}
                aria-label="Next banner"
                className="absolute right-4 top-1/2 z-20 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-white/15 text-white shadow-lg backdrop-blur-md transition hover:bg-white/25 md:right-5"
              >
                <ChevronRight size={28} strokeWidth={2.4} />
              </button>
            )
          }
          renderIndicator={(clickHandler, isSelected, index) => (
            <button
              type="button"
              key={index}
              onClick={clickHandler}
              aria-label={`Go to banner ${index + 1}`}
              className={`mx-1 inline-block h-3 rounded-full transition-all ${
                isSelected
                  ? "w-7 bg-white"
                  : "w-3 bg-white/90 hover:bg-[var(--theme-secondary)]"
              }`}
            />
          )}
        >
          {products.map((product, index) => {
            const productTitle = product.name || "Soybean Oil";
            const highlightedTitle = product.category || productTitle;

            return (
              <Link to={`/products/${product._id}`} key={product._id || index}>
                <div className="group relative isolate min-h-[250px] overflow-hidden rounded-[22px] bg-[#061d0c] text-left shadow-[0_24px_70px_rgba(6,29,12,0.26)] sm:min-h-[330px] md:min-h-[390px]">
                  <img
                    src={getProductImage(product)}
                    alt=""
                    aria-hidden="true"
                    className="absolute inset-0 h-full w-full scale-105 object-cover object-center opacity-95 saturate-110 transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(6,29,12,0.94)_0%,rgba(6,29,12,0.78)_34%,rgba(6,29,12,0.34)_62%,rgba(6,29,12,0.04)_100%)]" />
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_45%,transparent_0%,rgba(6,29,12,0.08)_42%,rgba(6,29,12,0.22)_100%)]" />

                  <div className="relative z-10 flex min-h-[250px] items-center px-8 py-8 sm:min-h-[330px] md:min-h-[390px] md:px-24">
                    <div className="max-w-[560px] text-white">
                      <div className="mb-5 inline-flex items-center gap-2 text-sm font-bold text-[#d8f56b] md:text-base">
                        <Leaf size={18} fill="currentColor" />
                        Premium Quality
                      </div>

                      <h2 className="text-[34px] font-extrabold leading-[1.06] tracking-tight sm:text-5xl md:text-[52px]">
                        Pure &amp; Healthy
                        <span className="mt-1 block text-[#65d35f]">
                          {highlightedTitle}
                        </span>
                      </h2>

                      <p className="mt-4 max-w-[460px] text-base font-semibold leading-relaxed text-white md:text-xl">
                        100% Pure, Refined &amp; Healthy Cooking Oil for Your Family
                      </p>

                      <span className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[var(--theme-primary)] px-7 py-3.5 text-sm font-extrabold text-white shadow-[0_14px_26px_rgba(11,125,35,0.36)] transition-transform group-hover:translate-x-1 md:text-base">
                        Shop Now <ChevronRight size={20} strokeWidth={2.6} />
                      </span>
                    </div>
                  </div>

                  <div className="pointer-events-none absolute bottom-4 left-0 right-0 z-20 flex justify-center" />
                </div>
              </Link>
            );
          })}
        </Carousel>
      ) : (
        <p className="text-center text-gray-300">No products available</p>
      )}
    </section>
  );
};

export default Banner;
