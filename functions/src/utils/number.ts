export const reduceToCycle = function (num: number): number {
  return ((num - 1) % 22) + 1;
};

export const sumDigits = (num: number): number =>
  num
    .toString()
    .split("")
    .reduce((acc, digit) => acc + parseInt(digit, 10), 0);