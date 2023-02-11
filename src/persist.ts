import * as fs from "fs";

export default class Persist {
    public static storage: Record<string, any> = {};
    public static configPath: string;

    public static load() {
        if (fs.existsSync(Persist.configPath)) {
            Persist.storage = JSON.parse(fs.readFileSync(Persist.configPath).toString());
            Persist.save();
        } else {
            Persist.loadTemplate();
        }
    }

    public static loadTemplate() {
        Persist.storage = {
            count: -1,
            passcodes: [],
        }
        Persist.save();
    }

    public static save() {
        fs.writeFileSync(Persist.configPath, JSON.stringify(Persist.storage));
    }

    public static set(dict: Record<string, any>) {
        for (const key in dict) {
            Persist.storage[key] = dict[key];
        }
        Persist.save();
    }

    public static get(keys: string[], callback: (data: Record<string, any>) => void) {
        const data: Record<string, any> = {};
        for (const key of keys) {
            data[key] = Persist.storage[key];
        }
        callback(data);
    }
}
