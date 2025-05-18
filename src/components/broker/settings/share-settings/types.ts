
import { z } from "zod";

export const shareFormSchema = z.object({
  defaultExpirationEnabled: z.boolean().default(true),
  defaultExpirationDays: z.number().min(1).max(365),
  autoGenerateNotes: z.boolean().default(false),
  notifyOnShareClick: z.boolean().default(true),
  defaultShareMode: z.enum(["standard", "short", "branded"]),
  appendUTMParameters: z.boolean().default(true),
});

export type ShareFormValues = z.infer<typeof shareFormSchema>;
