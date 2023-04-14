import { createApp } from 'vue'
import App from '@/App.vue'
import router from './router'
import './assets/main.css';
import * as Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue-next/dist/bootstrap-vue-next.css'



const app = createApp(App)
app.use(router)
app.use(VueAxios, axios)
app.mount('#app')
