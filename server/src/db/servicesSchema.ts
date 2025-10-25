// WARNING! - Any changes here MUST be the same between app/src/api & server/src/db/

import { z } from 'zod';
import { StatusInfoSchema } from '../routes/serverStatus/serverStatusSchema.js';


export const ServicesSchema = z.object({
  biometrics: z.object({
    enabled: z.boolean(),
    installScriptComplete: z.boolean(),
    jobs: z.object({
      stream: StatusInfoSchema,
      calibrateLeft: StatusInfoSchema,
      calibrateRight: StatusInfoSchema,
    }),
  }),
  sentryLogging: z.object({
    enabled: z.boolean(),
  }),
}).strict();

export type Services = z.infer<typeof ServicesSchema>;
