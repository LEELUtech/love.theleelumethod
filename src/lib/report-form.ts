import { ReportFormData } from '@/types/report-form';

const URL = 'https://lucidly-experiential-delois.ngrok-free.dev/leelu-tech/us-central1/typeformWebhook';

export const sendReportData = async (payload: ReportFormData & { submittedAt: string }) => {
  try {
    const res = await fetch(URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    console.log({ data });
  } catch (err) {
    console.log({ err });
  }
};
