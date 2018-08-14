<template>
    <div class="company-build-container company-container">
        <div class="title">调账管理</div>
        <el-form :inline="true">
            <el-form-item label="服务商名称">
                <el-input size="small"></el-input>
            </el-form-item>
            <el-form-item label="操作时间">
                <el-date-picker size="small" v-model="dateValue" type="dateRange" start-placeholder="开始日期" end-placeholder="结束日期" @change="getTime"></el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-button size="small" type="primary">查询</el-button>
            </el-form-item>
        </el-form>
        <el-button size="small" type="primary" @click="show = true">调账申请</el-button>
        <el-table :data="[]">
            <el-table-column label="操作人"></el-table-column>
            <el-table-column label="服务商信息"></el-table-column>
            <el-table-column label="转出渠道信息"></el-table-column>
            <el-table-column label="转入渠道信息"></el-table-column>
            <el-table-column label="金额（元）"></el-table-column>
            <el-table-column label="处理时间"></el-table-column>
            <el-table-column label="调账备注"></el-table-column>
        </el-table>
        <ayg-pagination
            :total="total"
            :currentPage="form.page"
            v-on:handleSizeChange="setSize"
            v-on:handleCurrentChange="query">
        </ayg-pagination>
        <el-dialog title="余额调账操作" :visible.sync="show" width="60%">
            <el-form label-width="140px">
                <el-form-item label="选择商户">
                    <el-select size="small" placeholder="请选择商户名称"></el-select>
                </el-form-item>
                <el-form-item label="选择服务商">
                    <el-select size="small" placeholder="请选择服务商名称"></el-select>
                </el-form-item>
                <el-form-item label="选择渠道">
                    <el-select size="small" placeholder="请选择渠道"></el-select>
                </el-form-item>
                <el-form-item label="选择转出的渠道帐号">
                    <el-select size="small" placeholder="选择转出的渠道帐号"></el-select>
                </el-form-item>
                <el-form-item label="选择转入的渠道帐号">
                    <el-select size="small" placeholder="选择转入的渠道帐号"></el-select>
                </el-form-item>
                <el-form-item label="输入调账金额（元）">
                    <el-input size="small" style="width: 215px;"></el-input>
                </el-form-item>
            </el-form>
            <div class="half">
                <span>帐号当前余额：12345.00元</span>
                <span>帐号当前余额：12345.00元</span>
            </div>
            <div class="half">
                <span>日发放限额：1000000.00元</span>
                <span>日发放限额：1000000.00元</span>
            </div>
            <div class="half">
                <span>当日已发：550000.00元</span>
                <span>当日已发：550000.00元</span>
            </div>
            <div>选择转入帐号后，系统自动切换当前发放渠道帐号到所选的帐号，请确保帐号内金额充足。</div>
            <span slot-scope="footer">
                <el-button size="small" type="primary"></el-button>
                <el-button size="small"></el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
export default {
    data() {
        return {
            form: {
                page: 1
            },
            dateValue: [],
            total: 0,
            show: false
        }
    },
    methods: {
        getTime() {
            if(this.dateValue.length) {

            }
        },
        query() {

        },
        setSize() {

        }
    }
}
</script>
<style scoped>
.title {
    margin-bottom: 20px;
}
.half > span {
  display: inline-block;
  width: 40%;
}
</style>
