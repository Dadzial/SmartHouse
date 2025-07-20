import lightUsageSchema from "../schemas/LightUsage.schema";
import { LightUsageModel } from "../models/LightUsage.model";

function durationsToMinutes(durations: Record<string, number>): Record<string, number> {
    const result: Record<string, number> = {};
    for (const room in durations) {
        result[room] = Math.round(durations[room] / 60000);
    }
    return result;
}

class LightUsageService {
    public async updateLightState(room: string, state: boolean): Promise<void> {
        const record = await lightUsageSchema.findOne({ room });

        if (state) {
            if (!record) {
                await lightUsageSchema.create({ room, turnedOnAt: new Date(), totalUsageMs: 0 });
            } else if (!record.turnedOnAt) {
                record.turnedOnAt = new Date();
                await record.save();
            }
        } else {
            if (record?.turnedOnAt) {
                const now = new Date();
                const duration = now.getTime() - new Date(record.turnedOnAt).getTime();
                record.totalUsageMs += duration;
                record.turnedOnAt = undefined;
                await record.save();
            }
        }
    }

    public async getLightUsageDurations(): Promise<Record<string, number>> {
        const usages = await lightUsageSchema.find({});
        const durations: Record<string, number> = {};

        usages.forEach(u => {
            let duration = u.totalUsageMs;
            if (u.turnedOnAt) {
                duration += Date.now() - new Date(u.turnedOnAt).getTime();
            }
            durations[u.room] = duration;
        });

        return durationsToMinutes(durations);
    }

    public async resetLightUsage(): Promise<void> {
        await lightUsageSchema.deleteMany({});
    }
}

export default LightUsageService;
