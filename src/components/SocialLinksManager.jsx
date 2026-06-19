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
    <div className="col-span-full rounded-2xl bg-[#d8e2e2] p-3 sm:p-4">
      <h3 className="font-semibold text-lg mb-3">Custom Social Links</h3>

      {links.map((link, index) => (
        <div
          key={index}
          className="mb-3 grid gap-3 rounded-xl bg-white/45 p-3 md:grid-cols-3 md:items-center"
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
          <div className="md:col-span-2">
            <div className="grid gap-2 sm:grid-cols-[1fr_auto]">
              <div className="min-w-0">
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
              <div className="h-full">
                <button
                  type="button"
                  onClick={() => handleRemove(index)}
                  className="h-10 w-full rounded-md bg-red-600 px-3 py-2 text-white transition hover:bg-red-700 sm:h-[80px] sm:w-auto"
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
          className={`${design.buttons} mt-2 w-full bg-green-600 hover:bg-green-800 sm:w-auto sm:min-w-72`}
        >
          + Add Social Link
        </button>
      </div>
    </div>
  );
};

export default memo(SocialLinksManager);
