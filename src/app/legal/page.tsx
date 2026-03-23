import Header from '@/components/ui/Header';

const sections = [
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
];

export default function LegalPage() {
  return (
    <main className='bg-brand-white min-h-screen'>
      <Header />
      <div className='container px-4 sm:px-6 lg:px-[40px] pt-[120px] pb-[80px] max-w-[800px]'>
        <p className='font-lato text-[12px] tracking-widest uppercase text-brand-gray mb-4'>
          Last updated March 23, 2026
        </p>
        <h1 className='font-canela font-thin text-brand-deep text-[56px] lg:text-[72px] leading-[110%] mb-16'>
          Disclaimer
        </h1>

        <div className='flex flex-col gap-12'>
          {sections.map((section) => (
            <div key={section.title}>
              <h2 className='font-canela font-thin text-brand-deep text-[28px] lg:text-[36px] leading-[130%] mb-4'>
                {section.title}
              </h2>
              <p className='font-lato text-[16px]/[28px] text-brand-gray'>
                {section.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
