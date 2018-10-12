import Vue from 'vue'
import Router from 'vue-router'
import AuthGuard from './auth-guard' // проверка доступа к роутам
import Home from '@/components/Home' // @ означает, что смотрим из корня нашего приложения т.е. из src
import Product from '@/components/Product/Product'
import NewProduct from '@/components/Product/NewProduct'
import ProductList from '@/components/Product/ProductList'
import Checkout from '@/components/User/Checkout'
import Login from '@/components/Auth/Login'
import Registration from '@/components/Auth/Registration'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '',
      name: 'home',
      component: Home
    },
    {
      path: '/product/:id',
      props: true, // передаем текущий айдишник как параметр в компонент
      name: 'product',
      component: Product
    },
    {
      path: '/new',
      name: 'new',
      component: NewProduct,
      beforeEnter: AuthGuard // проверка прав доступа
    },
    {
      path: '/list',
      name: 'list',
      component: ProductList,
      beforeEnter: AuthGuard // проверка прав доступа
    },
    {
      path: '/checkout',
      name: 'checkout',
      component: Checkout,
      beforeEnter: AuthGuard // проверка прав доступа
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/registration',
      name: 'registration',
      component: Registration
    }
  ],
  mode: 'history'
})
