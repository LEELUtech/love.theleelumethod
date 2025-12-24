"use client";

import React, { FC } from "react";
import { PhoneInput, PhoneInputProps } from "react-international-phone";
import "./style.css";

interface Props extends PhoneInputProps {
  value?: string;
  onChange?: (value: string) => void;
}

export const PhoneNumberInput: FC<Props> = ({ value, onChange }) => {
  return (
    <div>
      <PhoneInput
        className={"phone-input"}
        defaultCountry="us"
        value={value}
        placeholder="Phone Number"
        onChange={onChange}
        required
        style={{
          width: "100%",
          padding: "6px 14px",
          borderRadius: "100px",
          backgroundColor: "#FFF",
          border: "1px solid #1D1D1D",
        }}
        inputProps={{
          className: "w-full bg-[#FFF] border-none focus:outline-none",
          autoComplete: "tel-national",
        }}
        countrySelectorStyleProps={{
          buttonStyle: {
            marginRight: "8px",
            backgroundColor: "#FFF",
            border: "none",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          },
          dropdownStyleProps: {
            style: {
              backgroundColor: "#FFF",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              color: "#fff",
              borderRadius: "12px",
            },
            listItemCountryNameStyle: {
              color: "grey",
            },
          },
        }}
      />
    </div>
  );
};
