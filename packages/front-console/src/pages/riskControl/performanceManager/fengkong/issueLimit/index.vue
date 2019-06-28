<template>
    <div class="new-contract-issue-limit">
        <el-dialog
            :visible.sync="isShow"
            width="1100px">
            <div slot="title">
                {{ item.companyName }}
                <span style="font-size: 12px; color: #999">
                    限额明细
                </span>
            </div>
           <w-limit :company-id="item.companyId"/>
            <span slot="footer" class="dialog-footer">
                <el-button @click="isShow = false" size="small">取 消</el-button>
                <el-button type="primary" @click="isShow = false" size="small">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import WLimit from '../../../../../component/fengkong/limitRule'
    export default {
        name: "PerformanceManagerIssueLimit",
        components: {
            WLimit
        },
        data() {
            return {
                item: {},
                isShow: false
            }
        },
        methods: {
            show(item) {
                this.item = item
                this.isShow = true
            }
        }
    }
</script>

<style scoped lang="scss">

</style>
