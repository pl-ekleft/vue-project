import store from '../store/index'

export default function (to, from, next) { // функция next позволяет делать навигацию и защищать роуты
  if (store.getters.user) {
    console.log('Сессия найдена', store.getters.user.is)
    next()
  } else {
    console.log('Сессии НЕТ', store.getters.user)
    next('/login?loginError=true') // передаем гет параметр loginError в роут
  }
}
