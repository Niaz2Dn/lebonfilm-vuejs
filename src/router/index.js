import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '@/views/Home.vue'
import Login from '@/views/Login.vue'
import Movie from '@/views/Movie.vue'
import Search from '@/views/Search.vue'
import Register from '@/views/Register.vue'
import Profile from '@/views/Profile.vue'
import "vue-lazy-youtube-video/dist/style.simplified.css";

Vue.use(VueRouter)
    
    const routes = [
        {
            path: '/',
            name: 'Home',
            component: Home
        },
        {
            path: '/login',
            name: 'Login',
            component: Login
        },
        {
            path: '/register',
            name: 'Register',
            component: Register
        },
        {
            path: "/movie/:id",
            name: "Movie",
            component: Movie,
            props: true
        },
        {
            path: "/profile/:username",
            name: "Profile",
            component: Profile
        },
        {
            path: "/search/:name",
            name: "Search",
            component: Search,
            props: true
        }
    ]

const router = new VueRouter({
    mode: "history",
    routes
})

export default router
