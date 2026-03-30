import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  backgroundImage?: string;
  sectionClasses?: string;
  wrapperClasses?: string;
  bottomBackgroundImage?: string;
  topFade?: boolean;
  id?: string;
}

export const Section = (props: Props) => {
  const { children, backgroundImage, bottomBackgroundImage, topFade, sectionClasses = '', wrapperClasses = '', id = '' } = props;
  const style = backgroundImage
    ? {
        backgroundImage: `url('${backgroundImage}')`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
      }
    : {};
  return (
    <section id={id} className={`relative ${sectionClasses}`} style={style}>
      {topFade && (
        <div className='pointer-events-none absolute inset-x-0 top-0 h-[200px] bg-gradient-to-b from-white to-transparent z-20' />
      )}
      <div
        className={`container relative z-10 py-4 md:py-[70px] lg:py-[110px] ${wrapperClasses}`}
      >
        {children}
      </div>
      {bottomBackgroundImage && (
        <div
          className='w-full h-[530px] absolute bottom-0 -z-10'
          style={{
            background: `radial-gradient(120% 100% at 50% 0%,#ffffff 0%,#FFF4F1 20%)`,
            WebkitMaskImage: 'linear-gradient(to top, black 70%, transparent 100%)',
            maskImage: 'linear-gradient(to top, black 70%, transparent 100%)',
          }}
        >
          <div
            className='absolute inset-0'
            style={{
              backgroundImage: `url('${bottomBackgroundImage}')`,
              backgroundSize: 'cover',
              opacity: 0.25,
              mixBlendMode: 'overlay',
            }}
          />
        </div>
      )}
    </section>
  );
};
