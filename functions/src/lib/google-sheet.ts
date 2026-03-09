import { google, sheets_v4, Auth } from "googleapis";
import { configs } from "../configs/env";

class GoogleSheetService {
  private sheets: sheets_v4.Sheets;
  private auth: Auth.JWT;

  constructor() {
    console.log(`GoogleSheetService configs: ${configs.sheetEmail}, ${configs.sheetPrivateKey}`);

    this.auth = new google.auth.JWT({
      email: configs.sheetEmail,
      key: configs.sheetPrivateKey,
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    this.sheets = google.sheets({ version: "v4", auth: this.auth });
  }

  async appendToSheet(data: string[]): Promise<void> {
    console.log(`appendToSheet configs: ${configs.sheetId}, ${configs.sheetName}`);

    try {
      await this.sheets.spreadsheets.values.append({
        spreadsheetId: configs.sheetId,
        range: configs.sheetName,
        valueInputOption: "RAW",
        requestBody: { values: [Object.values(data)] },
      });
    } catch (error) {
      console.error("Error appending to Google Sheets:", error);
    }
  }
}

export const googleSheetService = new GoogleSheetService();
