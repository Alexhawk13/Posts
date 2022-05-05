import { format } from 'date-fns';

export default function convertDate(date) {
  if (!date) return;

  const time = new Date(date);

  return format(time, 'MMM d');
}
