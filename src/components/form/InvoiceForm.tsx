import { useFormContext, useFieldArray } from "react-hook-form";
import { Trash2Icon } from "lucide-react";

import FormInput from "./FormInput";
import Select from "./FormSelect";
import { Button } from "../ui/button";

export default function InvoiceForm({ errors }) {
  const { control, watch, setValue } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  return (
    <div className="h-full overflow-y-auto relative px-6 py-2 pb-34 flex flex-col gap-8">
      {/* BILL FROM */}
      <div>
        <h3 className="text-purple font-bold mb-4">Bill From</h3>

        <div className="flex flex-col gap-4">
          <FormInput name="senderAddress.street" label="Street Address" />

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <FormInput name="senderAddress.city" size="sm" label="City" />
            <FormInput
              name="senderAddress.postCode"
              size="sm"
              label="Post Code"
            />
            <FormInput
              name="senderAddress.country"
              size="sm"
              label="Country"
              className="col-span-2 md:col-span-1"
            />
          </div>
        </div>
      </div>

      {/* BILL TO */}
      <div>
        <h3 className="text-purple font-bold mb-4">Bill To</h3>

        <div className="flex flex-col gap-4">
          <FormInput name="clientName" size="sm" label="Client’s Name" />
          <FormInput name="clientEmail" size="sm" label="Client’s Email" />
          <FormInput
            name="clientAddress.street"
            size="sm"
            label="Street Address"
          />

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <FormInput name="clientAddress.city" size="sm" label="City" />
            <FormInput
              name="clientAddress.postCode"
              size="sm"
              label="Post Code"
            />
            <FormInput
              name="clientAddress.country"
              size="sm"
              label="Country"
              className="col-span-2 md:col-span-1"
            />
          </div>
        </div>
      </div>

      {/* DETAILS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormInput name="createdAt" label="Invoice Date" type="date" />

        <Select
          label="Payment Terms"
          value={watch("paymentTerms")}
          onChange={(val) => setValue("paymentTerms", val)}
          options={[
            { label: "Net 1 Day", value: "1" },
            { label: "Net 7 Days", value: "7" },
            { label: "Net 14 Days", value: "14" },
            { label: "Net 30 Days", value: "30" },
          ]}
        />
      </div>

      <FormInput name="description" label="Project Description" />

      {/* ITEMS */}
      <div>
        <h3 className="text-lg font-bold mb-4 text-muted-1">Item List</h3>

        <div className="flex flex-col gap-4">
          {fields.map((field, index) => {
            const quantity = watch(`items.${index}.quantity`) || 0;
            const price = watch(`items.${index}.price`) || 0;

            return (
              <div key={field.id} className="flex md:flex-row flex-col gap-2">
                <FormInput
                  name={`items.${index}.name`}
                  label="Item Name"
                  className="flex-1"
                />

                <div className="flex items-center gap-2">
                  <FormInput
                    name={`items.${index}.quantity`}
                    label="Qty"
                    size="sm"
                    type="number"
                    className="md:w-12! flex-1"
                  />

                  <FormInput
                    name={`items.${index}.price`}
                    label="Price"
                    size="sm"
                    type="number"
                    className="md:w-20 flex-1"
                  />

                  <span className="text-text-muted text-sm md:w-26 flex-1">
                    {(quantity * price).toFixed(2)}
                  </span>

                  <Trash2Icon
                    className="size-9 p-2 dark:text-muted-1 dark:hover:text-red-500 text-black hover:text-red-500 cursor-pointer"
                    onClick={() => remove(index)}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <Button
          type="button"
          size="lg"
          variant="secondary"
          onClick={() => append({ name: "", quantity: 1, price: 0 })}
          className="mt-4 bg-surface-2 rounded-full font-semibold text-muted-2 w-full"
        >
          + Add New Item
        </Button>
        <div className="h-12 w-full py-6">
          {errors?.map((err, i) => (
            <p key={i} className="text-destructive text-sm">
              - {err}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
