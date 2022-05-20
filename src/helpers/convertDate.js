import { format, formatDistance } from 'date-fns';

// formatDistance(subDays(new Date(), 3), new Date(), { addSuffix: true })
//=> "3 days ago"

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

export { monthAndDate, timePassed };
