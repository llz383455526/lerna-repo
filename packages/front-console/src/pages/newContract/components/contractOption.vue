<template>
    <div>
        <h3 class="green">请选择合同选项</h3>
        <el-form-item label="选择合同模板" prop="contractTplId" :rules="{ required: true, message: '请选择合同模板', trigger: 'change' }">
            <el-select v-model="ruleForm.contractTplId" filterable placeholder="请选择" style="width:450px;">
                <el-option v-for="(item, key) in contractTplList"
                           :key="key"
                           :label="item.text"
                           :value="item.value">
                </el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="选择客户行业类型" prop="contractType">
            <el-select v-model="ruleForm.contractType" placeholder="请选择" style="width:450px;">
                <el-option v-for="(item, key) in industryTypeList"
                           :key="key"
                           :label="item.text"
                           :value="item.value">
                </el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="客户从事" prop="customIndustry">
            <el-input v-model="ruleForm.customIndustry" style="width:450px;"></el-input>
        </el-form-item>
        <el-form-item label="合同期限" prop="contractStartDate">
            <el-date-picker type="daterange" style="width:450px;"
                            v-model="value"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            value-format="yyyy-MM-dd"
                            @change="autoFill">
            </el-date-picker>
        </el-form-item>
    </div>
</template>

<script>
    import _ from 'lodash'
    import { mapGetters } from 'vuex'
    export default {
        name: "contractOption",
        props: ['contractModel', 'ruleForm'],
        data() {
            return {
                value: '',
            }
        },
        computed: {
            ...mapGetters({
                contractTplList: 'contractTplList',
                industryTypeList: 'industryTypeList',
                serviceTypeList: 'serviceTypeList',
            })
        },
        watch: {
            ruleForm() {
                this.fillValue()
            }
        },
        methods: {
            fillValue() {
                if (this.ruleForm.contractStartDate) {
                    this.value = [this.ruleForm.contractStartDate, this.ruleForm.contractEndDate]
                }
                if (this.ruleForm.startDate) {
                    this.value = [this.ruleForm.startDate, this.ruleForm.endDate]
                    this.ruleForm.contractStartDate = this.ruleForm.startDate
                    this.ruleForm.contractEndDate = this.ruleForm.endDate
                }
                if (this.ruleForm.dataValue) {
                    this.value = this.ruleForm.dataValue
                    this.ruleForm.contractStartDate = this.ruleForm.dataValue[0]
                    this.ruleForm.contractEndDate = this.ruleForm.dataValue[1]
                }
            },
            autoFill (val) {
                if (val) {
                    this.ruleForm.contractStartDate = val[0];
                    this.ruleForm.contractEndDate = val[1];
                }
            },
            setSettleType (e) {
                // let arr = [];
                // _.forEach(this.contractModel.serviceTypes, item => {
                //     let serviceId = _.find(e, o => {
                //         return o === item.serviceId
                //     });
                //     if(serviceId) arr.push(item);
                // });
                // this.contractModel.contractForm.serviceType = arr;
                this.$emit('setSettleType');
                if (!this.hasInsurance()) {
                    this.ruleForm.vciBuyType = '';
                    this.ruleForm.vciPlanName = '';
                }
            },
            // 判断是否有商业保险
            hasInsurance() {
                var isHas = false;
                this.serviceTypeList.forEach(item => {
                    this.ruleForm.serviceType.forEach(el => {
                        if (item.serviceId === el && item.vciStatus === 1) {
                            isHas = true
                        }
                    })
                })
                return isHas;
            }
        },
        mounted() {
            this.$store.dispatch('getContractTplList')
            this.$store.dispatch('getIndustryTypeList')
            this.fillValue()
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
