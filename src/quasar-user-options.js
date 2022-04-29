import '@/styles/index.styl';
import 'quasar/dist/quasar.css';
import '@quasar/extras/material-icons/material-icons.css';
import { Notify, Loading } from 'quasar';

export default {
  config: { loading: {} },
  plugins: {
    Notify,
    Loading,
  },
};
