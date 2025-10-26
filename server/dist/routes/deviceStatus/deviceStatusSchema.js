// WARNING! - Any changes here MUST be the same between app/src/api & server/src/db/

!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="2a21b445-351c-5aeb-8950-3ad478e619cf")}catch(e){}}();
import { z } from 'zod';
const SideStatusSchema = z.object({
    currentTemperatureLevel: z.number(),
    currentTemperatureF: z.number(),
    targetTemperatureF: z.number()
        .min(55, { message: 'Temperature must be at least 55°F' })
        .max(110, { message: 'Temperature cannot exceed 110°F' }),
    secondsRemaining: z.number(),
    isOn: z.boolean(),
    isAlarmVibrating: z.boolean(),
}).strict();
export const DeviceStatusSchema = z.object({
    left: SideStatusSchema,
    right: SideStatusSchema,
    waterLevel: z.string(),
    isPriming: z.boolean(),
    settings: z.object({
        v: z.number(),
        gainLeft: z.number(),
        gainRight: z.number(),
        ledBrightness: z.number(),
    }),
    coverVersion: z.string(),
    hubVersion: z.string(),
}).strict();
export var Version;
(function (Version) {
    Version["NotFound"] = "Version not found";
    Version["Pod3"] = "Pod 3";
    Version["Pod4"] = "Pod 4";
    Version["Pod5"] = "Pod 5";
})(Version || (Version = {}));
//# sourceMappingURL=deviceStatusSchema.js.map
//# debugId=2a21b445-351c-5aeb-8950-3ad478e619cf
