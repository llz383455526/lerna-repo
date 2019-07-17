<template>
    <el-dialog
        :visible.sync="visible"
        width="560px"
        class="browser-tip"
        :before-close="handleCancel"
    >
        <div slot="title" class="tip-header">
            <i class="el-icon-warning tip-anticon"></i>
            <span class="tip-title">您当前浏览器的版本太低了</span>
        </div>
        <div class="tip-content">
            <p class="content-text">浏览器版本太低可能会导致页面无法访问，建议您将浏览器升级到最新版本或者选择以下推荐的浏览器</p>
            <br>
            <a class="tip-back" @click="handleCancel">>>>继续访问网站</a>
            <div class="browser-list">
                <a class="browser-link" href="https://www.google.cn/intl/zh-CN/chrome/" target="_blank">
                    <el-badge value="推荐">
                        <img class="browser-img" src="../assets/img/chrome.png" alt="">
                        <span class="link-txt">谷歌浏览器</span>
                    </el-badge>
                </a>
                <a class="browser-link" href="https://browser.qq.com/" target="_blank">
                    <el-badge>
                        <img class="browser-img" src="../assets/img/qq.png" alt="">
                        <span class="link-txt">QQ浏览器</span>
                    </el-badge>
                </a>
                <a class="browser-link" href="https://ie.sogou.com/" target="_blank">
                    <el-badge>
                        <img class="browser-img" src="../assets/img/sogou.png" alt="">
                        <span class="link-txt">搜狗浏览器</span>
                    </el-badge>
                </a>
                <a class="browser-link" href="https://browser.360.cn/" target="_blank">
                    <el-badge>
                        <img class="browser-img" src="../assets/img/360.png" alt="">
                        <span class="link-txt">360浏览器</span>
                    </el-badge>
                </a>
            </div>
        </div>
    </el-dialog>
</template>

<script>
export default {
    name: 'HmBrowserTip',
    props: {
        visible: {
            type: Boolean,
            default: false,
        }
    },
    methods: {
        handleCancel() {
            console.log('cancel')
            this.$emit('cancel')
        },
    },
}
</script>

<style lang="scss">
@import '../style/color.scss';

.browser-tip {
    .el-dialog__body {
        padding: 0 20px 30px 20px;
    }
}

.tip-header {
  .tip-anticon {
    color: #faad14;
    font-size: 22px;
    margin-right: 16px;
    font-style: none;
    vertical-align: -.125em;
    text-align: center;
    text-transform: none;
    line-height: 0;
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  .tip-title {
    color: rgba(0,0,0,.85);
    font-weight: 500;
    font-size: 16px;
    line-height: 1.4;
    overflow: hidden;
  }
}

.tip-content {
    margin: 0 45px;
    font-size: 14px;
    color: rgba(0,0,0,.65);

    .content-text {
        color: $dark-grey;
    }
    .tip-back {
        display: block;
        font-size: 14px;
        text-decoration: none;
        color: $dark-grey;
        line-height: 31px;
        margin-bottom: 16px;
    }

    .browser-list {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
    }

    .browser-link {
        text-decoration: none;
        color: $dark-grey;
        font-size: 12px;
        text-align: center;

        .el-badge__content.is-fixed {
            top: 7px;
            right: 23px;
        }
    }
    .browser-img{
        width: 66px;
        display: block;
        margin: 0 auto;
    }
    .link-txt {
        display: block;
        margin-top: 4px;
    }
}
</style>
