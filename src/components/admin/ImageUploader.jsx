import { useRef, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { FiUploadCloud, FiX } from "react-icons/fi";

/**
 * ImageUploader
 * Props:
 *   images   – string[]  (current Cloudinary URLs)
 *   onChange – (urls: string[]) => void
 */
const ImageUploader = ({ images = [], onChange }) => {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);

  const uploadFiles = async (files) => {
    if (!files || files.length === 0) return;

    const allowed = Array.from(files).filter((f) =>
      ["image/jpeg", "image/png", "image/webp"].includes(f.type)
    );

    if (allowed.length === 0) {
      toast.error("Only JPG, PNG and WebP images are accepted");
      return;
    }

    if (images.length + allowed.length > 5) {
      toast.error("Maximum 5 images per product");
      return;
    }

    setUploading(true);
    try {
      const token = localStorage.getItem("token");
      const baseUrl = import.meta.env.VITE_BACKEND_URL;
      const formData = new FormData();
      allowed.forEach((f) => formData.append("images", f));

      const { data } = await axios.post(`${baseUrl}/api/upload`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      onChange([...images, ...data.urls]);
      toast.success(`${data.urls.length} image${data.urls.length > 1 ? "s" : ""} uploaded`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Upload failed");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const removeImage = (index) => {
    onChange(images.filter((_, i) => i !== index));
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    uploadFiles(e.dataTransfer.files);
  };

  return (
    <div className="space-y-3">
      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        onClick={() => !uploading && inputRef.current?.click()}
        className={`
          relative flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-xl cursor-pointer
          transition-colors duration-200 p-6 select-none
          ${dragging
            ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20"
            : "border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/40 hover:border-indigo-400 hover:bg-indigo-50/50 dark:hover:bg-indigo-900/10"
          }
        `}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          className="hidden"
          onChange={(e) => uploadFiles(e.target.files)}
        />
        {uploading ? (
          <>
            <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-indigo-500 font-medium">Uploading to Cloudinary…</p>
          </>
        ) : (
          <>
            <FiUploadCloud className="w-8 h-8 text-indigo-400" />
            <p className="text-sm text-gray-600 dark:text-gray-300 font-medium">
              Drag &amp; drop images here, or <span className="text-indigo-500 underline">browse</span>
            </p>
            <p className="text-xs text-gray-400">JPG, PNG, WebP · max 5 MB each · up to 5 images</p>
          </>
        )}
      </div>

      {/* Previews */}
      {images.length > 0 && (
        <div className="flex flex-wrap gap-3">
          {images.map((url, i) => (
            <div key={url} className="relative group w-20 h-20 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-600 shadow-sm">
              <img src={url} alt={`img-${i}`} className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => removeImage(i)}
                className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
              >
                <FiX className="text-white w-5 h-5" />
              </button>
              {i === 0 && (
                <span className="absolute bottom-0 left-0 right-0 text-[9px] text-center bg-indigo-600 text-white py-0.5 font-semibold">
                  MAIN
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
