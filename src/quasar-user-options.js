import '@/styles/index.styl';
import 'quasar/dist/quasar.css';
import '@quasar/extras/material-icons/material-icons.css';
import { Notify, Loading, Dialog } from 'quasar';

export default {
  config: {},
  plugins: {
    Notify,
    Loading,
    Dialog,
  },
};
