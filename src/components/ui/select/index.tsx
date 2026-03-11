interface Props {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  placeholder: string;
}

export const Select = ({ value, onChange, options, placeholder }: Props) => {
  return (
    <div className='relative'>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className='w-full appearance-none rounded-[6px] border border-[#C3C6D1] bg-white px-[18px] py-[10px] font-lato text-body text-[#757986] outline-none pr-10'
      >
        <option value=''>{placeholder}</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>

      <span className='pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#757986]'>
        <svg width='12' height='8'>
          <path d='M1 1L6 6L11 1' stroke='currentColor' strokeWidth='1.5' />
        </svg>
      </span>
    </div>
  );
};
