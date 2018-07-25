<template>
    <div class="main">
        <div class="top">
            <div class="item" v-for="e in top" :key="e.name">
                <div>
                    <i class="iconfont icon-user"></i>
                    <span>{{e.name}}</span>
                </div>
                <div>
                    {{e.count}}
                </div>
                <div v-if="e.new">
                    <i class="iconfont icon-shangjiantou"></i>
                    <span>
                        昨日新增
                        <span class="E74C3C">{{e.new}}</span>
                    </span>
                </div>
            </div>
        </div>
        <div class="table">
            <div class="t_head">
                <span>开票数据统计</span>
                <span>开票金额及纳税金额</span>
                <el-date-picker
                    class="pick"
                    v-model="value6"
                    type="daterange"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期">
                </el-date-picker>
            </div>
            <chart :chartData="chartData"></chart>
        </div>
        <div class="bottom">
            <div class="waitDeal">
                <div>待处理订单</div>
            </div>
        </div>
    </div>
</template>
<script>
import { Line } from 'vue-chartjs'
import chart from '../../component/chart'
export default {
    data() {
        return {
            top: [
                {
                    name: '总客户数',
                    count: 2500,
                    new: 25
                },
                {
                    name: '已开个体户',
                    count: 1250,
                    new: 10
                },
                {
                    name: '已开发票数',
                    count: 3212,
                    new: 32
                },
                {
                    name: '开票总金额',
                    count: 67328341.00
                },
                {
                    name: '纳税总金额',
                    count: 7328341.00
                }
            ],
            value6: [],
            chartData: {
                labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                datasets: [
                  {
                    label: 'Data One',
                    backgroundColor: 'rgba(200, 100, 200, .3)',
                    data: [40, 39, 10, 40, 39, 80, 40]
                  },{
                    label: 'Data Two',
                    backgroundColor: 'rgba(100, 200, 100, .3)',
                    data: [60, 55, 32, 10, 2, 12, 53]
                  }
                ]
            }
        }
    },
    components: {
        chart
    },
    mounted() {

    },

}
</script>
<style scoped>
.main {
    margin: 15px;
    padding: 15px;
    background-color: #f7f7f7;
}
.top {
    display: flex;
    padding: 15px 0 50px;
}
.item {
    flex: 1;
    height: 65px;
    border-right: 2px solid #ADB2B5;
    color: #ADB2B5;
    padding: 0 10px 0 20px;
}
.item > div:nth-child(1) {
    font-size: 13px;
}
.item > div:nth-child(2) {
    font-size: 28px;
    line-height: 47px;
    color: #73879C;
    font-weight: bold;
}
.item > div:nth-child(3) {
    font-size: 13px;
}
.item > div:nth-child(3) > i::before {
    position: relative;
    top: -2px;
    font-size: 12px;
}
.E74C3C{
    color: #E74C3C;
}
.table {
    background-color: #fff;
    margin: 0 25px;
}
.t_head {
    height: 60px;
    padding: 15px 20px 0px;
    border-bottom: 2px solid #e6e9ed;
}
.t_head > span:nth-child(1) {
    font-size: 24px;
    color: #73879C;
    font-weight: bold;
}
.t_head > span:nth-child(2) {
    font-size: 15px;
    color: #777;
}
.pick {
    position: relative;
    top: -4px;
    float: right;
}
.bottom {
    margin-top: 20px 25px 0px;
}
.waitDeal {
    width: 70%;
    padding: 10px 17px;
}
.waitDeal > div:nth-child(1) {
    font-size: 18px;
    font-weight: 400;
}
</style>