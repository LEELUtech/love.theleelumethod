export function parseBirthDate(date: string) {
  const [day, , year] = date.split(".");
  return {
    daySum: day.split("").reduce((s, d) => s + Number(d), 0),
    yearSum: year.split("").reduce((s, d) => s + Number(d), 0),
  };
}

export function reduceTo22(num: number): number {
  while (num > 22) {
    num = num
      .toString()
      .split("")
      .reduce((s, d) => s + Number(d), 0);
  }
  return num === 0 ? 22 : num;
}
