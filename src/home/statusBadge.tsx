import type { InvoiceStatus } from "./InvoiceCard";

const statusStyles: Record<InvoiceStatus, string> = {
  paid: "bg-green/10 text-green",
  pending: "bg-orange/10 text-orange",
  draft:
    "bg-navy-4/10 text-navy-4 dark:bg-purple-muted/10 dark:text-purple-muted",
};

export default function StatusBadge({ status }: { status: InvoiceStatus }) {
  return (
    <div
      className={`flex items-center gap-2 px-4 py-2.5 rounded-md min-w-26 justify-center font-bold text-[15px] capitalize ${statusStyles[status]}`}
    >
      <span className="w-2 h-2 rounded-full bg-current" />
      {status}
    </div>
  );
}
