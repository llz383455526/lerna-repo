<!--
@description 数据统计组件，常用于表格顶部
@author llz
@date 2019-6-26
-->
<template>
    <div class="statistics-box">

        <el-row :gutter="2">
            <el-col 
                :span="colSpan"
                v-for="item in dataList"
                :key="item.title"> 
                <span>{{item.title}}:</span>
                <span v-if="item.type==TYPE.MONEY">{{item.value | formatMoney}}</span>
                <span v-else>{{item.value}}</span>
                <i v-show="item.showTip" class="el-icon-question" style="margin-left:5px;color:#f56c6c;cursor:pointer;" title="所选条件下的发放成功和发放中的金额总数"></i>
            </el-col>
        </el-row>
    </div>
    
</template>
<script>
export default {
    name: 'statistics-box',
    props: {
        dataList: {
            type: Array,    //[{title: '', value: ''}]
            default(){
                return [{
                    title: '',
                    type: '', //类型，主要是判断是否为金额类型
                    value: '',
                    showTip: false //是否显示提示 icon
                }]
            }
        }
    },
    data(){
        return {
            TYPE: {
                'MONEY': 1
            },
            colSpan: 8
        }
    },
    watch: {
        dataList: function(){
            let _colSpan = Math.floor(24/this.dataList.length)
            this.colSpan = _colSpan > 8 ? 8 : _colSpan // 最小分 3 列
        }
    }
}
</script>
<style lang="less" scoped>
.statistics-box {
    padding-top: 20px;
}

</style>


</style>


