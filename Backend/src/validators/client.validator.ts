import { z } from "zod";
import { emptyToUndefined, trimmedString, zDate } from "./common";

export const createClientSchema = z
  .object({
    firstName: trimmedString("Prénom requis"),
    lastName: trimmedString("Nom requis"),
    phone: z.string().trim().optional(),
    email: z.string().trim().email("Email invalide").optional().or(z.literal("")),
    gender: emptyToUndefined(z.enum(["female", "male"]).optional()),
    birthDate: emptyToUndefined(zDate.optional()),
    notes: z.string().trim().optional(),
  })
  .refine((data) => Boolean(data.phone) || Boolean(data.email), {
    message: "Un numéro de téléphone ou un email est requis",
    path: ["phone"],
  });

export const updateClientSchema = z.object({
  firstName: trimmedString().optional(),
  lastName: trimmedString().optional(),
  phone: z.string().trim().optional(),
  email: z.string().trim().email("Email invalide").optional().or(z.literal("")),
  gender: emptyToUndefined(z.enum(["female", "male"]).optional()),
  birthDate: emptyToUndefined(zDate.optional()),
  notes: z.string().trim().optional(),
});

export const updateStatusSchema = z.object({
  isActive: z.boolean(),
});
