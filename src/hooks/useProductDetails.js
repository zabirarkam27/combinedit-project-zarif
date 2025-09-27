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

        // ✅ mainImage safe selection
        if (data) {
          let imageToUse = null;

          if (Array.isArray(data.images) && data.images.length > 0) {
            imageToUse = data.images[0];
          } else if (data.image) {
            // single image field
            imageToUse = Array.isArray(data.image) ? data.image[0] : data.image;
          } else if (data.thumbnail) {
            imageToUse = data.thumbnail;
          }

          setMainImage(imageToUse);
        }
      })
      .catch((err) => console.error("Failed to fetch product details:", err));
  }, [id]);

  return { product, mainImage, setMainImage };
};

export default useProductDetails;
