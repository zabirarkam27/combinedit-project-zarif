import { useState } from "react";
import useImageUpload from "./useImageUpload";
import { toast } from "react-toastify";

const useImageGallery = () => {
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const { uploadImage } = useImageUpload();

  const addImage = async (file) => {
    if (!file) return;
    setUploading(true);

    const imageUrl = await uploadImage(file);
    if (imageUrl) {
      setImages((prev) => [...prev, imageUrl]);
      toast.success("Image uploaded");
    } else {
      toast.error("Image upload failed");
    }
    setUploading(false);
  };
  const addImageFromUrl = (url) => {
    if (!url) return;
    setImages((prev) => [...prev, url]);
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const setInitialImages = (initial) => {
    setImages(initial);
  };

  return {
    images,
    uploading,
    addImage,
    removeImage,
    setInitialImages,
    addImageFromUrl,
  };
};

export default useImageGallery;
