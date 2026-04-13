import { Section } from '@/components/ui/containers/section';
import Image from 'next/image';

const testimonials = [
  { src: '/images/testimonials/decode/testimonial_1.png', showOnMobile: true },
  { src: '/images/testimonials/decode/testimonial_2.png', showOnMobile: true },
  { src: '/images/testimonials/decode/testimonial_3.png', showOnMobile: true },
  { src: '/images/testimonials/decode/testimonial_4.png', showOnMobile: true },
  { src: '/images/testimonials/decode/testimonial_5.png', showOnMobile: true },
  { src: '/images/testimonials/decode/testimonial_6.png', showOnMobile: true },
];

export default function TestimonialsSection() {
  return (
    <Section sectionClasses='bg-[#1A1A1A] py-16 md:py-[51px] '>
      <div className='columns-1 md:columns-2 lg:columns-3 gap-6 md:gap-8'>
        {testimonials.map((item, i) => (
          <div
            key={i}
            className={`
                mb-6 md:mb-8 break-inside-avoid overflow-hidden rounded-2xl
                ${item.showOnMobile ? '' : 'hidden md:block'}
              `}
          >
            <Image
              src={item.src}
              alt={`Testimonial ${i + 1}`}
              width={1200}
              height={1200}
              className='w-full h-auto'
              quality={85}
            />
          </div>
        ))}
      </div>
    </Section>
  );
}
