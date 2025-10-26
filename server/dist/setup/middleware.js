
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="c51cf9b7-9dbf-5a69-a5f5-e4455730e9cc")}catch(e){}}();
import express from 'express';
import cors from 'cors';
import logger from '../logger.js';
import os from 'os';
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN;
function getLocalIp() {
    const interfaces = os.networkInterfaces();
    for (const interfaceName in interfaces) {
        const networkInterface = interfaces[interfaceName];
        if (!networkInterface)
            continue;
        for (const network of networkInterface) {
            if (network.family === 'IPv4' && !network.internal) {
                return network.address;
            }
        }
    }
    return 'localhost'; // Default to localhost if LAN IP isn't found
}
export default function (app) {
    app.use((req, res, next) => {
        const startTime = Date.now();
        // Hook into the response `finish` event to log after the response is sent
        res.on('finish', () => {
            const duration = Date.now() - startTime;
            logger.info(`${req.method} ${req.originalUrl} - ${res.statusCode} - ${duration}ms`);
        });
        next();
    });
    app.use(express.json());
    // Allow local development
    app.use(cors({
        origin: (origin, callback) => {
            // Allow if origin is LAN IP or localhost
            if (!origin ||
                origin?.startsWith(`http://${getLocalIp()}:`) ||
                origin?.startsWith('http://localhost') ||
                origin?.startsWith('http://192.168.') ||
                origin?.startsWith('http://172.16.') ||
                origin?.startsWith('http://10.0.') ||
                (ALLOWED_ORIGIN && origin?.startsWith(ALLOWED_ORIGIN))) {
                callback(null, true);
            }
            else {
                callback(new Error('Not allowed by CORS'));
            }
        }
    }));
    // Logging
    app.use((req, res, next) => {
        const clientIp = req.headers['x-forwarded-for'] || req.ip;
        const method = req.method;
        const endpoint = req.originalUrl;
        logger.debug(`${method} ${endpoint} - IP: ${clientIp}`);
        next();
    });
}
//# sourceMappingURL=middleware.js.map
//# debugId=c51cf9b7-9dbf-5a69-a5f5-e4455730e9cc
