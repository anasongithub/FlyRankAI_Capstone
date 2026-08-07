// src/lib/validation/settingsSchema.ts
import { z } from "zod";

export const settingsSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters"),
  email: z.string().trim().email("Enter a valid email address"),
  notifications: z.boolean(),
});

export type SettingsFormValues = z.infer<typeof settingsSchema>;
