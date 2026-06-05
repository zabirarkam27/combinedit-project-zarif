import { Link } from "react-router-dom";

const productActions = [
  {
    title: "Add New Product",
    description: "Create a product with images, prices, colors, and stock.",
    image: "/icons/14.png",
    to: "/dashboard/edit-your-products/add",
  },
  {
    title: "View All Products",
    description: "Search, edit, or delete products from the catalog.",
    image: "/icons/23.png",
    to: "/dashboard/edit-your-products/all",
  },
];

const EditProducts = () => {
  return (
    <div className="theme-dashboard-bg min-h-screen p-3 md:p-6">
      <div className="mb-6">
        <h1 className="text-xl md:text-3xl font-bold theme-text">
          Edit Products
        </h1>
        <p className="text-sm text-gray-600">
          Choose an action to update your product catalog.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {productActions.map((action) => (
          <Link
            key={action.to}
            to={action.to}
            className="group overflow-hidden rounded-lg border theme-border bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
          >
            <div className="theme-page-bg flex h-48 items-center justify-center p-4 md:h-64">
              <img
                src={action.image}
                alt=""
                className="h-full w-full object-contain transition duration-300 group-hover:scale-105"
              />
            </div>
            <div className="p-4">
              <h2 className="text-lg font-bold theme-text">{action.title}</h2>
              <p className="mt-1 text-sm text-gray-600">
                {action.description}
              </p>
              <div className="mt-4 btn w-full border-0 text-white theme-gradient theme-gradient-hover">
                Open
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default EditProducts;
