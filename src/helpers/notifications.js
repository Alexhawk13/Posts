import { Notify } from 'quasar';
import router from '@/router';

export function showSuccessMessage(text) {
  Notify.create({
    type: 'positive',
    message: text,
    position: 'top-right',
    timeout: '2000',
  });
}
export function showDangerMessage(text) {
  Notify.create({
    type: 'negative',
    message: text,
    position: 'top-right',
    timeout: '2000',
  });
}
export function showModal() {
  Notify.create({
    message: 'Only authorized users can do that',
    color: 'info',
    position: 'center',
    timeout: 0,
    classes: 'text-h5 q-ma-md',
    avatar: 'https://cdn.quasar.dev/img/boy-avatar.png',
    actions: [
      {
        label: 'LogIn',
        class: 'q-mr-md text-weight-bold',
        color: 'white',
        handler: () => {
          router.push({ name: 'LogIn' });
        },
      },
      {
        label: 'Dismiss',
        color: 'grey-8',
        class: 'text-weight-bold',
      },
    ],
  });
}
