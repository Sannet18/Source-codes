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

router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore()

  if (to.matched.length === 0) {
    next(false)
    return
  }
  const pages = ['/signIn', '/createAccount', '/start']

  if (userStore.loggedIn && pages.includes(to.path)) {
    const confirmLeave = window.confirm('You are already logged in. Do you want to log out?')

    if (confirmLeave) {
      userStore.logout()
      next()
    } else {
      next(false)
    }
    return
  }

  next()
})

export default router
