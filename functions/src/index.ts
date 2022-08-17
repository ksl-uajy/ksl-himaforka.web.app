import * as functions from "firebase-functions";
import { google } from "googleapis";

const initCors = (request: functions.https.Request, response: functions.Response<any>): void => {
    response.set("Access-Control-Allow-Origin", "*");
    if (request.method === "OPTIONS") {
        response.set("Access-Control-Allow-Methods", "GET, POST");
        response.set("Access-Control-Allow-Headers", "Content-Type");
        response.set("Access-Control-Max-Age", "3600");
        response.status(204).send("");
    }
};

const authGoogle = async () => {
    const auth = new google.auth.GoogleAuth({
        keyFile: "credentials.json",
        scopes: "https://www.googleapis.com/auth/spreadsheets",
    });
    return auth.getClient();
};

const getJadwal = async () => {
    const auth = await authGoogle();

    const googleSheets = google.sheets({ version: "v4", auth: auth });
    const spreadsheetId = "1OxKqfQCUeutCNPmu3oo25v7cGpIW3ep1FFckqia69xE";

    const data = await googleSheets.spreadsheets.values.get({
        auth,
        spreadsheetId,
        range: "'Jadwal KSL'!B2:D128",
    });

    return data.data.values;
};

export const jadwalKSL = functions.region("asia-northeast1").https.onRequest(async (request, response) => {
    initCors(request, response);
    const data = await getJadwal();

    switch (request.method) {
        case "GET":
            response.send(data);
            break;
        default:
            response.send({ status: "error" });
            break;
    }
});

const getAnggotaKSL = async () => {
    const auth = await authGoogle();

    const googleSheets = google.sheets({ version: "v4", auth: auth });
    const spreadsheetId = "1OxKqfQCUeutCNPmu3oo25v7cGpIW3ep1FFckqia69xE";

    const data = await googleSheets.spreadsheets.values.get({
        auth,
        spreadsheetId,
        range: "'Anggota KSL'!B2:F64",
    });

    return data.data.values;
};

const addAnggotaKSL = async (index: number, npm: string, full_name: string, email: string, phone_number: string) => {
    const auth = await authGoogle();

    const googleSheets = google.sheets({ version: "v4", auth: auth });
    const spreadsheetId = "1OxKqfQCUeutCNPmu3oo25v7cGpIW3ep1FFckqia69xE";

    const resp = await googleSheets.spreadsheets.values.append({
        auth,
        spreadsheetId,
        range: "'Anggota KSL'!B:F",
        requestBody: {
            values: [[index, npm, full_name, email, phone_number]]
        },
        valueInputOption: "USER_ENTERED",
    });

    if (resp.status === 200) {
        return true;
    }
    return false;
};

export const anggotaKSL = functions.region("asia-northeast1").https.onRequest(async (request, response) => {
    initCors(request, response);

    switch (request.method) {
        case "GET":
            let result: any;
            let data: any = await getAnggotaKSL();

            data.map((item: string, index: number) => {
                if (item[3] == request.query.email) {
                    result = {
                        npm: data[index][1],
                        full_name: data[index][2],
                        email: data[index][3],
                        phone_number: data[index][4],
                        status: "ok"
                    };
                    return result;
                }
            });

            result = result ?? { status: "error" };
            response.send(result);
            break;

        case "POST":
            if (request.body.npm && request.body.full_name && request.body.email && request.body.phone_number) {
                let result: any;
                let data: any = await getAnggotaKSL();

                data.map((item: string) => {
                    if (item[3] == request.body.email) {
                        result = {
                            status: "userExists"
                        };
                        return result;
                    }
                });

                if (result) {
                    response.send(result);
                    break;
                }

                const resp = await addAnggotaKSL(data.length, request.body.npm, request.body.full_name, request.body.email, request.body.phone_number);
                if (resp) {
                    response.send({ "status": "ok" });
                } else {
                    response.send({ "status": "error" });
                }
                break;
            }
            response.send({ "status": "error" });
            break;

        default:
            response.send({ status: "error" });
            break;
    }
});
