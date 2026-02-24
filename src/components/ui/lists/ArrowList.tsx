import { ArrowIC } from '@/components/icons';
import { Flex } from 'antd';

interface Props {
  list: string[];
  mb?: number;
}
export const ArrowList = ({ list, mb = 0 }: Props) => (
  <ul className='text-[17px]/[26px] font-lato text-brand-gray' style={{ marginBottom: mb }}>
    {list.map((listItem) => (
      <Flex key={listItem} gap={12} align='center'>
        <ArrowIC />
        <p>{listItem}</p>
      </Flex>
    ))}
  </ul>
);
