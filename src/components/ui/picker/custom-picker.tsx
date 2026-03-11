import { DatePicker } from 'antd';
import React from 'react';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import { DATE_FORMAT } from '@/utils/constants';
import { CalendarIC } from '@/components/icons';

const MASK = 'MM/DD/YYYY';

const mask = (raw: string): string => {
  const digits = raw.replace(/\D/g, '').slice(0, 8);
  let result = '';
  let di = 0;
  for (let i = 0; i < MASK.length && di < digits.length; i++) {
    if (MASK[i] === '/') {
      result += '/';
    } else {
      result += digits[di++];
    }
  }
  return result;
};

interface Props {
  placeholder?: string;
  onChange: (val: Dayjs | null) => void;
}

export const CustomPicker = ({ placeholder = MASK, onChange }: Props) => {
  const wrapRef = React.useRef<HTMLDivElement | null>(null);
  const [inputVal, setInputVal] = React.useState('');
  const [pickerVal, setPickerVal] = React.useState<Dayjs | null>(null);
  const [open, setOpen] = React.useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const masked = mask(e.target.value);
    setInputVal(masked);

    if (masked.length === MASK.length) {
      const parsed = dayjs(masked, DATE_FORMAT, true);

      if (parsed.isValid()) {
        setPickerVal(parsed);
        onChange(parsed);
      } else {
        setPickerVal(null);
        onChange(null);
      }
    } else {
      setPickerVal(null);
      onChange(null);
    }
  };

  function handlePickerChange(val: Dayjs | null) {
    setPickerVal(val);
    setInputVal(val ? val.format(DATE_FORMAT) : '');
    onChange(val);
  }

  return (
    <div ref={wrapRef} className='relative w-full'>
      <input
        type='text'
        value={inputVal}
        onChange={handleChange}
        onFocus={() => setOpen(true)}
        placeholder={placeholder}
        maxLength={MASK.length}
        className='absolute inset-0 z-10 w-full rounded-[6px] border border-[#C3C6D1] bg-transparent px-[18px] py-[10px] font-lato text-body text-[#1C1B1F] placeholder:text-[#757986] focus:outline-none'
      />
      <DatePicker
        getPopupContainer={() => wrapRef.current ?? document.body}
        open={open}
        onOpenChange={setOpen}
        value={pickerVal}
        classNames={{ popup: { root: 'date-popup-fit' } }}
        suffixIcon={
          <CalendarIC className='relative z-20 cursor-pointer text-[#1C1B1F]' onClick={() => setOpen(true)} />
        }
        className='!w-full !rounded-[6px] !border-[#C3C6D1] !px-[18px] !py-[10px] font-lato text-body text-[#757986] [&_input]:!opacity-0'
        placeholder={placeholder}
        format={DATE_FORMAT}
        onChange={handlePickerChange}
      />
    </div>
  );
};
