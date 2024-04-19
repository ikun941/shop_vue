import "./style.css"
import {createApp} from 'vue'
import App from './App.vue'
import store from './assets/store';
import DataVVue3 from '@kjgl77/datav-vue3'
const app = createApp(App);

app.use(store);
app.use(DataVVue3)
app.mount('#app');
