<template>
    <el-form>
        <el-form-item label="请选择合同附件处理方式">
            <el-radio-group v-model="approveType">
                <el-radio label="standard">不需要修改合同附件</el-radio>
                <el-radio label="partial">需要合同补充协议</el-radio>
                <el-radio label="customer">需要独立合同附件</el-radio>
            </el-radio-group>
        </el-form-item>
        <div v-if="approveType === 'partial'">
            <div v-for="(formItem, key) in contractForm.contracts" :key="key">
                <div class="row" style="margin-bottom: 15px;">
                    <div class="col-xs-4">
                        <div style="padding:20px;">
                            <el-upload class="form_input" :action="`/api/econtract/template/parsefile`" :auto-upload="false" :on-change="upload" :on-remove="remove" :on-preview="handlePreview" :multiple="false" :show-file-list="false">
                                <span style="margin-right:10px;">{{ formItem.serviceCompanyName }}</span>
                                <el-button size="small" type="primary" @click="index = key">上传附件</el-button>
                            </el-upload>
                        </div>
                    </div>
                    <div class="col-xs-8">
                        <el-table :data="formItem.partialAttachments">
                            <el-table-column label="附件类型">
                                <template slot-scope="scope">
                                    {{scope.row.targetType == 'customerContact' ? '系统附件' : '补充附件'}}
                                </template>
                            </el-table-column>
                            <el-table-column label="文件名称" prop="displayname"></el-table-column>
                            <el-table-column label="操作">
                                <template slot-scope="scope">
                                    <el-button type="text" size="medium" style="padding:0;" @click="handleDownload(scope.row.downloadCode)">下载</el-button>
                                    <el-button type="text" size="medium" style="padding:0;" v-if="scope.row.targetType == 'contractUserAttach'" @click="handleRemove(scope.row, key)">删除</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                </div>
                <hr v-if="key+1 != contractForm.contracts.length">
            </div>
        </div>
        <div v-if="approveType === 'customer'">
            <div v-for="(formItem, key) in contractForm.contracts" :key="key">
                <div class="row" style="margin-bottom: 15px;">
                    <div class="col-xs-4">
                        <div style="padding:20px;">
                            <el-upload class="form_input" :action="`/api/econtract/template/parsefile`" :auto-upload="false" :on-change="upload" :on-remove="remove" :on-preview="handlePreview" :multiple="false" :show-file-list="false">
                                <span style="margin-right:10px;">{{ formItem.serviceCompanyName }}</span>
                                <el-button size="small" type="primary" @click="index = key">上传附件</el-button>
                            </el-upload>
                        </div>
                    </div>
                    <div class="col-xs-8">
                        <el-table :data="formItem.customerAttachments">
                            <el-table-column label="附件类型">
                                <template slot-scope="scope">
                                    {{scope.row.targetType == 'customerContact' ? '系统附件' : '补充附件'}}
                                </template>
                            </el-table-column>
                            <el-table-column label="文件名称" prop="displayname"></el-table-column>
                            <el-table-column label="操作">
                                <template slot-scope="scope">
                                    <el-button type="text" size="medium" style="padding:0;" @click="handleDownload(scope.row.downloadCode)">下载</el-button>
                                    <el-button type="text" size="medium" style="padding:0;" v-if="scope.row.targetType == 'contractUserAttach'" @click="handleRemove(scope.row, key)">删除</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                </div>
                <hr v-if="key+1 != contractForm.contracts.length">
            </div>
        </div>
    </el-form>
</template>

<script>
export default {
    data() {
        return {
            approveType: ''
        }
    }
}
</script>

