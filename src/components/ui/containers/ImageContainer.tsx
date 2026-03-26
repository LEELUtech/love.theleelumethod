import { Flex } from 'antd';
import Image from 'next/image';

interface Props {
  src: string;
  height: number;
  children: React.ReactNode;
  alt: string;
  mb?: number;
}

export const ImageContainer = ({ src, alt, height, children, mb = 0 }: Props) => {
  const aspectRatio = 496 / height;
  const maxHeight = height;

  return (
    <Flex
      justify='space-between'
      className='flex-col-reverse items-center lg:items-start lg:flex-row lg:gap-[60px] xl:gap-[90px] 2xl:gap-[130px]'
      style={{ marginBottom: mb }}
    >
      <div className='flex-1'>{children}</div>

      <div className={`flex-1 w-full max-w-[496px] rounded-[100px] overflow-hidden`} style={{ maxHeight, aspectRatio }}>
        <Image src={src} width={496} height={height} alt={alt} className='w-full h-full object-cover object-top' />
      </div>
    </Flex>
  );
};
