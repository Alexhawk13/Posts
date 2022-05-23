import { Dialog } from 'quasar';
import router from '../router';
import store from '../store';

function remove(name, id, action) {
  Dialog.create({
    dark: true,
    message: `Are you sure to delete this ${name} `,
    persistent: true,
    class: 'text-h6 text-center',
    ok: {
      push: true,
      color: 'negative',
      label: 'Delete',
      padding: '7px 40px',
      class: 'q-mr-auto',
    },
    cancel: {
      push: true,
      color: 'primary',
      label: 'Cancel',
      padding: '7px 40px',
      class: 'q-ml-auto',
    },
  })
    .onOk(() => {
      store.dispatch(action, id);
      if (name === 'account') {
        router.push({ name: 'HomeView', query: { page: 1 } });
      }
    })
    .onCancel(() => {});
}

export { remove };
