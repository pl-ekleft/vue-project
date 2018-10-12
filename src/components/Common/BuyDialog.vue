<template>
    <v-dialog width="400px" v-model="dialog">
        <v-btn dark color="light-blue darken-4" round slot="activator">Bye</v-btn>

        <v-card>
            <v-container>
                <v-layout row>
                    <v-flex xs12>
                        <v-card-title>
                            <h1 class="text--primary">
                                Do you wan't to bue it?
                            </h1>
                        </v-card-title>
                    </v-flex>
                </v-layout>
                <v-divider></v-divider>
                <v-layout row>
                    <v-flex xs12>
                        <v-card-text>
                            <v-text-field
                                    name="name"
                                    label="Yor name"
                                    type="text"
                                    v-model="name"
                            ></v-text-field>
                            <v-text-field
                                    name="phone"
                                    label="Yor phone"
                                    type="text"
                                    v-model="phone"
                            ></v-text-field>
                        </v-card-text>
                    </v-flex>
                </v-layout>
                <v-layout row>
                    <v-flex xs12>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn
                                    flat
                                    outline
                                    @click="onCancel"
                                    :disabled="localLoading"
                            >Close</v-btn>
                            <v-btn
                                    flat
                                    class="success"
                                    @click="onSave"
                                    :disabled="localLoading"
                                    :loading="localLoading"
                            >Buy It!</v-btn>
                        </v-card-actions>
                    </v-flex>
                </v-layout>
            </v-container>
        </v-card>
    </v-dialog>
</template>

<script>
  export default {
    props: ['product'],
    data () {
      return { // модели (v-model)
        dialog: false, // v-model="dialog"
        name: '',
        phone: '',
        localLoading: false // локальная загрузка
      }
    },
    methods: {
      onCancel () {
        this.name = ''
        this.phone = ''
        this.dialog = false
      },
      onSave () {
        if (this.name !== '' && this.phone !== '') {
          this.localLoading = true
          this.$store.dispatch('createOrder', { // сихронное событие
            name: this.name,
            phone: this.phone,
            productId: this.product.id,
            ownerId: this.product.ownerId
          })
            .finally(() => { // в конце чистим форму
              this.name = ''
              this.phone = ''
              this.localLoading = false
              this.dialog = false
            })
        }
      }
    }
  }
</script>

<style scoped>

</style>
