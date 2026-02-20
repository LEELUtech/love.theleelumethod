import { FooterLabel } from './FooterLabel';
import { FooterNavigation } from './FooterNavigation';

interface Props {
  className?: string;
  withNavigation?: boolean;
}

const FooterLayout = (props: Props) => {
  const { className, withNavigation = true } = props;

  return (
    <footer className={`bg-white py-8 md:py-12 lg:py-16 px-4 md:px-6 lg:px-8 ${className}`}>
      <div className='container mx-auto px-4'>
        <FooterLabel mb={17} />
        {withNavigation && <FooterNavigation />}
      </div>
    </footer>
  );
};

export default FooterLayout;
