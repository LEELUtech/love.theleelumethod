import { ArrowIC } from '@/components/icons';

const content = [
  {
    id: '1',
    title_start: 'This is',
    title_mid: 'for you',
    title_end: 'if:',

    list: [
      {
        id: '1',
        title: 'You Have a Specific Problem:',
        description: `You're at a decision point that requires clarity, or comfort. A relationship at breaking point. A career pattern you keep repeating. A behavioral loop that has already cost you years.`,
      },
      {
        id: '2',
        title: `You Don't Know What The Problem Is:`,
        description: `You just know something is off. You're stuck but can't name why. You might be succeeding on paper but feel misaligned. That's fine—the diagnostic will reveal the pattern you can't see from the inside. Most people are shocked by what the numbers show them.`,
      },
      {
        id: '3',
        title: 'Either Way:',
        description: `You're ready for clarity. You want confirmation that what you're sensing is real—and you want to understand the deeper pattern creating it. You value precision. You've spent months processing the problem; you're ready to identify the root in one hour.`,
      },
    ],
  },

  {
    id: '2',
    title_start: 'This is',
    title_mid: 'NOT for you',
    title_end: 'if:',

    list: [
      {
        id: '1',
        title: `You're looking to replace therapeutic support`,
        description: `This session is diagnostic, not therapeutic—I identify patterns and provide strategic direction, but it doesn't replace therapy. If you're working through trauma or need emotional processing, continue with your therapist and consider this as a complementary tool.`,
      },
      {
        id: '2',
        title: `You aren't ready to change course.`,
        description: `If the data shows your current path is generating consequences, you must be prepared to adjust your direction immediately.`,
      },
    ],
  },
];

export const WhoThis = () => {
  return (
    <section className='max-w-[1600px] mx-auto pt-[80px] pb-[90px] px-2 sm:px-6 md:px-8 2xl:px-[180px] 2xl:py-[112px] 2xl:mt-[36px]'>
      <h2 className='text-h1 text-center mb-8 text-brand-deep md:text-left md:text-brand-black md:mb-[64px] font-canela font-thin'>
        WHO THIS IS FOR
      </h2>

      <div className='flex flex-col gap-[24px] bs:flex-row bs:gap-[48px]'>
        {content.map(({ title_end, title_mid, title_start, list, id }) => (
          <ul key={id} className='flex flex-col gap-y-[32px]'>
            <h4 className='font-canela font-light text-h2 text-brand-black-100'>
              {title_start} <span className='text-brand-primary'>{title_mid}</span> {title_end}
            </h4>

            {list.map((subItem) => (
              <li key={subItem.id} className='font-lato flex gap-x-[19px] text-[15px]/[24px] text-[#41444E]'>
                <div className='w-[20px] h-[20px] pt-2'>
                  <ArrowIC />
                </div>

                <div>
                  <h4 className='font-bold mb-2'>{subItem.title}</h4>
                  <p>{subItem.description}</p>
                </div>
              </li>
            ))}
          </ul>
        ))}
      </div>
    </section>
  );
};
