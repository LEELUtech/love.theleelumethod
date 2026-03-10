'use client';

import React from 'react';
import Input from '@/components/ui/Input';
import BirthDatePicker from '@/components/ui/BirthDatePicker';
import type { Dayjs } from 'dayjs';
import { DATE_FORMAT } from '@/utils/constants';
import { ThankYou } from '@/components/sections/Form/ThankYou';
import { Select } from '@/components/ui/select/index';
import { ErrorLabel, FieldLabel, HelperLabel } from '@/components/ui/labels';

type Path = 'A' | 'B' | 'C' | null;

interface FormData {
  email: string;
  fullName: string;
  dob: string;
  tier: string;
  path: Path;
  partnerName: string;
  partnerDob: string;
  duration: string;
  consent: boolean;
}

const initialForm: FormData = {
  email: '',
  fullName: '',
  dob: '',
  tier: '',
  path: null,
  partnerName: '',
  partnerDob: '',
  duration: '',
  consent: false,
};

const PATH_OPTIONS = [
  {
    value: 'A' as const,
    label: "I'm going through a breakup",
    desc: "I recently ended a relationship or I'm in the process of separating. I want to understand why it didn't work and how to move forward.",
  },
  {
    value: 'B' as const,
    label: "I'm in a relationship",
    desc: "I'm currently with a partner. I want to decode our dynamic, understand what we both need, and strengthen the connection.",
  },
  {
    value: 'C' as const,
    label: "I'm single and looking",
    desc: "I'm not in a relationship right now. I want to understand my patterns, clear what's blocking me, and attract the right partner.",
  },
];

const TIER_OPTIONS = [
  { value: 'essentials', label: 'The Essentials' },
  { value: 'guided_breakthrough', label: 'Guided Breakthrough' },
  { value: 'vip_immersion', label: 'VIP Immersion' },
];

const DURATION_OPTIONS = [
  { value: 'lt_6m', label: 'Less than 6 months' },
  { value: '6m_1y', label: '6 months - 1 year' },
  { value: '1y_3y', label: '1-3 years' },
  { value: '3y_5y', label: '3-5 years' },
  { value: '5y_plus', label: '5+ years' },
];

export default function FormPage() {
  const [form, setForm] = React.useState<FormData>(initialForm);
  const [errors, setErrors] = React.useState<Partial<Record<keyof FormData, string>>>({});
  const [submitted, setSubmitted] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const set = <K extends keyof FormData>(key: K, value: FormData[K]) => setForm((prev) => ({ ...prev, [key]: value }));

  const section2Title = form.path === 'A' ? 'About Your Ex-Partner' : 'About Your Partner';

  const validateBirthDate = (value: string) => {
    if (!value) return 'Date of birth is required.';

    const dob = new Date(value);
    const today = new Date();
    const age18 = new Date(dob.getFullYear() + 18, dob.getMonth(), dob.getDate());

    if (dob.getFullYear() < 1950) return 'Date of birth cannot be earlier than 1950.';
    if (age18 > today) return 'You must be at least 18 years old.';

    return null;
  };

  const validateName = (value: string) => {
    const trimmed = value.trim();

    if (!trimmed) return 'Name is required.';
    if (trimmed.length < 2) return 'Name must be at least 2 characters.';

    return null;
  };

  const validate = (): boolean => {
    const e: Partial<Record<keyof FormData, string>> = {};

    if (!form.email.trim()) e.email = 'Email is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/.test(form.email)) e.email = 'Enter a valid email address.';

    const nameError = validateName(form.fullName);
    if (nameError) e.fullName = nameError;

    const dobError = validateBirthDate(form.dob);
    if (dobError) e.dob = dobError;

    if (!form.tier) e.tier = 'Please select your program.';
    if (!form.path) e.path = 'Please select your path.';

    if (form.path === 'A' || form.path === 'B') {
      const partnerNameError = validateName(form.partnerName);
      if (partnerNameError) e.partnerName = partnerNameError;

      const partnerDobError = validateBirthDate(form.dob);
      if (partnerDobError) e.partnerDob = partnerDobError;
    }

    if (!form.consent) e.consent = 'Please confirm before submitting.';

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    setSubmitted(true);
  };

  if (submitted) return <ThankYou />;

  return (
    <div className='min-h-screen bg-brand-blush px-6 py-16 md:py-24'>
      <div className='mx-auto max-w-[640px]'>
        <div className='text-center mb-12'>
          <p className='font-lato text-[16px] font-bold tracking-widest uppercase text-brand-primary mb-3'>
            The Protocol
          </p>
          <h1 className='font-canela font-light text-[44px] md:text-[56px] text-brand-black leading-[1.1]'>
            Your Personal Data
          </h1>
          <p className='mt-4 font-lato text-body text-brand-gray max-w-[460px] mx-auto'>
            Fill this out so Lily can calculate your personalized reports. Please submit by Day 7 of your cohort.
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className='bg-white rounded-[24px] px-6 py-8 md:px-10 md:py-10 shadow-[0px_4px_20px_0px_rgba(0,0,0,0.06)]'>
            <h2 className='font-canela font-light text-[28px] text-brand-black mb-8'>About You</h2>

            <div className='space-y-6'>
              <div>
                <FieldLabel required label='Your email address' />
                <Input
                  type='email'
                  placeholder='you@example.com'
                  value={form.email}
                  onChange={(e) => set('email', e.target.value)}
                />
                <HelperLabel label='Use the same email you used to purchase the Protocol.' />

                {errors.email && <ErrorLabel label={errors.email} />}
              </div>

              <div>
                <FieldLabel required label='Your full name (as given at birth)' />

                <Input
                  type='text'
                  placeholder='Your birth name'
                  value={form.fullName}
                  onChange={(e) => set('fullName', e.target.value)}
                  onKeyDown={(e) => {
                    if (/\d/.test(e.key)) e.preventDefault();
                  }}
                />
                <HelperLabel label='This is used for your numerological calculation. Please use your birth name, not a nickname or married name.' />

                {errors.fullName && <ErrorLabel label={errors.fullName} />}
              </div>

              <div>
                <FieldLabel required label='Your date of birth' />

                <BirthDatePicker
                  placeholder={DATE_FORMAT}
                  onChange={(val: Dayjs | null) => set('dob', val ? val.format(DATE_FORMAT) : '')}
                />
                {errors.dob && <ErrorLabel label={errors.dob} />}
              </div>

              <div>
                <FieldLabel required label='Which program did you enroll in?' />
                <Select
                  value={form.tier}
                  onChange={(v) => set('tier', v)}
                  options={TIER_OPTIONS}
                  placeholder='Select your program'
                />
                {errors.tier && <ErrorLabel label={errors.tier} />}
              </div>

              <div>
                <FieldLabel required label='Where are you right now?' />
                <div className='mt-2 space-y-3'>
                  {PATH_OPTIONS.map((opt) => {
                    const selected = form.path === opt.value;

                    return (
                      <button
                        key={opt.value}
                        type='button'
                        onClick={() => set('path', opt.value)}
                        className={[
                          'w-full text-left rounded-[12px] border px-5 py-4 transition-all',
                          selected
                            ? 'border-brand-primary bg-[#F9ECED]'
                            : 'border-[#C3C6D1] bg-white hover:border-brand-primary/40',
                        ].join(' ')}
                      >
                        <p
                          className={`font-lato font-semibold text-[15px] ${selected ? 'text-brand-primary' : 'text-brand-black'}`}
                        >
                          {opt.label}
                        </p>
                        <p className='mt-1 font-lato font-normal text-[13px] text-[#757986] leading-[1.5]'>
                          {opt.desc}
                        </p>
                      </button>
                    );
                  })}
                </div>
                {errors.path && <ErrorLabel label={errors.path} />}
              </div>
            </div>
          </div>

          {(form.path === 'A' || form.path === 'B') && (
            <div className='mt-6 bg-white rounded-[24px] px-6 py-8 md:px-10 md:py-10 shadow-[0px_4px_20px_0px_rgba(0,0,0,0.06)]'>
              <h2 className='font-canela font-light text-[28px] text-brand-black mb-8'>{section2Title}</h2>

              <div className='space-y-6'>
                <div>
                  <FieldLabel
                    required
                    label={
                      form.path === 'A'
                        ? "Your ex-partner's full name (as given at birth)"
                        : "Your partner's full name (as given at birth)"
                    }
                  />

                  <Input
                    type='text'
                    placeholder='His birth name'
                    value={form.partnerName}
                    onChange={(e) => set('partnerName', e.target.value)}
                    onKeyDown={(e) => {
                      if (/\d/.test(e.key)) e.preventDefault();
                    }}
                  />

                  <HelperLabel label="His birth name is needed for accurate calculation. If you don't know his full birth name, provide the name you know — we'll work with it." />

                  {errors.partnerName && <ErrorLabel label={errors.partnerName} />}
                </div>

                <div>
                  <FieldLabel
                    required
                    label={form.path === 'A' ? "Your ex-partner's date of birth" : "Your partner's date of birth"}
                  />

                  <BirthDatePicker
                    placeholder={DATE_FORMAT}
                    onChange={(val: Dayjs | null) => set('partnerDob', val ? val.format(DATE_FORMAT) : '')}
                  />
                  <HelperLabel label="If you don't know the exact date, provide your best estimate. Even the year helps." />
                  {errors.partnerDob && <ErrorLabel label={errors.partnerDob} />}
                </div>

                <div>
                  <FieldLabel
                    required
                    label={form.path === 'A' ? 'How long were you together?' : 'How long have you been together?'}
                  />

                  <Select
                    value={form.duration}
                    onChange={(v) => set('duration', v)}
                    options={DURATION_OPTIONS}
                    placeholder='Select duration'
                  />
                </div>
              </div>
            </div>
          )}

          <div className='mt-6 bg-white rounded-[24px] px-6 py-8 md:px-10 md:py-10 shadow-[0px_4px_20px_0px_rgba(0,0,0,0.06)]'>
            <div className='flex items-start gap-3'>
              <input
                id='consent'
                type='checkbox'
                checked={form.consent}
                onChange={(e) => set('consent', e.target.checked)}
                className='mt-[3px] w-4 h-4 accent-brand-primary cursor-pointer flex-shrink-0'
              />
              <label htmlFor='consent' className='font-lato text-[14px] text-[#41444E] leading-[1.6] cursor-pointer'>
                I confirm that the information above is accurate to the best of my knowledge. I understand that my
                reports will be calculated based on this data and that changes after submission may delay delivery.
              </label>
            </div>
            {errors.consent && <ErrorLabel label={errors.consent} />}
          </div>

          <button
            type='submit'
            disabled={loading}
            className='mt-8 w-full rounded-full bg-brand-primary text-white font-lato font-semibold text-[15px] tracking-wide py-4 hover:opacity-90 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed'
          >
            {loading ? 'Submitting…' : 'Submit My Information'}
          </button>
        </form>
      </div>
    </div>
  );
}
