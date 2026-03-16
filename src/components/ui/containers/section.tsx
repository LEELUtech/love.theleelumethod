import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  backgroundImage?: string;
  sectionClasses?: string;
  wrapperClasses?: string;
  bottomBackgroundImage?: string;
  id?: string;
}

export const Section = (props: Props) => {
  const { children, backgroundImage, bottomBackgroundImage, sectionClasses = '', wrapperClasses = '', id = '' } = props;
  const style = backgroundImage
    ? {
        backgroundImage: `url('${backgroundImage}')`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
      }
    : {};
  return (
    <section id={id} className={sectionClasses} style={style}>
      <div
        className={`relative z-10 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-[40px] 4xl:px-[180px] py-4 md:py-[70px] lg:py-[110px] ${wrapperClasses}`}
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
