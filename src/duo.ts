// https://github.com/SparkShen02/Easy-Duo-Authentication

import {hotp} from "otplib";

export default class Duo {
    /*
     * When the user submits an activation link, try to fetch the HOTP secret from Duo.
     */
    public static async fetchHOTPSecret(link: string) {
        let host = "api" + link.substring(link.indexOf("-"), link.indexOf("com") + 3);
        let key = link.substring(link.lastIndexOf("/") + 1);
        let duoURL = "https://" + host + "/push/v2/activation/" + key + "?customer_protocol=1";

        const duoData = await fetch(duoURL, {
            method: "POST",
            headers: {
                "Content-type": "application/x-www-form-urlencoded"
            },
            body: "jailbroken=false&architecture=arm64&region=US&app_id=com.duosecurity.duomobile&full_disk_encryption=true&passcode_status=true&platform=Android&app_version=3.49.0&app_build_number=323001&version=11&manufacturer=unknown&language=en&model=Easy%20Duo%20Authentication&security_patch_level=2021-02-01"
        });

        const duoPayload = await duoData.json();

        if (duoPayload.stat === "OK") { // on success
            return duoPayload.response.hotp_secret;
        } else { // on failure
            throw new Error("Something went wrong. Maybe the activation link has been used.");
        }
    }

    /*
     * A valid activation link has been submitted by the user, and the HOTP secret has been fetched from Duo.
     * Calculate and display the next HOTP passcode.
     */
    public static calculatePasscode(HOTPSecret: string, count: number) {
        return hotp.generate(HOTPSecret, count);
    }

    public static getNextPasscode(HOTPSecret: string, passcodes: string[], count: number) {
        count += 1;
        passcodes.push(Duo.calculatePasscode(HOTPSecret, count));
        return {
            "code": passcodes[count],
            passcodes,
            count
        };
    }

    public static getPreviousPasscode(HOTPSecret: string, passcodes: string[], count: number) {
        if (count <= 0) {
            throw new Error("No previous passcode");
        }
        count -= 1;
        passcodes.pop();
        return {
            "code": passcodes[count],
            passcodes,
            count
        };
    }
}
