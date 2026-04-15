import Button, { ButtonVariant } from '@/components/ui/Button';
import RotateOnView from '@/components/ui/RotateOnView';
import Image from 'next/image';

export interface IFooterPromo {
  description: string[];
  subtitle?: string;
  link?: {
    href: string;
    label: string;
    variant?: ButtonVariant;
    isBlank?: boolean;
  };
  button?: {
    label: string;
  };

  title_top?: string;
  title_bottom?: string;
}

interface Props extends IFooterPromo {
  buttonClassName?: string;
  wrapperClassName?: string;
}

export const FooterPromo = (props: Props) => {
  const {
    description,
    subtitle,
    link,
    buttonClassName,
    wrapperClassName,
    button,
    title_top = 'I don’t guess.',
    title_bottom = 'I calculate.',
  } = props;

  const target = link?.isBlank ? '_blank' : '_self';
  const rel = link?.isBlank ? 'noreferrer' : undefined;

  return (
    <section className='bg-brand-white' id='footer-promo'>
      <div
        className={`max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-[60px] 2xl:px-[80px] 4xl:px-[180px] relative py-[80px] lg:py-[110px] ${wrapperClassName}`}
      >
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-10 lg:gap-12 items-center'>
          <div className='relative w-full max-w-[400px] md:max-w-[480px] lg:max-w-[551px] mx-auto lg:mx-0'>
            <div className="absolute left-[-10px] top-[-30px] md:left-[-40px] md:top-[-50px] lg:top-[-60px] lg:left-[-60px] flex items-center justify-center overflow-hidden bg-[#EB4F68] before:absolute before:inset-0 before:bg-[url('/icons/noise.png')] before:opacity-15 before:mix-blend-overlay rounded-[300px] w-[80px] h-[100px] md:w-[100px] md:h-[126px] lg:w-[134px] lg:h-[168px] z-10">
              <RotateOnView duration={17} amount={0.4} ease='linear' repeat={true}>
                <Image
                  src='/icons/ornament_2/ornament_2_light.svg'
                  alt=''
                  width={83}
                  height={83}
                  className='w-[65px] h-[65px] md:w-[65px] md:h-[65px] lg:w-[83px] lg:h-[83px]'
                  quality={85}
                />
              </RotateOnView>
            </div>

            <div className='relative w-full aspect-[551/748] rounded-[110px] overflow-hidden'>
              <video
                src='https://firebasestorage.googleapis.com/v0/b/leelu-tech.firebasestorage.app/o/landingVideos%2Flanding_video_3.mp4?alt=media&token=d412cfaa-895b-4ecc-82aa-94ec4684a67d'
                autoPlay
                muted
                loop
                playsInline
                className='absolute inset-0 w-full h-full object-cover'
              />
            </div>
          </div>

          <div className='flex flex-col  lg:items-start text-left'>
            <h1 className='font-canela flex flex-col 3xl:flex-row 3xl:gap-3 font-light mb-8 md:mb-8 lg:mb-8 leading-[130%] text-brand-black text-[60px] md:text-[60px] lg:text-[60px]'>
              <span className='3xl:whitespace-nowrap'>{title_top}</span>
              <span className='3xl:whitespace-nowrap'>{title_bottom}</span>
            </h1>

            <div className='space-y-8 md:space-y-8 lg:space-y-8 mb-8 md:mb-8 lg:mb-10'>
              {description.map((d, idx) => (
                <p
                  key={idx}
                  className='text-[#5A5757] font-lato text-[17px]/[24px] lg:text-body md:leading-[26px] lg:leading-[28px]'
                >
                  {d}
                </p>
              ))}

              {subtitle && (
                <p className='font-canela font-light text-brand-deep  text-[32px]/[130%] tracking-normal'>{subtitle}</p>
              )}
            </div>

            {link && (
              <Button
                target={target}
                rel={rel}
                variant={link.variant}
                className={`!w-full !px-4 !max-w-[410px] ${buttonClassName}`}
                href={link.href}
                trackingData={{
                  cta_name: 'footer_promo_link_cta',
                  cta_text: link.label,
                  cta_target_url: link.href,
                  cta_location: 'footer_promo',
                }}
              >
                {link.label}
              </Button>
            )}

            {button && (
              <Button
                variant='dark'
                className={`!w-full !max-w-[380px] ${buttonClassName}`}
                trackingData={{
                  cta_name: 'footer_promo_button_cta',
                  cta_text: button.label,
                  cta_location: 'footer_promo',
                }}
              >
                {button.label}
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
