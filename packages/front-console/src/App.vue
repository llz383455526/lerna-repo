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
<style>
*{
  box-sizing: border-box;
}
html, body {
  margin: 0;
  padding: 0;
}
.el-menu--horizontal .el-submenu .el-submenu__icon-arrow {
    position: static;
    vertical-align: middle;
    margin-left: 8px;
    margin-top: -3px;
}
.el-step__head.is-process {
  color: #c0c4cc;
  border-color: #c0c4cc;
}
.el-step__title.is-process {
  color: #c0c4cc;
}
.el-submenu__title {
  padding: 0px 10px;
}
.el-col {
    word-break: break-all;
}
</style>

















