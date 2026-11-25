import { z } from "zod";

export const schedulePostBodySchema = z.object({
  scheduledAt: z.coerce.date().refine((date) => date > new Date(), {
    message: "scheduledAt must be in the future",
  }),
});
