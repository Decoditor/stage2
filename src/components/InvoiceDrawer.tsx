import type { Invoice } from "@/home/InvoiceCard";
import InvoiceForm from "./form/InvoiceForm";
import { Button } from "./ui/button";
import { FiChevronLeft } from "react-icons/fi";
import useInvoiceContext from "@/hooks/useContext";
import { invoiceSchema } from "@/lib/InvoiceSchema";
import type z from "zod";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";

type InvoiceFormData = z.infer<typeof invoiceSchema>;

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invoice?: Invoice;
}

function addDays(date: string, days: number) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d.toISOString().split("T")[0];
}

export default function InvoiceDrawer({ open, onOpenChange, invoice }: Props) {
  const [submitError, setSubmitError] = useState<string[]>([]);
  const { setInvoices } = useInvoiceContext();

  const form = useForm<InvoiceFormData>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: invoice || {
      clientName: "",
      clientEmail: "",
      description: "",
      createdAt: "",
      paymentTerms: "30",
      senderAddress: { street: "", city: "", postCode: "", country: "" },
      clientAddress: { street: "", city: "", postCode: "", country: "" },
      items: [{ name: "", quantity: 1, price: 0 }],
    },
  });

  function close() {
    onOpenChange(false);
  }

  function submit(data: InvoiceFormData, isDraft: boolean) {
    const newId = crypto.randomUUID();
    const paymentDue = addDays(data.createdAt, Number(data.paymentTerms));

    const finalData = {
      ...data,
      paymentDue,
    };

    if (invoice) {
      setInvoices((prev) =>
        prev.map((item) =>
          item.id === invoice.id ? { ...item, ...finalData } : item,
        ),
      );
    } else {
      setInvoices((prev) => [
        ...prev,
        {
          ...finalData,
          id: "WK" + newId.slice(0, 6),
          status: isDraft ? "draft" : "pending",
        },
      ]);
    }

    console.log(data);
    close();
  }

  const handleSave = form.handleSubmit(
    (data) => {
      const errors: string[] = [];

      if (!data.items || data.items.length === 0) {
        errors.push("An item must be added");
      }

      if (errors.length > 0) {
        setSubmitError(errors);
        return;
      }

      setSubmitError([]);
      submit(data, false);
    },
    () => {
      const errors: string[] = ["All fields must be added"];

      const items = form.getValues("items");
      if (!items || items.length === 0) {
        errors.push("An item must be added");
      }

      setSubmitError(errors);
    },
  );

  const handleDraft = form.handleSubmit(
    (data) => {
      const errors: string[] = [];

      if (!data.items || data.items.length === 0) {
        errors.push("An item must be added");
      }

      if (errors.length > 0) {
        setSubmitError(errors);
        return;
      }

      setSubmitError([]);
      submit(data, true);
    },
    () => {
      const errors: string[] = ["All fields must be added"];

      const items = form.getValues("items");
      if (!items || items.length === 0) {
        errors.push("An item must be added");
      }

      setSubmitError(errors);
    },
  );

  // clear errors when user edits form
  useEffect(() => {
    const sub = form.watch(() => {
      if (submitError.length > 0) setSubmitError([]);
    });
    return () => sub.unsubscribe();
  }, [form, submitError.length]);

  return (
    <div className="fixed z-40">
      {/* BACKDROP */}
      <div
        className="fixed inset-0 bg-black/40"
        hidden={!open}
        onClick={close}
      />

      {/* DRAWER */}
      <div
        className={`fixed overflow-y-hidden flex flex-col pt-20 lg:pt-0 top-0 left-0 lg:pl-34 bg-surface lg:w-[40%] md:w-[80%] w-full inset-y-0 shadow transition-all duration-1000 md:rounded-r-2xl ${!open ? "-translate-x-full" : "translate-x-0"}`}
      >
        {/* HEADER */}
        <div className="flex flex-col px-6 py-4 gap-4 md:py-8">
          <Button
            variant="link"
            onClick={close}
            className="w-fit p-0! flex md:hidden"
          >
            <FiChevronLeft className="text-purple" size={16} strokeWidth={3} />
            Go back
          </Button>

          <h2 className="text-xl font-bold text-text-primary">
            {invoice ? `Edit #${invoice.id}` : "New Invoice"}
          </h2>
        </div>

        {/* FORM PROVIDER WRAPS EVERYTHING */}
        <FormProvider {...form}>
          <InvoiceForm errors={submitError} />
        </FormProvider>

        {/* ACTIONS */}
        <div className="flex absolute dark:bg-muted lg:pl-34 md:px-6 px-2 bottom-0 w-full left-0 bg-bg gap-3 justify-between py-6 shadow-[0_-60px_60px_rgba(0,0,0,0.1)]">
          {!invoice && (
            <Button
              type="button"
              size="lg"
              variant="secondary"
              onClick={close}
              className="rounded-full dark:bg-white dark:text-black text-muted-2 font-semibold"
            >
              Discard
            </Button>
          )}

          <div className="flex gap-3 justify-end w-full">
            {invoice ? (
              <Button
                type="button"
                size="lg"
                variant="secondary"
                onClick={close}
                className="rounded-full text-muted-2 font-semibold"
              >
                Cancel
              </Button>
            ) : (
              <Button
                type="button"
                size="lg"
                variant="secondary"
                onClick={handleDraft}
                className="bg-navy-4 text-muted-1 rounded-full flex-1 md:flex-0 hover:bg-navy-3 px-4 md:px-6"
              >
                Save as Draft
              </Button>
            )}

            <Button
              type="button"
              size="lg"
              onClick={handleSave}
              className="rounded-full px-4 md:px-6"
            >
              {invoice ? "Save Changes" : "Save & Send"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
