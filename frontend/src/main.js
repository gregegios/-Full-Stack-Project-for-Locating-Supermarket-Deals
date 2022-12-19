import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './components/router.js'
import userState from './composables/store.js'

if (localStorage.getItem('token') !== null) {
    
    userState.value.loggedIn = true

}
else userState.value.loggedIn = false


createApp(App).use(router).mount('#app')
