
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="7ff9ac2e-1060-508f-8dd4-ed27f17b6fdc")}catch(e){}}();
import express from 'express';
import moment from 'moment-timezone';
import settingsDB from '../../db/settings.js';
import { loadVitals } from '../../db/loadVitals.js';
import { prisma } from '../../db/prisma.js';
const router = express.Router();
router.get('/vitals', async (req, res) => {
    const { side, startTime, endTime } = req.query;
    const query = {};
    if (side)
        query.side = side;
    query.timestamp = {};
    if (startTime)
        query.timestamp.gte = moment(startTime).unix();
    if (endTime)
        query.timestamp.lte = moment(endTime).unix();
    // Use Prisma's generated type for the records
    const vitals = await prisma.vitals.findMany({
        where: query,
        orderBy: { timestamp: 'asc' },
    });
    await settingsDB.read();
    const formattedVitals = await loadVitals(vitals);
    res.json(formattedVitals);
});
router.get('/vitals/summary', async (req, res) => {
    const { side, startTime, endTime } = req.query;
    const query = {};
    if (side)
        query.side = side;
    query.timestamp = {};
    if (startTime)
        query.timestamp.gte = moment(startTime).unix();
    if (endTime)
        query.timestamp.lte = moment(endTime).unix();
    // Query: Min & Max Heart Rate
    const heartRateSummary = await prisma.vitals.aggregate({
        where: query,
        _min: { heart_rate: true },
        _max: { heart_rate: true },
        _avg: { heart_rate: true },
    });
    // Query: Average Breathing Rate (excluding 0)
    const avgBreathingRate = await prisma.vitals.aggregate({
        where: {
            ...query,
            breathing_rate: { not: 0, lte: 20, gte: 5 }, // Exclude zero values
        },
        _avg: { breathing_rate: true },
    });
    // Query: Average HRV (excluding 0)
    const avgHRV = await prisma.vitals.aggregate({
        where: {
            ...query,
            hrv: { not: 0, lte: 120, gte: 30 }, // Exclude zero values
        },
        _avg: { hrv: true },
    });
    res.json({
        avgHeartRate: Math.round(heartRateSummary._avg.heart_rate || 0),
        minHeartRate: Math.round(heartRateSummary._min.heart_rate || 0),
        maxHeartRate: Math.round(heartRateSummary._max.heart_rate || 0),
        avgHRV: Math.round(avgHRV._avg.hrv || 0),
        avgBreathingRate: Math.round(avgBreathingRate._avg.breathing_rate || 0),
    });
});
export default router;
//# sourceMappingURL=vitals.js.map
//# debugId=7ff9ac2e-1060-508f-8dd4-ed27f17b6fdc
