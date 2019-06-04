<template>
    <div>
        <el-form-item label="选择已有代理商">
            <el-select v-model="contract.datas.tplId" filterable placeholder="请选择" style="width:450px;">
                <el-option v-for="item in optionModel.contractTplList" :key="item.value" :label="item.text" :value="item.value"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="申请生效时间" prop="versionStartDate">
            <el-date-picker style="width:450px;" v-model="dateValue" type="month" :picker-options="pickerOptions"></el-date-picker>
        </el-form-item>
        <el-form-item label="变更版本说明" prop="flowMemo">
            <el-input style="width:450px;" v-model="flowMemo" type="textarea"></el-input>
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
        },
    },
    data() {
        return {
            optionModel: new optionModel(),
            dateValue: '',
            flowMemo: '',
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
    created() {
        this.optionModel.getAgentTypeList()
    }
}
</script>

