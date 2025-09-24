import { useEffect, useState } from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Link } from "react-router-dom";
import { getProducts } from "../services/products";

const Banner = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    getProducts()
      .then((res) => {
        const data = res.data;

        if (Array.isArray(data)) {
          setProducts(data);
        } else if (typeof data === "object" && data !== null) {
          setProducts([data]);
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
      <h1 className="text-gray-700 font-semibold text-xl sm:text-2xl md:text-3xl lg:text-4xl mb-4 sm:mb-6 md:mb-8 text-center">
        My Products
      </h1>

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
              <div className="group overflow-hidden rounded-xl">
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="max-h-[180px] sm:max-h-[200px] md:max-h-[380px] w-full object-cover rounded-xl transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="max-h-[300px] w-full bg-gray-200 flex items-center justify-center rounded-xl">
                    <span className="text-gray-500">No Image</span>
                  </div>
                )}
                <p className="legend">{product.name}</p>
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
