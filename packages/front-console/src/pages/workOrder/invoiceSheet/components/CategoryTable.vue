<template>
    <div class="category-table">
        <el-input
            readonly
            class="shortinput"
            :value="totalAmount"
        ></el-input>
        <el-table
            border
            :data="tableData"
            style="width: 100%">
            <el-table-column
                prop="subjectText"
                label="发票类目">
            </el-table-column>
            <el-table-column
                prop="amount"
                label="开票金额（含税）">
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
export default {
    props: {
        tableData: {
            type: Array,
            default() {
                return [{
                    amount:1.23,
                    subjectId:10008,
                    subjectText:'dddd'
                }]
            }
        }
    },
    data() {
        return {
        }
    },
    computed: {
        totalAmount() {
            let total = 0
            this.tableData.forEach(i => {
                total += Number(i.amount)
            })
            return total
        }
    },
    created() {
        // 这里获取发票信息
    }
}
</script>

<style lang="scss" scoped>
.category-table{
    width: 500px;
}
.el-input{
    margin-bottom: 10px;
}
</style>
