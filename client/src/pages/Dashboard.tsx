import { useEffect, useState } from "react";
import axios from "../services/axios";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { Home, LayoutGrid, List as ListIcon } from "lucide-react";

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
