import FooterLayout from '@/components/ui/footer/index';
import Header from '@/components/ui/Header';

const OnePageLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Header className='bg-white z-30 relative' />
      <main>{children}</main>
      <FooterLayout withNavigation={false} />
    </>
  );
};

export default OnePageLayout;
