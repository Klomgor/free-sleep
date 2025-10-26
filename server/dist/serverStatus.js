import { isSystemDateValid } from './jobs/isSystemDateValid.js';
import servicesDB from './db/services.js';
import { prisma } from './db/prisma.js';
await servicesDB.read();
class ServerStatus {
    // eslint-disable-next-line no-use-before-define
    static instance;
    status;
    constructor() {
        this.status = {
            alarmSchedule: {
                name: 'Alarm schedule',
                status: 'not_started',
                description: '',
                message: '',
            },
            database: {
                name: 'Database',
                status: 'not_started',
                description: 'Connection to SQLite DB',
                message: '',
            },
            express: {
                name: 'Express',
                status: 'not_started',
                description: 'The back-end server',
                message: '',
            },
            franken: {
                name: 'Franken sock',
                status: 'not_started',
                description: 'Socket service for controlling the hardware',
                message: '',
            },
            jobs: {
                name: 'Job scheduler',
                status: 'not_started',
                description: 'Scheduling service for temperature changes, alarms, and maintenance',
                message: '',
            },
            logger: {
                name: 'Logger',
                status: 'not_started',
                description: 'Logging service',
                message: '',
            },
            powerSchedule: {
                name: 'Power schedule',
                status: 'not_started',
                description: 'Power on/off schedule',
                message: '',
            },
            primeSchedule: {
                name: 'Prime schedule',
                status: 'not_started',
                description: 'Daily prime job',
                message: '',
            },
            rebootSchedule: {
                name: 'Reboot schedule',
                status: 'not_started',
                description: 'Daily system reboots',
                message: '',
            },
            systemDate: {
                name: 'System date',
                status: 'not_started',
                description: 'Whether or not the system date is correct. Scheduling jobs depend on this.',
                message: '',
            },
            temperatureSchedule: {
                name: 'Temperature schedule',
                status: 'not_started',
                description: 'Temperature adjustment schedule',
                message: '',
            },
        };
    }
    static getInstance() {
        if (!ServerStatus.instance) {
            ServerStatus.instance = new ServerStatus();
        }
        return ServerStatus.instance;
    }
    async updateDB() {
        try {
            await prisma.$queryRaw `SELECT 1`;
            const quick = await prisma.$queryRawUnsafe(`PRAGMA quick_check;`);
            const quickCheckHealthy = quick?.[0] && Object.values(quick[0])[0] === 'ok';
            if (quickCheckHealthy) {
                this.status.database.status = 'healthy';
                this.status.database.message = '';
            }
            else {
                this.status.database.status = 'failed';
                this.status.database.message = `SQLite DB is unhealthy! - ${JSON.stringify(quick)}`;
            }
        }
        catch (error) {
            this.status.database.status = 'failed';
            const message = error instanceof Error ? error.message : String(error);
            this.status.database.message = message;
        }
    }
    updateSystemDate() {
        const isValid = isSystemDateValid();
        if (isValid) {
            this.status.systemDate.status = 'healthy';
            this.status.systemDate.message = '';
        }
        else {
            this.status.systemDate.status = 'failed';
            this.status.systemDate.message = `Invalid system date: ${new Date().toISOString()}`;
        }
    }
    async updateServices() {
        await servicesDB.read();
        if (servicesDB.data.biometrics.enabled) {
            this.status.analyzeSleepLeft = servicesDB.data.biometrics.jobs.analyzeSleepLeft;
            this.status.analyzeSleepRight = servicesDB.data.biometrics.jobs.analyzeSleepRight;
            this.status.biometricsInstallation = servicesDB.data.biometrics.jobs.installation;
            this.status.biometricsCalibrationLeft = servicesDB.data.biometrics.jobs.calibrateLeft;
            this.status.biometricsCalibrationRight = servicesDB.data.biometrics.jobs.calibrateRight;
            this.status.biometricsStream = servicesDB.data.biometrics.jobs.stream;
        }
        else {
            // Delete keys from server status
            delete this.status.analyzeSleepLeft;
            delete this.status.analyzeSleepRight;
            delete this.status.biometricsInstallation;
            delete this.status.biometricsCalibrationLeft;
            delete this.status.biometricsCalibrationRight;
            delete this.status.biometricsStream;
        }
    }
    async toJSON() {
        await this.updateDB();
        await this.updateServices();
        this.updateSystemDate();
        return this.status;
    }
}
export default ServerStatus.getInstance();
