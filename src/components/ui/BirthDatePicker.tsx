'use client';

import React, { useState, useRef, useEffect } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { CalendarIC } from '../icons';

interface Props {
  placeholder: string;
  onChange: (val: Dayjs | null) => void;
}

type Step = 'year' | 'month' | 'day';

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const MONTHS_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DAYS_OF_WEEK = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const YEARS = Array.from({ length: 91 }, (_, i) => 2010 - i);

export default function BirthDatePicker({ placeholder, onChange }: Props) {
  const [inputValue, setInputValue] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<Step>('year');
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const tryParseDate = (digits: string): Dayjs | null => {
    if (digits.length !== 8) return null;
    const month = parseInt(digits.slice(0, 2));
    const day = parseInt(digits.slice(2, 4));
    const year = parseInt(digits.slice(4, 8));
    const date = dayjs(`${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`);
    if (!date.isValid() || date.month() + 1 !== month || date.date() !== day) return null;
    return date;
  };

  const sanitizeDigits = (raw: string): string => {
    let result = '';
    for (let i = 0; i < raw.length && i < 8; i++) {
      const d = parseInt(raw[i]);
      if (isNaN(d)) continue;

      // Month digit 1: only 0-1
      if (i === 0 && d > 1) continue;
      // Month digit 2: if first is 0 → 1-9, if first is 1 → 0-2
      if (i === 1) {
        const m1 = parseInt(result[0]);
        if (m1 === 0 && d === 0) continue;
        if (m1 === 1 && d > 2) continue;
      }
      // Day digit 1: only 0-3
      if (i === 2 && d > 3) continue;
      // Day digit 2: if first is 3 → 0-1, if first is 0 → 1-9
      if (i === 3) {
        const d1 = parseInt(result[2]);
        if (d1 === 3 && d > 1) continue;
        if (d1 === 0 && d === 0) continue;
      }

      result += raw[i];
    }
    return result;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '');
    const digits = sanitizeDigits(raw);
    let formatted = digits.slice(0, 2);
    if (digits.length >= 3) formatted += '/' + digits.slice(2, 4);
    if (digits.length >= 5) formatted += '/' + digits.slice(4, 8);
    setInputValue(formatted);
    onChange(tryParseDate(digits));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && (inputValue.endsWith('/') || inputValue.length === 3 || inputValue.length === 6)) {
      e.preventDefault();
      const newVal = inputValue.slice(0, -1);
      setInputValue(newVal);
      onChange(null);
    }
  };

  const openPopup = () => {
    if (isOpen) {
      setIsOpen(false);
      return;
    }
    setIsOpen(true);
    setStep('year');
    setSelectedYear(null);
    setSelectedMonth(null);
  };

  const handleYearSelect = (year: number) => {
    setSelectedYear(year);
    setStep('month');
  };

  const handleMonthSelect = (month: number) => {
    setSelectedMonth(month);
    setStep('day');
  };

  const handleDaySelect = (day: number) => {
    if (!selectedYear || selectedMonth === null) return;
    const month = selectedMonth + 1;
    const mm = String(month).padStart(2, '0');
    const dd = String(day).padStart(2, '0');
    const formatted = `${mm}/${dd}/${selectedYear}`;
    setInputValue(formatted);
    const date = dayjs(`${selectedYear}-${mm}-${dd}`);
    onChange(date.isValid() ? date : null);
    setIsOpen(false);
    setStep('year');
    setSelectedYear(null);
    setSelectedMonth(null);
  };

  const renderYearPicker = () => (
    <div>
      <p className='text-center text-[13px] font-semibold font-lato text-[#41444E] mb-3'>Select Year</p>
      <div className='grid grid-cols-4 gap-1 max-h-[200px] overflow-y-auto pr-1'>
        {YEARS.map(year => (
          <button
            key={year}
            type='button'
            className='px-1 py-1.5 text-[13px] font-lato rounded-[6px] hover:bg-[#F2E1E2] hover:text-brand-primary transition-colors'
            onClick={() => handleYearSelect(year)}
          >
            {year}
          </button>
        ))}
      </div>
    </div>
  );

  const renderMonthPicker = () => (
    <div>
      <div className='flex items-center mb-3'>
        <button type='button' onClick={() => setStep('year')} className='text-[12px] font-lato text-[#757986] hover:text-brand-primary transition-colors'>
          ← {selectedYear}
        </button>
        <p className='flex-1 text-center text-[13px] font-semibold font-lato text-[#41444E]'>Select Month</p>
      </div>
      <div className='grid grid-cols-3 gap-1.5'>
        {MONTHS_SHORT.map((month, i) => (
          <button
            key={month}
            type='button'
            className='px-2 py-2 text-[13px] font-lato rounded-[6px] hover:bg-[#F2E1E2] hover:text-brand-primary transition-colors'
            onClick={() => handleMonthSelect(i)}
          >
            {month}
          </button>
        ))}
      </div>
    </div>
  );

  const renderDayPicker = () => {
    if (!selectedYear || selectedMonth === null) return null;
    const daysInMonth = dayjs(`${selectedYear}-${selectedMonth + 1}-01`).daysInMonth();
    const firstDay = dayjs(`${selectedYear}-${selectedMonth + 1}-01`).day();
    const cells: React.ReactNode[] = [];

    for (let i = 0; i < firstDay; i++) {
      cells.push(<div key={`e-${i}`} />);
    }
    for (let d = 1; d <= daysInMonth; d++) {
      cells.push(
        <button
          key={d}
          type='button'
          className='w-8 h-8 text-[13px] font-lato rounded-full hover:bg-[#F2E1E2] hover:text-brand-primary transition-colors flex items-center justify-center mx-auto'
          onClick={() => handleDaySelect(d)}
        >
          {d}
        </button>
      );
    }

    return (
      <div>
        <div className='flex items-center mb-3'>
          <button type='button' onClick={() => setStep('month')} className='text-[12px] font-lato text-[#757986] hover:text-brand-primary transition-colors'>
            ← {MONTHS_SHORT[selectedMonth]}
          </button>
          <p className='flex-1 text-center text-[13px] font-semibold font-lato text-[#41444E]'>
            {MONTHS[selectedMonth]} {selectedYear}
          </p>
        </div>
        <div className='grid grid-cols-7 gap-0.5 text-center'>
          {DAYS_OF_WEEK.map(d => (
            <div key={d} className='text-[11px] font-lato text-[#757986] mb-1'>{d}</div>
          ))}
          {cells}
        </div>
      </div>
    );
  };

  return (
    <div ref={containerRef} className='relative w-full'>
      <div className='relative'>
        <input
          type='text'
          inputMode='numeric'
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          maxLength={10}
          className='w-full rounded-[6px] border border-[#C3C6D1] px-[18px] py-[10px] font-lato text-body text-[#757986] pr-12 outline-none focus:border-[#9ca3af] transition-colors bg-white'
        />
        <button
          type='button'
          onClick={openPopup}
          className='absolute right-[14px] top-1/2 -translate-y-1/2'
        >
          <CalendarIC className='text-[#1C1B1F]' />
        </button>
      </div>

      {isOpen && (
        <div className='absolute z-50 top-full mt-1 left-0 right-0 bg-white border border-[#C3C6D1] rounded-[8px] p-3 shadow-lg'>
          {step === 'year' && renderYearPicker()}
          {step === 'month' && renderMonthPicker()}
          {step === 'day' && renderDayPicker()}
        </div>
      )}
    </div>
  );
}
