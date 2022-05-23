import { Notify } from 'quasar';

function showSuccessMessage(text) {
  Notify.create({
    type: 'positive',
    message: text,
    position: 'top-right',
    timeout: '2000',
  });
}
function showDangerMessage(text) {
  Notify.create({
    type: 'negative',
    message: text,
    position: 'top-right',
    timeout: '2000',
  });
}

function showLoggedOutMessage() {
  Notify.create({
    type: 'positive',
    message: 'Logged Out',
    position: 'top-right',
    timeout: '2000',
  });
}

export { showSuccessMessage, showDangerMessage, showLoggedOutMessage };
