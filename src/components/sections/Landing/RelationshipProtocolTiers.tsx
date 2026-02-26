import React from 'react';
import Button from '@/components/ui/Button';

function TierRow({ text, last = false, className = '' }: { text: string; last?: boolean; className?: string }) {
  return (
    <div className={`py-[20px] ${last ? 'border-b border-[#C6ABB3]' : 'border-b border-[#C6ABB3]'} ${className}`}>
      <p className='font-lato font-normal text-[18px] text-[#41444E] leading-[150%]'>{text}</p>
    </div>
  );
}

export default function RelationshipProtocolTiers() {
  return (
    <div className='mt-[50px] lg:mt-[120px]'>
      <h2 className='font-thin text-[48px] lg:text-[80px] leading-[126%] font-canela text-brand-deep text-center'>
        <span className='text-brand-primary'>Relationship Protocol</span> Tiers
      </h2>

      <p className='text-center font-lato font-normal text-[24px] lg:text-[24px] text-brand-deep mt-[26px]'>
        Next cohort starts <span className='text-brand-primary'>March 18</span>
      </p>

      <div className='lg:hidden mt-8 space-y-6'>
        <MobileTierCard
          title={
            <>
              The <br /> Essentials
            </>
          }
          pairs={[
            { label: 'Objective', value: 'Self-Paced Study' },
            { label: 'The Methodology', value: '12-Module Video Sequence' },
            {
              label: 'Community Support',
              value: '60-Day Circle Schedule + 2 Group Zooms',
            },
            { label: 'Personal Audit', value: 'DIY Workbook' },
            { label: '1:1 Strategy', value: 'None' },
            { label: 'Real-Time Support', value: 'None' },
            { label: 'Response Time', value: 'N/A' },
            { label: 'Partner Inclusion', value: 'No' },
            { label: 'Live Diagnostic', value: 'Audience Access' },
          ]}
          price='$697'
          buttonText='BEGIN PROTOCOL'
        />

        <MobileTierCard
          title={
            <>
              Guided <br /> Breakthrough
            </>
          }
          pairs={[
            { label: 'Objective', value: 'Diagnostic Precision' },
            { label: 'The Methodology', value: 'Essentials + 1:1 Analysis' },
            { label: 'Community Support', value: 'Same as Essentials' },
            { label: 'Personal Audit', value: 'Custom Dossier (PDF)' },
            { label: '1:1 Strategy', value: '(1) 90-Min Session' },
            { label: 'Real-Time Support', value: 'None' },
            { label: 'Response Time', value: 'N/A' },
            {
              label: 'Partner Inclusion',
              value: 'Optional (as analysis subject)',
            },
            { label: 'Live Diagnostic', value: 'Audience Access' },
          ]}
          price='$1,700'
          buttonText='GET DIAGNOSED'
          isPopular
        />

        <MobileTierCard
          title={
            <>
              VIP <br /> Immersion
            </>
          }
          pairs={[
            { label: 'Objective', value: 'Crisis Intervention' },
            { label: 'The Methodology', value: 'Essentials + Full Access' },
            { label: 'Community Support', value: 'Same as Essentials' },
            { label: 'Personal Audit', value: 'Full Partner/Duo Audit' },
            { label: '1:1 Strategy', value: '(4) Sessions: 90min + (3) 60min' },
            {
              label: 'Real-Time Support',
              value: 'Direct Voxer/WhatsApp (60 days)',
            },
            { label: 'Response Time', value: 'Priority (< 24hrs weekdays)' },
            {
              label: 'Partner Inclusion',
              value: 'Yes (Joint Sessions Available)',
            },
            { label: 'Live Diagnostic', value: 'Hot Seat Priority' },
          ]}
          price='$4,997'
          buttonText='APPLY FOR VIP'
        />
      </div>

      <div className='hidden lg:block'>
        <div className='mt-[40px] lg:mt-[60px] w-full'>
          <div className='grid grid-cols-1 lg:grid-cols-[240px_1fr_1fr_1fr] gap-5 lg:gap-6 items-start'>
            {/* Feature column */}
            <div className='hidden lg:block pt-[55px]'>
              <p className='font-canela font-light text-[27px] text-brand-black mb-[72px]'>Feature</p>

              <ul className='font-lato font-normal text-[24px] text-[#41444E] leading-[150%]'>
                <li className='mb-[32px]'>Objective</li>
                <li className='mb-[40px]'>The Methodology</li>
                <li className='mb-[48px]'>Community Support</li>
                <li className='mb-[35px]'>Personal Audit</li>
                <li className='mb-[30px]'>1:1 Strategy</li>
                <li className='mb-[30px]'>Real-Time Support</li>
                <li className='mb-[30px]'>Response Time</li>
                <li className='mb-[35px]'>Partner Inclusion</li>
                <li className='mb-[35px]'>Live Diagnostic</li>
              </ul>
            </div>

            {/* The Essentials */}
            <div className='rounded-[32px] bg-brand-white shadow-[0px_4px_20px_0px_rgba(0,0,0,0.1)] px-7 lg:px-8 pb-7 min-h-[966px] pt-[46px] flex flex-col'>
              <h3 className='font-canela font-thin text-[36px] text-brand-black text-center leading-[126%]'>
                The <br /> Essentials
              </h3>

              <div className='mt-8 space-y-0'>
                <TierRow text='Self-Paced Study' />
                <TierRow text='12-Module Video Sequence' />
                <TierRow text='60-Day Circle Schedule + 2 Group Zooms' />
                <TierRow text='DIY Workbook' />
                <TierRow text='None' />
                <TierRow text='None' />
                <TierRow text='N/A' />
                <TierRow text='No' />
                <TierRow text='Audience Access' last />
              </div>

              <p className='mt-6 font-canela font-light text-[32px] text-brand-deep text-center'>$697</p>

              <Button variant='dark' size='md' className='w-full xs:text-[12px] mt-auto'>
                BEGIN PROTOCOL
              </Button>
            </div>

            {/* Guided Breakthrough */}
            <div className='relative rounded-[32px] bg-brand-white shadow-[0px_4px_20px_0px_rgba(0,0,0,0.1)] px-7 lg:px-8 pb-7 min-h-[966px] pt-[46px] flex flex-col'>
              {/* BADGE */}
              <div
                className="
								absolute
								left-1/2
								top-[-20px]
								-translate-x-1/2

								flex items-center justify-center overflow-hidden
								bg-[#EB4F68]
								before:absolute before:inset-0 before:bg-[url('/icons/noise.png')] before:opacity-15 before:mix-blend-overlay

								rounded-[300px]
								w-[80px] h-[100px]
								md:w-[100px] md:h-[126px]
								lg:w-[154px] lg:h-[37px]

								z-10
							"
              >
                <span className='relative z-10 font-lato font-medium text-[14px] tracking-[1.2px] text-white text-center px-2'>
                  MOST POPULAR
                </span>
              </div>

              <h3 className='font-canela font-thin text-[36px] text-brand-black text-center leading-[126%]'>
                Guided <br /> Breakthrough
              </h3>

              <div className='mt-8 space-y-0'>
                <TierRow text='Diagnostic Precision' />
                <TierRow text='Essentials + 1:1 Analysis' />
                <TierRow text='Same as Essentials' className='pt-[31px] pb-[34px]' />
                <TierRow text='Custom Dossier (PDF)' />
                <TierRow text='(1) 90-Min Session' />
                <TierRow text='None' />
                <TierRow text='N/A' />
                <TierRow text='Optional (as analysis subject)' />
                <TierRow text='Audience Access' last />
              </div>

              <p className='mt-6 font-canela font-light text-[32px] text-brand-deep text-center'>$1,700</p>

              <Button variant='dark' size='md' className='w-full xs:text-[12px] mt-auto'>
                GET DIAGNOSED
              </Button>
            </div>

            {/* VIP Immersion */}
            <div className='relative rounded-[32px] bg-brand-white shadow-[0px_4px_20px_0px_rgba(0,0,0,0.1)] px-7 lg:px-8 pb-7 min-h-[966px] pt-[46px] flex flex-col'>
              <h3 className='font-canela font-thin text-[36px] text-brand-black text-center leading-[126%]'>
                VIP <br /> Immersion
              </h3>

              <div className='mt-8 space-y-0'>
                <TierRow text='Crisis Intervention' />
                <TierRow text='Essentials + Full Access' />
                <TierRow text='Same as Essentials' className='pt-[31px] pb-[34px]' />
                <TierRow text='Full Partner/Duo Audit' />
                <TierRow text='(4) Sessions: 90min + (3) 60min' className='pt-[7px] pb-[7px]' />
                <TierRow text='Direct Voxer/WhatsApp (60 days)' className='pt-[7px] pb-[7px]' />
                <TierRow text='Priority (< 24hrs weekdays)' />
                <TierRow text='Yes (Joint Sessions Available)' />
                <TierRow text='Hot Seat Priority' last />
              </div>

              <p className='mt-6 font-canela font-light text-[32px] text-brand-deep text-center'>$4,997</p>

              <Button variant='dark' size='md' className='w-full xs:text-[12px] mt-auto'>
                APPLY FOR VIP
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MobileTierPair({ label, value }: { label: string; value: string }) {
  return (
    <div className='py-6'>
      <p className='font-lato font-normal text-body text-[#41444E] leading-[140%]'>{label}</p>
      <p className='mt-0 font-lato font-bold text-[22px] text-[#41444E] leading-[140%]'>{value}</p>
    </div>
  );
}

function MobileTierCard({
  title,
  pairs,
  price,
  buttonText,
  isPopular,
}: {
  title: React.ReactNode;
  pairs: Array<{ label: string; value: string }>;
  price: string;
  buttonText: string;
  isPopular?: boolean;
}) {
  return (
    <div className='relative rounded-[28px] bg-brand-white shadow-[0px_4px_20px_0px_rgba(0,0,0,0.1)] px-6 pt-10 pb-6'>
      {/* popular badge (optional) */}
      {isPopular && (
        <div className='absolute -top-3 left-1/2 -translate-x-1/2'>
          <div className='rounded-full bg-[#EB4F68] text-white font-lato font-medium text-[10px] tracking-[1.2px] px-4 py-2 shadow-[0_6px_20px_rgba(0,0,0,0.12)]'>
            MOST POPULAR
          </div>
        </div>
      )}

      <h3 className='font-canela font-thin text-[42px] text-brand-black leading-[126%]'>{title}</h3>

      <div className='mt-4'>
        {pairs.map((p, idx) => (
          <MobileTierPair key={idx} label={p.label} value={p.value} />
        ))}
      </div>

      {/* divider */}
      <div className='mt-8 h-[1px] w-full bg-[#C6ABB3]' />

      <p className='mt-6 font-lato font-normal text-[24px] text-[#41444E]'>Investment</p>

      <p className='mt-[18px] font-canela font-normal text-[48px] leading-[126%] text-brand-deep'>{price}</p>

      <Button variant='dark' size='md' className='w-full xs:text-[12px] mt-[22px]'>
        {buttonText}
      </Button>
    </div>
  );
}
