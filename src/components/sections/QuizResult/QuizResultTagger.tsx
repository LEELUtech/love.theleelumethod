'use client';
import { useEffect } from 'react';
import { getEmailFromLS } from '@/lib/tracking/localEmail';
import { updateCampaignTags } from '@/lib/campaigns';

const typeToProfileTag: Record<string, string> = {
  brokenHeartStorm: 'q_pf_over',
  lonelyHopeLoop: 'q_pf_drift',
  silentBreakupRelationship: 'q_pf_karmic',
  endlessWaitingRoom: 'q_pf_proj',
};

const typeToTitle: Record<string, string> = {
  brokenHeartStorm: 'The Broken Heart Storm',
  lonelyHopeLoop: 'The Lonely Hope Loop',
  silentBreakupRelationship: 'The Silent Breakup Relationship',
  endlessWaitingRoom: 'The Endless Waiting Room',
};

const ALL_PROFILE_TAGS = Object.values(typeToProfileTag);
const Q_EMAIL3_TRIGGER = 'q_email3_trigger';

export default function QuizResultTagger({ type }: { type: string }) {
  useEffect(() => {
    const profileTag = typeToProfileTag[type];
    if (!profileTag) return;

    const email = getEmailFromLS();
    if (!email) return;

    const otherProfileTags = ALL_PROFILE_TAGS.filter((t) => t !== profileTag);

    (async () => {
      await Promise.all([
        updateCampaignTags(email, {
          remove: otherProfileTags,
          add: ['q_done', profileTag, Q_EMAIL3_TRIGGER],
        }),
        fetch('/api/quiz-completed', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, quizResult: typeToTitle[type] }),
        }),
      ]);
    })();
  }, [type]);

  return null;
}
