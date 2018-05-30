<template>
    <transition name="router-fade" mode="out-in">
        <div class="route-container">
            <router-view></router-view>
        </div>
    </transition>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  computed: {
    ...mapGetters({
      principalMenu: 'principalMenu'
    })
  },
  watch: {
    principalMenu(menu) {
      if(menu && menu.length && this.$route.fullPath == '/main'){
        console.log(menu[0].children[0].action)
        this.$router.push(menu[0].children[0].action)
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.router-fade-enter-active,
.router-fade-leave-active {
  transition: opacity 0.3s;
}

.router-fade-enter,
.router-fade-leave-active {
  opacity: 0;
}

.route-container {
  width: 100%;
}
</style>

















