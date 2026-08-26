import { z } from "zod";
import { timeString, trimmedString, zDate } from "./common";

const roleEnum = z.enum(["employee", "cashier"]);

const specialityEnum = z.enum([
  "Hair",
  "Nails",
  "Makeup",
  "Massage",
  "Reception",
  "Waxing",
  "Skincare",
]);

export const createEmployeeSchema = z.object({
  firstName: trimmedString("Prénom requis"),
  lastName: trimmedString("Nom requis"),
  email: z.string().trim().min(1, "Email requis").email("Email invalide"),
  phone: z.string().trim().optional(),
  role: roleEnum,
  speciality: specialityEnum.optional(),
});

export const updateEmployeeSchema = z.object({
  firstName: trimmedString().optional(),
  lastName: trimmedString().optional(),
  phone: z.string().trim().optional(),
  role: roleEnum.optional(),
  speciality: specialityEnum.optional(),
});

export const updateStatusSchema = z.object({
  isActive: z.boolean(),
});

const dayHoursSchema = z.object({
  isOpen: z.boolean(),
  start: timeString.optional(),
  end: timeString.optional(),
});

export const updateScheduleSchema = z.object({
  weeklyHours: z.object({
    monday: dayHoursSchema,
    tuesday: dayHoursSchema,
    wednesday: dayHoursSchema,
    thursday: dayHoursSchema,
    friday: dayHoursSchema,
    saturday: dayHoursSchema,
    sunday: dayHoursSchema,
  }),
});

export const addExceptionSchema = z.object({
  date: zDate,
  isOff: z.boolean(),
  start: timeString.optional(),
  end: timeString.optional(),
  reason: z.string().trim().optional(),
});
