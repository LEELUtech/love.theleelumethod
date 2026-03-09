import { google, sheets_v4, Auth } from "googleapis";
import { defineSecret } from "firebase-functions/params";

const SHEET_EMAIL = defineSecret("SHEET_EMAIL");
const SHEET_PRIVATE_KEY = defineSecret("SHEET_PRIVATE_KEY");
const SHEET_ID = defineSecret("SHEET_ID");
const SHEET_NAME = defineSecret("SHEET_NAME");

class GoogleSheetService {
  private sheets: sheets_v4.Sheets;
  private auth: Auth.JWT;

  constructor() {
    const email = SHEET_EMAIL.value();
    const key = SHEET_PRIVATE_KEY.value();

    this.auth = new google.auth.JWT({
      email: email,
      key: key,
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    this.sheets = google.sheets({ version: "v4", auth: this.auth });
  }

  async appendToSheet(data: string[]): Promise<void> {
    const spreadsheetId = SHEET_ID.value();
    const range = SHEET_NAME.value();

    try {
      await this.sheets.spreadsheets.values.append({
        spreadsheetId,
        range,
        valueInputOption: "RAW",
        requestBody: { values: [Object.values(data)] },
      });
    } catch (error) {
      console.error("Error appending to Google Sheets:", error);
    }
  }
}

export const googleSheetService = new GoogleSheetService();
