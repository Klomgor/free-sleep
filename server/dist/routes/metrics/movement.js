
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="af6cb0e0-5b87-5049-815a-3964911c3d71")}catch(e){}}();
import express from 'express';
import moment from 'moment-timezone';
import { loadMovementRecords } from '../../db/loadMovementRecords.js';
import { prisma } from '../../db/prisma.js';
const router = express.Router();
router.get('/movement', async (req, res) => {
    const { startTime, endTime, side } = req.query;
    const query = {
        timestamp: {},
    };
    if (side)
        query.side = side;
    if (startTime) {
        // @ts-expect-error
        query.timestamp.gte = moment(startTime).unix();
    }
    if (endTime) {
        // @ts-expect-error
        query.timestamp.lte = moment(endTime).unix();
    }
    const movementRecords = await prisma.movement.findMany({
        where: query,
        orderBy: { timestamp: 'asc' },
    });
    const formattedRecords = await loadMovementRecords(movementRecords);
    res.json(formattedRecords);
});
export default router;
//# sourceMappingURL=movement.js.map
//# debugId=af6cb0e0-5b87-5049-815a-3964911c3d71
