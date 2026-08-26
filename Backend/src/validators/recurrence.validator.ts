import { z } from "zod";
import { objectId, timeString, zDate } from "./common";

const sourceEnum = z.enum(["admin", "cashier", "online"]);

const serviceItemSchema = z.object({
  service: objectId,
  employee: objectId,
});

const recurrenceSchema = z.object({
  frequency: z.enum(["weekly", "biweekly", "monthly"]),
  count: z.coerce.number().int().positive().optional(),
  until: zDate.optional(),
});

export const createRecurringAppointmentSchema = z.object({
  client: objectId,
  services: z.array(serviceItemSchema).min(1, "Au moins un service requis"),
  date: zDate,
  startTime: timeString,
  source: sourceEnum.optional(),
  notes: z.string().trim().optional(),
  recurrence: recurrenceSchema,
});
