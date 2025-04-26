import { useEffect, useState } from "react";
import axios from "../services/axios";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import {
  Home,
  FileText,
  Image as ImageIcon,
  File as FileIcon,
  Folder,
  LayoutGrid,
  List as ListIcon,
} from "lucide-react";
import PdfIcon from "../components/icons/PdfIcon";
import DocIcon from "../components/icons/DocIcon";
import FileGrid from "../components/FileGrid";
import FileList from "../components/FileList";
import FileUploader from "../components/FileUploader";

dayjs.extend(relativeTime);

interface File {
  _id: string;
  name: string;
  uploadedAt: string;
  downloadUrl: string;
}

// Helper to check if a file is a folder (adjust as needed for your backend)
const isFolder = (file: File) => file.name && !file.name.includes(".");

// Helper to get a colored thumbnail for each file type
const getFileThumb = (filename: string) => {
  const ext = filename.split(".").pop()?.toLowerCase();
  if (!ext)
    return (
      <div className="flex items-center justify-center w-full h-24 rounded-t-2xl bg-gray-100">
        <FileIcon size={40} className="text-gray-400" />
      </div>
    );
  switch (ext) {
    case "pdf":
      return (
        <div className="flex items-center justify-center w-full h-24 rounded-t-2xl bg-red-500">
          <span className="text-white text-3xl font-bold">PDF</span>
        </div>
      );
    case "doc":
    case "docx":
      return (
        <div className="flex items-center justify-center w-full h-24 rounded-t-2xl bg-blue-500">
          <span className="text-white text-3xl font-bold">DOCX</span>
        </div>
      );
    case "xlsx":
      return (
        <div className="flex items-center justify-center w-full h-24 rounded-t-2xl bg-green-500">
          <span className="text-white text-3xl font-bold">XLSX</span>
        </div>
      );
    case "jpg":
    case "jpeg":
    case "png":
    case "gif":
      return (
        <div className="flex items-center justify-center w-full h-24 rounded-t-2xl bg-blue-200">
          <ImageIcon size={40} className="text-blue-500" />
        </div>
      );
    case "txt":
      return (
        <div className="flex items-center justify-center w-full h-24 rounded-t-2xl bg-gray-300">
          <FileText size={40} className="text-gray-600" />
        </div>
      );
    default:
      return (
        <div className="flex items-center justify-center w-full h-24 rounded-t-2xl bg-gray-100">
          <FileIcon size={40} className="text-gray-400" />
        </div>
      );
  }
};

const Dashboard = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [uploaderOpen, setUploaderOpen] = useState(false);
  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    setLoading(true);
    const res = await axios.get("/api/files");
    setFiles(res.data.files);
    setLoading(false);
  };

  const handleSearch = async () => {
    if (!query) return fetchFiles();
    setLoading(true);
    const res = await axios.get(
      `/api/files/search?query=${encodeURIComponent(query)}`
    );
    setFiles(res.data.files);
    setLoading(false);
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Header
        query={query}
        setQuery={setQuery}
        handleSearch={handleSearch}
        handleRefresh={fetchFiles}
        toggleSidebar={toggleSidebar}
        isSidebarOpen={isSidebarOpen}
      />
      <div className="flex flex-1 overflow-hidden">
        {isSidebarOpen && <Sidebar onNewClick={() => setUploaderOpen(true)} />}
        <div className="flex-1 p-8">
          <div className="flex items-center text-gray-600   rounded-full p-1.5">
            <Home size={16} />
            <span className="ml-1 sm:inline">My Drive</span>
          </div>
          <div className="flex justify-end mb-4">
            <button
              className={`p-2 rounded-full border ${
                viewMode === "grid"
                  ? "bg-blue-50 border-blue-200"
                  : "bg-white border-gray-200"
              } mr-2`}
              onClick={() => setViewMode("grid")}
              title="Grid view"
            >
              <LayoutGrid
                size={20}
                className={
                  viewMode === "grid" ? "text-blue-600" : "text-gray-400"
                }
              />
            </button>
            <button
              className={`p-2 rounded-full border ${
                viewMode === "list"
                  ? "bg-blue-50 border-blue-200"
                  : "bg-white border-gray-200"
              }`}
              onClick={() => setViewMode("list")}
              title="List view"
            >
              <ListIcon
                size={20}
                className={
                  viewMode === "list" ? "text-blue-600" : "text-gray-400"
                }
              />
            </button>
          </div>
          {loading ? (
            <div>Loading...</div>
          ) : viewMode === "grid" ? (
            <FileGrid items={files} onAction={fetchFiles} />
          ) : (
            <FileList items={files} onAction={fetchFiles} />
          )}
        </div>
      </div>
      <FileUploader
        isOpen={uploaderOpen}
        onClose={() => setUploaderOpen(false)}
        onUploadSuccess={fetchFiles}
      />
    </div>
  );
};

export default Dashboard;
