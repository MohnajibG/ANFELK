import { z } from "zod";
import { objectId, timeString, trimmedString, zDate } from "./common";

export const createOnlineAppointmentSchema = z.object({
  client: z.object({
    firstName: trimmedString("Prénom requis"),
    lastName: trimmedString("Nom requis"),
    phone: trimmedString("Téléphone requis"),
    email: z.string().trim().email("Email invalide").optional().or(z.literal("")),
  }),
  employee: objectId,
  services: z.array(objectId).min(1, "Au moins un service requis"),
  date: zDate,
  startTime: timeString,
});
