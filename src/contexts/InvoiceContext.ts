import { createContext } from "react";
import type { Invoice } from "@/home/InvoiceCard";

type InvoiceContextType = {
  invoices: Invoice[];
  setInvoices: React.Dispatch<React.SetStateAction<Invoice[]>>;
};

const InvoiceContext = createContext<InvoiceContextType | null>(null);

export default InvoiceContext;
