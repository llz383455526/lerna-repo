<template>
    <div>
        <el-dialog title="关联销售" :visible.sync="show" width="800px">
            <el-form :model="form" size="small" :inline="true" ref="form">
                <el-form-item label="姓名/电话：" prop="accountInfo">
                    <el-input v-model="form.accountInfo"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button @click="$refs.form.resetFields()">清除</el-button>
                    <el-button type="primary" @click="query">查询</el-button>
                </el-form-item>
            </el-form>
            <el-table :data="listData.list" @selection-change="selectionChange" ref="table">
                <el-table-column type="selection" :selectable="selectable"></el-table-column>
                <el-table-column label="姓名" prop="name"></el-table-column>
                <el-table-column label="手机号" prop="mobilephone"></el-table-column>
            </el-table>
            <ayg-pagination
                v-if="listData.total"
                :total="listData.total"
                v-on:handleSizeChange="sizeChange"
                :currentSize="form.pageSize"
                v-on:handleCurrentChange="query"
                :currentPage="form.page">
            </ayg-pagination>
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
    data() {
        return {
            form: {
                platFormType: 'console-admin',
                accountInfo: '',
                page: 1,
                pageSize: 10
            },
            show: false,
            listData: [],
            selectList: [],
            saleList: []
        }
    },
    methods: {
        transmit(a) {
            Object.assign(this, a)
            this.selectList = []
            this.query()
        },
        query(a) {
            if(isNaN(a)) {
                a = 1
            }
            this.form.page = a
            post(sysmgr.userList, this.form).then(data => {
                this.listData = data
                this.$nextTick(() => {
                    this.listData.list.forEach(e => {
                        if(this.selectList.filter(ev => ev.id == e.id).length) {
                            this.$refs.table.toggleRowSelection(e)
                        }
                    })
                })
            })
        },
        sizeChange(a) {
            this.form.pageSize = a
            this.query()
        },
        selectionChange(a) {
            a.forEach(e => {
                if(!this.selectList.filter(ev => ev.id == e.id).length) {
                    this.selectList.push(e)
                }
            })
            console.log(this.selectList)
        },
        selectable(a) {
            return !this.saleList.filter(e => e.id == a.id).length
        },
        sure() {
            this.show = false
            this.$emit('result', this.saleList.concat(this.selectList))
        }
    }
}
</script>
<style scoped>

</style>
