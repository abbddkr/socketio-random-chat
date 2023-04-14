import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AboutView from '../views/AboutView.vue'
import ChatView from '../views/ChatView.vue'
import RandomChatView from '../views/RandomChatView.vue'
import DefaultLayout from '@/layouts/DefaultLayout.vue';
import ChatLayout from '@/layouts/ChatLayout.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: DefaultLayout,
      children: [
        {
          path: '',
          component: HomeView,
        },
        {
          path: 'about',
          component: AboutView,
        },
      ]
    },
    {
      path: '/chat',
      name: 'chat',
      component: ChatLayout,
      children: [
        {
          path: '',
          component: ChatView,
        },
        {
          path: 'random-chat',
          component: RandomChatView
        }
      ]
    },
  ]
})

export default router
