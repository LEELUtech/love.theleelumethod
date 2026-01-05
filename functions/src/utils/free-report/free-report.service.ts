import { POWER_TABLE, COMPATIBILITY_RANGES } from "./free-report.constants";
import { parseBirthDate, reduceTo22 } from "./free-report.utils";

export type CompatibilityType =
  | "Revolution"
  | "Battle"
  | "Truce"
  | "Victory"
  | "Absorption";

export function calculateKCHH(birthDate: string): number {
  const { daySum, yearSum } = parseBirthDate(birthDate);
  return reduceTo22(daySum + yearSum);
}

export function calculateCompatibility(
  birthDate1: string,
  birthDate2: string
) {
  const kchh1 = calculateKCHH(birthDate1);
  const kchh2 = calculateKCHH(birthDate2);

  const power1 = POWER_TABLE[kchh1];
  const power2 = POWER_TABLE[kchh2];

  const diff = Math.abs(power1 - power2);

  const range = COMPATIBILITY_RANGES.find(r => diff <= r.max)!;

  return {
    kchh1,
    kchh2,
    power1,
    power2,
    diff,
    type: range.type as CompatibilityType,
  };
}
