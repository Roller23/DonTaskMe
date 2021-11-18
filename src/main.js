import { createApp } from 'vue'
import App from './App.vue'

const app = createApp(App)
app.config.globalProperties.backendUrl = 'https://don-task-me.herokuapp.com';
app.config.globalProperties.listeners = {};
app.mount('#app')
