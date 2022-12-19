import { createRouter, createWebHistory} from 'vue-router'
import userState from '../composables/store.js'


const routes = [
    {
        path: '/',
        name: 'Home',
        component: () => import ('../views/Home.vue'),
    },

    {
        path: '/login',
        name: 'Login',
        component: () => import ('../views/Login.vue')
    },
    {
        path: '/register',
        name: 'Register',
        component: () => import ('../views/Register.vue')
    },
    {

        path: '/admin',
        name: 'Admin',
        component: () => import ('../views/Admin.vue')

    }

]

const router = createRouter({
    history: createWebHistory(),
    routes
})


router.beforeEach((to, from, next) => {
    if (to.path === '/login' || to.path === '/register') {
        // the user is already on the login page, so let them continue to that page
        next();
    }
    else if (userState.value.loggedIn) {
      // the user is logged in, so let them continue to the requested route
      next();
    } else {
      // the user is not logged in, so redirect them to the login page
      next('/login');
    }
  });
  
  export default router;

  
  
  
  
  