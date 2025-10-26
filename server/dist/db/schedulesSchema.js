// WARNING! - Any changes here MUST be the same between app/src/api & server/src/db/

!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="984188c7-b9a7-562a-aee0-94c9cb5af09c")}catch(e){}}();
import { z } from 'zod';
const timeRegexFormat = /^([01]\d|2[0-3]):([0-5]\d)$/;
// Reusable Zod type for time
export const TimeSchema = z.string().regex(timeRegexFormat, 'Invalid time format, must be HH:mm');
export const TemperatureSchema = z.number().int().min(55).max(110);
export const AlarmSchema = z.object({
    time: TimeSchema,
    vibrationIntensity: z.number().int().min(1).max(100),
    vibrationPattern: z.enum(['double', 'rise']),
    duration: z.number().int().positive().min(0).max(180),
    enabled: z.boolean(),
    alarmTemperature: TemperatureSchema,
}).strict();
export const DailyScheduleSchema = z.object({
    temperatures: z.record(TimeSchema, TemperatureSchema),
    alarm: AlarmSchema,
    power: z.object({
        on: TimeSchema,
        off: TimeSchema,
        onTemperature: TemperatureSchema,
        enabled: z.boolean(),
    }),
}).strict();
// Define the SideSchedule schema
export const SideScheduleSchema = z.object({
    sunday: DailyScheduleSchema,
    monday: DailyScheduleSchema,
    tuesday: DailyScheduleSchema,
    wednesday: DailyScheduleSchema,
    thursday: DailyScheduleSchema,
    friday: DailyScheduleSchema,
    saturday: DailyScheduleSchema,
}).strict();
// Define the Schedules schema
export const SchedulesSchema = z.object({
    left: SideScheduleSchema,
    right: SideScheduleSchema,
}).strict();
//# sourceMappingURL=schedulesSchema.js.map
//# debugId=984188c7-b9a7-562a-aee0-94c9cb5af09c
