import { useState } from "react";
import { FiPlus } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import type { InvoiceStatus } from "@/home/InvoiceCard";
import InvoiceCard from "@/home/InvoiceCard";
import useInvoiceContext from "@/hooks/useContext";
import InvoiceDrawer from "@/components/InvoiceDrawer";
import FilterInvoice from "./filterInvoice";

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <img src="/empty.png" alt="" className="w-[242px] mb-16" />
      <h2 className="font-bold text-2xl text-text-primary mb-4">
        There is nothing here
      </h2>
      <p className="text-[13px] text-text-muted leading-loose max-w-55">
        Create an invoice by clicking the{" "}
        <strong className="text-text-primary">New Invoice</strong> button and
        get started
      </p>
    </div>
  );
}

export default function Home() {
  const navigate = useNavigate();
  const [filters, setFilters] = useState<InvoiceStatus[]>([]);
  const [add, setAdd] = useState(false);
  const { invoices } = useInvoiceContext();
  const filtered =
    filters.length === 0
      ? invoices
      : invoices.filter((inv) => filters.includes(inv.status));

  return (
    <main className="py-24 px-6 md:px-12 lg:px-0 lg:max-w-195 lg:mx-auto">
      {/* Header */}
      <header className="flex items-center justify-between mb-16">
        <div>
          <h1 className="font-bold text-3xl md:text-[36px] tracking-tight text-text-primary leading-none">
            Invoices
          </h1>
          <p className="text-sm text-text-muted mt-1">
            {filtered.length === 0
              ? "No invoices"
              : `There are ${filtered.length} total invoice${filtered.length === 1 ? "" : "s"}`}
          </p>
        </div>

        <div className="flex items-center gap-6 md:gap-10">
          {/* Filter dropdown */}
          <FilterInvoice setFilters={setFilters} filters={filters} />

          {/* New Invoice */}
          <Button
            onClick={() => setAdd(true)}
            className="pr-4 rounded-full h-auto text-[15px] py-2 gap-4"
          >
            <span className="w-8 h-8 bg-white rounded-full flex items-center justify-center shrink-0">
              <FiPlus size={12} strokeWidth={3} className="text-purple" />
            </span>
            <span className="hidden md:inline">New Invoice</span>
            <span className="md:hidden">New</span>
          </Button>
        </div>
      </header>

      {/* List or empty state */}
      {filtered.length === 0 ? (
        <EmptyState />
      ) : (
        <ul className="flex flex-col gap-4">
          {filtered.map((inv, i) => (
            <li
              key={inv.id}
              className="animate-slide-in"
              style={{ animationDelay: `${i * 40}ms` }}
            >
              <InvoiceCard
                invoice={inv}
                onClick={(id) => navigate(`/invoice/view/${id}`)}
              />
            </li>
          ))}
        </ul>
      )}

      <InvoiceDrawer open={add} onOpenChange={setAdd} />
    </main>
  );
}
