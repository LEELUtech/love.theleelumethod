import { getData } from "country-list";

export const countries = getData().map((c) => ({
  label: c.name, 
  value: c.code,  
}));