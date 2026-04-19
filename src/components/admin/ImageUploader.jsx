import { useRef, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { FiUploadCloud, FiTrash2, FiPlus, FiImage } from "react-icons/fi";

const ImageUploader = ({ images = [], folderName = "Uncategorized", onChange }) => {
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

    if (images.length + allowed.length > 10) {
      toast.error("Maximum 10 images per product");
      return;
    }

    setUploading(true);
    try {
      const token = localStorage.getItem("token");
      const baseUrl = import.meta.env.VITE_BACKEND_URL;
      const formData = new FormData();
      formData.append("folderName", folderName);
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

  const displaySlots = [];
  
  // Slot 0: Main
  displaySlots.push({ index: 0, required: true, label: "Main Image" });
  
  // Slots 1, 2, 3: Secondary Optional
  for (let i = 1; i <= 3; i++) {
    displaySlots.push({ index: i, required: false });
  }

  // Slots 4+: Extra uploaded images
  for (let i = 4; i < images.length; i++) {
    displaySlots.push({ index: i, required: false });
  }

  const showAddMore = images.length < 10;

  return (
    <div 
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={onDrop}
      className={`relative w-full rounded-2xl transition-all duration-300 p-1 md:p-2 ${
        dragging ? "bg-indigo-50/50 dark:bg-indigo-900/10 ring-2 ring-indigo-500" : "bg-transparent"
      }`}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        className="hidden"
        onChange={(e) => uploadFiles(e.target.files)}
      />

      {/* Global Transparent Drag Overlay */}
      {dragging && (
         <div className="absolute inset-0 z-50 rounded-2xl flex flex-col items-center justify-center bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-2 border-dashed border-indigo-500">
            <FiUploadCloud size={64} className="text-indigo-600 mb-4 animate-bounce" />
            <h2 className="text-xl md:text-2xl font-black text-indigo-900 dark:text-indigo-100 uppercase tracking-widest">Drop Images to Upload</h2>
         </div>
      )}

      {/* Uploading Progress Overlay */}
      {uploading && !dragging && (
         <div className="absolute inset-0 z-40 rounded-2xl flex flex-col items-center justify-center bg-white/60 dark:bg-gray-900/60 backdrop-blur-[2px]">
            <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-3 shadow-lg" />
            <span className="text-indigo-700 dark:text-indigo-300 font-bold tracking-wider uppercase text-sm bg-white dark:bg-gray-800 px-4 py-1.5 rounded-full shadow-sm">Uploading Assets...</span>
         </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {displaySlots.map(slot => {
          const isMain = slot.index === 0;
          const url = images[slot.index];

          if (isMain) {
            return (
              <div 
                key="main"
                onClick={() => !uploading && inputRef.current?.click()}
                className={`col-span-2 md:row-span-2 aspect-[4/3] md:aspect-auto rounded-xl border-2 border-dashed flex flex-col items-center justify-center relative overflow-hidden group transition-all duration-300 ${
                  url ? "border-transparent bg-gray-100 dark:bg-gray-800 shadow-sm" 
                      : "border-gray-300 dark:border-gray-600 hover:border-indigo-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer"
                }`}
              >
                {url ? (
                    <>
                      <img src={url} alt="Main" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[1px]">
                         <button onClick={(e) => { e.stopPropagation(); removeImage(0); }} className="p-3 bg-red-600/90 rounded-xl text-white hover:bg-red-500 transition-transform active:scale-90 shadow-xl"><FiTrash2 size={24}/></button>
                      </div>
                      <span className="absolute bottom-3 left-3 bg-indigo-600/95 backdrop-blur-sm text-white text-[11px] font-black px-3 py-1.5 rounded-lg uppercase tracking-[0.1em] shadow-[0_4px_15px_rgba(0,0,0,0.5)]">Main Image</span>
                    </>
                ) : (
                    <div className="text-gray-400 dark:text-gray-500 flex flex-col items-center p-6 text-center">
                       <FiImage size={48} className="mb-4 text-indigo-400/60" />
                       <span className="text-sm font-bold text-gray-700 dark:text-gray-300">Upload Main Image</span>
                       <span className="text-[10px] font-bold mt-2 text-indigo-600 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-900/40 px-2 py-1 rounded-md uppercase tracking-wider">Required</span>
                    </div>
                )}
              </div>
            )
          }

          return (
            <div 
              key={`slot-${slot.index}`}
              onClick={() => !uploading && inputRef.current?.click()}
              className={`aspect-square rounded-xl border-2 border-dashed flex flex-col items-center justify-center relative overflow-hidden group transition-all duration-300 ${
                url ? "border-transparent bg-gray-100 dark:bg-gray-800 shadow-sm"
                    : "border-gray-200 dark:border-gray-700 hover:border-indigo-300 hover:bg-gray-50 dark:hover:bg-gray-800/30 cursor-pointer"
              }`}
            >
              {url ? (
                 <>
                   <img src={url} alt={`img-${slot.index}`} className="w-full h-full object-cover" />
                   <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[1px]">
                      <button onClick={(e) => { e.stopPropagation(); removeImage(slot.index); }} className="p-2 bg-red-600/90 rounded-lg text-white hover:bg-red-500 transition-transform active:scale-90 shadow-md"><FiTrash2 size={18}/></button>
                   </div>
                   <span className="absolute bottom-2 left-2 bg-gray-900/80 text-white text-[9px] font-bold px-2 py-1 rounded backdrop-blur-md">IMG {slot.index + 1}</span>
                 </>
              ) : (
                 <div className="text-gray-400 dark:text-gray-600 flex flex-col items-center">
                    <FiPlus size={24} className="mb-2 opacity-50" />
                    <span className={`text-[10px] font-bold uppercase tracking-tight ${slot.required ? "text-indigo-500 dark:text-indigo-400" : "text-gray-400 dark:text-gray-500"}`}>
                       {slot.required ? "Required" : "Optional"}
                    </span>
                 </div>
              )}
            </div>
          );
        })}

        {showAddMore && (
           <div 
             onClick={() => !uploading && inputRef.current?.click()}
             className="aspect-square rounded-xl border-2 border-dashed border-indigo-300 dark:border-indigo-700 bg-indigo-50/40 dark:bg-indigo-900/10 flex flex-col items-center justify-center cursor-pointer hover:bg-indigo-100/60 dark:hover:bg-indigo-900/30 text-indigo-500 dark:text-indigo-400 transition-all active:scale-95"
           >
             <FiPlus size={32} className="mb-1 opacity-80" />
             <span className="text-[10px] font-bold uppercase tracking-wide text-center px-1">Add<br/>More</span>
           </div>
        )}
      </div>
    </div>
  );
};

export default ImageUploader;
