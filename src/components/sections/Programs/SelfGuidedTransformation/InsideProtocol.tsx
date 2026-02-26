import Button from '@/components/ui/Button';
import { ImageContainer } from '@/components/ui/containers/ImageContainer';
import { ArrowList } from '@/components/ui/lists';

const content = {
  title_top: 'Inside The Protocol',
  title_bottom: 'Essentials, you will:',
  list: [
    'Reconnect with your femininity',
    'Learn how to create emotional closeness and deep attraction',
    'Bring attention and passion back into your relationship',
    'Become the woman your man desires and chooses every day',
    'Understand why past relationships didn’t work',
    'Release old attachments and unfinished emotional stories',
    'Heal patterns that sabotage love',
    'Build healthy, stable, passionate relationships',
    'Restore connection and feelings in existing relationships',
    'Gain clarity on whether to stay, rebuild, or move on',
    'Become emotionally prepared to meet your ideal partner',
  ],
  descriptions: [
    'You stop repeating painful cycles.',
    'You start choosing differently.',
    'Love stops feeling complicated.',
  ],
  highlight: 'It starts feeling safe, alive, and fulfilling.',
  link: {
    href: '#',
    label: 'SECURE YOUR SPOT',
  },
};

export const InsideProtocol = () => {
  const { title_top, title_bottom, list, descriptions, highlight, link } = content;

  return (
    <section>
      <div className='max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-[112px] 2xl:px-[180px] relative py-[80px] lg:py-[112px]'>
        <ImageContainer src='/images/lily/lily_2.png' alt='Lily' height={832}>
          <div className='flex flex-col'>
            <h2 className='text-[32px]/[126%] md:text-[48px] font-light font-canela mt-11 mb-6 text-brand-deep'>
              {title_top}
              <br />
              {title_bottom}
            </h2>
            <ArrowList list={list} mb={40} />
            <ul className='text-center md:text-left text-[24px]/[126%] md:text-[32px] font-light font-canela mb-5 text-brand-deep'>
              {descriptions.map((description, index) => (
                <li key={index}>{description}</li>
              ))}
            </ul>

            <p className='text-center md:text-left text-[24px]/[126%] md:text-[32px] font-light font-canela text-brand-primary mb-[60px]'>
              {highlight}
            </p>
            <Button href={link.href} className='self-center md:self-start md:px-[80px] xl:px-[98px] px-[98px]'>
              {link.label}
            </Button>
          </div>
        </ImageContainer>
      </div>
    </section>
  );
};
