import { z } from "zod";

function isValidUrl(value: string): boolean {
  if (!value) return true;
  const t = value.trim();
  // Reject protocol-relative "//evil.com" while allowing root-relative "/path"
  if (t.startsWith("/") && !t.startsWith("//")) return true;
  if (t.startsWith("https://")) return true;
  if (t.startsWith("blob:")) return true;
  return false;
}

const dateString = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD")
  .refine((v) => {
    const d = new Date(v);
    return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === v;
  }, "Invalid date");

const optionalDate = z.string().optional().or(z.literal(""));

export const programSchema = z.object({
  titleEn: z.string().trim().min(1),
  titleAr: z.string().trim().min(1),
  descriptionEn: z.string().trim().min(1),
  descriptionAr: z.string().trim().min(1),
  icon: z.string().trim().min(1),
  longDescriptionEn: z.string().optional(),
  longDescriptionAr: z.string().optional(),
});

export const initiativeSchema = z.object({
  titleEn: z.string().trim().min(1),
  titleAr: z.string().trim().min(1),
  descriptionEn: z.string().trim().min(1),
  descriptionAr: z.string().trim().min(1),
  image: z.string().refine(isValidUrl, "Image must be https:// or /").optional().or(z.literal("")),
  categoryEn: z.string().trim().min(1),
  categoryAr: z.string().trim().min(1),
  progress: z.number().min(0).max(100),
  targetEn: z.string().optional(),
  targetAr: z.string().optional(),
  type: z.string().optional(),
  status: z.enum(["active", "completed", "upcoming"]).optional(),
  participantsCount: z.number().min(0).optional(),
  startDate: optionalDate,
});

export const eventSchema = z.object({
  titleEn: z.string().trim().min(1),
  titleAr: z.string().trim().min(1),
  descriptionEn: z.string().trim().min(1),
  descriptionAr: z.string().trim().min(1),
  date: dateString,
  locationEn: z.string().trim().min(1),
  locationAr: z.string().trim().min(1),
  categoryEn: z.string().trim().min(1),
  categoryAr: z.string().trim().min(1),
  status: z.enum(["upcoming", "ended"]).optional(),
});

export const courseSchema = z.object({
  titleEn: z.string().trim().min(1),
  titleAr: z.string().trim().min(1),
  descriptionEn: z.string().trim().min(1),
  descriptionAr: z.string().trim().min(1),
  instructorEn: z.string().trim().min(1),
  instructorAr: z.string().trim().min(1),
  durationEn: z.string().trim().min(1),
  durationAr: z.string().trim().min(1),
  lessonsCount: z.number().int().min(1),
  categoryEn: z.string().trim().min(1),
  categoryAr: z.string().trim().min(1),
  image: z.string().refine(isValidUrl, "Image must be https:// or /").optional().or(z.literal("")),
});

export const postSchema = z.object({
  titleEn: z.string().trim().min(1),
  titleAr: z.string().trim().min(1),
  excerptEn: z.string().trim().min(1),
  excerptAr: z.string().trim().min(1),
  contentEn: z.string().trim().min(1),
  contentAr: z.string().trim().min(1),
  image: z.string().refine(isValidUrl, "Image must be https:// or /").optional().or(z.literal("")),
  date: dateString,
  authorEn: z.string().trim().min(1),
  authorAr: z.string().trim().min(1),
  categoryEn: z.string().trim().min(1),
  categoryAr: z.string().trim().min(1),
});

export const opportunitySchema = z.object({
  titleEn: z.string().trim().min(1),
  titleAr: z.string().trim().min(1),
  descriptionEn: z.string().trim().min(1),
  descriptionAr: z.string().trim().min(1),
  typeEn: z.enum(["Job", "Internship", "Volunteering"]),
  typeAr: z.string().trim().min(1),
  locationEn: z.string().trim().min(1),
  locationAr: z.string().trim().min(1),
  postedDate: optionalDate,
});

export const teamSchema = z.object({
  nameEn: z.string().trim().min(1),
  nameAr: z.string().trim().min(1),
  roleEn: z.string().trim().min(1),
  roleAr: z.string().trim().min(1),
  bioEn: z.string().optional(),
  bioAr: z.string().optional(),
  image: z.string().refine(isValidUrl, "Image must be https:// or /").optional().or(z.literal("")),
  borderColor: z.string().optional(),
  gradient: z.string().optional(),
  category: z.enum(["founder", "core", "intern"]).optional(),
});

export const entitySchemas: Record<string, z.ZodTypeAny> = {
  programs: programSchema,
  initiatives: initiativeSchema,
  events: eventSchema,
  courses: courseSchema,
  posts: postSchema,
  opportunities: opportunitySchema,
  team: teamSchema,
  games: z.object({
    titleEn: z.string().trim().min(1),
    titleAr: z.string().trim().min(1),
    descriptionEn: z.string().trim().min(1),
    descriptionAr: z.string().trim().min(1),
    categoryEn: z.string().trim().min(1),
    categoryAr: z.string().trim().min(1),
    icon: z.string().trim().min(1),
    playUrl: z.string().optional().or(z.literal("")),
  }),
  careers: z.object({
    titleEn: z.string().trim().min(1),
    titleAr: z.string().trim().min(1),
    skillsEn: z.array(z.string()),
    skillsAr: z.array(z.string()),
    salaryEn: z.string(),
    salaryAr: z.string(),
    pathEn: z.string(),
    pathAr: z.string(),
    demand: z.enum(["High", "Medium", "Urgent"]),
  }),
  "carbon-questions": z.object({
    questionEn: z.string().trim().min(1),
    questionAr: z.string().trim().min(1),
    options: z.array(
      z.object({
        labelEn: z.string().trim().min(1),
        labelAr: z.string().trim().min(1),
        score: z.number(),
      })
    ),
  }),
};

export function validateEntity(kind: string, data: unknown): string | null {
  const schema = entitySchemas[kind];
  if (!schema) return null;
  const result = schema.safeParse(data);
  if (result.success) return null;
  const first = result.error.issues[0];
  return first ? `${first.path.join(".")}: ${first.message}` : "Validation failed";
}
