import { z } from "zod";
import { trimmedString } from "./common";

export const createCategorySchema = z.object({
  name: trimmedString("Nom requis"),
  description: z.string().trim().optional().default(""),
});

export const updateCategorySchema = z.object({
  name: trimmedString().optional(),
  description: z.string().trim().optional(),
});

export const updateStatusSchema = z.object({
  isActive: z.boolean(),
});
