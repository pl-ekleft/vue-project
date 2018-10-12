<template>
    <v-container>
        <section class="product mt-3 elevation-10" v-if="!loading">
            <v-layout row wrap>
                <v-flex xs12 lg6>
                    <v-img :src="product.imageSrc" class="product__img"></v-img>
                </v-flex>
                <v-flex xs12 lg6>
                    <div class="product__info">
                        <h5 class="product__title display-1 mb-3 mt-3">{{ product.title }}</h5>
                        <p class="product__category">
                            <span class="product__title">Vendor: </span>
                            <!-- Берем первую букву вендора и делаем её в верхнем регистра, далее берем и удаляем первую букву у нижнего регистра и склеиваем  строку-->
                            {{ product.vendor.charAt(0).toUpperCase() + product.vendor.substr(1)}}
                        </p>
                        <p class="product__price title">
                            <span class="product__title">Price:</span>
                            ${{ product.price }}
                        </p>
                        <p class="product__color">
                            <span class="product__title">Color:</span>
                            <span
                                :title="product.color"
                                :style="{backgroundColor: product.color}"
                                class="product__color-bg"
                            ></span>
                        </p>
                        <p class="title">
                            <span class="product__title">Material:</span>
                            {{ product.material.charAt(0).toUpperCase() + product.material.substr(1)}}
                        </p>
                        <div class="title mb-5">
                            <p class="product__title mb-2">Description:</p>
                            {{ product.description }}
                        </div>
                        <app-edit-product :product="product" v-if="isOwner"></app-edit-product>
                        <app-buy-dialog :product="product"></app-buy-dialog>
                    </div>
                </v-flex>
            </v-layout>
        </section>
        <section v-else class="text-xs-center">
            <v-progress-circular
                    :size="100"
                    :width="4"
                    color="purple"
                    indeterminate
            ></v-progress-circular>
        </section>
    </v-container>
</template>

<script>
  import EditProduct from './EditProduct'
  export default {
    props: ['id'], // получаем id благодаря props: true,
    computed: {
      product () {
        const id = this.id
        return this.$store.getters.productById(id)
      },
      loading () {
        return this.$store.getters.loading
      },
      isOwner () { // v-if="isOwner"
        // сравниваем id пользователя, который создал запись и текущего
        return this.product.ownerId === this.$store.getters.user.is
      }
    },
    components: {
      appEditProduct: EditProduct
    }
  }
</script>

<style lang="scss" scoped>
    .product {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        border: 1px solid #1c77ad;
        padding: 30px;
        margin-bottom: 100px;
        &__img {
            height: 100%;
            width: 550px;
        }
        &__info {
            margin-left: 50px;
        }
        &__title {
            margin-bottom: 0;
            font-style: 1.6rem;
            font-weight: 600;
            color: blue;
        }
        &__price {
            color: red;
        }
        &__color {
            &-bg {
                display: inline-block;
                width: 50px;
                height: 20px;
                border: 1px solid #2b2b2b;
                border-radius: 10px;
            }
        }
    }
</style>
