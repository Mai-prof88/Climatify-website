import { z } from "zod";

export const emailSchema = z.string().trim().email("البريد الإلكتروني غير صحيح");
export const dateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD").refine((v) => { const d=new Date(v); return !Number.isNaN(d.getTime()) && d.toISOString().slice(0,10)===v; }, "Invalid date");
export const timeSchema = z.string().regex(/^(?:[01]\d|2[0-3]):[0-5]\d$/, "Time must be HH:MM");

export function isValidEmail(v: string): boolean { return emailSchema.safeParse(v).success; }
export function isValidDate(v: string): boolean { return dateSchema.safeParse(v).success; }
export function isValidTime(v: string): boolean { return timeSchema.safeParse(v).success; }

export const contactSchema = z.object({
  firstName: z.string().trim().min(1),
  lastName: z.string().trim().min(1),
  email: emailSchema,
  subject: z.string().trim().min(1),
  message: z.string().trim().min(1),
});

export const meetingSchema = z.object({
  name: z.string().trim().min(1),
  email: emailSchema,
  date: dateSchema,
  time: timeSchema,
  notes: z.string().optional(),
});

export const partnershipSchema = z.object({
  orgName: z.string().trim().min(1),
  orgType: z.enum(["corporate", "government", "ngo", "academic"]),
  contactPerson: z.string().trim().min(1),
  email: emailSchema,
  proposal: z.string().trim().min(1),
});

export const workshopSchema = z.object({
  institutionName: z.string().trim().min(1),
  city: z.string().trim().min(1),
  studentCount: z.coerce.number().int().min(1),
  workshopType: z.enum(["climate-basics", "carbon-calculator", "ghaf-planting"]),
  email: emailSchema,
});
