import { ArrowList } from '@/components/ui/lists';
import { Flex } from 'antd';
import Image from 'next/image';

export interface IVIPImmersionOverview {
  id: number;
  title: string;
  isReversed?: boolean;
  subtitle?: string;
  description: string | string[];
  list?: string[];
  imgSrc: string;
  additional_list?: string[];
  subtitle_bottom?: string;
}

interface CardProps extends IVIPImmersionOverview {} // eslint-disable-line @typescript-eslint/no-empty-object-type

const Card = (props: CardProps) => {
  const { id, title, subtitle, description, list, isReversed, imgSrc, additional_list, subtitle_bottom } = props;

  return (
    <article
      key={id}
      className='flex flex-col items-center justify-center lg:items-start lg:flex-row lg:justify-between lg:gap-[60px] xl:gap-[90px] 2xl:gap-[130px]'
      style={{
        flexDirection: isReversed ? 'row-reverse' : 'row',
      }}
    >
      <div className='flex-1 max-w-[496px] aspect-[496/761] rounded-[100px] overflow-hidden'>
        <Image src={imgSrc} width={496} height={761} alt='' className='w-full h-auto' />
      </div>{' '}
      <Flex vertical className='flex-1'>
        <h4 className='text-[32px]/[120%] text-left font-canela font-light mb-7 text-brand-deep'>{title}</h4>

        {subtitle && (
          <h5 className='text-[32px]/[120%] text-left font-canela font-light mb-6 text-brand-deep'>{subtitle}</h5>
        )}

        {list && <ArrowList list={list} />}

        {description && <p className='text-[17px]/[26px] text-left font-lato mb-11 text-brand-gray'>{description}</p>}

        {additional_list && <ArrowList list={additional_list} />}

        {subtitle_bottom && (
          <h4 className='text-[32px]/[120%] max-w-[500px] mt-[48px] text-left font-canela font-light'>
            {subtitle_bottom}
          </h4>
        )}
      </Flex>
    </article>
  );
};

interface Props {
  overviews: IVIPImmersionOverview[];
}

export const VIPImmersionOverview = ({ overviews }: Props) => {
  return (
    <section
      style={{
        backgroundImage: "url('/images/programs/self-guided-transformation/mechanics_section_bg.png')",
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
      }}
    >
      <div className='max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-[112px] 2xl:px-[180px] relative py-[80px] lg:py-[110px]'>
        <Flex vertical gap={120}>
          {overviews.map((overview) => (
            <Card key={overview.id} {...overview} />
          ))}
        </Flex>
      </div>
    </section>
  );
};
