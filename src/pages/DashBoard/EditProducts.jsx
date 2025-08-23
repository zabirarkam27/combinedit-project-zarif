import { Link } from "react-router-dom";

const EditProducts = () => {
  return (
    <div className="min-h-[calc(100vh-48px)] bg-gradient-to-b from-[#06b5d4] to-[#3b82f5] max-w-2xl mx-auto my-6 rounded-xl flex items-center justify-center flex-col">
      <h1 className="text-3xl md:text-4xl font-bold text-center text-white mb-10">
        Edit Products
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 px-12">
        {/* Add Product */}
        <Link
          to="/dashboard/edit-your-products/add"
          className="relative group block rounded-2xl overflow-hidden hover:shadow-2xl transition-shadow duration-300 bg-white/85 shadow-2xl"
        >
          <img
            src="/icons/14.png"
            alt="Add Product"
            className="h-72 object-contain p-4 transform transition-transform duration-500 group-hover:scale-105"
          />
          <div className="block text-center bg-[#696b6e] text-white font-semibold px-4 py-4 hover:bg-black transition">
            Add New Product
          </div>
        </Link>

        {/* All Products */}
        <Link
          to="/dashboard/edit-your-products/all"
          className="relative group block rounded-2xl overflow-hidden hover:shadow-2xl transition-shadow duration-300 bg-white/85 shadow-2xl"
        >
          <div className=" flex justify-center items-center">
            <img
              src="/icons/23.png"
              alt="All Products"
              className="h-72 object-contain p-4 transform transition-transform duration-500 group-hover:scale-105"
            />
          </div>
          <div className="block text-center bg-[#696b6e] text-white font-semibold px-4 py-4 hover:bg-black transition">
            View All Products
          </div>
        </Link>
      </div>
    </div>
  );
};

export default EditProducts;
