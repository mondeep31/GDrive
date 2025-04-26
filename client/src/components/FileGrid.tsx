import React, { useState } from "react";
import {
  FileText,
  Image as ImageIcon,
  File as FileIcon,
  Folder,
  MoreVertical,
  Download,
  Eye,
  Share2,
  Trash2,
  Pencil,
} from "lucide-react";
import dayjs from "dayjs";
import axios from "../services/axios";
import Button from "./ui/Button";
import FileOption from "./FileOption";

// Adjust this interface as needed
interface FileOrFolder {
  _id: string;
  name: string;
  uploadedAt: string;
  downloadUrl?: string;
  // Add more fields if needed
}

interface FileGridProps {
  items: FileOrFolder[];
  onItemClick?: (item: FileOrFolder) => void;
  onAction?: () => void; // Call this after rename/delete/share to refresh
}

const isFolder = (item: FileOrFolder) => item.name && !item.name.includes(".");

const getFileThumb = (filename: string) => {
  const ext = filename.split(".").pop()?.toLowerCase();
  if (!ext)
    return (
      <div className="flex items-center justify-center w-full h-28 rounded-t-2xl bg-gray-100">
        <FileIcon size={56} className="text-gray-400" />
      </div>
    );
  switch (ext) {
    case "pdf":
      return (
        <div className="flex items-center justify-center w-full h-28 rounded-t-2xl bg-red-500">
          <span className="text-white text-4xl font-bold">PDF</span>
        </div>
      );
    case "doc":
    case "docx":
      return (
        <div className="flex items-center justify-center w-full h-28 rounded-t-2xl bg-blue-500">
          <span className="text-white text-4xl font-bold">DOCX</span>
        </div>
      );
    case "xlsx":
      return (
        <div className="flex items-center justify-center w-full h-28 rounded-t-2xl bg-green-500">
          <span className="text-white text-4xl font-bold">XLSX</span>
        </div>
      );
    case "jpg":
    case "jpeg":
    case "png":
    case "gif":
      return (
        <div className="flex items-center justify-center w-full h-28 rounded-t-2xl bg-blue-200">
          <ImageIcon size={56} className="text-blue-500" />
        </div>
      );
    case "txt":
      return (
        <div className="flex items-center justify-center w-full h-28 rounded-t-2xl bg-gray-300">
          <FileText size={56} className="text-gray-600" />
        </div>
      );
    default:
      return (
        <div className="flex items-center justify-center w-full h-28 rounded-t-2xl bg-gray-100">
          <FileIcon size={56} className="text-gray-400" />
        </div>
      );
  }
};

const FileGrid: React.FC<FileGridProps> = ({
  items,
  onItemClick,
  onAction,
}) => {
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
  const [renameId, setRenameId] = useState<string | null>(null);
  const [newName, setNewName] = useState("");
  const [shareId, setShareId] = useState<string | null>(null);
  const [shareUrl, setShareUrl] = useState("");
  const [menuPosition, setMenuPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);

  // Backend actions
  const handleRename = async (id: string) => {
    await axios.put(`/api/files/rename/${id}`, { newName });
    setRenameId(null);
    setNewName("");
    onAction && onAction();
  };

  const handleDelete = async (id: string) => {
    await axios.delete(`/api/files/${id}`);
    setMenuOpenId(null);
    onAction && onAction();
  };

  const handleShare = async (id: string) => {
    const res = await axios.get(`/api/files/share/${id}`);
    setShareUrl(res.data.url || res.data.shareUrl || "");
    setShareId(id);
    setMenuOpenId(null);
  };

  const handleDownload = async (item: FileOrFolder) => {
    try {
      const response = await axios.get(`/api/files/download/${item._id}`, {
        responseType: "blob", // Important! Treat response as a file
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", item.name); // Suggest the filename
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("Download failed:", err);
      alert("Failed to download file.");
    }
  };

  const handleView = (item: FileOrFolder) => {
    // Open in new tab for viewing (could be the same as downloadUrl or a public URL)
    window.open(item.downloadUrl || `/api/files/share/${item._id}`, "_blank");
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
      {items.map((item) => (
        <div
          key={item._id}
          className="relative flex flex-col bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg transition cursor-pointer"
          style={{ minWidth: 180, maxWidth: 240 }}
          onClick={() => onItemClick && onItemClick(item)}
        >
          {/* Top-right actions */}
          <div className="absolute top-2 right-2 flex space-x-2 z-10">
            <button
              className="p-1 rounded-full hover:bg-gray-100"
              onClick={(e) => {
                e.stopPropagation();
                handleDownload(item);
              }}
              title="Download"
            >
              <Download size={18} className="text-gray-500" />
            </button>
            <button
              className="p-1 rounded-full hover:bg-gray-100"
              onClick={(e) => {
                e.stopPropagation();
                const rect = (e.target as HTMLElement).getBoundingClientRect();
                setMenuOpenId(item._id);
                setMenuPosition({
                  top: rect.bottom + window.scrollY + 4,
                  left: rect.left + window.scrollX - 120,
                });
              }}
              title="More"
            >
              <MoreVertical size={18} className="text-gray-500" />
            </button>
          </div>

          {/* Thumbnail */}
          {isFolder(item) ? (
            <div className="flex items-center justify-center w-full h-28 rounded-t-2xl bg-gray-50">
              <Folder size={56} className="text-gray-400" />
            </div>
          ) : (
            getFileThumb(item.name)
          )}

          {/* Divider */}
          <div className="border-b border-gray-200 w-full" />

          {/* File name and date */}
          <div className="w-full px-4 py-3 text-center">
            <div
              className="font-semibold text-gray-900 truncate"
              title={item.name}
            >
              {item.name}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {dayjs(item.uploadedAt).fromNow()}
            </div>
          </div>
        </div>
      ))}

      {renameId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-opacity-10 backdrop-blur-sm"
            onClick={() => setRenameId(null)}
          />
          <div className="relative bg-white/90 backdrop-blur rounded-xl shadow-xl p-6 w-80 border border-gray-200 z-10">
            <h3 className="text-lg font-semibold mb-4">Rename File</h3>
            <input
              className="w-full border rounded px-3 py-2 mb-4"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setRenameId(null)}>
                Cancel
              </Button>
              <Button onClick={() => handleRename(renameId)}>Rename</Button>
            </div>
          </div>
        </div>
      )}

      {shareId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-opacity-10 backdrop-blur-sm"
            onClick={() => setShareId(null)}
          />
          <div className="relative bg-white/90 backdrop-blur rounded-xl shadow-xl p-6 w-80 border border-gray-200 z-10">
            <h3 className="text-lg font-semibold mb-4">Share File</h3>
            <input
              className="w-full border rounded px-3 py-2 mb-4"
              value={shareUrl}
              readOnly
              onFocus={(e) => e.target.select()}
            />
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShareId(null)}>
                Close
              </Button>
              <Button
                onClick={() => {
                  navigator.clipboard.writeText(shareUrl);
                }}
              >
                Copy Link
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* FileOption menu */}
      <FileOption
        open={!!menuOpenId && !!menuPosition}
        position={menuPosition || { top: 0, left: 0 }}
        onClose={() => setMenuOpenId(null)}
        options={[
          {
            icon: <Pencil size={16} />,
            label: "Rename",
            onClick: () => {
              setRenameId(menuOpenId!);
              setNewName(items.find((i) => i._id === menuOpenId)?.name || "");
            },
          },
          {
            icon: <Eye size={16} />,
            label: "View",
            onClick: () => handleView(items.find((i) => i._id === menuOpenId)!),
          },
          {
            icon: <Share2 size={16} />,
            label: "Share",
            onClick: () => handleShare(menuOpenId!),
          },
          {
            icon: <Download size={16} />,
            label: "Download",
            onClick: () =>
              handleDownload(items.find((i) => i._id === menuOpenId)!),
          },
          {
            icon: <Trash2 size={16} />,
            label: "Delete",
            onClick: () => handleDelete(menuOpenId!),
            danger: true,
          },
        ]}
      />
    </div>
  );
};

export default FileGrid;
