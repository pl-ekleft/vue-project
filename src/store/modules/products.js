import * as fb from 'firebase'

class Product { // прописываем все поля в конструкторе и далее в actions (ниже)
  constructor (title, vendor, color, material, price, description, ownerId, imageSrc = '', promo = false, id = null) {
    this.title = title
    this.vendor = vendor
    this.color = color
    this.material = material
    this.price = price
    this.description = description
    this.ownerId = ownerId
    this.imageSrc = imageSrc
    this.promo = promo
    this.id = id
  }
}

export default {
  state: {
    products: []
    // products: [
    //   {
    //     id: '1',
    //     title: 'Lenovo Legion Y520',
    //     vendor: 'Lenovo',
    //     color: 'black',
    //     material: 'metal/plastic',
    //     description: 'Intel Core i5 7300HQ 2500 MHz/15.6"/1920x1080/8Gb/1000Gb HDD/DVD нет/NVIDIA GeForce GTX 1050, 4096 МБ/Wi-Fi/Bluetooth/Win 10 Home',
    //     price: 760,
    //     promo: false,
    //     imageSrc: 'https://image.ibb.co/fZzq1o/Lenovo_Legion_Y520.jpg'
    //   },
    //   {
    //     id: '2',
    //     title: 'Asus FX503VD',
    //     vendor: 'Asus',
    //     color: 'white',
    //     material: 'plastic',
    //     description: 'Intel Core i5 7300HQ 2500 MHz/15.6"/1920x1080/8Gb/256Gb SSD/DVD нет/NVIDIA GeForce GTX 1050/Wi-Fi/Bluetooth/Windows 10 Home',
    //     price: 984,
    //     promo: true,
    //     imageSrc: 'https://image.ibb.co/cpScgo/ASUS_FX503_VD.jpg'
    //   },
    //   {
    //     id: '3',
    //     title: 'ASUS TUF Gaming FX504GD',
    //     vendor: 'Asus',
    //     color: 'black',
    //     material: 'metal/plastic',
    //     description: 'Intel Core i7 8750H 2300 MHz/15.6"/1920x1080/12Gb/1000Gb HDD/DVD нет/NVIDIA GeForce GTX 1050, 4096 МБ/Wi-Fi/Bluetooth/Win 10 Home',
    //     price: 1220,
    //     promo: true,
    //     imageSrc: 'https://image.ibb.co/jBZOMo/ASUS_TUF_Gaming_FX504_GD.jpg'
    //   },
    //   {
    //     id: '4',
    //     title: 'HP Omen 17',
    //     vendor: 'Hp',
    //     color: 'black',
    //     material: 'metal/plastic',
    //     description: 'Intel Core i7 7700HQ 2800 MHz/17.3"/1920x1080/12Gb/1128Gb HDD+SSD/DVD-RW/NVIDIA GeForce GTX 1060/Wi-Fi/Bluetooth/Windows 10 Home',
    //     price: 1600,
    //     promo: false,
    //     imageSrc: 'https://image.ibb.co/g6czu8/HP_Omen_17.jpg'
    //   },
    //   {
    //     id: '5',
    //     title: 'Acer Swift 5 SF514',
    //     vendor: 'Acer',
    //     color: 'gold',
    //     material: 'metal',
    //     description: 'Intel Core i7 8550U 1800 MHz/14"/1920x1080/16Gb/512Gb SSD/DVD нет/Intel HD Graphics 620/Wi-Fi/Bluetooth/Windows 10 Home',
    //     price: 1100,
    //     promo: true,
    //     imageSrc: 'https://image.ibb.co/mrOsgo/Acer_Swift_5.jpg'
    //   },
    //   {
    //     id: '6',
    //     title: 'Apple MacBook (MLHC2RU/A)',
    //     vendor: 'Apple',
    //     color: 'silver',
    //     material: 'metal',
    //     description: 'Intel Core m3 1200 MHz/12"/2304x1440/8Gb/256Gb SSD/DVD нет/Intel HD Graphics 615/Wi-Fi/Bluetooth/MacOS X',
    //     price: 980,
    //     promo: true,
    //     imageSrc: 'https://image.ibb.co/fxDsgo/Apple_macbook.jpg'
    //   }
    // ]
  },
  mutations: {
    createProduct (state, payload) {
      state.products.push(payload)
    },
    loadProducts (state, payload) { // мутация на формирование массива продуктов
      state.products = payload
    },
    updateProduct (state, {title, description, id}) {
      const product = state.products.find(a => {
        return a.id === id // возвращаем совпадающие id
      })
      product.title = title
      product.description = description
    }
  },
  actions: {
    async createProduct ({commit, getters}, payload) {
      commit('clearError') // чистим сообщения об ошибках
      commit('setLoading', true) // запускаем лоад
      const image = payload.image
      try {
        console.log(getters.user)
        const newProduct = new Product(
          payload.title,
          payload.vendor,
          payload.color,
          payload.material,
          payload.price,
          payload.description,
          getters.user.is, // ownerId - получаем айди юзера из is, который создал товар
          '', // вместо payload.imageSrc, передаем  пустую строку
          payload.promo
          // id не создаем т.к. будем получать его от firebase
        )
        const product = await fb.database().ref('products').push(newProduct) // данные продукта из БД
        const imageExt = image.name.slice(image.name.lastIndexOf('.')) // ищем расширение картинки по символу "точка" и сохраняем в переменную
        const fileData = await fb.storage().ref(`products/${product.key}.${imageExt}`).put(image) // отправляем картинку в БД products асихронно указав имя файла из ключа и его расширение/формат
        const imageSrc = await fb.storage().ref().child(fileData.ref.fullPath).getDownloadURL() // обращаемся в сторедж фаербейса к таближе ref() и ищем нашу картинку используя переменную fileData (т.е. ответ на запрос) и далее вызываем метод getDownloadURL
        await fb.database().ref('products').child(product.key).update({ imageSrc }) // записываем данные о картинке в БД (как всегда, асихронно по этому await)
        // console.log(product)
        console.log(product.key)
        commit('setLoading', false)
        commit('createProduct', {
          ...newProduct, // разворачиваем объект (диструкция), который был получен выше
          id: product.key, // обновляем ключ продукта взяв его из БД
          imageSrc // сохраняем значение imageSrc: imageSrc
        })
      } catch (error) {
        commit('setError', error.message)
        commit('setLoading', false)
        throw error //  выброс ошибки для обработки в промисе
      }
    },
    async fetchProducts ({commit}) { // т.к. работаем с базой данных, делаем данный экшен асихронным
      commit('clearError')
      commit('setLoading', true)
      console.log('fetchProducts')
      const resultProducts = [] // определяем пустой массив в константе
      try {
        const productsVal = await fb.database().ref('products').once('value') // обращаемся к нашей таблице products и единожды забираем данные value
        const products = productsVal.val() // специальный метод val
        Object.keys(products).forEach(key => { // пробегаемся по объекту
          const product = products[key]
          resultProducts.push( // пушим данные в константу
            new Product(
              product.title,
              product.vendor,
              product.color,
              product.material,
              product.price,
              product.description,
              product.ownerId,
              product.imageSrc,
              product.promo,
              key // в id передаем key
            )
          )
          commit('loadProducts', resultProducts)
          commit('setLoading', false)
        })
      } catch (error) {
        commit('setError', error.message)
        commit('setLoading', false)
        throw error
      }
    },
    async updateProduct ({commit}, {title, description, id}) { // вместо payload мы знаем, что передаем title, description, id
      commit('clearError') // чистим ошибки
      commit('setLoading', true) // активируем лоайдер
      try {
        // выборка в БД таблица products по id и обновляем данные таблицы
        await fb.database().ref('products').child(id).update({
          title,
          description
        })
        commit('updateProduct', { // вызываем мутацию
          title,
          description,
          id
        })
        commit('setLoading', false) // прячем лоадер
      } catch (error) { // обрабатываем ошибки
        commit('setError', error.message)
        commit('setLoading', false) // прячем лоадер
        throw error // выбрасываем ошибку
      }
    }
  },
  getters: {
    products (state) { // передаем state (см. выше)
      return state.products
    },
    promoProducts (state) {
      return state.products.filter(product => {
        return product.promo // для каждой итерации возвращаем значение promo
      })
    },
    myProducts (state, getters) { // отдаем данные для раздела мои продукты, для их редактирования
      return state.products.filter(product => { // на каждой итерации получаем product
        return product.ownerId === getters.user.is // сверяем id автора записи и id текущего пользователя, если совпадает, то отдаем запись
      })
    },
    productById (state) { // функция замыкания
      return productId => {
        return state.products.find(product => product.id === productId) // сравниваем id, если совпадает то возвращаем нужный продукт
      }
    }
  }
}
