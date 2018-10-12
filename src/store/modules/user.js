import * as fb from 'firebase' // импорт firebase

class User {
  constructor (id) {
    this.is = id
  }
}

export default {
  state: {
    user: null
  },
  mutations: {
    setUser (state, payload) {
      state.user = payload
    }
  },
  actions: {
    async registerUser ({commit}, {email, password}) { // payload
      commit('clearError') // чистим ошибки с помощью мутации
      commit('setLoading', true) // начало загрузки
      try { // если успех
        const user = await fb.auth().createUserWithEmailAndPassword(email, password) // константа, наш юзер (await позволяет работать с user как с обычной переменной)
        commit('setUser', new User(user.uid))
        commit('setLoading', false)
      } catch (error) { // если ошбика
        commit('setLoading', false) // конец загрузки
        commit('setError', error.message) // выводим ошибку
        throw error
      }
        //  .then(user => {
        //    // uid, который пришел с firebase передаем в класс User
        //    commit('setUser', new User(user.uid))
        //    commit('setLoading', false) // конец загрузки
        //  })
        // .catch(error => { // отслеживаем ошибку
        //   commit('setLoading', false) // конец загрузки
        //   commit('setError', error.message) // выводим ошибку
        // })
    },
    async loginUser ({commit}, {email, password}) {
      commit('clearError') // чистим ошибки с помощью мутации
      commit('setLoading', true) // начало загрузки
      try { // если успех
        const user = await fb.auth().signInWithEmailAndPassword(email, password) // константа, наш юзер (await позволяет работать с user как с обычной переменной)
        commit('setUser', new User(user.uid))
        // console.log(user, user.is)
        commit('setLoading', false)
      } catch (error) { // если ошибка
        commit('setLoading', false) // конец загрузки
        commit('setError', error.message) // выводим ошибку
        throw error
      }
    },
    autoLoginUser ({commit}, payload) { // поддержка сессии
      // console.log(payload.uid)
      commit('setUser', new User(payload.uid))
    },
    logoutUser ({commit}) { // разлогинивание
      fb.auth().signOut()
      commit('setUser', null) // вызываем мутацию setUser и ставим null
    }
  },
  getters: {
    user (state) {
      return state.user
    },
    isUserLoggedIn (state) {
      return state.user !== null
    }
  }
}
