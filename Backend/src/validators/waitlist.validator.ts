import { z } from "zod";
import { objectId, timeString, zDate } from "./common";

const sourceEnum = z.enum(["admin", "cashier", "online"]);

const waitlistServiceItemSchema = z.object({
  service: objectId,
  employee: objectId.optional(),
});

const appointmentServiceItemSchema = z.object({
  service: objectId,
  employee: objectId,
});

export const createWaitlistEntrySchema = z.object({
  client: objectId,
  services: z.array(waitlistServiceItemSchema).min(1, "Au moins un service requis"),
  desiredDateFrom: zDate,
  desiredDateTo: zDate.optional(),
  notes: z.string().trim().optional(),
});

export const convertWaitlistEntrySchema = z.object({
  services: z.array(appointmentServiceItemSchema).min(1, "Au moins un service requis"),
  date: zDate,
  startTime: timeString,
  source: sourceEnum.optional(),
  notes: z.string().trim().optional(),
});
