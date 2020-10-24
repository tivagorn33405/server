import Vue from 'vue'
import Router from 'vue-router'
// Users
import UserIndex from '@/components/Users/Index'
import UserCreate from '@/components/Users/CreateUser'
import UserEdit from '@/components/Users/EditUser'
import UserShow from '@/components/Users/ShowUser'
// Authen
import Login from '@/components/Login'
// Blogs
import BlogIndex from '@/components/Blogs/Index'
import BlogCreate from '@/components/Blogs/CreateBlog'
import BlogEdit from '@/components/Blogs/EditBlog'
import BlogShow from '@/components/Blogs/ShowBlog'
import CommentIndex from '@/components/Comments/Index'
// Upload Testing
import Upload from '@/components/Utils/Upload'
// Front
import FrontIndex from '@/components/Fronts/Index'
import FrontShow from '@/components/Fronts/ShowBlog'
import FrontTickets from '@/components/Fronts/Tickets'
import FrontshowTickets from '@/components/Fronts/showTicket'
import FrontCartlist from '@/components/Fronts/Cartlist'

// Tickets
import TicketIndex from '@/components/Tickets/Index'
import TicketCreate from '@/components/Tickets/CreateTicket'
import TicketEdit from '@/components/Tickets/EditTicket'
import TicketShow from '@/components/Tickets/ShowTicket'
import Cartlist from '@/components/Tickets/Cartlist'
Vue.use(Router)
export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/users',
      name: 'users',
      component: UserIndex
    },
    {
      path: '/user/create',
      name: 'users-create',
      component: UserCreate
    },
    {
      path: '/user/edit/:userId',
      name: 'user-edit',
      component: UserEdit
    },
    {
      path: '/user/:userId',
      name: 'user',
      component: UserShow
    },
    // authen
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    // blogs
    {
    path: '/blogs',
    name: 'blogs',
    component: BlogIndex
    },
    {
      path: '/blog/create',
      name: 'blogs-create',
      component: BlogCreate
    },
    {
      path: '/blog/edit/:blogId',
      name: 'blog-edit',
      component: BlogEdit
    },
    {
      path: '/blog/:blogId',
      name: 'blog',
      component: BlogShow
    },
    // comments
    {
      path: '/comments',
      name: 'comments',
      component: CommentIndex
    },
    // upload testing
    {
      path: '/upload',
      name: 'upload',
      component: Upload
    },
    // front
    {
      path: '/front',
      name: 'front',
      component: FrontIndex
    },
    {
      path: '/front-tickets',
      name: 'front-ticketks',
      component: FrontTickets
    },
    {
      path: '/front-cartlist',
      name: 'cartlist',
      component: FrontCartlist
    },
    {
      path: '/front-view-ticket/:ticketId',
      name: 'front-view-ticket',
      component: FrontshowTickets
    },
    {
      path: '/front/read/:blogId',
      name: 'front-read',
      component: FrontShow
    },
    // tickets
    {
      path: '/tickets',
      name: 'tickets',
      component: TicketIndex
    },
    {
      path: '/ticket/create',
      name: 'tickets-edit',
      component: TicketCreate
    },
    {
      path: '/ticket/edit/:ticketId',
      name: 'ticket-edit',
      component: TicketEdit
    },
    {
      path: '/ticket/:ticketId',
      name: 'ticket',
      component: TicketShow
    },
    {
      path: '/Cartlist',
      name: 'Cartlist',
      component: Cartlist
    },
  ]
})