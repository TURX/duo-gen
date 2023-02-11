import Persist from "./persist";
import Duo from "./duo";

export default class Op {
    public static setup() {
        Persist.load();
    }

    public static async set(link: string) {
        Persist.loadTemplate();
        const HOTPSecret = await Duo.fetchHOTPSecret(link);
        Persist.set({HOTPSecret});
        console.log(HOTPSecret);
    }

    public static next() {
        Persist.get(["HOTPSecret", "count", "passcodes"], (data) => {
            const {HOTPSecret, count, passcodes} = data;
            const {
                code,
                passcodes: newPasscodes,
                count: newCount
            } = Duo.getNextPasscode(HOTPSecret, passcodes, count);
            Persist.set({passcodes: newPasscodes, count: newCount});
            console.log(code);
        });
    }

    public static prev() {
        Persist.get(["HOTPSecret", "count", "passcodes"], (data) => {
            const {HOTPSecret, count, passcodes} = data;
            const {
                code,
                passcodes: newPasscodes,
                count: newCount
            } = Duo.getPreviousPasscode(HOTPSecret, passcodes, count);
            Persist.set({passcodes: newPasscodes, count: newCount});
            console.log(code);
        });
    }
}
