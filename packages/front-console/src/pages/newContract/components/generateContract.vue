<template>
    <el-form label-width="200px" class="contractForm" v-if="contractModel.contractForm.contactIds">
        <el-form-item>
            <el-table :data="contractModel.contractForm.contactIds">
                <el-table-column prop="serviceCompanyName" label="落地公司名称"></el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button @click="handleDownload(scope.row.contractId)"
                                   type="text" size="medium" style="padding:0;">下载</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-form-item>
    </el-form>
</template>

<script>
    import {baseUrl} from '../../../config/address';
    export default {
        name: "generateContract",
        props: ['contractModel'],
        methods: {
            handleDownload(downloadCode) {
                let url = this.contractModel.workflowType === 'create_sale_contract' ?
                    '/api/contract-web/contract/download-contract-attachments?contractId=' :
                    '/api/contract-web/file/download?downloadCode=';
                window.location.href = baseUrl + url + downloadCode;
            },
        }
    }
</script>

<style scoped>
    .contractForm {
        width: 900px;
    }
</style>