import { google, sheets_v4, Auth } from "googleapis";
import { defineSecret } from "firebase-functions/params";

const SHEET_EMAIL = defineSecret("SHEET_EMAIL");
const SHEET_PRIVATE_KEY = defineSecret("SHEET_PRIVATE_KEY");
const SHEET_ID = defineSecret("SHEET_ID");
const SHEET_NAME = defineSecret("SHEET_NAME");

export class GoogleSheetService {
  private sheets!: sheets_v4.Sheets;
  private auth!: Auth.JWT;
  private spreadsheetId!: string;
  private sheetName!: string;

  async init() {
    const email = await SHEET_EMAIL.value();
    const key = (await SHEET_PRIVATE_KEY.value()).replace(/\\n/g, "\n");
    this.spreadsheetId = await SHEET_ID.value();
    this.sheetName = await SHEET_NAME.value();

    this.auth = new google.auth.JWT({
      email,
      key,
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    this.sheets = google.sheets({ version: "v4", auth: this.auth });
  }

  async appendToSheet(data: string[]): Promise<void> {
    if (!this.sheets) throw new Error("Sheets not initialized. Call init() first.");

    try {
      await this.sheets.spreadsheets.values.append({
        spreadsheetId: this.spreadsheetId,
        range: this.sheetName,
        valueInputOption: "RAW",
        requestBody: { values: [data] },
      });
    } catch (error) {
      console.error("Error appending to Google Sheets:", error);
    }
  }
}

export const googleSheetService = new GoogleSheetService();

export const appendRowFunction = async (data: string[]) => {
  await googleSheetService.init();
  await googleSheetService.appendToSheet(data);
};
