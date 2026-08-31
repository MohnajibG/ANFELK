import { z } from "zod";
import mongoose from "mongoose";

export const objectId = z
  .string()
  .refine((value) => mongoose.Types.ObjectId.isValid(value), {
    message: "Identifiant invalide",
  });

export const timeString = z
  .string()
  .regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Format d'heure invalide (HH:mm)");

export const zDate = z.coerce.date().refine((date) => !isNaN(date.getTime()), {
  message: "Date invalide",
});

export const trimmedString = (message = "Champ requis") =>
  z.string().trim().min(1, message);

/**
 * Les formulaires HTML envoient souvent "" pour un champ optionnel non
 * rempli (select, input date) plutôt que d'omettre la clé. zod ne traite
 * pas "" comme "absent" pour un champ .optional() — ce wrapper le fait.
 */
export const emptyToUndefined = <T extends z.ZodTypeAny>(schema: T) =>
  z.preprocess((value) => (value === "" ? undefined : value), schema);
