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
