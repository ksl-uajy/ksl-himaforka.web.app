import * as functions from "firebase-functions";
import { google } from "googleapis";

const initCors = (request: functions.https.Request, response: functions.Response<any>): void => {
    if (request.method === 'OPTIONS') {
        response.set('Access-Control-Allow-Methods', 'GET');
        response.set('Access-Control-Allow-Headers', 'Content-Type');
        response.set('Access-Control-Max-Age', '3600');
        response.status(204).send('');
    }
    response.set('Access-Control-Allow-Origin', '*');
};

export const jadwalKSL = functions.https.onRequest(async (request, response) => {
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

    response.send(data.data.values);
});

export const anggotaKSL = functions.https.onRequest(async (request, response) => {
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

    response.send(data.data.values);
});
