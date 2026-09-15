"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Search, Check } from "lucide-react";
import { Region } from "@/lib/constants/provinces";

interface RegionSelectProps {
  regions: Region[];
  value: string;
  onChange: (regionName: string) => void;
  placeholder?: string;
  error?: string;
  className?: string;
}

export function RegionSelect({
  regions,
  value,
  onChange,
  placeholder = "Select province / state",
  error,
  className = "",
}: RegionSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const selectedRegion = regions.find(
    (r) =>
      r.name.toLowerCase() === value.toLowerCase() ||
      r.code.toLowerCase() === value.toLowerCase()
  );

  const filteredRegions = regions.filter((r) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return r.name.toLowerCase().includes(q) || r.code.toLowerCase().includes(q);
  });

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    } else {
      setSearch("");
    }
  }, [isOpen]);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between text-left transition-all px-3 py-2.5 rounded-xl border text-[14px] text-[#0A0F2C] bg-white focus:outline-none focus:ring-2 focus:ring-[#047857]/20 focus:border-[#047857] ${
          error ? "border-red-400" : "border-gray-200"
        }`}
      >
        <span className={selectedRegion ? "font-medium text-[#0A0F2C] truncate" : "text-gray-400 font-normal"}>
          {selectedRegion ? selectedRegion.name : placeholder}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-gray-400 transition-transform flex-shrink-0 ml-1.5 ${
            isOpen ? "rotate-180 text-[#047857]" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-1.5 w-full bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden animate-in fade-in zoom-in-95 duration-150 left-0">
          {regions.length > 8 && (
            <div className="p-2 border-b border-gray-100 bg-gray-50/50">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search province..."
                  className="w-full pl-8 pr-3 py-1.5 text-[13px] bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#047857]/20 focus:border-[#047857] text-[#0A0F2C] placeholder:text-gray-400"
                />
              </div>
            </div>
          )}

          <div className="max-h-52 overflow-y-auto p-1.5 space-y-0.5 custom-scrollbar">
            {filteredRegions.length === 0 ? (
              <div className="p-3 text-center text-[13px] text-gray-400">
                No matching provinces
              </div>
            ) : (
              filteredRegions.map((r) => {
                const isSelected = selectedRegion?.code === r.code;
                return (
                  <button
                    key={r.code}
                    type="button"
                    onClick={() => {
                      onChange(r.name);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-[13px] transition-colors ${
                      isSelected
                        ? "bg-emerald-50 text-[#047857] font-semibold"
                        : "text-[#0A0F2C] hover:bg-gray-50"
                    }`}
                  >
                    <span className="truncate">{r.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-gray-400 font-mono font-medium">{r.code}</span>
                      {isSelected && <Check className="w-4 h-4 text-[#047857]" />}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
