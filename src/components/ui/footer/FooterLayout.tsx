import { FooterLabel } from './FooterLabel';
import { FooterNavigation } from './FooterNavigation';

interface Props {
  className?: string;
  withNavigation?: boolean;
}

const FooterLayout = (props: Props) => {
  const { className, withNavigation = true } = props;

  return (
    <footer className={`bg-white py-[22px] px-4 md:px-6 lg:px-8 ${className}`}>
      <div className='max-w-[1600px] mx-auto px-[180px]'>
        <FooterLabel mb={10} />
        {withNavigation && <FooterNavigation />}
      </div>
    </footer>
  );
};

export default FooterLayout;
