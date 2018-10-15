<template>
  <div class="steps" :style="{ 'height': height ? height + 'px' : '' }" ref="box">
    <div class="item" :class="{action: k + 1 <= index, finish: k + 2 <= index}" v-for="(v, k) in dataArr" :key="k">
      <div class="step">
        <span class="num" :class="{cancle: index == 0}">
            <template v-if="k + 2 <= index">
                <i class="iconfont icon-weibiaoti14"></i>
            </template>
            <template v-else>
                {{k + 1}}
            </template>
        </span>
        <span class="title" :class="{cancle_text: index == 0}">{{v}}</span>
      </div>
      <span v-if="k < dataArr.length - 1" class="line" :style="{ 'width': itemWidth ? itemWidth + 'px' : '', 'background-color':  index == k + 1 ? '#E9E9E9' : ''}"></span>
    </div>
  </div>
</template>

<script>
export default {
  name: "steps",
  props: ["dataArr", "index", "interval", "width", "height", 'paddingWidth'],
  data() {
      return{
          old: '',
          itemWidth: '',
          frame: ''
      }
  },
  mounted() {
    this.countWidth()
  },
  methods: {
      countWidth() {
        this.frame = requestAnimationFrame(this.countWidth)
        if(this.$refs['box']) {
            var boxWidth = this.$refs['box'].offsetWidth
            if(this.old != boxWidth) {
                this.old = boxWidth
                this.itemWidth = ( boxWidth - 120 - (this.paddingWidth || 69) * this.dataArr.length + 34 ) / ( this.dataArr.length - 1 )
            }
        }
        else {
            cancelAnimationFrame(this.frame)
        }
      }
  }
};
</script>

<style lang="scss" scoped>
.steps {
  background-color: #fff;
  padding: 60px 60px;
  box-shadow: 0 2px 6px 0 rgba(204, 204, 204, 0.4);
  display: flex;
  justify-content: center;
  .item {
    display: flex;
    align-items: center;
    .step {
      width: 35px;
      height: 35px;
      position: relative;
      .num {
        position: relative;
        right: 6px;
        width: 35px;
        height: 35px;
        border-radius: 50%;
        border: 1px solid #bcbcbc;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #999999;
      }
      .title {
        position: absolute;
        left: -31px;
        bottom: -37px;
        text-align: center;
        width: 100px;
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color: #999999;
        line-height: 21px;
      }
    }
    .line {
      display: inline-block;
      background-color: #e9e9e9;
      height: 1px;
      width: 259px;
      margin: 0 20px;
    }
  }
  .action {
    > .step {
      > .num {
        background: #108ee9;
        border: 1px solid #008ff0;
        color: #fff;
      }
      > .title {
        color: #666666;
      }
    }
    > .line {
      background-color: #108ee9;
    }
  }
  .finish {
      > .step {
          > .num {
              background-color: transparent;
              color: #108ee9;
              > i::before {
                  font-size: 25px;
              }
          }
      }
  }
}
.index0 {
    filter: grayscale(1);
}
.cancle {
    background-color: #D8D8D8;
    border-color: #D8D8D8 !important;
    color: #fff !important;
}
.cancle_text {
    color: #D8D8D8 !important;
}
</style>
