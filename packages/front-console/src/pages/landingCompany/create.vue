<template>
    <div class="r_main">
        <div style="margin-bottom:30px;">{{this.$route.query.id ? pageHeader[1] : pageHeader[0]}}</div>
        <div class="tool">
            <el-button size="small" @click="back">取消</el-button>
            <el-button size="small" type="primary" @click="submit">保存</el-button>
        </div>
        <el-card class="box-card">
            <div slot="header">
                <span>必填项</span>
            </div>
            <div class="text item">
                <el-form :model="form" :rules="rule" label-width="400px" ref="form">
                    <el-form-item label="落地公司名称" prop="name" size="small">
                        <el-input class="form_input" v-model="form.name"></el-input>
                    </el-form-item>
                    <el-form-item label="落地公司简称" prop="shortName" size="small">
                        <el-input class="form_input" v-model="form.shortName"></el-input>
                    </el-form-item>
                    <el-form-item label="是否直营" prop="direct" size="small">
                        <el-select v-model="form.direct" placeholder="请选择" class="form_input">
                            <el-option v-for="item in directStatus" :label="item.text" :value="item.value" :key="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="是否有业务（用于合同）" prop="businessed" size="small">
                        <el-select v-model="form.businessed" placeholder="请选择" class="form_input">
                            <el-option v-for="item in directStatus" :label="item.text" :value="item.value" :key="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="注册状态" prop="registered" size="small">
                        <el-select v-model="form.registered" placeholder="请选择" class="form_input">
                            <el-option v-for="item in registeredStatus" :label="item.text" :value="item.value" :key="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="支持开票类型" prop="supportInvoiceType" size="small">
                        <el-checkbox-group v-model="form.supportInvoiceType" disabled>
                            <el-checkbox label="PP">增值税普通发票</el-checkbox>
                            <el-checkbox label="ZP">增值税专用发票</el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>
                    <el-form-item label="负责人" prop="masterUid" size="small">
                        <el-select v-model="form.masterUid" class="form_input" @change="masterVal">
                            <el-option v-for="e in charges" :value="e.id" :label="e.name" :key="e.id"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="税优地" prop="taxLandingId" size="small">
                        <el-select v-model="form.taxLandingId" class="form_input" filterable>
                            <el-option v-for="e in list" :label="e.taxLandingName" :value="e.id" :key="e.id"></el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
                
            </div>
        </el-card>
        <el-card>
            <div slot="header">
                <span>非必填项</span>
            </div>
            <div class="text item">
                <el-form :model="form" label-width="400px">
                    <el-form-item label="所在省市" prop="provinceId" size="small">
                        <el-select v-model="form.provinceId" filterable placeholder="请选择" @change="provinceVal">
                            <el-option v-for="item in provinceList" :key="item.id" :label="item.name"
                               :value="item.id"></el-option>
                        </el-select>
                        <el-select v-model="form.cityId" filterable placeholder="请选择" @change="cityVal">
                            <el-option v-for="item in cityList" :key="item.id" :label="item.name"
                               :value="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="公司详细地址" prop="address" size="small">
                        <el-input class="form_input" v-model="form.address"></el-input>
                    </el-form-item>
                    <el-form-item label="纳税人识别号" prop="taxIdcd" size="small">
                        <el-input class="form_input" v-model="form.taxIdcd"></el-input>
                    </el-form-item>
                    <el-form-item label="注册日期" prop="registrationAt" size="small">
                        <el-date-picker class="form_input" v-model="form.registrationAt" type="date" value-format="yyyy-MM-dd">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="法人姓名" prop="corporateName" size="small">
                        <el-input class="form_input" v-model="form.corporateName"></el-input>
                    </el-form-item>
                    <el-form-item label="法人证件号" prop="corporateIdentity" size="small">
                        <el-input class="form_input" v-model="form.corporateIdentity"></el-input>
                    </el-form-item>
                    <el-form-item label="公司联系电话" prop="telephone" size="small">
                        <el-input class="form_input" v-model="form.telephone"></el-input>
                    </el-form-item>
                    <el-form-item label="公司开户行" prop="bankName" size="small">
                        <el-input class="form_input" v-model="form.bankName"></el-input>
                    </el-form-item>
                    <el-form-item label="开户行账号" prop="bankAccount" size="small">
                        <el-input class="form_input" v-model="form.bankAccount"></el-input>
                    </el-form-item>
                </el-form>
            </div>
        </el-card>
    </div>
</template>
<script>
import { get, post } from "../../store/api";
import { mapGetters } from 'vuex';
import _ from 'lodash'
export default {
    data() {
        return {
            form: {
                id:"",
                name: "",
                shortName: "",
                direct: "",
                businessed: '',
                registered: '',
                supportInvoiceType: ['PP','ZP'],
                masterUid: "",
                provinceId: "",
                cityId: "",
                address: "",
                taxIdcd: "",
                registrationAt: "",
                corporateName: "",
                corporateIdentity: "",
                telephone: "",
                bankName: "",
                bankAccount: "",
                masterName:"",
                provinceName:"",
                cityName:"",
                taxLandingId:"",
                taxLandingName:""
            },
            charges:"",
            rule: {
                name: [{
                    required: true,
                    message: "请输入名称",
                    trigger: "change"
                }],
                shortName: [{
                    required: true,
                    message: "请输入简称",
                    trigger: "change"
                }],
                direct: [{
                    required: true,
                    message: "请选择是否直营",
                    trigger: "change"
                }],
                businessed: [{
                    required: true,
                    message: "请选择是否有业务",
                    trigger: "change"
                }],
                registered: [{
                    required: true,
                    message: "请选择注册状态",
                    trigger: "change"
                }],
                supportInvoiceType: [{
                    required: true,
                    message: "请选择支持开票类型",
                    trigger: "change"
                }],
                masterUid: [{
                    required: true,
                    message: "请选择负责人",
                    trigger: "change"
                }],
                taxLandingId: [{
                    required: true,
                    message: "请选择税优地",
                    trigger: "change"
                }]
            },
            pageHeader:['新建落地公司信息','编辑落地公司信息'],
            directStatus:[
                {
                    text:'是',
                    value:true
                },{
                    text:'否',
                    value:false
                }
            ],
            registeredStatus:[
                {
                    text:'已注册',
                    value:true
                },{
                    text:'未注册',
                    value:false
                }
            ],
            list:[],
        };
    },
    created() {
        if(_.isEmpty(this.provinceList)) {
            this.$store.dispatch('getProvince')
        }
    },
    computed: {
        ...mapGetters({
            provinceList: 'provinceList',
        }),
        cityList() {
            let provinceId = this.form.provinceId

            return provinceId ? this.provinceList[provinceId].citys : []
        }
    },
    mounted(){
        this.form.id = this.$route.query.id;
        if(this.$route.query.id){
            this.getData();
        }
        get(`/api/sysmgr-web/user/get-platform-users?platformType=console-admin`).then(data => {
            this.charges = data
            this.charges.forEach(e => {
                if(e.id == this.form.chargeBy) {
                  this.form.chargeByName = e.name
                }
            })
        })
        this.getList();
    },
    methods: {
        back() {
            this.$router.back()
        },
        getData(){
            get(`/api/salemgt/service-company/query/details/${this.$route.query.id}`).then(data => {
                data.serviceCompanyInfo.supportInvoiceType = data.serviceCompanyInfo.supportInvoiceType.split(';');
                this.form = data.serviceCompanyInfo;
            })
        },
        submit() {
            this.$refs['form'].validate((valid) => {
                if (valid) {
                    this.form.supportInvoiceType = this.form.supportInvoiceType.join(';');
                    this.list.forEach(r => {
                        if(r.id == this.form.taxLandingId){
                            this.form.taxLandingName = r.taxLandingName;
                        }
                    })
                    
                    post('/api/salemgt/service-company/save-update', this.form).then(data => {
                        this.$message({
                            type: 'success',
                            message: '添加成功！'
                        })
                        localStorage.setItem('appId', data)
                        this.$router.push("/main/clientManager/serverManager");
                    })
                    this.form.supportInvoiceType = this.form.supportInvoiceType.split(';');
                }
            })
        },
        masterVal(val){
            this.charges.forEach(e => {
                if(e.id == val) {
                  this.form.masterName = e.name
                }
            })
        },
        provinceVal(val){
            this.form.provinceName = this.provinceList[val]['name'];
            this.form.cityId = this.cityList[0]['id'];
            this.form.cityName = this.cityList[0]['name'];
        },
        cityVal(val){
            this.cityList.forEach(e => {
                if(e.id == val) {
                  this.form.cityName = e.name
                }
            })
        },
        getList() {
            get('/api/console-dlv/tax-landing/all-tax-landing').then(data => {
                this.list = data
            })
        }
    }
};

</script>
<style scoped>
.r_main {
    padding: 15px;
    background-color: #fff;
}

.form_input {
    width: 500px;
}

.tool {
    margin: 20px 0;
}

.box-card{
    margin-bottom: 20px;
}
</style>