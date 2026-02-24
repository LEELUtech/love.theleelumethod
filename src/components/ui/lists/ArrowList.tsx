import { ArrowIC } from '@/components/icons';
import { Flex } from 'antd';

interface Props {
  list: string[];
  mb?: number;
}
export const ArrowList = ({ list, mb = 0 }: Props) => (
  <ul className='text-[17px]/[26px] gap-1 font-lato text-brand-gray' style={{ marginBottom: mb }}>
    {list.map((listItem) => (
      <Flex key={listItem} gap={12}>
        <div className='w-2.5 h-[9px]'>
          <ArrowIC className='mt-2' />
        </div>
        <p>{listItem}</p>
      </Flex>
    ))}
  </ul>
);
