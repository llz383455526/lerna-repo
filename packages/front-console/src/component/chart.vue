<script>
  import {Line, mixins} from 'vue-chartjs'
  const { reactiveProp } = mixins
  console.log(Line)
  export default {
    extends: Line,
    mixins: [reactiveProp],
    props: ['chartData'],
    mounted () {
      this.renderChart(this.chartData, {responsive: true, maintainAspectRatio: false})
    }
  }
</script>
