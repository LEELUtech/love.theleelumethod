/**
 * Calculates the sum of all digits in a string
 * @param {string} str - Input string containing digits
 * @return {number} Sum of all digits
 */
function sumDigits(str: string): number {
  return str.split("").reduce((acc, digit) => acc + parseInt(digit, 10), 0);
}

/**
 * Formats a date to a string representation
 * @param {Date} date - Date to format
 * @return {string} Formatted date string
 */
function formatDate(date: Date): string {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
}

/**
 * Calculates season dates based on date of birth
 * @param {string} dateOfBirth - Date of birth string
 * @return {Object} Object containing formatted dates array and season number
 */
export function getSeasonDates(dateOfBirth: string): {
  dates: string[];
  seasonNumber: "1st" | "2nd" | "3rd";
} {
  const birthDate = new Date(dateOfBirth);
  const dobString = birthDate.toISOString().slice(0, 10).replace(/-/g, "");
  const digitSum = sumDigits(dobString);

  const resultDate = new Date(birthDate);
  resultDate.setFullYear(resultDate.getFullYear() + digitSum);

  const seasonMilestones = [0, 9, 18].map((offset) => {
    const d = new Date(resultDate);
    d.setFullYear(d.getFullYear() + offset);
    return d;
  });

  const [date1, date2, date3] = seasonMilestones;
  const now = new Date();

  let seasonNumber: "1st" | "2nd" | "3rd";
  let endPrevSeasonDate: Date;
  let endSeasonDate: Date;

  if (now < date1) {
    seasonNumber = "1st";
    endPrevSeasonDate = birthDate;
    endSeasonDate = date1;
  } else if (now < date2) {
    seasonNumber = "2nd";
    endPrevSeasonDate = date1;
    endSeasonDate = date2;
  } else {
    seasonNumber = "3rd";
    endPrevSeasonDate = date2;
    endSeasonDate = date3;
  }

  const turboYearStartDate = new Date(endSeasonDate);
  turboYearStartDate.setFullYear(turboYearStartDate.getFullYear() - 1);

  return {
    dates: [
      formatDate(date1),
      formatDate(date2),
      formatDate(date3),
      formatDate(endPrevSeasonDate),
      formatDate(endSeasonDate),
      formatDate(turboYearStartDate),
    ],
    seasonNumber,
  };
}
