import { Dialog } from 'quasar';

function dialogDeleteWrapper(name, func) {
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
      func();
    })
    .onCancel(() => {});
}

export { dialogDeleteWrapper };
