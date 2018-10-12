import Vue from 'vue'
import App from './App'
import BuyDialogComponent from '@/components/Common/BuyDialog'
import router from './router'
import Vuetify from 'vuetify'
import store from './store' // настройка vuex
import * as fb from 'firebase/app' // импорт firebase
import 'vuetify/dist/vuetify.min.css'

Vue.use(Vuetify)
Vue.component('app-buy-dialog', BuyDialogComponent)
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store, // настройка vuex
  components: { App },
  template: '<App/>',
  created () {
    // жизненный цикл создание
    var config = {
      // конфигурация с firebase
      apiKey: 'AIzaSyDxpTPo47jaxJ8bSDv9PJduvRA2HIHKp_s',
      authDomain: 'onlinestore-1f7cd.firebaseapp.com',
      databaseURL: 'https://onlinestore-1f7cd.firebaseio.com',
      projectId: 'onlinestore-1f7cd',
      storageBucket: 'onlinestore-1f7cd.appspot.com',
      messagingSenderId: '516638137019'
    }
    fb.initializeApp(config)
    fb.auth().onAuthStateChanged(user => { // firebase проверит локальное хранилище и если обнаружит авторизацию, то продлит сессию
      if (user) { // проверяем наличие юзера
        this.$store.dispatch('autoLoginUser', user) // экшен autoLoginUser в user.js
      }
    })
    this.$store.dispatch('fetchProducts') // экшен fetchProducts в store/modules/products.js
  }
})
