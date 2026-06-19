import { memo, useEffect, useState } from "react";
import { ImagePlus, Link as LinkIcon, Plus, Trash2, Upload } from "lucide-react";

import useImageUpload from "../hooks/useImageUpload";

const inputClass =
  "h-11 w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 text-sm font-semibold text-slate-700 outline-none transition focus:border-[var(--theme-primary)] focus:bg-white focus:ring-2 focus:ring-[var(--theme-muted-bg)]";

const SocialLinksManager = ({ socialLinks = [], onChange }) => {
  const [links, setLinks] = useState(socialLinks);
  const [uploadingIndex, setUploadingIndex] = useState(null);
  const { uploadImage } = useImageUpload();

  useEffect(() => {
    setLinks(socialLinks);
  }, [socialLinks]);

  const updateLinks = (nextLinks) => {
    setLinks(nextLinks);
    onChange(nextLinks);
  };

  const handleAdd = () => {
    updateLinks([...links, { icon: "", url: "" }]);
  };

  const handleRemove = (index) => {
    updateLinks(links.filter((_, itemIndex) => itemIndex !== index));
  };

  const handleChange = (index, field, value) => {
    updateLinks(
      links.map((link, itemIndex) =>
        itemIndex === index ? { ...link, [field]: value } : link
      )
    );
  };

  const handleIconUpload = async (index, event) => {
    const imageFile = event.target.files?.[0];
    if (!imageFile) return;

    setUploadingIndex(index);
    try {
      const imageUrl = await uploadImage(imageFile);
      if (imageUrl) handleChange(index, "icon", imageUrl);
    } finally {
      setUploadingIndex(null);
      event.target.value = "";
    }
  };

  return (
    <div>
      <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-cyan-50 text-cyan-700">
            <LinkIcon size={20} />
          </span>
          <div>
            <p className="text-xs font-black uppercase tracking-wide text-[var(--theme-primary)]">
              Social
            </p>
            <h2 className="text-xl font-black text-slate-950">Custom social links</h2>
          </div>
        </div>
        <button
          type="button"
          onClick={handleAdd}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-slate-950 px-4 text-sm font-black text-white transition hover:bg-slate-800"
        >
          <Plus size={16} />
          Add Link
        </button>
      </div>

      {links.length > 0 ? (
        <div className="grid gap-3">
          {links.map((link, index) => (
            <div
              key={`${link.icon || "icon"}-${index}`}
              className="grid gap-3 rounded-3xl border border-slate-100 bg-slate-50 p-4 md:grid-cols-[88px_1fr_auto] md:items-center"
            >
              <div className="grid h-20 w-20 place-items-center overflow-hidden rounded-3xl bg-white">
                {link.icon ? (
                  <img
                    src={link.icon}
                    alt={`Social ${index + 1}`}
                    className="h-12 w-12 object-contain"
                  />
                ) : (
                  <ImagePlus size={24} className="text-slate-300" />
                )}
              </div>

              <div className="min-w-0 space-y-2">
                <input
                  type="text"
                  placeholder="Enter link (https://...)"
                  value={link.url || ""}
                  onChange={(event) => handleChange(index, "url", event.target.value)}
                  className={inputClass}
                />
                <label className="inline-flex h-10 w-full cursor-pointer items-center justify-center gap-2 rounded-2xl bg-white px-3 text-xs font-black text-slate-700 ring-1 ring-slate-200 transition hover:ring-[var(--theme-primary)] sm:w-auto">
                  <Upload size={15} />
                  {uploadingIndex === index ? "Uploading..." : "Upload icon"}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(event) => handleIconUpload(index, event)}
                    className="hidden"
                  />
                </label>
              </div>

              <button
                type="button"
                onClick={() => handleRemove(index)}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-rose-50 px-4 text-sm font-black text-rose-700 transition hover:bg-rose-600 hover:text-white"
              >
                <Trash2 size={16} />
                Remove
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center">
          <LinkIcon className="mx-auto text-slate-300" size={34} />
          <p className="mt-3 font-black text-slate-700">No custom social links yet</p>
          <p className="mt-1 text-sm font-medium text-slate-500">
            Add extra channels only when you need them.
          </p>
        </div>
      )}
    </div>
  );
};

export default memo(SocialLinksManager);
