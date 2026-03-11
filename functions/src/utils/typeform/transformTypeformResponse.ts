import { TypeformColumns } from "../../static/typeform";
import { PATH, PATH_LABELS, TIER, TIER_LABELS, TypeformWebhookRequest } from "../../types/typeform";

export const transformTypeformResponse = (payload: TypeformWebhookRequest) => {
  const data = Object.fromEntries(Object.values(TypeformColumns).map((col) => [col, ""])) as Record<
    TypeformColumns,
    string
  >;

  Object.entries(payload).forEach(([key, value]) => {
    switch (true) {
      case key === "submittedAt":
        data[TypeformColumns.TIMESTAMP] = value;
        break;

      case key === "email":
        data[TypeformColumns.EMAIL] = value;
        break;
      case key === "fullName":
        data[TypeformColumns.HER_FULL_NAME] = value;
        break;
      case key === "dob":
        data[TypeformColumns.HER_DOB] = value;
        break;
      case key === "tier":
        data[TypeformColumns.TIER] = TIER_LABELS[value as TIER];
        break;
      case key === "path":
        data[TypeformColumns.PATH] = PATH_LABELS[value as PATH];
        break;
      case key === "partnerName" && value:
        data[TypeformColumns.PARTNER_FULL_NAME] = value;
        break;
      case key === "partnerDob" && value:
        data[TypeformColumns.PARTNER_DOB] = value;
        break;
      case key === "duration" && value:
        data[TypeformColumns.PARTNER_DURATION] = value;
        break;

      default:
        break;
    }
  });

  return data;
};
