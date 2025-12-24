export const reduceToCycle = function (num: number): number {
  return ((num - 1) % 22) + 1;
};
