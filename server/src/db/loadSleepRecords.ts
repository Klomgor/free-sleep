// Helper file to load raw sleep records from SQLite and convert the epoch timestamps -> ISO8601
import { sleep_records as PrismaSleepRecord } from '.prisma/client';
import settingsDB from './settings.js';
import moment from 'moment-timezone';

import { SleepRecord } from './prismaDbTypes.js';

export const loadSleepRecords = async (sleepRecords: PrismaSleepRecord[]): Promise<SleepRecord[]> => {
  await settingsDB.read();
  const userTimeZone: string = settingsDB.data.timeZone || 'UTC';

  // Parse JSON fields
  return sleepRecords.map((record: any) => ({
    ...record,
    entered_bed_at: moment.tz(record.entered_bed_at * 1000, userTimeZone).format(),
    left_bed_at: moment.tz(record.left_bed_at * 1000, userTimeZone).format(),
    present_intervals: record.present_intervals
      ? JSON.parse(record.present_intervals).map(([start, end]: number[]) => [
        moment.tz(start * 1000, userTimeZone).format(),
        moment.tz(end * 1000, userTimeZone).format(),
      ])
      : [],
    not_present_intervals: record.not_present_intervals
      ? JSON.parse(record.not_present_intervals).map(([start, end]: number[]) => [
        moment.tz(start * 1000, userTimeZone).format(),
        moment.tz(end * 1000, userTimeZone).format(),
      ])
      : [],
  })) as SleepRecord[];
};
