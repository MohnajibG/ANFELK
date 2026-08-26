import { z } from "zod";
import { objectId, trimmedString } from "./common";

const specialityEnum = z.enum([
  "Hair",
  "Nails",
  "Makeup",
  "Massage",
  "Reception",
  "Waxing",
  "Skincare",
]);

export const createServiceSchema = z.object({
  name: trimmedString("Nom requis"),
  description: z.string().trim().optional(),
  category: objectId,
  speciality: specialityEnum,
  price: z.coerce.number().min(0, "Le prix doit être positif"),
  duration: z.coerce.number().positive("La durée doit être positive"),
});

export const updateServiceSchema = z.object({
  name: trimmedString().optional(),
  description: z.string().trim().optional(),
  category: objectId.optional(),
  speciality: specialityEnum.optional(),
  price: z.coerce.number().min(0).optional(),
  duration: z.coerce.number().positive().optional(),
});

export const updateStatusSchema = z.object({
  isActive: z.boolean(),
});
