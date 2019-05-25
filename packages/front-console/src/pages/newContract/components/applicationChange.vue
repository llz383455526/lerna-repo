<template>
    <div>
        <h3 class="green">请选择客户企业信息</h3>
        <el-form-item label="选择已有客户信息" prop="customerId">
            <el-select style="width:450px;" v-model="contractModel.contractForm.customerId" filterable @change="companyChange">
                <el-option v-for="(item, key) in optionModel.companyIdentityList" :key="key" :label="item.companyName" :value="item.companyId"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="变更版本说明" prop="flowMemo">
            <el-input style="width:450px;" v-model="contractModel.contractForm.flowMemo"></el-input>
        </el-form-item>
        <el-form-item label="版本生效时间" prop="versionStartDate">
            <el-date-picker style="width:450px;" v-model="contractModel.contractForm.versionStartDate" type="month" :picker-options="pickerOptions"></el-date-picker>
        </el-form-item>
    </div>
</template>

<script>
import { get } from "../../../store/api";
import optionModel from '../../../model/option/optionModel'
export default {
    props: ['contractModel'],
    data() {
        return {
            optionModel: new optionModel(),
            pickerOptions:{
                disabledDate(time){
                    let curDate = (new Date()).getTime();
                    let limit = 30 * 24 * 3600 * 1000;
                    let monthsAgo = curDate - limit;
                    let monthsLater = curDate + limit;
                    return time.getTime() > monthsLater || time.getTime() < monthsAgo;
                }
            }
        }
    },
    methods: {
        companyChange(ev) {
            const obj = this.optionModel.companyIdentityList.find(item => {
                return item['companyId'] === ev
            })
            const param = {
                customCompanyName: obj.companyName
            }
            get('/api/contract-web/commom/custom-flow-form', param).then((data) => {
                Object.assign(this.contractModel.contractForm, data.datas, {
                    customerId: ev,
                })
                this.contractModel.workflowType = 'update_sale_contract'
            })
        },
    },
    created() {
        this.optionModel.getCompanyIdentityList()
    }
}
</script>
