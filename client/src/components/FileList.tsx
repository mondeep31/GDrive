import React, { useState, useRef } from "react";
import {
  Folder,
  File,
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

interface FileOrFolder {
  _id: string;
  name: string;
  uploadedAt: string;
  downloadUrl?: string;
}

interface FileListProps {
  items: FileOrFolder[];
  onAction?: () => void; // Call this after rename/delete/share to refresh
}

const isFolder = (item: FileOrFolder) => item.name && !item.name.includes(".");

const FileList: React.FC<FileListProps> = ({ items, onAction }) => {
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
  const [menuPosition, setMenuPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);
  const [renameId, setRenameId] = useState<string | null>(null);
  const [newName, setNewName] = useState("");
  const [shareId, setShareId] = useState<string | null>(null);
  const [shareUrl, setShareUrl] = useState("");

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
    window.open(item.downloadUrl || `/api/files/share/${item._id}`, "_blank");
  };

  return (
    <div className="w-full border border-gray-200 rounded-lg overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
          <tr>
            <th className="px-4 py-3 font-medium text-left">Name</th>
            <th className="px-4 py-3 font-medium text-left">Uploaded</th>
            <th className="px-4 py-3 font-medium w-12"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {items.map((item) => (
            <tr key={item._id} className="hover:bg-gray-50">
              <td className="px-4 py-3">
                <div className="flex items-center">
                  {isFolder(item) ? (
                    <Folder size={20} className="text-[#5f6368] mr-2" />
                  ) : (
                    <File size={20} className="text-[#5f6368] mr-2" />
                  )}
                  <span className="text-sm">{item.name}</span>
                </div>
              </td>
              <td className="px-4 py-3 text-sm text-gray-500">
                {dayjs(item.uploadedAt).fromNow()}
              </td>
              <td className="px-4 py-3 w-12 relative">
                <button
                  className="p-1 rounded-full hover:bg-gray-200"
                  onClick={(e) => {
                    e.stopPropagation();
                    const rect = (
                      e.target as HTMLElement
                    ).getBoundingClientRect();
                    setMenuOpenId(item._id);
                    setMenuPosition({
                      top: rect.bottom + window.scrollY + 4,
                      left: rect.left + window.scrollX - 120,
                    });
                  }}
                >
                  <MoreVertical size={16} className="text-gray-400" />
                </button>
              </td>
            </tr>
          ))}
          {items.length === 0 && (
            <tr>
              <td colSpan={3} className="text-center py-8">
                <div className="text-gray-400 text-sm">No items found</div>
              </td>
            </tr>
          )}
        </tbody>
      </table>

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
    </div>
  );
};

export default FileList;
