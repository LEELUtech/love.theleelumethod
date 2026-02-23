import FooterLayout from '@/components/ui/footer/index';
import Header from '@/components/ui/Header';

const OnePageLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Header className='bg-white z-30 relative max-w-[1600px] mx-auto' />
      <main>{children}</main>
      <FooterLayout withNavigation={false} />
    </>
  );
};

export default OnePageLayout;
