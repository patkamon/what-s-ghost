import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import PrimeVue from 'primevue/config';
import 'primeicons/primeicons.css';


const app = createApp(App);
app.mount('#app')
app.use(PrimeVue);
