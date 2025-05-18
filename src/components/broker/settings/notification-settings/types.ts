
import { z } from "zod";

export const notificationFormSchema = z.object({
  emailNotifications: z.boolean().default(true),
  pushNotifications: z.boolean().default(true),
  smsNotifications: z.boolean().default(false),
  notifyOnNewLead: z.boolean().default(true),
  notifyOnPropertyView: z.boolean().default(true),
  notifyOnShareClick: z.boolean().default(false),
  quietHoursStart: z.string(),
  quietHoursEnd: z.string(),
});

export type NotificationFormValues = z.infer<typeof notificationFormSchema>;
