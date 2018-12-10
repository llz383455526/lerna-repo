<template>
<div class="v-modal" v-show="showVModal" @click.self="clickSelf" :style="{ backgroundImage: url}">
    <div class="left" @click="go(-1)">&lt;</div>
    <div class="right" @click="go(1)">&gt;</div>
</div>
</template>

<script>
export default {
    props: {
        prevList: {
            type: Array
        },
        showVModal: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            previewIndex: 0
        }
    },
    computed: {
        url() {
            if (this.prevList.length) {
                return 'url(/api/sysmgr-web/file/download?downloadCode=' + this.prevList[this.previewIndex]
            } else {
                return ''
            }
        }
    },
    methods: {
        clickSelf() {
            this.$emit('clickSelf')
        },
        go(a) {
            if (isNaN(a)) {
                a = 1
            }
            if (this.prevList[this.previewIndex + a]) {
                this.previewIndex += a
            } else {
                if (a > 0) {
                    this.previewIndex = 0
                } else {
                    this.previewIndex = this.prevList.length - 1
                }
            }
        }
    }
}
</script>

<style scoped>
.v-modal {
    z-index: 2001;
    opacity: 1;
    background-color: rgba(0, 0, 0, 0.5);
    background-repeat: no-repeat;
    background-size: 900px 600px;
    background-position: center center;
    transition: all 0.3s;
}

.left {
    position: absolute;
    color: #fff;
    font-size: 40px;
    top: calc(50% - 20px);
    left: calc(50% - 500px);
    cursor: pointer;
    user-select: none;
}

.right {
    position: absolute;
    color: #fff;
    font-size: 40px;
    top: calc(50% - 20px);
    right: calc(50% - 500px);
    cursor: pointer;
    user-select: none;
}
</style>
