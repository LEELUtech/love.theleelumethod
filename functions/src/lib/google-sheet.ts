import { google, sheets_v4, Auth } from "googleapis";
import { configs } from "../configs/env";

export class GoogleSheetService {
  private sheets!: sheets_v4.Sheets;
  private auth!: Auth.JWT;
  private spreadsheetId!: string;
  private sheetName!: string;

  async init() {
    const email = configs.sheetEmail;
    const key = configs.sheetPrivateKey.replace(/\\n/g, "\n");

    this.spreadsheetId = configs.sheetId;
    this.sheetName = configs.sheetName;

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
