import Button from '@/components/ui/Button';
import { ImageContainer } from '@/components/ui/containers/ImageContainer';
import { Section } from '@/components/ui/containers/section';
import { ArrowList } from '@/components/ui/lists';
import { ESSENTIALS_LINKS } from '@/static/links';

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
    href: ESSENTIALS_LINKS.INSIDE_LINK.href,
    label: ESSENTIALS_LINKS.INSIDE_LINK.label,
  },
};

export const InsideProtocol = () => {
  const { title_top, title_bottom, list, descriptions, highlight, link } = content;

  return (
    <Section wrapperClasses='py-[64px] px-3'>
      <div>
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
            <Button
              href={link.href}
              className='self-center md:self-start md:px-[80px] xl:px-[98px] px-[98px]'
              trackingData={{
                cta_name: 'sgt_inside_protocol_cta',
                cta_text: link.label,
                cta_target_url: link.href,
                cta_location: 'inside_protocol',
              }}
            >
              {link.label}
            </Button>
          </div>
        </ImageContainer>
      </div>
    </Section>
  );
};
