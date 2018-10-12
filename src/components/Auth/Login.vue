<template>
    <v-container fluid fill-height>
        <v-layout align-center justify-center>
            <v-flex xs12 sm8 md6>
                <v-card class="elevation-12">
                    <v-toolbar dark color="primary">
                        <v-toolbar-title>Login form</v-toolbar-title>
                    </v-toolbar>
                    <v-card-text>
                        <v-form ref="form" v-model="valid" lazy-validation>
                            <v-text-field prepend-icon="person" name="email" label="Email" type="email" v-model="email" :rules="emailRules"></v-text-field>
                            <v-text-field prepend-icon="lock" name="password" label="Password" type="password" v-model="password" :rules="passwordRules" :counter="6"></v-text-field>
                        </v-form>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="primary" @click="onSubmit"
                               :loading="loading"
                               :disabled="!valid || loading">Login</v-btn>
                    </v-card-actions>
                </v-card>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
  export default {
    name: 'Login',
    data () {
      return {
        email: '',
        password: '',
        valid: false,
        emailRules: [
          v => !!v || 'E-mail is required',
          v => /.+@.+/.test(v) || 'E-mail must be valid'
        ],
        passwordRules: [
          v => !!v || 'Password is required',
          v => (v && v.length >= 6) || 'Password must be equal or than 6 characters'
        ]
      }
    },
    computed: {
      loading () { // далее бандим данное свойство в кнопку
        return this.$store.getters.loading
      }
    },
    methods: {
      onSubmit () {
        if (this.$refs.form.validate()) {
          const user = {
            email: this.email,
            password: this.password
          }
          // console.log(user)
          this.$store.dispatch('loginUser', user)
            .then(() => { // отслеживаем состояние хода регистрации
              this.$router.push('/') // успех, переадресовываем на главную через роут
            })
            .catch(() => {}) // .catch(err => console.log(err)) // если ошибка
        }
      }
    },
    created () { // жизненный цикл - создание
      if (this.$route.query['loginError']) { // проверка наличия get параметра loginError в $route
        this.$store.dispatch('setError', 'Please log in to access this page') // диспатчим ошибку
      }
    }
  }
</script>

<style scoped>

</style>
