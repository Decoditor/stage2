import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import { INVOICES } from "./datas";
import InvoiceContext from "./contexts/InvoiceContext";
import { useState, useEffect } from "react";
import type { Invoice } from "@/home/InvoiceCard";

const STORAGE_KEY = "invoices";

export default function App() {
  const [invoices, setInvoices] = useState<Invoice[]>(() => {
    if (typeof window === "undefined") return INVOICES;

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : INVOICES;
    } catch {
      return INVOICES;
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(invoices));
  }, [invoices]);

  return (
    <InvoiceContext.Provider value={{ invoices, setInvoices }}>
      <div className="min-h-screen bg-bg">
        <Navbar />
        <Outlet />
      </div>
    </InvoiceContext.Provider>
  );
}
