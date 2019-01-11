<template>
    <div>
        <h3 class="green">请选择合同选项</h3>
        <el-form-item label="选择合同模板"
                      prop="contractTplId"
                      :rules="{ required: true, message: '请选择合同模板', trigger: 'change' }">
            <el-select v-model="contractModel.contractForm.contractTplId" filterable placeholder="请选择" style="width:450px;">
                <el-option v-for="(item, key) in contractModel.contractTplList"
                           :key="key"
                           :label="item.text"
                           :value="item.value">
                </el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="选择客户行业类型" prop="contractType">
            <el-select v-model="contractModel.contractForm.contractType" placeholder="请选择" style="width:450px;">
                <el-option v-for="(item, key) in contractModel.businessTypeList"
                           :key="key"
                           :label="item.text"
                           :value="item.value">
                </el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="客户从事" prop="customIndustry">
            <el-input v-model="contractModel.contractForm.customIndustry" style="width:450px;"></el-input>
        </el-form-item>
        <el-form-item label="合同期限" prop="contractStartDate">
            <el-date-picker type="daterange" style="width:450px;"
                            v-model="contractModel.contractDate"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            value-format="yyyy-MM-dd"
                            @change="autoFill">
            </el-date-picker>
        </el-form-item>
        <el-form-item label="服务类型" prop="serviceType">
            <template slot="label">
                <i class="el-icon-question" title="请参考《服务内容确认书》"></i>服务类型
            </template>
            <el-checkbox-group v-model="contractModel.serviceTypeList" @change="setSettleType" style="width:1100px;">
                <el-checkbox v-for="(item, key) in contractModel.serviceTypes"
                             :key="key" :label="item.serviceId">{{item.serviceName}}
                </el-checkbox>
            </el-checkbox-group>
        </el-form-item>
    </div>
</template>

<script>
    import _ from 'lodash'
    export default {
        name: "contractOption",
        props: ['contractModel'],
        methods: {
            autoFill (val) {
                this.contractModel.contractForm.contractStartDate = val[0];
                this.contractModel.contractForm.contractEndDate = val[1];
            },
            setSettleType (e) {
                let arr = [];
                _.forEach(this.contractModel.serviceTypes, item => {
                    let serviceId = _.find(e, o => {
                        return o === item.serviceId
                    });
                    if(serviceId) arr.push(item);
                });
                this.contractModel.contractForm.serviceType = arr;
                this.$emit('setSettleType');
                if (!this.contractModel.hasInsurance()) {
                    this.contractModel.contractForm.vciBuyType = '';
                    this.contractModel.contractForm.vciPlanName = '';
                }
            }
        }
    }
</script>

<style scoped>
    .el-icon-question {
        margin-right: 5px;
        color: #f56c6c;
        cursor: pointer;
    }
</style>