import { ArrowIC } from '@/components/icons';
import { Flex } from 'antd';

export const ArrowList = ({ list }: { list: string[] }) => (
  <ul className='text-[17px]/[26px] font-lato text-brand-gray'>
    {list.map((listItem) => (
      <Flex key={listItem} gap={12} align='center'>
        <ArrowIC />
        <p>{listItem}</p>
      </Flex>
    ))}
  </ul>
);
