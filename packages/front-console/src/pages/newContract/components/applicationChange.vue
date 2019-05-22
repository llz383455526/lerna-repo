<template>
    <div>
        <h3 class="green">请选择客户企业信息</h3>
        <el-form-item label="选择已有客户信息" prop="customerId">
            <el-select style="width:450px;" v-model="ruleForm.customerId" filterable filterable @change="companyChange">
                <el-option v-for="(item, key) in companyIdentityList" :key="key" :label="item.companyName" :value="item.companyId"></el-option>
            </el-select>
        </el-form-item>
    </div>
</template>
