import { format, formatDistance, getDaysInMonth, parse } from 'date-fns';

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
  const month = format(time, 'MMM');
  // const numberOfDaysInMonth = daysInMonth(time);

  // let jse = parse('19 May 2022', 'd MMM yyyy', new Date());
  // let esj = format(jse, 'd MMM yyyy');
  const day = format(time, 'd MMM yyyy');

  const timeObj = {
    year,
    month,
    day,
    // jse,
    // esj,
    // numberOfDaysInMonth,
  };

  return timeObj;
}

function daysInMonth(date) {
  return getDaysInMonth(date);
}

function stringToDate(date) {
  return parse(date, 'd/MM/yyyy', new Date());
}

export { monthAndDate, timePassed, getFullDate, daysInMonth, stringToDate };
