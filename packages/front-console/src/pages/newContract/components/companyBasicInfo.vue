<template>
    <div>
        <h3 class="green">请输客户企业信息</h3>
        <el-form-item label="客户性质" prop="customNature" style="width:100%;">
            <el-radio v-model="contractModel.contractForm.customNature"
                      v-for="(item, key) in contractModel.customNatureList"
                      :key="key" :label="item.value">{{item.text}}</el-radio>
            <i class="el-icon-question ml10" title="非直接用工企业：人力资源公司、服务外包公司、城市合伙人公司、第三方平台等"></i>
        </el-form-item>
        <el-form-item label="企业对接方式" style="width:100%;" prop="isFromOutApp" v-if="contractModel.workflowType !== 'update_sale_contract'">
            <el-select style="width:450px;" v-model="contractModel.contractForm.isFromOutApp" @change="handleOutAppChange">
                <el-option v-for="(item, key) in list" :key="key" :label="item.label" :value="item.value"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="企业名称" prop="customerName">
            <el-select 
                v-if="checkRight(permissions, 'sysmgr-web:/data-permission-tag/sales-contract-interim-company-flag')" 
                v-model="contractModel.contractForm.customerName" 
                filterable 
                style="width:450px;">
                <el-option v-for="e in companyList" :key="e.value" :value="e.text" :label="e.text"></el-option>
            </el-select>
            <el-input v-else v-model="contractModel.contractForm.customerName" style="width:450px;" :disabled="contractModel.workflowType === 'update_sale_contract'"></el-input>
        </el-form-item>
        <el-form-item label="企业地址" prop="areaName">
            <el-input v-model="contractModel.contractForm.areaName" style="width:450px;"></el-input>
        </el-form-item>
        <el-form-item label="法定代表人" prop="customLegalPerson">
            <el-input v-model="contractModel.contractForm.customLegalPerson" style="width:450px;"></el-input>
        </el-form-item>
        <el-form-item label="系统操作人" prop="customCollector">
            <el-input v-model="contractModel.contractForm.customCollector" style="width:450px;" :disabled="contractModel.workflowType === 'update_sale_contract'"></el-input>
        </el-form-item>
        <el-form-item label="操作人手机" prop="customCollectorPhone">
            <el-input v-model="contractModel.contractForm.customCollectorPhone" style="width:450px;" maxlength="11" :disabled="contractModel.workflowType === 'update_sale_contract'"></el-input>
        </el-form-item>
        <el-form-item label="操作人邮箱" prop="customMail1">
            <el-input v-model="contractModel.contractForm.customMail1" style="width:450px;"></el-input>
        </el-form-item>
        <el-form-item label="企业负责人">
            <el-input v-model="contractModel.contractForm.companyChargeName" style="width:450px;"></el-input>
        </el-form-item>
        <el-form-item label="负责人手机">
            <el-input v-model="contractModel.contractForm.companyChargePhone" style="width:450px;"></el-input>
        </el-form-item>
        <el-form-item label="负责人邮箱">
            <el-input v-model="contractModel.contractForm.companyChargeMail" style="width:450px;"></el-input>
        </el-form-item>
        <!-- <el-form-item label="负责人邮箱2" prop="customMail2">
            <el-input v-model="contractModel.contractForm.customMail2" style="width:450px;"></el-input>
        </el-form-item> -->
        <el-form-item label="负责人地址" prop="customCollectorAddr">
            <el-input v-model="contractModel.contractForm.customCollectorAddr" style="width:450px;"></el-input>
        </el-form-item>
    </div>
</template>

<script>
import {mapGetters} from 'vuex';
import { post, get, importPost } from '../../../store/api';
export default {
    name: "companyBasicInfo",
    props: ['contractModel'],
    data() {
        return {
            companyList: [],
            list: [
                { label: 'SaaS发放', value: '0' },
                { label: 'API发放', value: '1' },
            ],
        }
    },
    computed: {
      ...mapGetters({
          permissions: 'permissions',
          serverConfigList: 'serverConfigList',
      })
    },
    mounted() {
        get('/api/sysmgr-web/interim-company/interim-company-options').then(data => {
            this.companyList = data
        })
        this.$store.dispatch('getServerConfigList')
    },
    methods: {
        handleOutAppChange(ev) {
            let arr = []
            if (ev === '1') {
                this.serverConfigList.forEach(el => {
                    arr.push(el.value)
                });
            }
            this.contractModel.contractForm.serviceCodes = arr;
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