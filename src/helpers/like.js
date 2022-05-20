import { Dialog } from 'quasar';
import router from '../router';
import $store from '@/store';

async function like(action, payload) {
  let likes = payload.likes;
  if (!$store.getters.isAuth) {
    Dialog.create({
      dark: true,
      message: 'Only authorized users are allowed to do that',
      persistent: true,
      class: 'text-h6 text-center',
      ok: {
        push: true,
        color: 'primary',
        label: 'Log In',
        padding: '7px 40px',
        class: 'q-mr-auto',
      },
      cancel: {
        push: true,
        color: 'negative',
        label: 'Dismiss',
        padding: '7px 40px',
        class: 'q-ml-auto',
      },
    })
      .onOk(() => {
        router.push({ name: 'LogIn' });
      })
      .onCancel(() => {});
  } else {
    await $store.dispatch(action, payload._id);

    if (!isLiked(payload)) {
      likes.push($store.getters.getUserState._id);
    } else {
      likes.pop();
    }
  }
  return likes;
}

function isLiked(payload) {
  return $store.getters.getUserState
    ? payload.likes.includes($store.getters.getUserState._id)
    : false;
}

export { like, isLiked };
