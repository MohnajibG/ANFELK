import { z } from "zod";
import { objectId, timeString, zDate } from "./common";

const statusEnum = z.enum([
  "pending",
  "confirmed",
  "in_progress",
  "completed",
  "waiting_payment",
  "paid",
  "cancelled",
  "no_show",
]);

const sourceEnum = z.enum(["admin", "cashier", "online"]);

const serviceItemSchema = z.object({
  service: objectId,
  employee: objectId,
});

export const createAppointmentSchema = z.object({
  client: objectId,
  services: z.array(serviceItemSchema).min(1, "Au moins un service requis"),
  date: zDate,
  startTime: timeString,
  source: sourceEnum.optional(),
  notes: z.string().trim().optional(),
});

export const updateAppointmentSchema = z.object({
  date: zDate.optional(),
  startTime: timeString.optional(),
  services: z.array(serviceItemSchema).min(1).optional(),
  status: statusEnum.optional(),
  notes: z.string().trim().optional(),
  noShowReason: z.string().trim().optional(),
});

export const rescheduleAppointmentSchema = z.object({
  date: zDate,
  startTime: timeString,
});

export const cancelAppointmentSchema = z.object({
  reason: z.string().trim().optional(),
});
