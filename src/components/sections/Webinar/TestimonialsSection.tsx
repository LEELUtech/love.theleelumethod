import Image from "next/image";

const testimonials = [
  { src: "/images/testimonials/testimonial_1.png", showOnMobile: true },
  { src: "/images/testimonials/testimonial_2.png", showOnMobile: true },
  { src: "/images/testimonials/testimonial_3.png", showOnMobile: false },
  { src: "/images/testimonials/testimonial_4.png", showOnMobile: false },
  { src: "/images/testimonials/testimonial_5.png", showOnMobile: true },
  { src: "/images/testimonials/testimonial_6.png", showOnMobile: false },
];

export default function TestimonialsSection() {
  return (
    <section className="relative bg-[#1A1A1A] py-16 md:py-[51px] overflow-hidden">
      <div className="container px-4">
        {/* Masonry */}
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 md:gap-8">
          {testimonials.map((item, i) => (
            <div
              key={i}
              className={`
                mb-6 md:mb-8 break-inside-avoid overflow-hidden rounded-2xl
                ${item.showOnMobile ? "" : "hidden md:block"}
              `}
            >
              <Image
                src={item.src}
                alt={`Testimonial ${i + 1}`}
                width={1200}
                height={1200}
                className="w-full h-auto"
                quality={100}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
