import { FiChevronRight } from "react-icons/fi";
import StatusBadge from "./statusBadge";

export type InvoiceStatus = "paid" | "pending" | "draft";

export interface Address {
  street: string;
  city: string;
  postCode: string;
  country: string;
}

export interface InvoiceItem {
  name: string;
  quantity: number;
  price: number;
  total: number;
}

export interface Invoice {
  id: string;
  createdAt: string;
  paymentDue: string;
  description: string;

  clientName: string;
  clientEmail: string;

  status: InvoiceStatus;

  senderAddress: Address;
  clientAddress: Address;

  items: InvoiceItem[];

  total: number;
  paymentTerms: string;
}

const fmt = {
  date: (s: string) =>
    new Date(s + "T00:00:00").toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }),
  money: (n: number) =>
    "£ " +
    n.toLocaleString("en-GB", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }),
};

export default function InvoiceCard({
  invoice,
  onClick,
}: {
  invoice: Invoice;
  onClick: (id: string) => void;
}) {
  return (
    <article
      role="button"
      tabIndex={0}
      onClick={() => onClick(invoice.id)}
      onKeyDown={(e) => e.key === "Enter" && onClick(invoice.id)}
      className="bg-surface rounded-lg border border-transparent hover:border-purple cursor-pointer transition-colors p-6 shadow-[0_10px_10px_-10px_rgba(72,84,159,0.1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple"
    >
      {/* Desktop */}
      <div className="hidden md:grid grid-cols-[1fr_1.4fr_1.6fr_1.2fr_1fr_auto] items-center gap-4">
        <span className="font-bold text-[15px] text-text-primary">
          <span className="text-muted-2">#</span>
          {invoice.id}
        </span>
        <span className="text-[13px] text-text-muted">
          Due {fmt.date(invoice.paymentDue)}
        </span>
        <span className="text-[13px] text-text-muted text-right">
          {invoice.clientName}
        </span>
        <span className="font-bold text-[16px] text-text-primary text-right">
          {/* {fmt.money(invoice.total)} */}
        </span>
        <StatusBadge status={invoice.status} />
        <FiChevronRight className="text-purple ml-2" size={16} />
      </div>

      {/* Mobile */}
      <div className="md:hidden space-y-4">
        <div className="flex justify-between">
          <span className="font-bold text-[15px] text-text-primary">
            <span className="text-muted-2">#</span>
            {invoice.id}
          </span>
          <span className="text-[13px] text-text-muted">
            {invoice.clientName}
          </span>
        </div>
        <div className="flex items-end justify-between">
          <div>
            <p className="text-[13px] text-text-muted mb-1">
              Due {fmt.date(invoice.paymentDue)}
            </p>
            <p className="font-bold text-[16px] text-text-primary">
              {/* {fmt.money(invoice.total)} */}
            </p>
          </div>
          <StatusBadge status={invoice.status} />
        </div>
      </div>
    </article>
  );
}
