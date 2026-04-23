import { Outlet } from "react-router";
import Navbar from "./components/Navbar";
import { INVOICES } from "./datas";
import InvoiceContext from "./contexts/InvoiceContext";
import { useState, useEffect } from "react";

const STORAGE_KEY = "invoices";

export default function App() {
  const [invoices, setInvoices] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : INVOICES;
    } catch {
      return INVOICES;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(invoices));
    } catch (err) {
      console.error("Failed to save invoices", err);
    }
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
