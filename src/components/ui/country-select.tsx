"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Search, Check } from "lucide-react";
import { Country, SUPPORTED_COUNTRIES } from "@/lib/constants/countries";

interface CountrySelectProps {
  value?: string;
  onChange: (country: Country) => void;
  mode?: "country" | "dialCode"; // "country" shows name (KYC), "dialCode" shows flag + code (Phone)
  placeholder?: string;
  error?: string;
  className?: string;
  disabled?: boolean;
}

export function CountrySelect({
  value,
  onChange,
  mode = "country",
  placeholder = "Select country",
  error,
  className = "",
  disabled = false,
}: CountrySelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Determine current selected country
  const selectedCountry = SUPPORTED_COUNTRIES.find((c) => {
    if (!value) return false;
    if (mode === "dialCode") {
      return c.code === value || c.name.toLowerCase() === value.toLowerCase();
    }
    return c.name.toLowerCase() === value.toLowerCase();
  });

  // Filter countries based on search
  const filteredCountries = SUPPORTED_COUNTRIES.filter((c) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return (
      c.name.toLowerCase().includes(q) ||
      c.code.includes(q) ||
      c.isoCode.toLowerCase().includes(q)
    );
  });

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Auto focus search input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    } else {
      setSearch("");
    }
  }, [isOpen]);

  const handleSelect = (country: Country) => {
    onChange(country);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between text-left transition-all ${
          mode === "dialCode"
            ? "h-12 px-3 rounded-xl border border-gray-200 bg-gray-50/80 hover:bg-gray-100/70 text-[14px] text-[#0A0F2C] focus:outline-none focus:ring-2 focus:ring-[#047857]/20"
            : `w-full px-3 py-2.5 rounded-xl border text-[14px] text-[#0A0F2C] bg-white focus:outline-none focus:ring-2 focus:ring-[#047857]/20 focus:border-[#047857] ${
                error ? "border-red-400" : "border-gray-200"
              }`
        }`}
      >
        <div className="flex items-center gap-2 truncate">
          {selectedCountry ? (
            <>
              <span className="text-[18px] leading-none">{selectedCountry.flag}</span>
              {mode === "dialCode" ? (
                <span className="font-semibold text-[#0A0F2C]">{selectedCountry.code}</span>
              ) : (
                <span className="font-medium text-[#0A0F2C] truncate">{selectedCountry.name}</span>
              )}
            </>
          ) : (
            <span className="text-gray-400 font-normal">{placeholder}</span>
          )}
        </div>
        <ChevronDown
          className={`w-4 h-4 text-gray-400 transition-transform flex-shrink-0 ml-1.5 ${
            isOpen ? "rotate-180 text-[#047857]" : ""
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-50 mt-1.5 w-72 max-w-[90vw] bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden animate-in fade-in zoom-in-95 duration-150 right-0 sm:left-0">
          {/* Search Bar */}
          <div className="p-2.5 border-b border-gray-100 bg-gray-50/50">
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                ref={searchInputRef}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search country or code..."
                className="w-full pl-9 pr-3 py-2 text-[13px] bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#047857]/20 focus:border-[#047857] text-[#0A0F2C] placeholder:text-gray-400"
              />
            </div>
          </div>

          {/* List */}
          <div className="max-h-60 overflow-y-auto p-1.5 space-y-0.5 custom-scrollbar">
            {filteredCountries.length === 0 ? (
              <div className="p-4 text-center text-[13px] text-gray-400">
                No matching countries
              </div>
            ) : (
              filteredCountries.map((c) => {
                const isSelected =
                  selectedCountry?.name.toLowerCase() === c.name.toLowerCase();

                return (
                  <button
                    key={`${c.isoCode}-${c.code}`}
                    type="button"
                    onClick={() => handleSelect(c)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-[13px] transition-colors ${
                      isSelected
                        ? "bg-emerald-50 text-[#047857] font-semibold"
                        : "text-[#0A0F2C] hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <span className="text-[18px] leading-none flex-shrink-0">{c.flag}</span>
                      <span className="truncate">{c.name}</span>
                    </div>
                    <div className="flex items-center gap-2 ml-2 flex-shrink-0">
                      <span className="text-[12px] text-gray-400 font-medium">{c.code}</span>
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
