<template>
  <div ref="PerformanceManagerChert" class="performance-manager-chert"></div>
</template>

<script>
  import ECharts from 'echarts'
  export default {
    name: "PerformanceManagerChert",
    props: ['model'],
    methods: {
      initData() {
        // 基于准备好的dom，初始化echarts实例
        const myChart = ECharts.init(this.$refs.PerformanceManagerChert);
        const xTitles = []
        const XNums = []
          const list = [...this.model.companyRiskRateDataDTOList].reverse()
          if (list.length > 0) {
              const lastItem = list[list.length - 1]
              if (lastItem.cuserQuarterSignRate === null) {
                  list.pop()
              }
          }
          list.forEach((item) => {
          xTitles.push(`${item.year}/${item.month}`)
            let num = 0
            if (item.cuserQuarterSignRate && item.cuserSignRate) {
                num = item.cuserQuarterSignRate > item.cuserSignRate ? item.cuserSignRate : item.cuserQuarterSignRate
            } else if (item.cuserQuarterSignRate) {
                num = item.cuserQuarterSignRate
            } else if (item.cuserSignRate) {
                num = item.cuserSignRate
            }
            XNums.push(num)
        })

        // 指定图表的配置项和数据
        const option = {
          tooltip : {
            trigger: 'axis',
            axisPointer: {
              type: 'cross',
              label: {
                backgroundColor: '#6a7985'
              }
            },
            formatter: '加权签约率{c0}%'
          },
          xAxis: {
            name: '统计时间',
            type: 'category',
            data: xTitles
          },
          yAxis: {
            name: '签约率',
            nameLocation: 'end',
            type: 'value',
            min: 0,
            max: 100
          },
          series: [{
            data: XNums,
            type: 'line',
            label: {
              normal: {
                show: true,
                position: 'top'
              }
            },
          }]
        };

        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
      }
    },
    mounted() {
      this.initData()
    }
  }
</script>

<style scoped lang="scss">
  .performance-manager-chert {
    height: 400px;
  }
</style>
