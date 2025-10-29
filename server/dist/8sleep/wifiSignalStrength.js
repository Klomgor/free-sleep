
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="e7951faa-771c-5de4-bed5-937e3379a3a4")}catch(e){}}();
import { exec } from 'child_process';
import logger from '../logger.js';
function execAsync(cmd) {
    return new Promise((resolve) => {
        exec(cmd, { timeout: 2000 }, (error, stdout, stderr) => {
            if (error) {
                return resolve({ ok: false, error: error.message.trim() });
            }
            if (stderr) {
                return resolve({ ok: false, error: stderr.trim() });
            }
            resolve({ ok: true, stdout: stdout.trim() });
        });
    });
}
export let WIFI_SIGNAL_STRENGTH = 0;
export async function loadWifiSignalStrength() {
    try {
        const result = await execAsync(`nmcli -t -f ACTIVE,SSID,SIGNAL dev wifi`);
        // @ts-expect-error
        if (!result.ok) {
            return 0;
        }
        // @ts-expect-error
        const activeLine = result.stdout
            .split('\n')
            .find((line) => line.startsWith('yes:'));
        if (!activeLine) {
            return 0;
        }
        const parts = activeLine.split(':');
        const signal = Number(parts[2]) || 0;
        WIFI_SIGNAL_STRENGTH = signal;
        return WIFI_SIGNAL_STRENGTH;
    }
    catch (error) {
        logger.error(error);
    }
}
//# sourceMappingURL=wifiSignalStrength.js.map
//# debugId=e7951faa-771c-5de4-bed5-937e3379a3a4
