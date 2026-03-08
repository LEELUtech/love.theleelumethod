import { google } from "googleapis";
import { configs } from "../configs/env";

const auth = new google.auth.JWT({
  email: configs.sheetEmail,
  key: configs.sheetPrivateKey.replace(/\\n/g, "\n"),
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const sheets = google.sheets({ version: "v4", auth });

export const appendToSheet = async (id: string, name: string, data: string[]) => {
  try {
    await sheets.spreadsheets.values.append({
      spreadsheetId: id,
      range: name,
      valueInputOption: "RAW",
      requestBody: { values: [Object.values(data)] },
    });
  } catch (error) {
    console.error("Error appending to Google Sheets:", error);
  }
};
