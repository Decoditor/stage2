import { useState, useEffect } from "react";
import { FiChevronLeft } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import type { InvoiceStatus } from "@/home/InvoiceCard";
import useInvoiceContext from "@/hooks/useContext";
import InvoiceDrawer from "./InvoiceDrawer";

const fmtDate = (s: string) =>
  new Date(s + "T00:00:00").toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
const fmtMoney = (n: number) =>
  "£ " +
  n.toLocaleString("en-GB", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const statusStyles: Record<InvoiceStatus, string> = {
  paid: "bg-green/10 text-green",
  pending: "bg-orange/10 text-orange",
  draft:
    "bg-navy-4/10 text-navy-4 dark:bg-purple-muted/10 dark:text-purple-muted",
};

function StatusBadge({ status }: { status: InvoiceStatus }) {
  return (
    <div
      className={`flex items-center gap-2 px-4 py-2.5 rounded-md font-bold text-[15px] capitalize ${statusStyles[status]}`}
    >
      <span className="w-2 h-2 rounded-full bg-current" />
      {status}
    </div>
  );
}
function DeleteModal({
  invoiceId,
  onCancel,
  onConfirm,
}: {
  invoiceId: string;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  // Trap focus + close on ESC
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onCancel]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onCancel();
      }}
    >
      <div className="bg-surface rounded-lg p-12 max-w-[480px] w-[90%] shadow-xl">
        <h2
          id="modal-title"
          className="font-bold text-2xl text-text-primary mb-3"
        >
          Confirm Deletion
        </h2>
        <p className="text-[13px] text-text-muted leading-relaxed mb-6">
          Are you sure you want to delete invoice #{invoiceId}? This action
          cannot be undone.
        </p>
        <div className="flex gap-2 justify-end">
          <Button
            variant="secondary"
            size="lg"
            onClick={onCancel}
            className="rounded-full"
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            size="lg"
            variant="destructive"
            className="rounded-full"
          >
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function InvoiceDetails() {
  const navigate = useNavigate();
  const [showDelete, setShowDelete] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const { invoices, setInvoices } = useInvoiceContext();
  const { id } = useParams();
  const invoice = invoices.find((item) => item.id === id);
  const handleDelete = () => {
    const remaining = invoices.filter((item) => item.id !== invoice.id);
    setInvoices(remaining);
    console.log(remaining);
    navigate("/");
  };
  function markPaid() {
    setInvoices((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: "paid" } : item)),
    );
  }
  const itemTotal = invoice.items.reduce((acc, item) => {
    return +item.quantity * +item.price + acc;
  }, 0);

  return (
    <div className="">
      <main className=" space-y-6 pt-24 lg:pt-12 px-6 md:px-12 lg:max-w-195 lg:mx-auto py-18">
        {/* Go back */}
        <Button variant="link" onClick={() => navigate(-1)} className="">
          <FiChevronLeft className="text-purple" size={16} strokeWidth={3} />
          Go back
        </Button>

        {/* ── Status bar ── */}
        <div className="bg-surface rounded-lg p-6 flex items-center justify-between mb-6 shadow-[0_10px_10px_-10px_rgba(72,84,159,0.1)]">
          {/* Mobile: status only (actions move to bottom) */}
          <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-start">
            <span className="text-[13px] text-text-muted font-medium">
              Status
            </span>
            <StatusBadge status={invoice.status} />
          </div>

          {/* Desktop actions */}
          <div className="hidden md:flex items-center gap-2">
            {invoice.status !== "paid" && (
              <Button
                variant="secondary"
                size="lg"
                className="rounded-full font-bold"
                onClick={() => setShowEdit(true)}
              >
                Edit
              </Button>
            )}
            <Button
              onClick={() => setShowDelete(true)}
              size="lg"
              variant="destructive"
              className="rounded-full font-bold"
            >
              Delete
            </Button>
            {invoice.status === "pending" && (
              <Button
                size="lg"
                onClick={markPaid}
                className="rounded-full font-bold"
              >
                Mark as Paid
              </Button>
            )}
          </div>
        </div>

        {/* ── Invoice card ── */}
        <div className="bg-surface rounded-lg p-6 md:p-12 shadow-[0_10px_10px_-10px_rgba(72,84,159,0.1)]">
          {/* Top: ID + sender address */}
          <div className="flex flex-col md:flex-row md:justify-between gap-8 mb-10">
            <div>
              <p className="font-bold text-[16px] text-text-primary">
                <span className="text-muted-2">#</span>
                {invoice.id}
              </p>
              <p className="text-[13px] text-text-muted mt-1">
                {invoice.description}
              </p>
              {/* Sender address on mobile sits here */}
              <div className="md:hidden text-[13px] text-text-muted leading-relaxed mt-6">
                <p>{invoice.senderAddress.street}</p>
                <p>{invoice.senderAddress.city}</p>
                <p>{invoice.senderAddress.postCode}</p>
                <p>{invoice.senderAddress.country}</p>
              </div>
            </div>
            {/* Sender address on desktop — right aligned */}
            <div className="hidden md:block text-[13px] text-text-muted leading-relaxed text-right">
              <p>{invoice.senderAddress.street}</p>
              <p>{invoice.senderAddress.city}</p>
              <p>{invoice.senderAddress.postCode}</p>
              <p>{invoice.senderAddress.country}</p>
            </div>
          </div>

          {/* Meta grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 mb-10">
            {/* Dates */}
            <div className="flex flex-col gap-8">
              <div>
                <p className="text-[13px] text-text-muted mb-3">Invoice Date</p>
                <p className="font-bold text-[15px] text-text-primary">
                  {fmtDate(invoice.createdAt)}
                </p>
              </div>
              <div>
                <p className="text-[13px] text-text-muted mb-3">Payment Due</p>
                <p className="font-bold text-[15px] text-text-primary">
                  {fmtDate(invoice.paymentDue)}
                </p>
              </div>
            </div>

            {/* Bill To */}
            <div>
              <p className="text-[13px] text-text-muted mb-3">Bill To</p>
              <p className="font-bold text-[15px] text-text-primary mb-2">
                {invoice.clientName}
              </p>
              <div className="text-[13px] text-text-muted leading-relaxed">
                <p>{invoice.clientAddress.street}</p>
                <p>{invoice.clientAddress.city}</p>
                <p>{invoice.clientAddress.postCode}</p>
                <p>{invoice.clientAddress.country}</p>
              </div>
            </div>

            {/* Sent To */}
            <div className="col-span-2 md:col-span-1">
              <p className="text-[13px] text-text-muted mb-3">Sent to</p>
              <p className="font-bold text-[15px] text-text-primary">
                {invoice.clientEmail}
              </p>
            </div>
          </div>

          {/* Items table */}
          <div className="bg-surface-2 rounded-lg overflow-hidden">
            {/* Desktop table header */}
            <div className="hidden md:grid grid-cols-[1fr_80px_120px_120px] gap-4 px-8 pt-8 pb-4">
              {["Item Name", "QTY.", "Price", "Total"].map((h, i) => (
                <span
                  key={h}
                  className={`text-[13px] text-text-muted ${i > 0 ? "text-right" : ""}`}
                >
                  {h}
                </span>
              ))}
            </div>

            {/* Rows */}
            <div className="px-6 md:px-8 pb-8 space-y-6 pt-6 md:pt-0">
              {invoice.items.map((item) => (
                <div key={item.name}>
                  {/* Desktop row */}
                  <div className="hidden md:grid grid-cols-[1fr_80px_120px_120px] gap-4 items-center">
                    <span className="font-bold text-[15px] text-text-primary">
                      {item.name}
                    </span>
                    <span className="font-bold text-[15px] text-text-muted text-right">
                      {item.quantity}
                    </span>
                    <span className="font-bold text-[15px] text-text-muted text-right">
                      {fmtMoney(+item.price)}
                    </span>
                    <span className="font-bold text-[15px] text-text-primary text-right">
                      {fmtMoney(+item.quantity * +item.price)}
                    </span>
                  </div>

                  {/* Mobile row */}
                  <div className="md:hidden flex items-center justify-between">
                    <div>
                      <p className="font-bold text-[15px] text-text-primary">
                        {item.name}
                      </p>
                      <p className="text-[13px] text-text-muted mt-1">
                        {item.quantity} x {fmtMoney(+item.price)}
                      </p>
                    </div>
                    <span className="font-bold text-[15px] text-text-primary">
                      {fmtMoney(+item.quantity * +item.price)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Amount Due footer */}
            <div className="bg-navy-2 dark:bg-navy-5 rounded-b-lg px-8 py-6 flex items-center justify-between">
              <span className="text-[13px] text-white/80 md:text-white">
                <span className="md:hidden">Grand Total</span>
                <span className="hidden md:inline">Amount Due</span>
              </span>
              <span className="font-bold text-2xl text-white">
                {fmtMoney(itemTotal)}
              </span>
            </div>
          </div>
        </div>

        {/* ── Mobile action bar ── */}
        <div className="md:hidden fixed bottom-0 inset-x-0 bg-surface px-12 py-5 flex items-center justify-between gap-2 shadow-[0_-10px_10px_-10px_rgba(72,84,159,0.1)]">
          {invoice.status !== "paid" && (
            <Button
              variant="secondary"
              size="lg"
              className="rounded-full font-bold"
            >
              Edit
            </Button>
          )}
          <Button
            onClick={() => setShowDelete(true)}
            size="lg"
            variant="destructive"
            className="rounded-full font-bold"
          >
            Delete
          </Button>
          {invoice.status === "pending" && (
            <Button
              onClick={markPaid}
              size="lg"
              className="rounded-full font-bold"
            >
              Mark as Paid
            </Button>
          )}
        </div>
      </main>

      {showDelete && (
        <DeleteModal
          invoiceId={invoice.id}
          onCancel={() => setShowDelete(false)}
          onConfirm={handleDelete}
        />
      )}

      <InvoiceDrawer
        open={showEdit}
        onOpenChange={setShowEdit}
        invoice={invoice}
      />
    </div>
  );
}
