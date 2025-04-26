import React from "react";
import { Clock, Users, Trash2, Cloud, Plus, HardDrive } from "lucide-react";

import Button from "./ui/Button";

interface SidebarProps {
  className?: string;
  onNewClick?: () => void;
}

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
  count?: number;
}

const SidebarItem: React.FC<SidebarItemProps> = ({
  icon,
  label,
  active = false,
  onClick,
  count,
}) => {
  return (
    <div
      className={`flex items-center px-4 h-10 rounded-full text-gray-700 cursor-pointer transition-colors
        ${active ? "bg-[#e8f0fe] text-[#1a73e8]" : "hover:bg-gray-100"}`}
      onClick={onClick}
    >
      <span className="mr-3">{icon}</span>
      <span className="flex-1">{label}</span>
      {count !== undefined && (
        <span className="text-sm text-gray-500">{count}</span>
      )}
    </div>
  );
};

const Sidebar: React.FC<SidebarProps> = ({ className = "", onNewClick }) => {
  return (
    <div
      className={`relative w-64 h-full flex-shrink-0 border-r border-gray-200 pt-3 ${className}`}
    >
      <div className="px-2 mb-6">
        <Button
          size="lg"
          fullWidth
          icon={<Plus size={20} />}
          className="shadow-md"
          onClick={onNewClick}
        >
          New
        </Button>
      </div>

      <div className="space-y-1 px-2">
        <SidebarItem
          icon={<Cloud size={18} />}
          label="My Drive"
          //   active={currentFolderId === null}
          //   onClick={() => navigateToFolder(null)}
        />
        <SidebarItem icon={<Clock size={18} />} label="Recent" />
        <SidebarItem icon={<Users size={18} />} label="Shared with me" />
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200 px-2">
        <SidebarItem icon={<Trash2 size={18} />} label="Trash" />
        <SidebarItem icon={<HardDrive size={18} />} label="Storage" />
      </div>

      <div className="mt-6 px-4">
        <div className="text-sm text-gray-500">
          <div className="mb-1">Storage</div>
          <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div className="bg-[#1a73e8] h-full" style={{ width: "28%" }}></div>
          </div>
          <div className="text-xs mt-1">3.8 GB of 15 GB used</div>
        </div>
      </div>

      <div className="absolute bottom-4 left-0 w-full px-4 text-xs text-gray-400 text-center">
        in this sidebar only the new (upload) button works, rest are just
        existing
      </div>
    </div>
  );
};

export default Sidebar;
