<template>
    <div class="main">
        <el-steps id="steps" :active="2" align-center size="small">
            <el-step title="上传签约对象"></el-step>
            <el-step title="核对信息"></el-step>
        </el-steps>
        <el-form label-width="180px">
            <div class="mtitle">合同名称</div>
            <el-form-item label="合同名称:">
                {{msg.name}}<a target="_bank" :href="`${baseUrl}/api/econtract/template/preview?templateId=${msg.templateId}`">合同预览</a>
            </el-form-item>
        </el-form>
        <div v-for="e in detail" v-if="e.signNo" :key="e.signNo">
            <div class="mtitle">
                {{part[e.signNo]}}签约对象（{{ptype[e.userDetailType]}}）
            </div>
            <template v-if="e.userDetailType == '1'">
                <div class="success" v-if="isSuccess">
                    <span v-if="!errCount">您上传的数据全部校验通过</span>
                    <span v-else>您上传的数据有<span class="error">{{errCount}}</span>条记录存在错误，请编辑更正后再进行下一步。</span>
                </div>
                <el-form :model="form" :inline="true" ref="form">
                    <el-form-item label="姓名" prop="personalName">
                        <el-input v-model="form.personalName" size="small"></el-input>
                    </el-form-item>
                    <el-form-item label="证件号" prop="personalIdentity">
                        <el-input v-model="form.personalIdentity" size="small"></el-input>
                    </el-form-item>
                    <el-form-item label="手机" prop="personalMobile">
                        <el-input v-model="form.personalMobile" size="small"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" size="small" @click="query">查询</el-button>
                        <el-button size="small" @click="reset('form')">清空所有条件</el-button>
                    </el-form-item>
                </el-form>
                <!-- <el-button type="primary" size="small" @click="show = true">批量添加</el-button> -->
                <a :href="`${baseUrl}/api/econtract/order/exporterrors?batchId=${form.batchId}`" v-if="hasChange"><el-button type="primary" size="small">导出文件</el-button></a>
                <el-table :data="list">
                    <el-table-column label="姓名" prop="personalName"></el-table-column>
                    <el-table-column label="证件类型" prop="personalIdentityTypeName"></el-table-column>
                    <el-table-column label="证件号" prop="personalIdentity"></el-table-column>
                    <el-table-column label="手机" prop="personalMobile"></el-table-column>
                    <el-table-column label="错误原因">
                        <template slot-scope="scope">
                            <span class="error">{{scope.row.msg}}</span>
                        </template>
                    </el-table-column>
                    <!-- <el-table-column label="操作">
                        <template slot-scope="scope">
                            <el-button type="text" size="small" @click="forEdit(scope.row)">修改</el-button>
                            <el-button type="text" size="small" @click="deleteOrder(scope.row)">删除</el-button>
                        </template>
                    </el-table-column> -->
                </el-table>
                <ayg-pagination
                    v-if="total"
                    :total="total"
                    v-on:handleSizeChange="setSize"
                    :currentSize="form.pageSize"
                    v-on:handleCurrentChange="query"
                    :currentPage="form.pageNo">
                </ayg-pagination>
            </template>
            <template v-else>
                <el-form label-width="180px">
                    <el-form-item :label="`${ptype[e.userDetailType]}全称：`">
                        {{e.name}}
                        <!-- <el-button type="text" size="small" @click="isShow[e.userDetailType] = !isShow[e.userDetailType]">
                            {{isShow[e.userDetailType] ? '收起' : '展开详情'}}
                        </el-button> -->
                    </el-form-item>
                    <!-- <template v-if="isShow[e.userDetailType]"> -->
                    <el-form-item label="工商注册号：">{{e.regCode}}</el-form-item>
                    <el-form-item label="税务登记号：">{{e.taxCode}}</el-form-item>
                    <el-form-item label="组织机构代码：">{{e.orgCode}}</el-form-item>
                    <el-form-item label="法人姓名：">{{e.legalPerson}}</el-form-item>
                    <el-form-item label="法人证件类型：">{{e.legalPersonIdentityType == 0 ? '身份证' : '护照'}}</el-form-item>
                    <el-form-item label="法人证件号码：">{{e.legalPersonIdentity}}</el-form-item>
                    <el-form-item label="法人手机号：">{{e.legalPersonMobile}}<i class="el-icon-question" title="选择手动签约将会发送签约短信到该手机号码"></i></el-form-item>
                    <!-- </template> -->
                </el-form>
            </template>
        </div>
        <div class="mtitle">概况</div>
        <el-form label-width="120px">
            <el-form-item label="签约合同数量：">
                {{total}}份
            </el-form-item>
        </el-form>
        <div class="mtitle">短信通知</div>
        <div class="tip">
            发起签约操作完成后，将发送短信通知个人签署合同。
        </div>
        <el-button type="primary" size="small" @click="next">发起签约</el-button>
        <el-button size="small" @click="cancle">上一步</el-button>
    </div>
</template>
<script>
import { post, get, importPost } from "../../store/api"
import { baseUrl } from "../../config/address.js"
export default {
    data() {
        return {
            form: {
                batchId: '',
                personalName: '',
                personalIdentity: '',
                personalMobile: '',
                pageNo: 1,
                pageSize: 10
            },
            total: 0,
            list: [],
            // isShow: false,
            show: false,
            eshow: false,
            msg: '',
            baseUrl,
            detail: [],
            part: {
                '1': '甲方',
                '2': '乙方' ,
                '3': '丙方'
            },
            ptype: {
                '1': '个人',
                '2.1': '服务商',
                '2.2': '公司'
            }
        }
    },
    mounted() {
        this.msg = JSON.parse(sessionStorage.getItem('sign'))
        this.detail = JSON.parse(sessionStorage.getItem('detail'))
        this.form.batchId = sessionStorage.getItem('batchId')
        this.query()
    },
    methods: {
        query(a) {
            if(isNaN(a)){
                a = 1
            }
            this.form.pageNo = a
            post('/api/econtract/contractsigner/qry', this.form).then(data => {
                console.log(data)
                this.list = data.data
                this.total = data.total
            })
        },
        reset(name) {
            this.$refs[name][0].resetFields()
        },
        setSize(a) {
            this.form.pageSize = a
            this.query()
        },
        next() {
        	let templateName = this.$route.query.templateName
            post(`/api/econtract/batch/submit?batchId=${this.form.batchId}&templateId=${this.msg.templateId}&templateGroupId=`).then(data => {
                this.$router.push(`/main/eContract/signSuccess?name=${templateName}`)
            })
        },
        cancle() {
            this.$router.push(`uploadObject?batchId=${this.form.batchId}`)
        }
    }
}
</script>
<style scoped>
.main {
    margin: 15px;
    padding: 15px;
    background-color: #fff;
}
#steps {
    margin: 30px 0;
}
.mtitle {
    font-size: 13px;
    color: #333;
    border-left: 4px solid #0283fb;
    height: 16px;
    text-indent: 10px;
    margin-bottom: 15px;
}
.el-icon-question {
    color: red;
    margin-left: 15px;
}
.success {
    position: relative;
    left: -15px;
    width: calc(100% - 10px);
    padding: 20px;
    text-align: center;
    background-color: #d9f2e6;
    margin-bottom: 20px;
}
a {
    margin-left: 5px;
}
.dbox {
    display: flex;
    justify-content: space-around;
}
.ditem {
    width: 40%;
}
.ditem > div:nth-child(1) {
    font-size: 18px;
    color: #333;
    margin-bottom: 5px;
}
.ditem > div:nth-child(2) {
    font-size: 14px;
    color: #999;
    margin-bottom: 5px;
}
.tip {
    color: #FF9900;
    font-size: 16px;
    margin-bottom: 20px;
}
</style>
