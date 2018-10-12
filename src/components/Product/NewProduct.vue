<template>
    <v-container>
        <v-layout row>
            <v-flex xs12 sm6 offset-sn3>
                <h1 class="text--secondary mb-3">New Product</h1>
                <v-form ref="form" v-model="valid" lazy-validation class="mb-3">
                    <v-text-field name="title" label="Title" type="text" v-model="title" :rules="[v => !!v || 'Title is require']" required></v-text-field>
                    <v-text-field name="vendor" label="Vendor product" type="text" v-model="vendor" ></v-text-field>
                    <v-text-field name="color" label="Color product" type="text" v-model="color" ></v-text-field>
                    <v-text-field name="material" label="Material product" type="text" v-model="material"></v-text-field>
                    <v-text-field name="price" label="Price" type="text" v-model="price" :rules="[v => !!v || 'Price is require']" required></v-text-field>
                    <v-textarea name="description" label="Description" type="text" v-model="description"></v-textarea>
                </v-form>
                <v-layout row class="mb-3">
                    <v-flex xs12>
                        <v-btn class="warning" @click="upload">
                            Upload
                            <v-icon right dark>cloud_upload</v-icon>
                            <input
                                    @change="onFileChange"
                                    ref="fileInput" type="file" style="display: none;" accept="image/*">
                        </v-btn>
                    </v-flex>
                </v-layout>
                <v-layout row>
                    <v-flex xs12>
                        <img :src="imageSrc" alt="" height="200px" v-if="imageSrc">
                    </v-flex>
                </v-layout>
                <v-layout row>
                    <v-flex xs12>
                        <v-switch :label="`Add to promo?`" v-model="promo"></v-switch>
                    </v-flex>
                </v-layout>
                <v-layout row>
                    <v-spacer></v-spacer>
                    <v-btn class="success"
                           :loading="loading"
                           @click="createProduct"
                           :disabled="!valid || !image || loading"
                    >Create Product</v-btn>
                </v-layout>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
  export default {
    data () {
      return {
        title: '',
        vendor: '',
        color: '',
        material: '',
        price: 0,
        description: '',
        promo: false,
        valid: false,
        image: null,
        imageSrc: ''
      }
    },
    computed: {
      loading () {
        return this.$store.getters.loading
      }
    },
    methods: {
      createProduct () {
        if (this.$refs.form.validate() && this.image) { // также отслеживаем картинку
          const product = {
            title: this.title,
            vendor: this.vendor,
            color: this.color,
            material: this.material,
            price: this.price,
            description: this.description,
            promo: this.promo,
            image: this.image
            // valid: this.valid // так не делать :) иначе будет некорректно работать валидация
          }
          // console.log(product)
          this.$store.dispatch('createProduct', product) // т.к. метод асихронный, мы можем вызвать колбэк
            .then(() => {
              this.$router.push('/list') // при успешном создании товара, переадресовываем на страницу list
            })
            .catch(() => {})
        }
      },
      upload () {
        this.$refs.fileInput.click() // обращаемся к локальной референции ref="fileInput"
      },
      onFileChange (event) { // получаем новый евент для обработки картинки когда мы её будем получать
        const file = event.target.files[0] // получаем первый элемент данного масива (картинка)
        const reader = new FileReader() // стандартная библиотека в js
        console.log(reader)
        reader.onload = e => { // прослушка reader, стрелочная функция, параметр e
          this.imageSrc = reader.result // ставим значение в переменную imageSrc из data ()
        }
        reader.readAsDataURL(file) // в метод передаем картинку
        this.image = file  // ставим значение в переменную image из data ()
      }
    }
  }
</script>

<style scoped>

</style>
