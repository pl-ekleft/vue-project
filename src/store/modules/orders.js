import * as fb from 'firebase'

class Order {
  constructor (name, phone, productId, done = false, id = null) { // параметры и их значения по умолчанию
    this.name = name
    this.phone = phone
    this.productId = productId
    this.done = done
    this.id = id
  }
}
export default {
  state: {
    orders: [] // наши заказы
  },
  mutations: {
    // createOrder (state, payload) {
    //  state.orders.push(payload) // добавляем заказы к массиву
    // }
    loadOrders (state, payload) {
      state.orders = payload // добавляем заказы в state
    }
  },
  actions: {
    async createOrder ({commit}, {name, phone, productId, ownerId}) { // создание заказа
      const order = new Order(name, phone, productId) // остальные параметры указаны в конструкторе по умолчанию
      commit('clearError')
      try {
        await fb.database().ref(`/users/${ownerId}/orders`).push(order) // создаем таблицу users, подтаблицу для каждого юзера ownerId и еще одну подтаблицу orders и передаем в неё значения order
      } catch (error) {
        commit('setError', error.message)
        throw error
      }
      // await new Promise((resolve, reject) => {
      //   setTimeout(() => {
      //     resolve()
      //   }, 4000)
      // })
    },
    async fetchOrders ({commit, getters}) { // вывод списка заказаов
      commit('setLoading', true)
      commit('clearError')
      const resultOrders = [] // массив с заказами (результат)
      try {
        const fbVal = await fb.database().ref(`/users/${getters.user.is}/orders`).once('value') // создание таблицы БД
        const orders = fbVal.val()
        console.log(orders)
        Object.keys(orders).forEach(key => {
          const order = orders[key]
          resultOrders.push(new Order(order.name, order.phone, order.productId, order.done, key)) // id находится в ключе, по этому передаем key
        })
        commit('loadOrders', resultOrders)// вызов мутации loadOrders для передачи данных в state
        commit('setLoading', false)
      } catch (error) {
        commit('setError', error.message)
        commit('setLoading', false)
      }
    },
    async markOrderDone ({commit, getters}, payload) { // в payload у нас хранится id нашего заказа
      commit('clearError')
      try {
        await fb.database().ref(`/users/${getters.user.is}/orders`).child(payload).update({// обновляем значение в базеданных на "завезрешшеный заказ"
          done: true
        })
      } catch (error) {
        commit('setError', error.message)
        throw error
      }
    }
  },
  getters: {
    doneOrders (state) { // выполненные заказы
      return state.orders.filter(order => order.done)
    },
    undoneOrders (state) { // невыполненные заказы
      return state.orders.filter(order => !order.done) // фильтруем по невыполненым заказам
    },
    orders (state, getters) { // в начале показываем невыполненные заказы и после выполненные
      return getters.undoneOrders.concat(getters.doneOrders) // делаем новый массив объединяя undoneOrders и doneOrders
    }
  }
}
