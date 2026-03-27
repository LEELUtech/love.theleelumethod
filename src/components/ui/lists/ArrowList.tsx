import { ArrowIC } from '@/components/icons';
import { Flex } from 'antd';

interface Props {
  list: string[];
  mb?: number;
  type?: 'light' | 'dark';
  boldFirst?: boolean;
}
export const ArrowList = ({ list, mb = 0, type = 'dark', boldFirst = false }: Props) => {
  const textColor = type === 'dark' ? 'text-brand-gray' : 'text-brand-gray-100';

  return (
    <ul className={`text-[17px]/[26px] gap-1 font-lato ${textColor}`} style={{ marginBottom: mb }}>
      {list.map((listItem, index) => (
        <Flex key={listItem} gap={12}>
          <div className='w-2.5 h-[9px]'>
            <ArrowIC className='mt-2' />
          </div>
          <p className={`text-left${boldFirst && index === 0 ? ' font-bold' : ''}`}>{listItem}</p>
        </Flex>
      ))}
    </ul>
  );
};
