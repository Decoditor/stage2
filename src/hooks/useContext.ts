import InvoiceContext from "@/contexts/InvoiceContext";
import { useContext } from "react";

export default function useInvoiceContext() {
  const context = useContext(InvoiceContext);
  if (!context) {
    throw new Error("Invoice must be used withing Invoice Context");
  }

  return context;
}
