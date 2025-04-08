import {
  differenceInSeconds,
  differenceInMinutes,
  differenceInHours,
  differenceInDays,
  format,
  addSeconds,
} from 'date-fns';

export const SECONDS_PER_EPOCH = 65;
export const EPOCHS_PER_DAY = 1330;

/**
 * Calculates and formats the time difference between two epoch progress values.
 *
 * @param firstEpoch - The starting epoch progress value
 * @param secondEpoch - The ending epoch progress value
 * @returns A formatted string representing the time difference
 *
 * Format rules:
 * - Less than 1 minute: show seconds
 * - Less than 1 hour: show minutes
 * - Less than 1 day: show hours and minutes
 * - Greater than 1 day: show date in format "{month}.{day} {year}, {hour}:{minutes} hs"
 */
export const differenceBetweenEpochs = (
  firstEpoch: number,
  secondEpoch: number
): string => {
  if (firstEpoch > secondEpoch) {
    throw new Error('secondEpoch must be greater than or equal to firstEpoch');
  }

  // Calculate the time difference in seconds
  const epochDifference = secondEpoch - firstEpoch;
  const secondsDifference = epochDifference * SECONDS_PER_EPOCH;

  // Use the current date as a base and add the seconds difference to get the relative time
  const baseDate = new Date();
  const targetDate = addSeconds(baseDate, secondsDifference);

  // Calculate various time differences
  const seconds = differenceInSeconds(targetDate, baseDate, { roundingMethod: 'ceil' });
  const minutes = differenceInMinutes(targetDate, baseDate, { roundingMethod: 'ceil' });
  const hours = differenceInHours(targetDate, baseDate);
  const days = differenceInDays(targetDate, baseDate);

  // Format based on the time difference
  if (minutes < 1) {
    return `${seconds} seconds`;
  } else if (hours < 1) {
    return `${minutes} minutes`;
  } else if (days < 1) {
    const remainingMinutes = minutes % 60;
    return `${hours} hour${hours > 1 ? 's' : ''} ${remainingMinutes} min.`;
  } else {
    // For dates more than a day in the future, show the full date
    return `${format(targetDate, 'MMM. d yyyy, HH:mm')} hs`;
  }
};
