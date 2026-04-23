import { useEffect, useRef, useState } from "react";

type Option = {
  label: string;
  value: string;
};

type SelectProps = {
  label: string;
  value: string;
  options: Option[];
  onChange: (value: string) => void;
};

export default function Select({
  label,
  value,
  options,
  onChange,
}: SelectProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const selected = options.find((o) => o.value === value);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex flex-col gap-1 relative" ref={ref}>
      <label className="text-xs text-text-muted">{label}</label>

      {/* SELECT BOX */}
      <div
        onClick={() => setOpen((prev) => !prev)}
        className={`h-12 w-full text-sm rounded-sm border border-input px-4 flex items-center justify-between cursor-pointer transition
        ${open ? "border-primary ring-primary" : "border-border"}`}
      >
        <span className="font-semibold text-text-primary">
          {selected?.label}
        </span>

        {/* custom caret (no arrow symbols used) */}
        <div
          className={`w-2.5 h-2.5 border-r-2 border-b-2 border-primary transform transition ${
            open ? "rotate-225" : "rotate-45"
          }`}
        />
      </div>

      {/* DROPDOWN */}
      {open && (
        <div className="mt-2 rounded-lg shadow-lg absolute top-full left-0 w-full bg-bg overflow-hidden">
          {options.map((opt, index) => {
            const isActive = opt.value === value;

            return (
              <div
                key={opt.value}
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
                className={`px-4 py-3 cursor-pointer font-semibold transition border-ring text-sm ${index === 0 ? "" : "border-t"}
                ${
                  isActive
                    ? "text-primary"
                    : "text-text-primary hover:text-primary"
                }`}
              >
                {opt.label}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
