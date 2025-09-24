import { useState, useCallback, useRef, memo } from "react";
import useImageUpload from "../hooks/useImageUpload";
import design from "../styles/design";
import debounce from "lodash/debounce";

const SocialLinksManager = ({ socialLinks = [], onChange }) => {
  const [links, setLinks] = useState(socialLinks);
  const { uploadImage } = useImageUpload();

  const linksRef = useRef(links);

  // Use a callback to update state
  const handleAdd = () => {
    const newLinks = [...linksRef.current, { icon: "", url: "" }];
    linksRef.current = newLinks; // Update reference without re-rendering
    setLinks(newLinks); // Trigger state update for render
    onChange(newLinks);
  };

  const handleRemove = (index) => {
    const newLinks = linksRef.current.filter((_, i) => i !== index);
    linksRef.current = newLinks; // Update reference without re-rendering
    setLinks(newLinks);
    onChange(newLinks);
  };

  const handleChange = (index, field, value) => {
    const newLinks = [...linksRef.current];
    newLinks[index][field] = value;
    linksRef.current = newLinks; // Update reference without re-rendering
    setLinks(newLinks);
    onChange(newLinks);
  };

  const handleIconUpload = async (index, e) => {
    const imageFile = e.target.files[0];
    if (!imageFile) return;

    const imageUrl = await uploadImage(imageFile);
    if (imageUrl) handleChange(index, "icon", imageUrl);
  };

  // Debounced function to avoid excessive API calls when user types quickly
  const handleUrlChange = useCallback(
    debounce((index, value) => {
      handleChange(index, "url", value);
    }, 500),
    []
  );

  return (
    <div className="col-span-full bg-[#d8e2e2] p-4 rounded-md">
      <h3 className="font-semibold text-lg mb-3">Custom Social Links</h3>

      {links.map((link, index) => (
        <div
          key={index}
          className="grid md:grid-cols-3 gap-3 mb-3 items-center"
        >
          {/* Icon Preview & Upload */}
          <div className="col-span-1 flex flex-col items-center">
            {link.icon && (
              <img
                src={link.icon}
                alt={`social-${index}`}
                className="w-12 h-12 object-contain mb-1"
              />
            )}
          </div>

          {/* URL Input */}
          <div className="col-span-2">
            <div className="grid grid-cols-12 gap-2">
              <div className="col-span-11">
                <input
                  type="text"
                  placeholder="Enter link (https://...)"
                  value={link.url}
                  onChange={(e) => handleUrlChange(index, e.target.value)}
                  className="w-full bg-[#ebf0f0] border border-gray-300 px-3 py-2 rounded-md"
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleIconUpload(index, e)}
                  className="input w-full bg-[#ebf0f0] border border-gray-300 px-2 py-1 rounded-md"
                />
              </div>

              {/* Remove Button */}
              <div className="col-span-1 h-full">
                <button
                  type="button"
                  onClick={() => handleRemove(index)}
                  className="bg-red-600 text-white px-3 py-2 rounded-md hover:bg-red-700 transition h-[80px]"
                >
                  ✕
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}

      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleAdd}
          className={`${design.buttons} bg-green-600 hover:bg-green-800 mt-2 w-[350px]`}
        >
          + Add Social Link
        </button>
      </div>
    </div>
  );
};

export default memo(SocialLinksManager);
