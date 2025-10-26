// WARNING! - Any changes here MUST be the same between app/src/api & server/src/db/

!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="f9de616f-616d-50cb-83b5-30351d87397f")}catch(e){}}();
import { z } from 'zod';
import { StatusInfoSchema } from '../routes/serverStatus/serverStatusSchema.js';
export const ServicesSchema = z.object({
    biometrics: z.object({
        enabled: z.boolean(),
        jobs: z.object({
            analyzeSleepLeft: StatusInfoSchema,
            analyzeSleepRight: StatusInfoSchema,
            installation: StatusInfoSchema,
            stream: StatusInfoSchema,
            calibrateLeft: StatusInfoSchema,
            calibrateRight: StatusInfoSchema,
        }),
    }),
    sentryLogging: z.object({
        enabled: z.boolean(),
    }),
}).strict();
//# sourceMappingURL=servicesSchema.js.map
//# debugId=f9de616f-616d-50cb-83b5-30351d87397f
