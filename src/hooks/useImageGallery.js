import { useState } from "react";
import useImageUpload from "./useImageUpload";
import { toast } from "react-toastify";

const useImageGallery = () => {
  const [image, setImage] = useState([]);
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const { uploadImage } = useImageUpload();

  // ---- Single Image ----
  const addSingleImage = async (file) => {
    if (!file) return;
    setUploading(true);

    const imageUrl = await uploadImage(file);
    if (imageUrl) {
      setImage(imageUrl);
      toast.success("Single image uploaded");
    } else {
      toast.error("Single image upload failed");
    }
    setUploading(false);
  };

  const addSingleImageFromUrl = (url) => {
    if (!url) return;
    setImage(url);
  };

  const removeSingleImage = () => {
    setImage(null);
  };

  const setInitialSingleImage = (initial) => {
    setImage(initial);
  };


  // ---- Multiple Images ----
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
    // single
    image,
    addSingleImage,
    addSingleImageFromUrl,
    removeSingleImage,
    setInitialSingleImage,

    // multiple
    images,
    addImage,
    removeImage,
    setInitialImages,
    addImageFromUrl,
    
    // common
    uploading,
  };
};

export default useImageGallery;
