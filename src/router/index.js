import VueRouter from 'vue-router';
import Vue from 'vue'
import Home from '../views/Home.vue';

Vue.use(VueRouter);

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home
    },
    {
        path: '/expenses',
        name: 'Expenses',
        component: () => import('../views/Expenses')
    }
]

const router = new VueRouter({
    routes
})

export default router

