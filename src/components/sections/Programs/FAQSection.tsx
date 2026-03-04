import React from 'react';

type FAQItem = {
  q: string;
  a: string;
};

const FAQ: FAQItem[] = [
  {
    q: "I don't have a partner right now. Is this for me?",
    a: `You need this the most. You cannot build a new house on a broken foundation. This course ensures that the next man you meet encounters the "Upgraded" you, not the version of you that unconsciously repeats the past.`,
  },
  {
    q: 'We are on the brink of divorce. Can this save us?',
    a: `I have seen marriages resurrect from the ashes—but only when the dynamic shifts. You cannot save a relationship by doing "more of the same." You need a pattern interrupt. This is that interrupt.`,
  },
  {
    q: "I've done therapy. How is this different?",
    a: `Therapy analyzes your feelings. I analyze your emotional and relational architecture. We don't just talk about the pain; we give you the specific, numbered steps to stop the behavior causing it. We move from "Why do I feel this way?" to "How do I fix this system?"`,
  },
  {
    q: "I'm worried I won't have time to complete the course.",
    a: `This course is designed for busy women. Each module is 15-25 minutes. You can complete the entire system in 2-3 hours, and the workbook exercises are designed to be done in 10-minute increments. Most women see a shift in their dynamic within 7-10 days of starting.`,
  },
  {
    q: 'This sounds too good to be true. How do I know it works?',
    a: `This system has been validated across 11,500 real-world applications in high-stakes hiring decisions. It's not theory—it's a protocol I used to predict human behavior with 75% greater accuracy than trained psychologists. The curriculum is built on the same mathematical framework that helped elite families avoid catastrophic hiring mistakes. If it works for profiling strangers in security-sensitive roles, it works for understanding the person you're sleeping next to.`,
  },
];

export default function FAQSection() {
  return (
    <section className='bg-brand-white py-[80px] md:py-[120px] lg:pt-[160px] lg:pb-[112px]'>
      <div className='container'>
        <h2 className='font-canela font-light text-brand-black leading-[110%] text-[44px] md:text-[52px] lg:text-[60px]'>
          Frequently Asked <span className='text-brand-primary'>Questions</span>
        </h2>

        <div className='mt-[40px] md:mt-[48px] lg:mt-[56px] space-y-[16px] md:space-y-[24px] lg:space-y-[16px]'>
          {FAQ.map((item) => (
            <div key={item.q} className='py-[24px] md:py-[28px] lg:py-[24px]'>
              <h3 className='font-canela font-normal text-[#010101] text-[20px]/[126%]'>{item.q}</h3>

              <p className='mt-3 font-lato font-medium text-[#5A5757] text-[17px]/[26px] tracking-[3%'>{item.a}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
