import { z } from "zod";
import { objectId } from "./common";

const paymentMethodEnum = z.enum(["cash", "card", "transfer"]);

const itemSchema = z.object({
  service: objectId,
  employee: objectId,
  finalPrice: z.coerce.number().min(0),
});

export const createTicketSchema = z.object({
  client: objectId,
  appointment: objectId.optional(),
  items: z.array(itemSchema).min(1, "Au moins un article requis"),
  discount: z.coerce.number().min(0).optional(),
  paymentMethod: paymentMethodEnum,
  notes: z.string().trim().optional(),
});

export const createTicketFromAppointmentSchema = z.object({
  client: objectId,
  items: z.array(itemSchema).min(1, "Au moins un article requis"),
  discount: z.coerce.number().min(0).optional(),
  paymentMethod: paymentMethodEnum,
  notes: z.string().trim().optional(),
});

export const updateTicketAdminSchema = z.object({
  items: z.array(itemSchema).min(1).optional(),
  discount: z.coerce.number().min(0).optional(),
  paymentMethod: paymentMethodEnum.optional(),
  notes: z.string().trim().optional(),
});
