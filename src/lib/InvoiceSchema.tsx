import { z } from "zod";

const addressSchema = z.object({
  street: z.string().min(1, "Can't be empty"),
  city: z.string().min(1, "Can't be empty"),
  postCode: z.string().min(1, "Can't be empty"),
  country: z.string().min(1, "Can't be empty"),
});

const itemSchema = z.object({
  name: z.string().min(1, "Required"),
  quantity: z.number().min(1, "Min 1"),
  price: z.number().min(1, "Must be > 0"),
});

export const invoiceSchema = z.object({
  // BILL FROM
  senderAddress: addressSchema,

  // BILL TO
  clientName: z.string().min(1, "Can't be empty"),
  clientEmail: z.string().email("Invalid email"),
  clientAddress: addressSchema,

  // DETAILS
  createdAt: z.string().min(1),
  paymentTerms: z.string().min(1), // "1" | "7" | "30"
  description: z.string().min(1, "Can't be empty"),

  // ITEMS
  items: z.array(itemSchema).min(1, "At least one item required"),
});
