import Button from '@/components/ui/Button';

export const ThankYou = () => {
  return (
    <div className='min-h-screen flex items-center justify-center bg-brand-blush px-6 py-20'>
      <div className='text-center max-w-[520px]'>
        <h1 className='font-canela font-thin text-[60px]/[126%] text-brand-deep '>You’re all set.</h1>
        <p className='my-6 font-lato text-body text-brand-gray leading-[1.6]'>
          Your data has been received. Lily will use it to calculate your personalized reports, which will be delivered
          after you complete Modules 10–12. Now go back to your community and start Module 1 — the sooner you begin, the
          sooner you’ll get your reports.
        </p>

        <Button target='_blank' rel='noreferrer' href='https://lilys-community-6395bb.circle.so/'>
          Back to My Protocol
        </Button>
      </div>
    </div>
  );
};
