import { useEffect, useState } from "react";
import { getProductById } from "../services/products";

const useProductDetails = (id) => {
  const [product, setProduct] = useState(null);
  const [mainImage, setMainImage] = useState(null);

  useEffect(() => {
    if (!id) return;

    getProductById(id)
      .then((res) => {
        const data = res.data;
        setProduct(data);

        if (data?.images?.length > 0) {
          setMainImage(data.images[0]);
        }
      })
      .catch((err) => console.error("Failed to fetch product details:", err));
  }, [id]);

  return { product, mainImage, setMainImage };
};

export default useProductDetails;
