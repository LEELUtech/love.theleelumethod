"use client";

import * as React from "react";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  placeholder: string;
};

export default function Input({ className, ...props }: InputProps) {
  return (
    <input
      {...props}
      className={[
        `
        w-full
        rounded-[6px]
        border border-[#C3C6D1]
        bg-white
        px-[18px] py-[10px]
        font-lato font-normal text-body
        text-[#757986]
        placeholder:text-[#757986]
        outline-none
      `,
        className ?? "",
      ].join(" ")}
    />
  );
}
