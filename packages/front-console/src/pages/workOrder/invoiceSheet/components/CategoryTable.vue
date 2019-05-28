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
    methods: {
        accAdd(arg1, arg2) {
            var r1, r2, m, c;
            try {
                r1 = arg1.toString().split(".")[1].length;
            }
            catch (e) {
                r1 = 0;
            }
            try {
                r2 = arg2.toString().split(".")[1].length;
            }
            catch (e) {
                r2 = 0;
            }
            c = Math.abs(r1 - r2);
            m = Math.pow(10, Math.max(r1, r2));
            if (c > 0) {
                var cm = Math.pow(10, c);
                if (r1 > r2) {
                    arg1 = Number(arg1.toString().replace(".", ""));
                    arg2 = Number(arg2.toString().replace(".", "")) * cm;
                } else {
                    arg1 = Number(arg1.toString().replace(".", "")) * cm;
                    arg2 = Number(arg2.toString().replace(".", ""));
                }
            } else {
                arg1 = Number(arg1.toString().replace(".", ""));
                arg2 = Number(arg2.toString().replace(".", ""));
            }
            return (arg1 + arg2) / m;
        }
    },
    computed: {
        totalAmount() {
            let total = 0
            this.tableData.forEach(i => {
                // total += Number(i.amount)
                total = this.accAdd(total, i.amount)
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
