import { createRouter, createWebHashHistory } from 'vue-router'
import StartView from '@/views/StartView.vue'
import CreateAccount from '@/views/CreateAccount.vue'
import HomeView from '@/views/HomeView.vue'
import Sidebar from '@/components/Sidebar.vue'
import Mainbox from '@/components/Mainbox.vue'
import SignIn from '@/views/SignIn.vue'
import Messenger from '@/components/Messenger.vue'
import { useUserStore } from '@/stores/userStore'

const routes = [
  { path: '/', redirect: '/start' },
  { path: '/createAccount', component: CreateAccount },
  { path: '/signIn', name: 'signIn', component: SignIn },
  {
    path: '/start',
    component: StartView,
    props: {
      imageUrl: '/message-icon.png',
    },
  },
  {
    path: '/home',
    component: HomeView,
    children: [
      {
        path: '',
        components: {
          sidebar: Sidebar,
          main: Mainbox,
        },
      },
      {
        path: 'chat/:username',
        components: {
          sidebar: Sidebar,
          main: Messenger,
        },
        props: {
          main: true,
        },
      },
    ],
  },
]

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach((to, from, next) => {
  const userStore = useUserStore()
  const publicPages = ['/signIn', '/createAccount', '/start']

  if (to.matched.length === 0) {
    return next(false)
  }

  // this to send user to sign in if not loggedin
  if (!userStore.loggedIn && !publicPages.includes(to.path)) {
    return next('/signIn')
  }

  if (userStore.loggedIn && ['/signIn', '/createAccount'].includes(to.path)) {
    return next('/home')
  }

  next()
})

export default router
