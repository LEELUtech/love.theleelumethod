import type { StylesConfig } from "react-select";

export type CountryOption = { label: string; value: string };

export const selectStyles: StylesConfig<CountryOption, false> = {
  container: (base) => ({
    ...base,
    width: "100%",
  }),

  control: (base, state) => ({
    ...base,
    minHeight: "49px",
    height: "44px",
    borderRadius: "6px",
    borderColor: "#C3C6D1",
    boxShadow: "none",
    backgroundColor: "#fff",
    cursor: "pointer",

    padding: 0,

    ":hover": { borderColor: "#C3C6D1" },
    ...(state.isFocused ? { borderColor: "#C3C6D1" } : {}),
  }),

  valueContainer: (base) => ({
    ...base,
    height: "44px",
    padding: "0 18px",
  }),

  input: (base) => ({
    ...base,
    margin: 0,
    padding: 0,
    fontFamily: "Lato, sans-serif",
    fontWeight: 400,
    fontSize: "17px",
    lineHeight: "24px",
    color: "#757986",
  }),

  placeholder: (base) => ({
    ...base,
    margin: 0,
    color: "#757986",
    fontFamily: "Lato, sans-serif",
    fontWeight: 400,
    fontSize: "17px",
    lineHeight: "24px",
  }),

  singleValue: (base) => ({
    ...base,
    margin: 0,
    color: "#757986",
    fontFamily: "Lato, sans-serif",
    fontWeight: 400,
    fontSize: "17px",
    lineHeight: "24px",
  }),

  indicatorsContainer: (base) => ({
    ...base,
    height: "44px",
  }),

  dropdownIndicator: (base) => ({
    ...base,
    padding: "0 14px 0 0",
    color: "#757986",
    ":hover": { color: "#757986" },
  }),

  indicatorSeparator: () => ({
    display: "none",
  }),

  menu: (base) => ({
    ...base,
    borderRadius: "6px",
    overflow: "hidden",
    zIndex: 50,
    
  }),

  option: (base, state) => ({
    ...base,
    padding: "10px 18px",
    fontFamily: "Lato, sans-serif",
    fontSize: "17px",
    lineHeight: "24px",
    color: "#111827",
    backgroundColor: state.isSelected
      ? "rgba(225, 57, 84, 0.12)"
      : state.isFocused
      ? "rgba(0,0,0,0.04)"
      : "#fff",
    cursor: "pointer",
  }),

  menuList: (base) => ({
    ...base,
    maxHeight: 240,
    overflowY: "auto",

    // скрываем скроллбар, но прокрутка работает
    scrollbarWidth: "none",      // Firefox
    msOverflowStyle: "none",     // IE/Edge legacy
  }),
};
