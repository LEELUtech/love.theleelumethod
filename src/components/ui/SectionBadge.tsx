import Image from 'next/image';
import RotateOnView from './RotateOnView';

interface Props {
  bottom?: number;
  position?: 'center' | 'right';
  size?: 'md' | 'lg';
  color?: 'pink' | 'coral';
}

export const SectionBadge = ({ bottom = -40, position = 'center', size = 'lg', color = 'pink' }: Props) => {
  const positionClasses = {
    center: 'left-1/2 -translate-x-1/2',
    right: 'right-[16px] ',
  };

  const sizeClasses = {
    md: `w-[89px] h-[112px]`,
    lg: `w-[107px] h-[148px] xl:w-[142px] xl:h-[196px]`,
  };

  const imageSizes = {
    md: 'w-[48px] h-[47px]',
    lg: 'w-[67px] h-[65px] xl:w-[88.27px] xl:h-[86.35px]',
  };

  const bg = color === 'coral' ? 'bg-[#E0B2A4]' : 'bg-[#EB4F68]';

  return (
    <div
      className={`
                absolute ${positionClasses[position]} 
                flex items-center justify-center overflow-hidden
                ${bg}
                before:absolute before:inset-0 before:bg-[url('/icons/noise.png')]
                before:opacity-15 before:mix-blend-overlay
                rounded-[300px]
                ${sizeClasses[size]}
                z-10
              `}
      style={{
        bottom: bottom,
      }}
    >
      <RotateOnView duration={17} amount={0.4} ease='linear' repeat={true}>
        <Image src='/leelu_logo.svg' alt='' width={55} height={55} className={`${imageSizes[size]} filter invert`} quality={85} />
      </RotateOnView>
    </div>
  );
};
