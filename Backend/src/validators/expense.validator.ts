import { z } from "zod";
import { trimmedString } from "./common";

export const createExpenseSchema = z.object({
  description: trimmedString("La description est obligatoire"),
  amount: z.coerce.number().positive("Le montant doit être supérieur à 0"),
  type: z.enum(["variable", "semi-variable"], {
    message: "Type de charge invalide",
  }),
  date: trimmedString("La date est obligatoire"),
});
