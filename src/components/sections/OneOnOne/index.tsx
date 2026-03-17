'use client';

import { Diagnostic } from './Diagnostic';

import { WhoThis } from './WhoThis';
import { Pricing } from './Pricing';
import { HowItWorks } from './HowItWorks';
import { Primary } from './Primary';

export const OneOnOneSection = () => {
  return (
    <>
      {/* <Diagnostic /> */}
      <HowItWorks />
      <WhoThis />
      <Pricing />
      <Primary />
    </>
  );
};
