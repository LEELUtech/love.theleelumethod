import { ReportFormData } from '@/types/report-form';

// const LOCAL_URL = 'https://lucidly-experiential-delois.ngrok-free.dev/leelu-tech/us-central1/typeformWebhook';

const URL = 'https://us-central1-leelu-tech.cloudfunctions.net/typeformWebhook';

export const sendReportData = async (payload: ReportFormData & { submittedAt: string }) => {
  try {
    const res = await fetch(URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    return data;
  } catch (err) {
    console.log({ err });
  }
};
