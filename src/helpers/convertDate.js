import { format, formatDistance } from 'date-fns';

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
  const weak = format(time, 'wo');
  const day = format(time, 'dd MM');

  const timeObj = {
    year,
    month,
    weak,
    day,
  };

  return timeObj;
}

export { monthAndDate, timePassed, getFullDate };
