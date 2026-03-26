import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { FaCloudUploadAlt, FaTrash, FaCheckCircle, FaExclamationCircle } from "react-icons/fa";
import axios from "axios";
import toast from "react-hot-toast";

export default function ImageUploader({ images, setImages }) {
  const [uploading, setUploading] = useState(false);

  const onDrop = useCallback(
    async (acceptedFiles) => {
      if (images.length + acceptedFiles.length > 5) {
        toast.error("You can only upload up to 5 images per product.");
        return;
      }

      const uploadPromises = acceptedFiles.map(async (file) => {
        const formData = new FormData();
        formData.append("images", file);

        try {
          const token = localStorage.getItem("token");
          const response = await axios.post(
            `${import.meta.env.VITE_BACKEND_URL}/api/upload`,
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${token}`,
              },
            }
          );
          return response.data.urls[0];
        } catch (error) {
          console.error("Upload error:", error);
          toast.error(`Failed to upload ${file.name}`);
          return null;
        }
      });

      setUploading(true);
      const uploadedUrls = await Promise.all(uploadPromises);
      const validUrls = uploadedUrls.filter((url) => url !== null);
      
      setImages((prev) => [...prev, ...validUrls]);
      setUploading(false);
      
      if (validUrls.length > 0) {
        toast.success(`Successfully uploaded ${validUrls.length} file(s)`);
      }
    },
    [images, setImages]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    maxSize: 5242880, // 5MB
    multiple: true,
  });

  const removeImage = (indexToRemove) => {
    setImages((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-300 ${
          isDragActive
            ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
            : "border-gray-200 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-500/50"
        } ${uploading ? "opacity-50 pointer-events-none" : ""}`}
      >
        <input {...getInputProps()} />
        <FaCloudUploadAlt className="text-4xl text-gray-400 dark:text-gray-500 mx-auto mb-3" />
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {isDragActive
            ? "Drop the files here"
            : "Drag & drop product images, or click to select"}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          JPG, PNG or WebP up to 5MB (Max 5 images)
        </p>
        {uploading && (
          <div className="mt-4 flex items-center justify-center gap-2 text-blue-600 font-bold text-sm">
            <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            Uploading...
          </div>
        )}
      </div>

      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {images.map((url, index) => (
            <div
              key={url}
              className="relative group aspect-square rounded-xl overflow-hidden border border-gray-100 dark:border-gray-700 shadow-sm"
            >
              <img
                src={url}
                alt={`Product ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  title="Remove Image"
                >
                  <FaTrash size={14} />
                </button>
              </div>
              {index === 0 && (
                <div className="absolute top-2 left-2 bg-blue-600 text-white text-[10px] font-black px-2 py-0.5 rounded shadow-lg uppercase tracking-wider flex items-center gap-1">
                  <FaCheckCircle size={10} /> MAIN
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
