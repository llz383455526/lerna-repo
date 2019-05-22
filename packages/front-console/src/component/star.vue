<template>
  <div>
    <i class="el-icon-star-on icon" v-for="(v, k ) in 5" :key="k" :class="{ 'icon-action': k < num }"></i>
  </div>
</template>

<script>
  export default {
    name: "star",
    props: {
      count: {
        type: String,
        default: 'zero-star'
      }
    },
    computed: {
      num() {
        switch (this.count) {
          case 'three-star':
            return 3
          case 'four-star':
            return 4
          case 'five-star':
            return 5
        }
        return 0
      }
    }
  }
</script>

<style scoped>
  .icon {
    color: #ddd;
  }

  .icon-action {
    color: #3589fe;
  }
</style>
