"use client";

export function StripeCardSkeleton() {
  const fieldClass =
    "w-full h-[46px] rounded-[6px] border border-[#C3C6D1] bg-[#F3F4F6] animate-pulse";

  const lineClass = "h-4 rounded bg-[#F3F4F6] animate-pulse";

  return (
    <>
      {/* Card fields (same as StripeCardPart) */}
      <div className="mt-4 space-y-3">
        <div className={fieldClass} />

        <div className="grid grid-cols-2 gap-3">
          <div className={fieldClass} />
          <div className={fieldClass} />
        </div>
      </div>

      {/* Order summary (same margins as StripeCardPart) */}
      <div className="mt-[56px] md:mt-[56px] lg:mt-[94px]">
        {/* h4 placeholder */}
        <div className="h-[32px] md:h-[28px] lg:h-[32px] w-[220px] rounded bg-[#F3F4F6] animate-pulse" />

        <div className="mt-5 space-y-3">
          <div className="flex items-baseline justify-between gap-4">
            <div className={`${lineClass} w-[55%]`} />
            <div className={`${lineClass} w-[25%]`} />
          </div>

          <div className="flex items-baseline justify-between gap-4">
            <div className={`${lineClass} w-[30%]`} />
            <div className={`${lineClass} w-[25%]`} />
          </div>

          <div className="!my-[43px] md:!my-8 h-px w-full bg-black/10" />

          <div className="flex items-baseline justify-between gap-4">
            <div className={`${lineClass} w-[28%]`} />
            <div className={`${lineClass} w-[25%]`} />
          </div>
        </div>
      </div>

      {/* Button skeleton (same margins as StripeCardPart) */}
      <div
        className="
          mt-[24px] md:mt-10 lg:mt-[110px]
          h-[56px] w-full rounded-full
          bg-[#F3F4F6] animate-pulse
        "
      />
    </>
  );
}
