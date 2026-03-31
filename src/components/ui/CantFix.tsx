'use client';

import Image from 'next/image';
import { useRef, useState } from 'react';
import Button, { ButtonVariant, TrackingData } from './Button';

interface Props {
  href: string;
  linkLabel: string;
  buttonVariant?: ButtonVariant;
  trackingData?: TrackingData;
}

export const CantFix = ({ href, linkLabel, buttonVariant = 'primary' }: Props) => {
  const [muted, setMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const toggleMute = () => {
    const next = !muted;
    setMuted(next);
    if (videoRef.current) videoRef.current.muted = next;
  };

  return (
    <article>
      <h2 className='font-thin text-[48px] lg:text-[60px] leading-[126%] font-canela text-brand-deep mb-[50px] lg:mb-[100px] text-center'>
        You cannot fix a pattern you cannot see.
      </h2>
      <div className='grid grid-cols-1 md:grid-cols-[4fr,3fr] gap-[43px] lg:gap-[102px] '>
        <div className='flex flex-col gap-5 lg:gap-8 justify-center'>
          <div className='relative md:mb-0 lg:mb-0 w-full h-[245px]  xl:w-[600px] lg:h-[380px] rounded-[32px]  overflow-hidden'>
            <video
              ref={videoRef}
              src='https://firebasestorage.googleapis.com/v0/b/leelu-tech.firebasestorage.app/o/landingVideos%2Flanding_video_2.mp4?alt=media&token=fde1d13e-5f99-4c5b-b1a1-7ebbf25cde04'
              autoPlay
              muted
              loop
              playsInline
              className='w-full h-full object-cover'
              style={{ objectPosition: '50% 58%' }}
            />
            <button
              onClick={toggleMute}
              className='absolute bottom-3 right-3 bg-black/50 hover:bg-black/70 transition-colors rounded-full w-9 h-9 flex items-center justify-center text-white'
              aria-label={muted ? 'Включить звук' : 'Выключить звук'}
            >
              {muted ? (
                <svg xmlns='http://www.w3.org/2000/svg' width='18' height='18' viewBox='0 0 24 24' fill='currentColor'>
                  <path d='M16.5 12A4.5 4.5 0 0 0 14 7.97v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51A8.796 8.796 0 0 0 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3 3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06A8.99 8.99 0 0 0 17.73 19L19 20.27 20.27 19 5.27 4 4.27 3zM12 4 9.91 6.09 12 8.18V4z'/>
                </svg>
              ) : (
                <svg xmlns='http://www.w3.org/2000/svg' width='18' height='18' viewBox='0 0 24 24' fill='currentColor'>
                  <path d='M3 9v6h4l5 5V4L7 9H3zm13.5 3A4.5 4.5 0 0 0 14 7.97v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z'/>
                </svg>
              )}
            </button>
          </div>

          <div className='relative flex flex-row items-center gap-3 lg:gap-6'>
            <div className='relative w-[66px] h-[66px] rounded-full overflow-hidden shrink-0'>
              <Image
                src='/images/programs/lisa_avatar.jpg'
                alt='Person sitting with a laptop'
                fill
                priority
                quality={100}
                className='object-cover'
              />
            </div>

            <div>
              <div className='font-canela font-light text-[24px]/[130%] lg:text-[32px] text-brand-gray'>
                Lisa B. Gold, M.A., CH
              </div>

              <div className='font-lato italic font-normal lg:text-[22px] leading-[26px] text-[#6F4C40] text-[18px]'>
                Applied Behavior Analyst
              </div>

              <div className='font-lato text-[16px] leading-[22px] text-brand-gray-100 mt-1'>Boca Raton, FL</div>
            </div>
          </div>
        </div>

        <div>
          <h2 className='font-thin text-[42px]/[126%] lg:text-[60px] font-canela text-brand-deep mb-4'>
            I am literally blown away...
          </h2>
          <p className='italic text-[#6F4C40] max-w-[496px] font-lato text-[22px]/[30px] mb-8'>
            {`“I've been a behavioral analyst for 25 years, and I am literally blown away by the accuracy. She hit it spot on what my relationship patterns were… She completed the missing piece. I have broken through my block, and I am living everything I've ever dreamed of.”`}
          </p>
          <Button variant={buttonVariant} className='w-full max-w-[392px]' href={href}>
            {linkLabel}
          </Button>
        </div>
      </div>
    </article>
  );
};
