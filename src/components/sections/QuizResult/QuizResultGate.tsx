"use client";

import React from "react";
import Image from "next/image";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";
import { saveEmailToLS } from "@/lib/tracking/localEmail";
import { salesiqIdentify } from "@/lib/tracking/salesiqIdentify";
import { updateCampaignTags } from "@/lib/campaigns";
import { getStoredFirstUTM, getStoredLastUTM } from "@/utils/utm-tracker";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const typeToProfileTag: Record<string, string> = {
  TheOverFunctioner: "q_pf_over",
  KarmicLoop: "q_pf_drift",
  Drifter: "q_pf_karmic",
  Projector: "q_pf_proj",
};

const typeToTitle: Record<string, string> = {
  TheOverFunctioner: "The Over Functioner",
  KarmicLoop: "Karmic Loop",
  Drifter: "Drifter",
  Projector: "Projector",
};

const ALL_PROFILE_TAGS = Object.values(typeToProfileTag);

type Props = {
  children: React.ReactNode;
  type: string;
};

export default function QuizResultGate({ children, type }: Props) {
  const [open, setOpen] = React.useState(true);
  const [firstName, setFirstName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [submitting, setSubmitting] = React.useState(false);

  React.useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const fn = firstName.trim();
    const em = email.trim();

    if (!fn) return setError("Please enter your first name.");
    if (!em || !emailRegex.test(em)) return setError("Please enter a valid email.");

    setSubmitting(true);
    try {
      saveEmailToLS(em);
      salesiqIdentify({ email: em, firstName: fn });

      const utmFirst = getStoredFirstUTM();
      const utmLast = getStoredLastUTM();

      // await lead-captured first so contact is created with firstName
      // before quiz-completed's ensureContact runs (prevents race/duplicate)
      await fetch("/api/lead-captured", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: em,
          firstName: fn,
          site: window.location.hostname,
          pagePath: window.location.pathname,
          sessionId: localStorage.getItem("ff_session_id") || undefined,
          salesiqVisitorId: localStorage.getItem("ff_salesiq_visitor_id") || undefined,
          utmSource: utmFirst?.utm_source,
          utmMedium: utmFirst?.utm_medium,
          utmCampaign: utmFirst?.utm_campaign,
          utmContent: utmFirst?.utm_content,
          utmTerm: utmFirst?.utm_term,
          utmLastSource: utmLast?.utm_source,
          utmLastMedium: utmLast?.utm_medium,
          utmLastCampaign: utmLast?.utm_campaign,
          utmLastContent: utmLast?.utm_content,
          utmLastTerm: utmLast?.utm_term,
        }),
      }).catch(() => {});

      const profileTag = typeToProfileTag[type];
      if (profileTag) {
        const otherProfileTags = ALL_PROFILE_TAGS.filter((t) => t !== profileTag);
        await Promise.all([
          updateCampaignTags(em, {
            remove: otherProfileTags,
            add: ["q_done", profileTag, "q_email3_trigger"],
          }),
          fetch("/api/quiz-completed", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: em, quizResult: typeToTitle[type] }),
          }),
        ]);
      }

      setOpen(false);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className={open ? "blur-sm pointer-events-none select-none" : undefined}>
        {children}
      </div>

      {open ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/40 backdrop-blur-sm">
          <div className="relative w-full max-w-[480px] rounded-[32px] bg-white px-8 py-10 md:px-12 md:py-12 shadow-[0px_4px_40px_0px_rgba(0,0,0,0.18)]">

            <div className="absolute inset-0 z-0 rounded-[32px] overflow-hidden pointer-events-none">
              <Image src="/noise_bg.svg" alt="" fill quality={85} className="object-cover" />
            </div>

            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="mb-8">
                <Logo />
              </div>

              <p className="font-lato font-normal text-body uppercase tracking-[0.1em] text-[#C6ABB3] mb-3">
                Your results are ready
              </p>

              <h2 className="font-canela font-thin text-brand-black text-[36px] md:text-[42px] leading-[110%] mb-3">
                Where should we<br />send your profile?
              </h2>

              <p className="font-lato font-normal text-[15px] text-[#5A5757] leading-[1.6] mb-8">
                Enter your details below to unlock your full diagnosis and see what&apos;s driving your pattern.
              </p>

              <form onSubmit={onSubmit} className="w-full space-y-4 text-left">
                <div>
                  <Input
                    placeholder="First Name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>

                <div>
                  <Input
                    type="email"
                    placeholder="Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck={false}
                  />
                </div>

                {error ? (
                  <p className="text-xs font-lato text-brand-primary">{error}</p>
                ) : null}

                <Button
                  type="submit"
                  fullWidth
                  loading={submitting}
                  disabled={submitting}
                  className="mt-2"
                  trackingData={{
                    cta_name: "quiz_result_gate_submit",
                    cta_text: "UNLOCK MY RESULTS",
                    cta_location: "quiz_result_gate",
                  }}
                >
                  UNLOCK MY RESULTS
                </Button>
              </form>

            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
