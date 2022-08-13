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

export const jadwalKSL = functions.region("asia-northeast1").https.onRequest(async (request, response) => {
    initCors(request, response);

    const auth = new google.auth.GoogleAuth({
        keyFile: "credentials.json",
        scopes: "https://www.googleapis.com/auth/spreadsheets",
    });
    const client = await auth.getClient();

    const googleSheets = google.sheets({ version: "v4", auth: client });
    const spreadsheetId = "1OxKqfQCUeutCNPmu3oo25v7cGpIW3ep1FFckqia69xE";

    const data = await googleSheets.spreadsheets.values.get({
        auth,
        spreadsheetId,
        range: "'Jadwal KSL'!B2:D128",
    });

    switch (request.method) {
        case "GET":
            response.send(data.data.values);
            break;
        default:
            response.send({ status: "error" });
            break;

    }
});

export const anggotaKSL = functions.region("asia-northeast1").https.onRequest(async (request, response) => {
    initCors(request, response);

    const auth = new google.auth.GoogleAuth({
        keyFile: "credentials.json",
        scopes: "https://www.googleapis.com/auth/spreadsheets",
    });
    const client = await auth.getClient();

    const googleSheets = google.sheets({ version: "v4", auth: client });
    const spreadsheetId = "1OxKqfQCUeutCNPmu3oo25v7cGpIW3ep1FFckqia69xE";

    switch (request.method) {
        case "GET":
            let result: any;
            let data: any = await googleSheets.spreadsheets.values.get({
                auth,
                spreadsheetId,
                range: "'Anggota KSL'!B2:F64",
            });
            data = data.data.values;

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
                let data: any = await googleSheets.spreadsheets.values.get({
                    auth,
                    spreadsheetId,
                    range: "'Anggota KSL'!B2:B64",
                });
                data = data.data.values;

                googleSheets.spreadsheets.values.append({
                    auth,
                    spreadsheetId,
                    range: "'Anggota KSL'!B:F",
                    requestBody: {
                        values: [[data.length, request.body.npm, request.body.full_name, request.body.email, request.body.phone_number]]
                    },
                    valueInputOption: "USER_ENTERED",
                });
                response.send({ "status": "ok" });
                break;
            }
            response.send({ "status": "error" });
            break;

        default:
            response.send({ status: "error" });
            break;
    }
});
