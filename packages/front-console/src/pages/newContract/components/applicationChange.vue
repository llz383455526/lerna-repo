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
                    const monthMap = {
                        28: [2],
                        30: [4,6,9,11],
                        31: [1,3,5,7,8,10,12]
                    }
                    let curDate = new Date();
                    const curMonth = curDate.getMonth()+1;
                    const preMonth = curMonth - 1 <= 0 ? 12 : curMonth -1; 
                    const afterMonth = curMonth + 1 >= 13 ? 1 : curMonth + 1;
                    let curMonthDay,preMonthDay,afterMonthDay;
                    for(const day in monthMap) {
                        if (monthMap[day].indexOf(preMonth) > -1) {
                            preMonthDay = parseInt(day)
                        }
                        if (monthMap[day].indexOf(afterMonth) > -1) {
                            afterMonthDay = parseInt(day)
                        }
                        if (monthMap[day].indexOf(curMonth) > -1) {
                            curMonthDay = parseInt(day)
                        }
                    }
                    
                    let curDay = curDate.getDate();
                    let preDaylimit = (preMonthDay + curDay) * 24 * 3600 * 1000;
                    let afterDaylimit = (afterMonthDay + curMonthDay - curDay) * 24 * 3600 * 1000;
                    let monthsAgo = curDate.getTime() - preDaylimit;
                    let monthsLater = curDate.getTime() + afterDaylimit;
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
                }, {
                    contractAddr: '广州市天河区建中路59号柏朗奴商务大厦9楼'
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
