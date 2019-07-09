<template>
    <transition name="router-fade" mode="out-in">
        <div class="route-container">
            <router-view></router-view>
          <hm-browser-tip :visible="tipVisible" @cancel="tipVisible = false"></hm-browser-tip>
        </div>
    </transition>
</template>

<script>
import { mapGetters } from 'vuex'
import HmBrowserTip from './component/browserTip.vue'
import { getBrowserInfo } from './plugin/utils-functions'

export default {
  components: {
    HmBrowserTip,
  },
  data() {
    return {
      tipVisible: false,
    }
  },
  computed: {
    ...mapGetters({
      principalMenu: 'principalMenu',
      userInformation: 'userInformation',
    }),
    // 是否要提示浏览版本过低
    needTip() {
      const sys = getBrowserInfo()
      // 非Chrome 或 Chrome < 40
      if (sys.browser === 'chrome' && sys.ver.split('.')[0] >= 40) {
        return false
      }
      return true
    },
  },
  watch: {
    principalMenu(menu) {
      if(menu && menu.length && this.$route.fullPath == '/main'){
        // console.log(menu[0].children[0].action)
        // this.$router.push(menu[0].children[0].action)
        if(this.userInformation.userProfile && this.userInformation.userProfile.subjectType !== 'agent') {
            this.$router.push('/main/workOrder/workOrderIndex')
        } else {
            // 遍历找到发放流水
            // menu.forEach((item) => {
            //     console.log(item.title)
            //     if (item.title === '流水管理') {
            //         console.log(item)
            //     }
            // })
            if(menu[0].children && menu[0].children.length) {
                this.$router.push(menu[0].children[0].action)
            } else {
                this.$router.push(menu[0].action)
            }
        }
      }
    }
  },
  mounted() {
    if (this.needTip) {
      this.tipVisible = true
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
<style lang="scss">
@import './sass/style.scss';
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
.hidden_label .el-radio__label {
    display: none;
}
.el-select-dropdown {
    width: 300px;
}
    .wrap {
        margin-top: 15px;background-color: #fff;padding: 15px;
    }
    .title {
        margin: 0px 30px 30px;
    }
</style>

















