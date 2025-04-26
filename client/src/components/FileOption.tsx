import React, { useEffect, useRef } from "react";

interface FileOptionProps {
  open: boolean;
  position: { top: number; left: number };
  onClose: () => void;
  options: {
    icon: React.ReactNode;
    label: string;
    onClick: () => void;
    danger?: boolean;
  }[];
}

const FileOption: React.FC<FileOptionProps> = ({
  open,
  position,
  onClose,
  options,
}) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <>
      {/* Soft, semi-transparent backdrop */}
      {/* <div className="fixed inset-0 z-40 bg-black bg-opacity-10 transition-opacity" /> */}
      <div
        ref={ref}
        className="fixed z-50 min-w-[160px] rounded-xl shadow-xl bg-white/90 backdrop-blur border border-gray-200"
        style={{
          top: position.top,
          left: position.left,
        }}
      >
        {options.map((opt, idx) => (
          <button
            key={idx}
            className={`flex items-center w-full text-left px-4 py-2 transition hover:bg-gray-100 rounded-xl ${
              opt.danger ? "text-red-600" : ""
            }`}
            onClick={() => {
              opt.onClick();
              onClose();
            }}
          >
            <span className="mr-2">{opt.icon}</span>
            {opt.label}
          </button>
        ))}
      </div>
    </>
  );
};

export default FileOption;
