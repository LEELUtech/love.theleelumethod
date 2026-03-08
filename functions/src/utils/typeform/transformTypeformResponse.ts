import { TypeformColumns, TypeformRef } from "../../static/type-form";
import { TypeformAnswer } from "../../types/typeform";

const transformPathResponse = (label: string) => {
  switch (label) {
    case "I’m going through a breakup":
      return "Path A";
    case "I’m in a relationship":
      return "Path A";
    default:
      return "Path C";
  }
};

export const transformTypeformResponse = (submittedAt: string, answers: TypeformAnswer[]) => {
  const data: Record<TypeformColumns, string> = {} as Record<TypeformColumns, string>;

  data[TypeformColumns.TIMESTAMP] = submittedAt;
  data[TypeformColumns.EMAIL] = "";
  data[TypeformColumns.HER_FULL_NAME] = "";
  data[TypeformColumns.HER_DOB] = "";
  data[TypeformColumns.TIER] = "";
  data[TypeformColumns.PATH] = "";
  data[TypeformColumns.PARTNER_FULL_NAME] = "";
  data[TypeformColumns.PARTNER_DOB] = "";
  data[TypeformColumns.PARTNER_DURATION] = "";
  data[TypeformColumns.REPORT_1_STATUS] = "";
  data[TypeformColumns.REPORT_2_STATUS] = "";
  data[TypeformColumns.REPORT_3_STATUS] = "";
  data[TypeformColumns.REPORT_4_STATUS] = "";
  data[TypeformColumns.NOTES] = "";

  answers.forEach((answer) => {
    const ref = answer.field.ref;

    switch (ref) {
      case TypeformRef.USER_EMAIL:
        if (answer.email) data[TypeformColumns.EMAIL] = answer.email;
        else if (answer.text) data[TypeformColumns.EMAIL] = answer.text;
        break;

      case TypeformRef.USER_NAME:
        if (answer.text) data[TypeformColumns.HER_FULL_NAME] = answer.text;
        break;

      case TypeformRef.USER_DOB:
        if (answer.date) data[TypeformColumns.HER_DOB] = answer.date;
        break;

      case TypeformRef.USER_PROGRAM:
        if (answer.choice?.label) data[TypeformColumns.TIER] = answer.choice.label;
        break;

      case TypeformRef.USER_PATH:
        if (answer.choice?.label)
          data[TypeformColumns.PATH] = transformPathResponse(answer.choice.label);
        break;

      case TypeformRef.PARTNER_NAME:
      case TypeformRef.EX_PARTNER_NAME:
        if (answer.text) data[TypeformColumns.PARTNER_FULL_NAME] = answer.text;
        break;

      case TypeformRef.PARTNER_DOB:
      case TypeformRef.EX_PARTNER_DOB:
        if (answer.date) data[TypeformColumns.PARTNER_DOB] = answer.date;
        break;

      case TypeformRef.PARTNER_DURATION:
      case TypeformRef.EX_PARTNER_DURATION:
        if (answer.choice) data[TypeformColumns.PARTNER_DURATION] = answer.choice.label;
        break;

      default:
        break;
    }
  });

  return data;
};
