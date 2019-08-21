<template>
    <div style="background-color:#fff;padding:15px;">
        <div style="margin-bottom:30px;">落地公司管理</div>
        <el-form class="form" :model="formSearch" :inline="true" label-width="100px" style="float:right">
          <el-form-item label="客户简称" size="small">
              <el-input v-model="formSearch.shortName" class="in_input" clearable placeholder="请输入内容" prefix-icon="el-icon-search"></el-input>
          </el-form-item>
          <el-form-item class="form_foot" size="small">
              <el-button type="primary" @click="requestAction({
                    pageNo: 1,
                    pageSize: pageSize,
                })">查询</el-button>
          </el-form-item>
      </el-form>
        <el-button size="small" @click="routerPush('/main/landingCompany/create')">新建企业</el-button>
        <el-table :data="tableList.list" style="width: 100%;margin-top: 20px;">
            <el-table-column prop="shortName" label="落地公司简称"></el-table-column>
            <el-table-column prop="masterName" label="负责人"></el-table-column>
            <el-table-column prop="directName" label="是否直营"></el-table-column>
            <el-table-column prop="registeredName" label="注册状态">
                <template slot-scope="scope">
                    <span class="usable" v-if="scope.row.registeredName == '已注册'">{{scope.row.registeredName}}</span>
                    <span class="disable" v-if="scope.row.registeredName == '未注册'">{{scope.row.registeredName}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="testStatusName" label="业务穿行状态">
                <template slot-scope="scope">
                    <span class="testok" v-if="scope.row.testStatusName == '已完成测试'">{{scope.row.testStatusName}}</span>
                    <span v-else>{{scope.row.testStatusName}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="isBusinessed" label="状态">
                <template slot-scope="scope">
                    <span>{{scope.row.isBusinessed?"启用":"禁用"}}</span>
                </template>
            </el-table-column>
            <!--
            <el-table-column prop="address" label="地址"></el-table-column>
            <el-table-column prop="invoiceType" label="发票类型" display="none">
                <template slot-scope="scope">
                    <span v-for="e in scope.row.supportInvoiceTypeName">
                        <span>{{e}}</span><br/>
                    </span>
                </template>
            </el-table-column>
            -->
            <el-table-column label="操作" width="100" fixed="right">
                <template slot-scope="scope">
                    <el-button @click="routerPush('/main/clientManager/serverManager',scope.row)" type="text" size="medium" style="padding:0;">管理
                    </el-button>
                    <el-switch
                        v-model="scope.row.isBusinessed"
                        @change="switchStatus(scope.row)"
                        size="medium"
                        style="padding:0;">
                    </el-switch>
                </template>
            </el-table-column>
        </el-table>
        <ayg-pagination v-if="tableList.total" :total="tableList.total"
                        v-on:handleSizeChange="handleSizeChange"
                        v-on:handleCurrentChange="handleCurrentChange" :currentPage="currentPage"></ayg-pagination>
        <el-dialog
            :title="dialogModal.title"
            :visible.sync="dialogVisible"
            class="switch-status-dialog"
            :before-close="dialogCancelHandler"
        >
            <div class="dialog-content">
                <!--isBussined=true，表示进入禁用流程-->
                <div class="disable-content" v-if="!dialogModal.isBusinessed">
                    <div class="disable-tip">
                        <i class="el-icon-warning"></i>
                        <span>禁用原因将直接显示在企业端</span>
                    </div>
                    <div class="disable-reason">
                        <span>禁用原因：</span><textarea v-model="dialogModal.disableReason"></textarea>
                    </div>
                    <p class="disable-comment">注：禁用后，客户不能选择与该落地公司签合同，已签合同的客户不能对该落地公司进行充值或发放</p>
                </div>
                <!--相反进入启用流程-->
                <div
                    class="enable-title"
                    v-if="dialogModal.isBusinessed"
                    slot="title"
                    >
                    <i class="el-icon-warning"></i><span>确认启用？</span>
                </div>
                <div class="enable-content" v-if="dialogModal.isBusinessed">
                    启用后客户可选择与该落地公司签合同，已签合同的客户可进行对落地公司充值或发放。是否确认启用？
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogCancelHandler">取 消</el-button>
                <el-button type="primary" @click="dialogOkHandler">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<style>
    .el-time-spinner.has-seconds .el-time-spinner__wrapper:nth-child(2) {
        margin-left: 0;
    }
    /* .el-dialog__body{
        text-align: center;
    } */
    .usable{
        color: #fff;
        text-align:center;
        border:1px solid #67C23A;
        padding:1px 7px; 
        background:#67C23A;
        border-radius:5px;
        -moz-border-radius:7px;
    }
    .disable{
        color: #fff;
        text-align:center;
        border:1px solid #E6A23C;
        padding:1px 7px; 
        background:#E6A23C;
        border-radius:5px;
        -moz-border-radius:7px;
    }
    .testok{
        color: green;
    }
</style>

<script>
    import {post, get} from '../../store/api';
    import {showNotify} from '../../plugin/utils-notify';
    export default {
        data() {
            return {
                pageSize: 10,
                currentPage: parseInt(this.$route.query.page) || 1,
                tableList: [],
                options: [],
                formSearch: {
                    shortName: '',
                },
                dialogVisible: false,
                dialogModal:{
                    title: '',
                    disableReason:''
                }
               
                
            }
        },
        methods: {
            search() {
                this.currentPage = 1;
                this.requestAction({
                    pageNo: 1,
                    pageSize: this.pageSize,
                });
            },
            switchStatus(item){ //注意：此时el-switch已经切换了状态，dialogModal同步收到影响
                this.dialogModal = item
                this.dialogVisible = true
                this.dialogModal.disableReason = ''
                if(item.isBusinessed){
                    this.dialogModal.title = ''
                } else {
                    this.dialogModal.title = '禁用'
                }
            },
            dialogCancelHandler(){
                console.log('closed')
                this.dialogVisible = false
                this.dialogModal.isBusinessed = !this.dialogModal.isBusinessed
            },
            dialogOkHandler(){
                if(!this.dialogModal.isBusinessed && this.dialogModal.disableReason==="") {
                    showNotify("error", '请填写禁用原因', true)
                    return
                }
                var param = {
                    id: this.dialogModal.id,
                    isEnable: this.dialogModal.isBusinessed,
                    memo: this.dialogModal.disableReason
                }
                post(`/api/salemgt/service-company/update-business`,param).then(data => {
                    this.dialogVisible = false
                    showNotify("success", '更新状态成功', true)
                }).catch(()=>{
                    showNotify("error", '更新状态失败', true)
                })
            },
            handleSizeChange(value) {
                this.pageSize = value;
                this.requestAction({
                    pageNo: 1,
                    pageSize: value,
                });
            },
            handleCurrentChange(value) {
                this.requestAction({
                    pageNo: value,
                    pageSize: this.pageSize,
                });
            },
            requestAction(pageInfo) {
                if(this.formSearch.shortName){
                    var param = {
                        keyword:this.formSearch.shortName,
                        pageNo: pageInfo.pageNo,
                        pageSize: pageInfo.pageSize,
                    };
                }else{
                    var param = {
                        pageNo: pageInfo.pageNo,
                        pageSize: pageInfo.pageSize,
                    };
                }
                
                post(`/api/salemgt/service-company/query/list`,param).then(data => {
                    data.list.forEach(e => {
                        e.supportInvoiceTypeName = e.supportInvoiceTypeName.split(";");
                    })
                    this.tableList = data;
                })
                /*post('/api/salemgt/service-company/query/list', param).then(data => {
                    console.log(data);
                    data.list.forEach(item => {
                        if (item) {
                            if (item.addr) {
                                item.addr = item.addr.replace(/\s+/g, '');
                            }
                        }
                    })
                    this.tableList = data;
                })*/
            },
            routerPush(link,val) {
                if(val){
                    localStorage.setItem('appId', val.id)
                    localStorage.setItem('fullName', val.name)
                    this.$router.push({path: link});
                }else{
                    this.$router.push({path: link});
                }
                
            }
        },
        mounted() {
            this.requestAction({
                pageNo: this.$route.query.page || 1,
                pageSize: this.pageSize,
            });
        },

    }
</script>

<style lang="scss" scoped>
// .switch-status-dialog {
//     &>>>.el-dialog__body{
//         border-top:1px solid #eeeeee;
//     }
// }
.dialog-content {
    color: #666666;
    font-size: 14px;

    .disable-title {
        font-size: 16px;
        i {
            color: red;
        }
        span {
            color:#333;
            font-weight: bold;
            margin-left: 10px;
        }
    }
    .disable-content {
        .disable-tip {
            display: flex;
            align-items: center;
            padding: 0 15px;
            color: #6e777b;
            height: 40px;
            background-color: rgba(230,247,255,0.9);
            i {
                color: #108EE9;
                margin-right: 5px;
            }

        }
        .disable-reason {
            margin-top: 15px;
            display: flex;

            textArea {
                width: 80%;
                height: 90px;
                border-color:#eeeeee;
                border-radius: 5px;
                font-size: 14px;
                outline: none;
                margin-left: 15px;
                padding: 10px;
            }
        }
        .disable-comment{
            color:#999999;
        }
    }
    
    .enable-title {
        font-size: 16px;
        i {
            color: #FAAD14;
        }
        span {
            color:#333;
            font-weight: bold;
            margin-left: 10px;
        }
    }
    .enable-content {
        margin-top: 15px;
        color:#999;
    }
}
</style>
