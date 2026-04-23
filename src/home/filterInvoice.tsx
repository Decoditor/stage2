import { Button } from "@/components/ui/button";
import React, { useEffect, useRef, useState } from "react";
import type { InvoiceStatus } from "./InvoiceCard";
import { FiChevronDown } from "react-icons/fi";

const STATUSES: InvoiceStatus[] = ["draft", "pending", "paid"];

interface Props {
  setFilters: (f) => void;
  filters: InvoiceStatus[];
}
export default function FilterInvoice({ setFilters, filters }: Props) {
  const [filterOpen, setFilterOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);
  const toggleFilter = (s: InvoiceStatus) =>
    setFilters((f) => (f.includes(s) ? f.filter((x) => x !== s) : [...f, s]));

  // Close filter on outside click or ESC
  useEffect(() => {
    const onOutside = (e: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(e.target as Node))
        setFilterOpen(false);
    };
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setFilterOpen(false);
    };
    document.addEventListener("mousedown", onOutside);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onOutside);
      document.removeEventListener("keydown", onEsc);
    };
  }, []);

  return (
    <div className="relative" ref={filterRef}>
      <Button
        variant="ghost"
        aria-expanded={filterOpen}
        aria-haspopup="listbox"
        onClick={() => setFilterOpen((o) => !o)}
        className="font-bold text-[15px] text-text-primary hover:text-purple active:bg-transparent group gap-3 px-0"
      >
        <span className="hidden md:inline">Filter by status</span>
        <span className="md:hidden">Filter</span>
        <FiChevronDown
          size={12}
          strokeWidth={3}
          className={`group-hover:text-purple transition-transform ${filterOpen ? "rotate-180" : ""}`}
        />
      </Button>

      {filterOpen && (
        <div
          role="listbox"
          className="absolute top-[calc(100%+16px)] left-1/2 -translate-x-1/2 bg-surface shadow-[0_10px_20px_rgba(0,0,0,0.25)] rounded-lg py-4 px-6 min-w-48 flex flex-col gap-4 z-50"
        >
          {STATUSES.map((s) => (
            <label key={s} className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.includes(s)}
                onChange={() => toggleFilter(s)}
                className="w-4 h-4 accent-purple cursor-pointer"
              />
              <span className="font-bold text-[15px] capitalize text-text-primary">
                {s}
              </span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}
