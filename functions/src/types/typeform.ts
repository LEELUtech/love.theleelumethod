import { TypeformRef } from "../static/typeform";

interface TypeformChoice {
  id: string;
  label: string;
  ref: string;
}

export interface TypeformField {
  id: string;
  type: string;
  ref: TypeformRef;
}

export interface TypeformAnswer {
  type: string;
  email?: string;
  text?: string;
  date?: string;
  choice?: TypeformChoice;
  answer_url?: string;
  field: TypeformField;
}

export interface TypeformWebhookRequest {
  event_id: string;
  event_type: string;
  form_response: {
    form_id: string;
    landed_at: Date;
    submitted_at: string;
    token: string;
    definition: {
      id: string;
      title: string;
      endings: unknown[];
      fields: TypeformField[];
    };
    answers: TypeformAnswer[];
  };
}
