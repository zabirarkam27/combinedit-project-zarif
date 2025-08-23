import { useState } from "react";
import { toast } from "react-toastify";

const imgbbApiKey = "e61259e4f671cfd3cce82559116cc968";

const useImageUpload = () => {
  const [uploading, setUploading] = useState(false);

  const uploadImage = async (imageFile) => {
    if (!imageFile) return null;

    setUploading(true);
    const formData = new FormData();
    formData.append("image", imageFile);

    try {
      const res = await fetch(
        `https://api.imgbb.com/1/upload?key=${imgbbApiKey}`,
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await res.json();
      if (data.success) {
        toast.success("Image uploaded successfully!");
        return data.data.display_url;
      } else {
        toast.error("Image upload failed.");
        return null;
      }
    } catch (err) {
      console.error("Image upload error:", err);
      toast.error("Something went wrong while uploading.");
      return null;
    } finally {
      setUploading(false);
    }
  };

  return { uploadImage, uploading };
};

export default useImageUpload;
