import { format, formatDistance, getDaysInMonth } from 'date-fns';

function monthAndDate(date) {
  if (!date) return;

  const time = new Date(date);

  return format(time, 'MMM d');
}

function timePassed(date) {
  if (!date) return;

  const time = new Date(date);

  return formatDistance(time, new Date(), { addSuffix: true });
}

function getFullDate(date) {
  if (!date) return;

  const time = new Date(date);

  const year = format(time, 'yyyy');
  const month = format(time, 'MMMM');
  const day = format(time, 'D', { useAdditionalDayOfYearTokens: true });

  const timeObj = {
    year,
    month,
    day,
  };

  return timeObj;
}

function getCurrentDayNumberInYear() {
  return format(new Date(), 'D', { useAdditionalDayOfYearTokens: true });
}

export { monthAndDate, timePassed, getFullDate, getCurrentDayNumberInYear };
