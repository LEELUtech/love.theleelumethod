/* eslint-disable indent */
import { extractDateParts } from "./date";
import { reduceToCycle, sumDigits } from "./number";

export type ProductType = "destiny" | "money" | "karmic" | "weaknesses";

export const calculateProgramNumber = (birthDate: Date): number => {
    const { day, month, year } = extractDateParts(birthDate);
    const today = new Date();

    const sumOfDigits = sumDigits(Number(`${day}${month}${year}`));

    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }

    if (age < sumOfDigits) {
        return day >= 23 ? day - 22 : day;
    } else if (age >= sumOfDigits && age < sumOfDigits + 9) {
        return month;
    } else {
        const yearSum = sumDigits(year);
        return reduceToCycle(yearSum);
    }
};

export const calculateMoneyProgram = (birthDate: Date): number => {
    const { day, month, year } = extractDateParts(birthDate);
    const dayValue = reduceToCycle(day);
    const yearSum = sumDigits(year);
    const yearValue = yearSum > 22 ? reduceToCycle(yearSum) : yearSum;

    let total = dayValue + month + yearValue;
    total = total > 22 ? reduceToCycle(total) : total;

    return total === 0 ? 22 : total;
};

export const calculateKarmicProgram = (birthDate: Date): number => {
    const { day, month } = extractDateParts(birthDate);
    const dayValue = reduceToCycle(day);

    const diff = Math.abs(dayValue - month);
    const programNumber = reduceToCycle(diff);

    return programNumber === 0 ? 22 : programNumber;
};

export const calculateWeaknessesProgram = (birthDate: Date): number => {
    const { day, year } = extractDateParts(birthDate);
    const dayValue = reduceToCycle(day);
    const yearSum = sumDigits(year);
    const yearValue = reduceToCycle(yearSum);

    const diff = Math.abs(yearValue - dayValue);
    const programNumber = reduceToCycle(diff);

    return programNumber === 0 ? 22 : programNumber;
};

export const calculateProgram = (birthDate: Date, productType: ProductType): number => {
    switch (productType) {
        case "destiny":
            return calculateProgramNumber(birthDate);
        case "money":
            return calculateMoneyProgram(birthDate);
        case "karmic":
            return calculateKarmicProgram(birthDate);
        case "weaknesses":
            return calculateWeaknessesProgram(birthDate);
        default:
            throw new Error(`Unknown product type: ${productType}`);
    }
};
