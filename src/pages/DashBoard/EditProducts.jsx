import { Link } from "react-router-dom";

const EditProducts = () => {
  return (
    <div className="bg-[#ebf0f0] min-h-screen p-6 mx-auto">
      <h1 className="text-2xl font-bold mb-8">Edit Products</h1>
      <div className="mx-auto  my-6 rounded-xl flex items-center justify-center flex-col">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:px-12">
          {/* Add Product */}
          <Link
            to="/dashboard/edit-your-products/add"
            className="group block rounded-xl overflow-hidden hover:shadow-xl transition-shadow duration-200 bg-[#b5e4e0] shadow-lg w-full"
          >
            <img
              src="/icons/14.png"
              alt="Add Product"
              className="w-full h-72 object-contain p-3 transform transition-transform duration-500 group-hover:scale-105"
            />
            <div className="text-center text-white font-semibold px-4 py-4 rounded-b-xl bg-gradient-to-r from-[#00ad9c] via-[#3a8881] to-[#009e8e] bg-[length:200%_200%] transition-all duration-500 ease-in-out hover:bg-right">
              Add New Product
            </div>
          </Link>

          {/* All Products */}
          <Link
            to="/dashboard/edit-your-products/all"
            className="group block rounded-xl overflow-hidden hover:shadow-xl transition-shadow duration-300 bg-[#b5e4e0] shadow-lg w-full"
          >
            <div className=" flex justify-center items-center">
              <img
                src="/icons/23.png"
                alt="All Products"
                className="w-full h-72 object-contain p-3 transform transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="text-center text-white font-semibold px-4 py-4 rounded-b-xl bg-gradient-to-r from-[#00ad9c] via-[#3a8881] to-[#009e8e] bg-[length:200%_200%] transition-all duration-500 ease-in-out hover:bg-right">
              View All Products
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EditProducts;
