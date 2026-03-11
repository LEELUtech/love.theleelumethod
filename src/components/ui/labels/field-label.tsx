export const FieldLabel = ({ label, required }: { label: string; required?: boolean }) => {
  return (
    <label className='block font-lato text-[15px] font-normal text-[#41444E] mb-[6px]'>
      {label}
      {required && <span className='text-brand-primary ml-0.5'>*</span>}
      {!required && '(optional)'}
    </label>
  );
};
