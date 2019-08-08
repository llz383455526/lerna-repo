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
            <el-table-column prop="address" label="状态"></el-table-column>
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
                    <el-switch @click="routerPush('/main/clientManager/serverManager',scope.row)" type="text" size="medium" style="padding:0;">管理
                    </el-switch>
                </template>
            </el-table-column>
        </el-table>
        <ayg-pagination v-if="tableList.total" :total="tableList.total"
                        v-on:handleSizeChange="handleSizeChange"
                        v-on:handleCurrentChange="handleCurrentChange" :currentPage="currentPage"></ayg-pagination>
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