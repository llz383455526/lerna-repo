
<template>
    <div>
        <h3 class="green">归属销售联系信息</h3>
        <el-form-item label="销售姓名" :prop="`${propName}.salesName`">
            <el-select v-model="contract.datas.salesInfo.salesName" filterable placeholder="请选择" style="width: 400px;" @change="changeSales">
                <el-option v-for="item in optionModel.groupUsersList" :key="item.id" :value="item.id" :label="item.name"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="销售联系电话" :prop="`${propName}.mobilePhone`">
            <el-input v-model="contract.datas.salesInfo.mobilePhone" disabled></el-input>
        </el-form-item>
        <el-form-item label="销售地址" :prop="`${propName}.salesAddress`">
            <el-input v-model="contract.datas.salesInfo.salesAddress"></el-input>
        </el-form-item>
    </div>
</template>

<script>
import optionModel from 'src/model/option/optionModel'

export default {
    props: {
        contract: {
            type: Object,
            default() {
                return {}
            }
        }
    },
    data() {
        return {
            propName: 'datas.salesInfo',
            optionModel: new optionModel()
        }
    },
    methods: {
        changeSales(ev) {
            const obj = this.optionModel.groupUsersList.find((item) => {
                return item.id === ev
            })
            this.contract.datas.salesInfo.mobilePhone = obj.mobilephone
            this.contract.datas.salesInfo.email = obj.email
            // this.contract.datas.salesInfo.mobilePhone = obj.mobilePhone
        }
    },
    created() {
        this.optionModel.getGroupUsersList()
    }
}
</script>


<style lang="scss" scoped>
.el-input {
    width: 400px;
}
</style>
