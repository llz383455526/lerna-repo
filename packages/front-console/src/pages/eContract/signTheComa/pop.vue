<template>
    <el-dialog
        :visible.sync="visible"
        :show-close="false"
        width="900px"
        class="pop-box"
        :before-close="handleClose">
        <span slot="title" class="dialog-header">配置先签后发</span>
        <ul class="pop-content">
            <li class="item">
                <el-switch class="switch" v-model="form_0.switch"></el-switch>
                <p class="item-title">
                    配置客户+落地
                    <span class="title-show">（优先级高，优先生效）</span>
                </p>
                <el-form :disabled="!form_0.switch" :model="form_0" class="demo-form-inline" size="small">
                    <el-form-item label="选择公司">
                        <el-select @change="step1Change" v-model="form_0.customerCompanyId" filterable
                                   placeholder="请选择">
                            <el-option
                                v-for="item in customerCompanies"
                                :key="item.companyId"
                                :label="item.companyName"
                                :value="item.companyId">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="选择落地">
                        <el-checkbox-group v-model="form_0.sel">
                            <el-checkbox :label="item.id" :key="item.id" v-for="item in form_0.luoDiArr">{{ item.companyName }}</el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>
                </el-form>
            </li>
            <li class="item">
                <el-switch class="switch" v-model="form_1.switch"></el-switch>
                <p class="item-title">
                    只配置客户
                    <span class="title-show">（优先级中，优先生效）</span>
                </p>
                <el-form :disabled="!form_1.switch" v-if="form_1.switch" :model="form_1" class="demo-form-inline" size="small">
                    <el-form-item label="选择公司">
                        <el-select style="width: 300px" multiple v-model="form_1.sel" filterable placeholder="请选择">
                            <el-option
                                v-for="item in form_1.listOption"
                                :key="item.id"
                                :label="item.companyName"
                                :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
            </li>
            <li class="item">
                <el-switch class="switch" v-model="form_2.switch"></el-switch>
                <p class="item-title">
                    只配置落地
                    <span class="title-show">（优先级低，优先生效）</span>
                </p>
                <el-form :disabled="!form_2.switch" v-if="form_2.switch" :model="form_2" class="demo-form-inline"
                         size="small">
                    <el-form-item label="选择公司">
                        <el-select style="width: 300px" multiple v-model="form_2.sel" filterable placeholder="请选择">
                            <el-option
                                v-for="item in form_2.listOption"
                                :key="item.id"
                                :label="item.companyName"
                                :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
            </li>
        </ul>
        <span slot="footer" class="dialog-footer">
            <el-button @click="visible = false" size="small">取 消</el-button>
            <el-button type="primary" @click="okBtnClick" size="small">确 定</el-button>
        </span>
    </el-dialog>
</template>

<script>
    import {post, get, importPost} from "../../../store/api"

    export default {
        name: "pop",
        props: {
            customerCompanies: {
                type: Array,
            },
        },
        data() {
            return {
                visible: false,
                form_0: {
                    switch: false,
                    customerCompanyId: '',
                    luoDiArr: [],
                    sel: []
                },
                form_1: {
                    switch: false,
                    listOption: [],
                    sel: []
                },
                form_2: {
                    switch: false,
                    listOption: [],
                    sel: []
                }
            }
        },
        mounted() {
            this.getStep2List()
            this.getStep3List()
        },
        methods: {
            step1Change(id) {
                this.form_0.luoDiArr = []
                this.form_0.sel = []
                get('/api/risk-mgt-service/esign-config/get-customer-service-company', {
                    customerCompanyId: id
                }).then((data) => {
                    this.form_0.luoDiArr = data ? data : []
                }).catch(() => {
                })
            },
            getStep2List() {
                get('/api/risk-mgt-service/esign-config/get-customer-company').then((data) => {
                    this.form_1.listOption = data ? data : []
                }).catch(() => {
                })
            },
            getStep3List() {
                get('/api/risk-mgt-service/esign-config/get-service-company').then((data) => {
                    this.form_2.listOption = data ? data : []
                }).catch(() => {
                })
            },
            // huo
            show() {
                this.visible = true
                this.form_0.switch = false
                this.form_0.customerCompanyId = ''
                this.form_1.switch = false
                this.form_2.switch = false
                this.form_0.sel = []
                this.form_1.sel = []
                this.form_2.sel = []
            },
            okBtnClick() {
                if (!this.form_0.switch && !this.form_1.switch && !this.form_2.switch) {
                    this.$message.error('至少选择一个');
                    return
                }
                const noSignServiceCompanyIds = this.form_0.luoDiArr.filter((item) => {
                     return this.form_0.sel.indexOf(item.id) < 0
                }).map((item) => {
                    return item.id
                })
                const data = {
                    "customerCompanyId": this.form_0.customerCompanyId,
                    "esignFirstServiceCompanyIds": this.form_0.sel,
                    "noSignServiceCompanyIds": noSignServiceCompanyIds,
                    "openCustomer": this.form_1.switch,
                    "openCustomerService":  this.form_0.switch,
                    "openService": this.form_2.switch,
                    "serviceCompanyIds": this.form_2.sel,
                    "singleCustomerCompanyIds": this.form_1.sel,
                }
                post('/api/risk-mgt-service/esign-config/company-config', data).then(res => {
                    this.visible = false
                    this.$emit('reload')
                })
            }
        }
    }
</script>

<style scoped lang="scss">
    .pop-box {
        .dialog-header {
            color: rgb(29, 124, 238);
            padding-bottom: 5px;
            border-bottom: 3px solid rgb(29, 124, 238);
        }

        .pop-content {
            list-style: none;
            padding: 0;
            margin: 0;

            .item {
                padding-left: 50px;
                position: relative;

                .switch {
                    position: absolute;
                    left: 0;
                    top: 3px;
                }

                .item-title {
                    color: #333;
                    font-size: 18px;

                    .title-show {
                        color: #ccc;
                        font-size: 14px;
                    }
                }
            }
        }
    }
</style>