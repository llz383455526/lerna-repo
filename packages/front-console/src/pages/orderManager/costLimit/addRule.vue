<template>
    <div class="cost-limit-add-rule" v-if="model">
        <div>
            {{ model.companyName }}
            &nbsp;
            <template v-if="!$route.query.show">
                <el-button v-if="model.riskSpecialState == 20" type="primary" size="mini" @click="stateBtnClick('10')">启用</el-button>
                <el-button v-else type="danger" size="mini" @click="stateBtnClick('20')">禁用</el-button>
            </template>
        </div>
        <div class="section">
            <p class="section-title">概览</p>
            <div class="content">
                <span class="star-box">
                    风控等级
                    <w-stsr style="display: inline" :count="model.riskLevel"></w-stsr>
                </span>
                <span style="margin-left: 100px;">
                    限额状态
                    <el-tooltip v-if="model.riskSpecialState == 10" class="item" effect="dark" content="成本限额与星级限同时生效" placement="top">
                        <span style="color: #1D7CEE;" >有效</span>
                    </el-tooltip>
                    <el-tooltip v-else class="item" effect="dark" content="默认生效星级限额" placement="top">
                        <span style="color: #EC6D72;" >无效</span>
                    </el-tooltip>
                </span>
            </div>
        </div>
        <br />
        <div class="section">
            <p class="section-title">发放限额规则</p>
            <w-limit-rule ref="WStarRule" :company-id="$route.query.id" :option="$route.query.show !== 'true'"></w-limit-rule>
        </div>
        <el-button size="small" @click="$router.go(-1)">返回</el-button>
    </div>
</template>

<script>
    import {get, post} from "../../../store/api";
    import WStsr from '../../../component/star'
    import WLimitRule from '../../../component/fengkong/limitRule'

    export default {
        name: "addRule",
        components: {
            WStsr,
            WLimitRule
        },
        data() {
            return {
                model: null
            }
        },
        methods: {
            // 获取详情数据
            getDetail() {
                get('/api/console-dlv/risk_level_degrade/risk-level-degrade-detail', {
                    companyId: this.$route.query.id
                }).then((data) => {
                    this.model = data
                }).catch(() => {
                })
            },
            stateBtnClick(state) {
                post('/api/console-dlv/risk-special/risk-special-state-update', {
                    companyId: this.$route.query.id,
                    state: state
                }).then(() => {
                    this.getDetail()
                    this.$refs.WStarRule.getListData()
                }).catch(() => {
                })
            }
        },
        mounted() {
            this.getDetail()
        }
    }
</script>

<style lang="scss" scoped>
    .cost-limit-add-rule {
        background-color: #fff;
        margin: 20px 0;
        padding: 20px;

        .section {
            .section-title {
                color: rgba(16, 16, 16, 1);
                font-size: 18px;
                padding-left: 10px;
                border-left: 4px solid #1D7CEE;
            }

            .cell {
                border-bottom: 1px solid rgba(242, 242, 242, 1);
                padding: 20px 0;
            }
        }
    }
</style>
