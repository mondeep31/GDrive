import React, { useState, useRef } from "react";
import { Upload, X } from "lucide-react";
import Button from "./ui/Button";
import axios from "../services/axios";

interface FileUploaderProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadSuccess: () => void;
}

const FileUploader: React.FC<FileUploaderProps> = ({
  isOpen,
  onClose,
  onUploadSuccess,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      uploadFile(files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      uploadFile(files[0]);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const uploadFile = async (file: File) => {
    setIsUploading(true);
    setUploadProgress(0);
    try {
      const formData = new FormData();
      formData.append("File", file);

      await axios.post("/api/files/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            setUploadProgress(
              Math.round((progressEvent.loaded * 100) / progressEvent.total)
            );
          }
        },
      });

      setIsUploading(false);
      setUploadProgress(100);
      onUploadSuccess();
      onClose();
    } catch (err) {
      setIsUploading(false);
      setUploadProgress(0);
      alert("Upload failed.");
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 bg-white rounded-lg shadow-xl w-80 overflow-hidden transition-all duration-300 animate-slideUp">
      <div className="bg-[#1a73e8] text-white px-4 py-3 flex justify-between items-center">
        <h3 className="text-lg font-medium">Upload file</h3>
        <button
          onClick={onClose}
          className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-1"
        >
          <X size={18} />
        </button>
      </div>
      <div className="p-4">
        {isUploading ? (
          <div className="py-4">
            <div className="flex justify-between mb-2 text-sm">
              <span>Uploading...</span>
              <span>{uploadProgress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        ) : (
          <div
            className={`
              border-2 border-dashed rounded-lg p-6 text-center mb-4 transition-colors
              ${
                dragActive
                  ? "border-[#1a73e8] bg-blue-50"
                  : "border-gray-300 hover:border-[#1a73e8]"
              }
            `}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={handleButtonClick}
          >
            <Upload className="mx-auto text-gray-400 mb-4" size={32} />
            <p className="text-sm text-gray-600 mb-2">
              Drag and drop files here or click to browse
            </p>
            <p className="text-xs text-gray-500">
              Supported file types: documents, images, videos, and more
            </p>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
        )}
        <div className="flex justify-end space-x-2">
          <Button variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button size="sm" onClick={handleButtonClick} disabled={isUploading}>
            {isUploading ? "Uploading..." : "Select Files"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FileUploader;
