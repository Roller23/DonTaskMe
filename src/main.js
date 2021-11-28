import { createApp } from 'vue'
import App from './App.vue'

const app = createApp(App)
app.config.globalProperties.backendUrl = 'https://don-task-me.herokuapp.com';
app.config.globalProperties.listeners = {};
app.config.globalProperties.request = async (route, {method = 'GET', body = null, query = null}) => {
  const options = {method}
  if (body && typeof body === 'object') {
    options.headers = {'Content-Type': 'application/json'}
    if (!body.token && localStorage.token) {
      body.token = localStorage.token;
    }
    options.body = JSON.stringify(body)
  }
  const url = new URL(`${app.config.globalProperties.backendUrl}${route}`);
  if (query && typeof query === 'object') {
    for (const key of Object.keys(query)) {
      url.searchParams.append(key, query[key])
    }
  }
  if (!url.searchParams.has('token') && localStorage.token) {
    url.searchParams.append('token', localStorage.token)
  }
  const res = await fetch(url, options);
  return res;
}
app.mount('#app')
