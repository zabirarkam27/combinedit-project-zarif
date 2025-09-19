import { useEffect, useState } from "react";
import { getLandingPages } from "../../../services/landingPages";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const ExistingPages = () => {
  const [pages, setPages] = useState([]);

  useEffect(() => {
    const fetchPages = async () => {
      try {
        const { data } = await getLandingPages();
        setPages(data);
      } catch {
        toast.error("Failed to fetch Landing Pages");
      }
    };
    fetchPages();
  }, []);

  const handleCopy = (id) => {
    const link = `${import.meta.env.VITE_CLIENT_URL}/landing-page/${id}`;
    navigator.clipboard.writeText(link);
    toast.success("Link copied!");
  };

  return (
    <div className="w-full mx-auto p-2 md:p-4 bg-[#ebf0f0] shadow-md min-h-screen">
      <h1 className="text-lg md:text-3xl font-bold text-black my-10">
        Your Landing Pages
      </h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {pages.map((page) => (
          <div
            key={page._id}
            className="card card-bordered bg-base-100 hover:scale-105 transition-transform duration-200 ease-in-out"
          >
            <div className="card-body shadow-xl ">
              <Link to={`/landing-page/${page._id}`}>
                <h2 className="card-title">
                  {page.nameEn} || {page.nameBn}
                </h2>
                <p>Product ID: {page.productId}</p>
              </Link>
              <div className="card-actions justify-end">
                <button
                  className="w-full btn text-center text-white font-semibold px-4 py-3 rounded-b-xl bg-gradient-to-r from-[#00ad9c] via-[#3a8881] to-[#009e8e] bg-[length:200%_200%] transition-all duration-500 ease-in-out hover:bg-right mt-4"
                  onClick={() => handleCopy(page._id)}
                >
                  Copy Link
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExistingPages;
