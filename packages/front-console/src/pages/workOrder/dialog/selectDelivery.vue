<template>
    <div>
        <el-dialog title="关联交付" :visible.sync="show" width="500px">
            <el-form size="small">
                <el-form-item label="选择交付">
                    <el-select v-model="delivery" filterable>
                        <el-option v-for="e in list" :key="e.id" :value="e.id" :label="e.name"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="show = false">取消</el-button>
                <el-button type="primary" @click="sure">确认</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import { get, post } from "src/store/api";
import { sysmgr } from "src/api";
export default {
    props: {
        customCompanyId: {
            type: null,
            default: ''
        }
    },
    data() {
        return {
            show: false,
            delivery: '',
            list: []
        }
    },
    methods: {
        transmit(a) {
            Object.assign(this, a)
            this.getList()
        },
        getList() {
            get(sysmgr.getGroupUsers, { relationKey: 'DeliverUserRelation' }).then(data => {
                this.list = data
            })
        },
        sure() {
            this.show = false
            this.$emit('result', this.list.filter(e => e.id == this.delivery)[0])
        }
    }
}
</script>
<style scoped>

</style>
