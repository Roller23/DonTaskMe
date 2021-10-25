import { createApp } from 'vue'
import App from './App.vue'

const app = createApp(App)
app.config.globalProperties.backendUrl = 'https://don-task-me.herokuapp.com';
app.mount('#app')
