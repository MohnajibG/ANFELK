import { z } from "zod";
import { objectId } from "./common";

export const openCashRegisterSchema = z.object({
  openingAmount: z.coerce.number().min(0, "Le montant doit être positif"),
});

export const closeCashRegisterSchema = z.object({
  closingAmount: z.coerce.number().min(0, "Le montant doit être positif"),
  notes: z.string().trim().optional(),
});

export const adminOpenCashRegisterSchema = z.object({
  cashier: objectId,
  openingAmount: z.coerce.number().min(0, "Le montant doit être positif"),
});

export const adminCloseCashRegisterSchema = z.object({
  closingAmount: z.coerce.number().min(0, "Le montant doit être positif"),
  notes: z.string().trim().optional(),
});

export const finalizeCashRegisterSchema = z.object({
  finalAmount: z.coerce.number().min(0, "Le montant doit être positif"),
  notes: z.string().trim().optional(),
});
