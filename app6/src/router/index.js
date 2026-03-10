import { createRouter, createWebHistory } from 'vue-router'
import Login from '@/components/Login.vue'
import HomeView from '@/views/HomeView.vue'
import AboutView from '@/views/AboutView.vue'
import NotFound from '@/components/NotFound.vue'

const routes = [
  { path: '/', redirect: '/login' }, // root redirects to login
  { path: '/login', name: 'login', component: Login },
  { path: '/home', name: 'home', component: HomeView },
  { path: '/about', name: 'about', component: AboutView },
  { path: '/:pathMatch(.*)*', component: NotFound },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
