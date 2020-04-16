import Vue from 'vue'
import Router from 'vue-router'

const Cinema = () => import('../views/Cinema/Cinema')
const Mine = () => import('../views/Mine/Mine')
const Movie = () => import('../views/Movie/Movie')

const City = () => import('../components/City/index')
const NowPlaying = () => import('../components/NowPlaying')
const ComingSoon = () => import('../components/ComingSoon')
const Search = () => import('../components/Search')

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path:'/',
      redirect:'/movie/nowPlaying'
    },
    {
      path: '/cinema',
      component:Cinema
    },
    {
      path: '/mine',
      component:Mine
    },
    {
      path:'/movie',
      component:Movie,
      children:[
        {
          path:'city',
          component:City
        },
        {
          path:'nowPlaying',
          component:NowPlaying
        },
        {
          path:'comingSoon',
          component:ComingSoon
        },
        {
          path:'search',
          component:Search
        }
      ]
    }
  ]
})
