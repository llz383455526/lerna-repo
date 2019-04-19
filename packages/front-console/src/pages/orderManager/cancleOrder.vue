<template>
    <div style="margin-top: 15px;background-color: #fff;padding: 15px; position: relative;">
        <div class="plan">
            <div class="phend">
                <span>订单号：{{msg.orderNo}}</span>
                <!-- <span @click="cancel">取消订单</span> -->
            </div>
            <div class="pstatus">
                {{msg.stateName}}
            </div>
            <div class="ptip">
                {{msg.productTypeName}}
            </div>
            <div class="pcreate">
                {{msg.createByName}} 创建于 {{msg.createAt}}
            </div>
        </div>
        <div id="steps" style="text-align: center;">订单已取消</div>
        <div id="detail">
            <div class="mtitle">
                发放明细
            </div>
            <el-form :model="form" :inline="true" style="padding-left: 35px;padding: 10px 0 10px 35px;" label-width="120px;" ref="query">
                <el-form-item label="收款方账号名称：" prop="accountName">
                    <el-input v-model="form.accountName" size="small"></el-input>
                </el-form-item>
                <el-form-item label="身份证号：" prop="idCard">
                    <el-input v-model="form.idCard" size="small"></el-input>
                </el-form-item>
                <el-form-item label="银行卡号：" prop="accountNo">
                    <el-input v-model="form.accountNo" size="small"></el-input>
                </el-form-item>
                <el-form-item label="手机号：" prop="phone">
                    <el-input v-model="form.phone" size="small"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button size="small" type="primary" @click="query">查询</el-button>
                    <el-button size="small" @click="reset('query')">清空所有条件</el-button>
                </el-form-item>
            </el-form>
            <a target="_bank" :href="`/api/console-dlv/company/salary-online-order/download-pay-item-details${term}`"><el-button type="primary" size="small" style="float: right;">导出数据</el-button></a>
            <!-- <el-button type="primary" size="small" class="btn">批量删除</el-button>
            <el-button type="primary" size="small" class="btn">增加收款方</el-button> -->
            <el-tabs style="clear: both;">
                <!-- <el-tab-pane label="校验结果"> -->
                    <el-table :data="detail" >
                        <el-table-column label="收款方账号名称" prop="accountName"></el-table-column>
                        <el-table-column label="身份证" prop="idCard"></el-table-column>
                        <el-table-column label="手机号" prop="phone"></el-table-column>
                        <el-table-column label="收款方账号" prop="accountNo"></el-table-column>
                        <!-- <el-table-column label="开户行" prop="depositBank"></el-table-column> -->
                        <el-table-column label="款项属性备注" prop="fund"></el-table-column>
                        <!-- <el-table-column label="外籍人员信息备注" prop="foreignNationality"></el-table-column> -->
                        <el-table-column label="实发金额">
                            <template slot-scope="scope">
                                {{scope.row.shouldAmount | formatMoney}}
                            </template>
                        </el-table-column>
                    </el-table>
                    <ayg-pagination
                        v-if="total"
                        :total="total"
                        v-on:handleSizeChange="setSize"
                        :currentSize="form.pageSize"
                        v-on:handleCurrentChange="query"
                        :currentPage="form.page">
                    </ayg-pagination>
                <!-- </el-tab-pane> -->
                <!-- <el-tab-pane label="校验不通过">
                    <el-table :data="detail" >
                        <el-table-column label="收款方账号名称" prop="accountName"></el-table-column>
                        <el-table-column label="身份证" prop="idCard"></el-table-column>
                        <el-table-column label="手机号" prop="phone"></el-table-column>
                        <el-table-column label="收款方账号" prop="accountNo"></el-table-column>
                        <el-table-column label="开户行" prop="depositBank"></el-table-column>
                        <el-table-column label="款项属性备注" prop="fund"></el-table-column>
                        <el-table-column label="外籍人员信息备注" prop="foreignNationality"></el-table-column>
                        <el-table-column label="实发金额">
                            <template slot-scope="scope">
                                {{scope.row.shouldAmount | formatMoney}}
                            </template>
                        </el-table-column>
                    </el-table>
                    <ayg-pagination
                        v-if="total"
                        :total="total"
                        v-on:handleSizeChange="setSize"
                        :currentSize="form.pageSize"
                        v-on:handleCurrentChange="query"
                        :currentPage="form.page">
                    </ayg-pagination>
                </el-tab-pane> -->
            </el-tabs>
        </div>
        <div id="explain">
            <div>服务说明：</div>
            <div>
                <span>
                    为了保证费用可以成功发放，请正确填写人员相关信息。
                </span>
                <span>
                    如果您有任何疑问或紧急事项，请及时联系爱员工客服，联系电话：020-37127695。
                </span>
            </div>
        </div>
        <!-- <el-dialog title="选择发放委托方" :visible.sync="show">
            <div class="dtitle">发放委托方</div>
            <el-radio v-model="clientId" :label="1">西瓜小视频-爱洋发放</el-radio>
            <el-radio v-model="clientId" :label="2">西瓜小视频-爱皖发放</el-radio>
            <el-radio v-model="clientId" :label="3">大话西游-爱洋发放</el-radio>
            <span slot="footer">
                <el-button size="small">确认</el-button>
                <el-button size="small" @click="show = false">取消</el-button>
            </span>
        </el-dialog> -->
    </div>
</template>
<script>
import {
  get,
  post,
  formPost,
  postButNoErrorToast,
  postWithErrorCallback
} from "../../store/api";
export default {
    data() {
        return {
            data: '',
            form: {
                accountName: '',
                idCard: '',
                accountNo: '',
                phone: '',
                orderId: '',
                page: 1,
                pageSize: 10
            },
            msg: '',
            detail: [],
            total: 0,
            term: ''
        };
    },
    watch: {
        form: {
            handler() {
                this.term = ''
                for(var k in this.form) {
                    if(this.form[k]){
                        if(this.term) {
                            this.term += `&${k}=${this.form[k]}`
                        }
                        else {
                            this.term += `?${k}=${this.form[k]}`
                        }
                    }
                }
            },
            deep: true
        }
    },
    mounted() {
        this.data = JSON.parse(sessionStorage.getItem('data'))
        this.form.orderId = this.data.id
        get('/api/console-dlv/company/salary-online-order/salary-order-step-detail', {
            orderId: this.data.id
        }).then(data => {
            this.msg = data
        })
        this.query()
    },
    methods: {
        query(a) {
            if(isNaN(a)){
                a = 1
            }
            this.form.page = a
            post('/api/console-dlv/company/salary-online-order/query-salary-order-item', this.form).then(data => {
                this.detail = data.list
                this.total = data.total
            })
        },
        setSize(a) {
            this.form.pageSize = a;
            this.query()
        },
        reset(name) {
            this.$refs[name].resetFields();
        }
    }
};
</script>
<style scoped>
.plan {
    width: 300px;
    padding: 20px 15px 35px;
    box-sizing: border-box;
    border: 1px solid rgba(234, 234, 234, 1);
    margin-top: 10px;
}
.phend {
    font-size: 12px;
    color: #666;
}
.phend > span:nth-child(2) {
    float: right;
    cursor: pointer;
}
.pstatus {
    color: #ef5187;
    font-size: 24px;
    margin-top: 35px;
    text-align: center;
}
.ptip {
    font-size: 14px;
    color: #333;
    text-align: center;
    margin-top: 20px;
}
.pcreate {
    font-size: 12px;
    color: #999;
    text-align: center;
    margin-top: 10px;
}
#steps {
    position: absolute;
    top: 110px;
    right: 15px;
    width: calc(100% - 345px);
}
/* #orderCost {
    padding: 30px 0px;
    box-sizing: border-box;
    // background-color: #f2f2f2;
} */
#detail {
    margin-top: 20px;
}
.mtitle {
    font-size: 13px;
    color: #333;
    border-left: 4px solid #0283fb;
    height: 16px;
    text-indent: 10px;
}
.dtitle {
    font-size: 16px;
    color: #333;
    margin-bottom: 20px;
}
/* #pay {
    // background-color: #999;
}
#pay > :nth-child(1) {
    height: 80px;
    line-height: 80px;
    background-color: #f2f2f2;
    padding: 0px 30px;
    box-sizing: border-box;
}
#pay > :nth-child(1) > span:nth-child(1){
    color: #333;
    font-size: 18px;
    margin-right: 15px;
} */
.red {
    font-size: 28px;
    color: #FF0000;
}
.client {
    float: right;
    padding: 0px 80px;
    box-sizing: border-box;
}
.client::before {
    position: relative;
    top: 15px;
    right: 80px;
    content: '';
    display: inline-block;
    height: 45px;
    border-left: 1px solid #666;
}
#pay > :nth-child(2) {
    background-color: #999;
    padding: 20px 30px;
    box-sizing: border-box;
}
#explain {
    overflow: hidden;
    padding: 30px 0px;
}
#explain > div {
    float: left;
    font-size: 14px;
}
#explain > div:nth-child(1) {
    color: #999;
    text-align: right;
    width: 100px;
}
#explain > div:nth-child(2) {
    color: #333;
    width: calc(100% - 100px);
}
#explain > div:nth-child(2) > span {
    display: block;
    margin-bottom: 20px;
}
#explain > div:nth-child(2) > span:last-child {
    color: #999;
    margin-bottom: 0px;
}
.btn {
    position: relative;
    top: 30px;
    float: right;
    margin: 0 10px;
    z-index: 1;
    margin-top: -30px;
}
</style>
