export const metadata = { title: "Legal | The Leelu Method" };

import Header from '@/components/ui/Header';

type Section = {
  title: string;
  body?: string;
  intro?: string;
  list?: string[];
};

type Document = {
  heading: string;
  date: string;
  intro?: string;
  sections: Section[];
};

const documents: Document[] = [
  {
    heading: 'Privacy Policy',
    date: 'Last updated: March 30, 2026',
    intro:
      'The Leelu Method, operated by Leelu Tech Inc ("we," "us," or "our"), offers various programs and deliverables including the Decoded Love Masterclass, Compatibility Code Report, 7 Secrets to Mend a Broken Heart, The Relationship Protocol, and other products and services. This Privacy Policy applies across all our offerings.',
    sections: [
      {
        title: 'Information We Collect',
        intro: 'When you sign up for our free masterclass, purchase products, or contact us, we may collect:',
        list: ['Name', 'Email address', 'Any other information you voluntarily provide'],
      },
      {
        title: 'How We Use Your Information',
        intro: 'We use your data to:',
        list: [
          'Deliver the free Decoded Love Masterclass and any other programs or deliverables you request',
          'Send registration details, access links, reminders, and related communications',
          'Provide customer support and respond to inquiries',
          'Improve our products and services',
        ],
      },
      {
        title: 'Sharing Your Information',
        body: 'We do not sell or rent your personal information.\nWe may share it only with trusted service providers (such as email platforms) strictly necessary to deliver our programs. These providers are bound by confidentiality.',
      },
      {
        title: 'Your Rights',
        body: 'You can unsubscribe from emails anytime using the link in the message.\nTo access, update, or delete your information, contact us at support@theleelumethod.com.',
      },
      {
        title: 'Changes to This Policy',
        body: 'We may update this policy and will post the new version here with the updated date.',
      },
    ],
  },
  {
    heading: 'Disclaimer',
    date: 'Last updated: March 23, 2026',
    sections: [
      {
        title: 'Website Disclaimer',
        body: `The information provided by Leelu Tech Inc ("we," "us," or "our") on theleelumethod.com (the "Site") and our mobile application is for general informational purposes only. All information on the Site and our mobile application is provided in good faith, however we make no representation or warranty of any kind, express or implied, regarding the accuracy, adequacy, validity, reliability, availability, or completeness of any information on the Site or our mobile application. UNDER NO CIRCUMSTANCE SHALL WE HAVE ANY LIABILITY TO YOU FOR ANY LOSS OR DAMAGE OF ANY KIND INCURRED AS A RESULT OF THE USE OF THE SITE OR OUR MOBILE APPLICATION OR RELIANCE ON ANY INFORMATION PROVIDED ON THE SITE AND OUR MOBILE APPLICATION. YOUR USE OF THE SITE AND OUR MOBILE APPLICATION AND YOUR RELIANCE ON ANY INFORMATION ON THE SITE AND OUR MOBILE APPLICATION IS SOLELY AT YOUR OWN RISK.`,
      },
      {
        title: 'External Links Disclaimer',
        body: `The Site and our mobile application may contain (or you may be sent through the Site or our mobile application) links to other websites or content belonging to or originating from third parties or links to websites and features in banners or other advertising. Such external links are not investigated, monitored, or checked for accuracy, adequacy, validity, reliability, availability, or completeness by us. WE DO NOT WARRANT, ENDORSE, GUARANTEE, OR ASSUME RESPONSIBILITY FOR THE ACCURACY OR RELIABILITY OF ANY INFORMATION OFFERED BY THIRD-PARTY WEBSITES LINKED THROUGH THE SITE OR ANY WEBSITE OR FEATURE LINKED IN ANY BANNER OR OTHER ADVERTISING. WE WILL NOT BE A PARTY TO OR IN ANY WAY BE RESPONSIBLE FOR MONITORING ANY TRANSACTION BETWEEN YOU AND THIRD-PARTY PROVIDERS OF PRODUCTS OR SERVICES.`,
      },
      {
        title: 'Professional Disclaimer',
        body: `The Site cannot and does not contain medical/health advice. The medical/health information is provided for general informational and educational purposes only and is not a substitute for professional advice. Accordingly, before taking any actions based upon such information, we encourage you to consult with the appropriate professionals. We do not provide any kind of medical/health advice. THE USE OR RELIANCE OF ANY INFORMATION CONTAINED ON THE SITE OR OUR MOBILE APPLICATION IS SOLELY AT YOUR OWN RISK.`,
      },
    ],
  },
];

function SectionBlock({ section }: { section: Section }) {
  return (
    <div>
      <h2 className='font-canela font-thin text-brand-deep text-[28px] lg:text-[36px] leading-[130%] mb-4'>
        {section.title}
      </h2>
      {section.intro && (
        <p className='font-lato text-[16px]/[28px] text-brand-gray mb-3'>{section.intro}</p>
      )}
      {section.list && (
        <ul className='list-disc pl-6 font-lato text-[16px]/[28px] text-brand-gray'>
          {section.list.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      )}
      {section.body &&
        section.body.split('\n').map((line, i) => (
          <p key={i} className={`font-lato text-[16px]/[28px] text-brand-gray ${i > 0 ? 'mt-3' : ''}`}>
            {line}
          </p>
        ))}
    </div>
  );
}

export default function LegalPage() {
  return (
    <main className='bg-brand-white min-h-screen'>
      <Header />
      <div className='container px-4 sm:px-6 lg:px-[40px] pt-[120px] pb-[80px] max-w-[800px]'>
        <p className='font-lato text-[12px] tracking-widest uppercase text-brand-gray mb-12'>
          Last updated: March 30, 2026
        </p>
        {documents.map((doc, i) => (
          <div key={doc.heading} className={i > 0 ? 'mt-24' : ''}>
            <h1 className='font-canela font-thin text-brand-deep text-[56px] lg:text-[72px] leading-[110%] mb-8'>
              {doc.heading}
            </h1>
            {doc.intro && (
              <p className='font-lato text-[16px]/[28px] text-brand-gray mb-16'>{doc.intro}</p>
            )}
            <div className='flex flex-col gap-12'>
              {doc.sections.map((section) => (
                <SectionBlock key={section.title} section={section} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
