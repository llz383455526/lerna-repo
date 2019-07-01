<template>
    <div class="limit-rule">
        <el-row :gutter="20" class="table-title">
            <el-col :span="6">
                <span class="text">服务公司名称</span>
            </el-col>
            <el-col :span="3" class="text-center">
                <span class="text">单人笔(万)</span>
            </el-col>
            <el-col :span="3" class="text-center">
                <span class="text">单人日(万)</span>
            </el-col>
            <el-col :span="3" class="text-center">
                <span class="text">单人月(万)</span>
            </el-col>
            <el-col :span="3" class="text-center">
                <span class="text">单人年(万)</span>
            </el-col>
            <el-col :span="option ? 3 : 6" class="text-center">
                <span class="text">操作记录</span>
            </el-col>
            <el-col :span="3" class="text-center" v-if="option">
                <span class="text">操作</span>
            </el-col>
        </el-row>
        <div v-for="(v, k) in dataArr" class="table-view-cell">
            <el-row :gutter="20">
                <el-col :span="6">
                    <span class="gongsi-cell-text">
                        {{ v.serviceCompanyName }}
                    </span>
                </el-col>
                <el-col :span="3" class="text-center flex-center">
                    <template v-if="isHaveData(v, 'riskRuleType2RiskRuleInfoDTOMap', 'unit_limit_max')">
                        <div
                            class="cost-box"
                            v-if="chengBenShow(v, 'riskRuleType2RiskRuleInfoDTOMap', 'unit_limit_max')"
                            :class="{'text-line-through': !v.riskRuleType2RiskRuleInfoDTOMap.unit_limit_max.specialEnable}">
                                <span class="server-type-cell-text number">
                                    {{ getChengBenData(v, 'riskRuleType2RiskRuleInfoDTOMap', 'unit_limit_max') }}
                                </span>
                            <span>成本</span>
                        </div>
                        <div
                            class="star-box"
                            v-if="starShow(v, 'riskRuleType2RiskRuleInfoDTOMap', 'unit_limit_max')"
                            :class="{'text-line-through': !v.riskRuleType2RiskRuleInfoDTOMap.unit_limit_max.levelEnable}">
                                <span class="server-type-cell-text number">
                                    {{ getStarData(v, 'riskRuleType2RiskRuleInfoDTOMap', 'unit_limit_max') }}
                                </span>
                            <span>星级</span>
                        </div>
                    </template>
                    <template v-else>
                        --
                    </template>
                </el-col>
                <el-col :span="3" class="text-center flex-center">
                    <template v-if="isHaveData(v, 'riskRuleType2RiskRuleInfoDTOMap', 'day_limit_max')">
                        <div
                            class="cost-box"
                            v-if="chengBenShow(v, 'riskRuleType2RiskRuleInfoDTOMap', 'day_limit_max')"
                            :class="{'text-line-through': !v.riskRuleType2RiskRuleInfoDTOMap.day_limit_max.specialEnable}">
                            <span class="server-type-cell-text number">{{ getChengBenData(v, 'riskRuleType2RiskRuleInfoDTOMap', 'day_limit_max') }}</span>
                            <span>成本</span>
                        </div>
                        <div
                            class="star-box"
                            v-if="starShow(v, 'riskRuleType2RiskRuleInfoDTOMap', 'day_limit_max')"
                            :class="{'text-line-through': !v.riskRuleType2RiskRuleInfoDTOMap.day_limit_max.levelEnable}">
                                <span class="server-type-cell-text number">
                                    {{ getStarData(v, 'riskRuleType2RiskRuleInfoDTOMap', 'day_limit_max') }}
                                </span>
                            <span>星级</span>
                        </div>
                    </template>
                    <template v-else>
                        --
                    </template>
                </el-col>
                <el-col :span="3" class="text-center flex-center">
                    <template v-if="isHaveData(v, 'riskRuleType2RiskRuleInfoDTOMap', 'month_limit_max')">
                        <div
                            class="cost-box"
                            v-if="chengBenShow(v, 'riskRuleType2RiskRuleInfoDTOMap', 'month_limit_max')"
                            :class="{'text-line-through': !v.riskRuleType2RiskRuleInfoDTOMap.month_limit_max.specialEnable}">
                            <span class="server-type-cell-text number">{{ getChengBenData(v, 'riskRuleType2RiskRuleInfoDTOMap', 'month_limit_max') }}</span>
                            <span>成本</span>
                        </div>
                        <div
                            class="star-box"
                            v-if="starShow(v, 'riskRuleType2RiskRuleInfoDTOMap', 'month_limit_max')"
                            :class="{'text-line-through': !v.riskRuleType2RiskRuleInfoDTOMap.month_limit_max.levelEnable}">
                                <span class="server-type-cell-text number">
                                    {{ getStarData(v, 'riskRuleType2RiskRuleInfoDTOMap', 'month_limit_max') }}
                                </span>
                            <span>星级</span>
                        </div>
                    </template>
                    <template v-else>
                        --
                    </template>
                </el-col>
                <el-col :span="3" class="text-center flex-center">
                    <template v-if="isHaveData(v, 'riskRuleType2RiskRuleInfoDTOMap', 'year_limit_max')">
                        <div
                            class="cost-box"
                            v-if="chengBenShow(v, 'riskRuleType2RiskRuleInfoDTOMap', 'year_limit_max')"
                            :class="{'text-line-through': !v.riskRuleType2RiskRuleInfoDTOMap.year_limit_max.specialEnable}">
                            <span class="server-type-cell-text number">{{ getChengBenData(v, 'riskRuleType2RiskRuleInfoDTOMap', 'year_limit_max') }}</span>
                            <span>成本</span>
                        </div>
                        <div
                            class="star-box"
                            v-if="starShow(v, 'riskRuleType2RiskRuleInfoDTOMap', 'year_limit_max')"
                            :class="{'text-line-through': !v.riskRuleType2RiskRuleInfoDTOMap.year_limit_max.levelEnable}">
                                <span class="server-type-cell-text number">
                                    {{ getStarData(v, 'riskRuleType2RiskRuleInfoDTOMap', 'year_limit_max') }}
                                </span>
                            <span>星级</span>
                        </div>
                    </template>
                    <template v-else>
                        --
                    </template>
                </el-col>
                <el-col :span="option ? 3 : 6" class="text-center flex-center" style="font-size: 14px; color: #999">
                    {{ v.updateName }} <span v-if="v.updateName && v.updateTime">&nbsp;|&nbsp;</span> {{ v.updateTime }}
                </el-col>
                <el-col :span="3" class="text-center flex-center" v-if="option">
                    <el-button type="text" @click="editBtnClick(v)">编辑</el-button>
                    <el-button type="text" @click="removeBtnClick(v)">删除</el-button>
                </el-col>
            </el-row>
            <el-row :gutter="20" v-for="(item, key) in v.serviceTypeOptionsDTOList" :key="key">
                <el-col :span="6" class="server-type-cell" style="justify-content: flex-start;">
                        <span class="server-type-cell-text server-type-cell-title-text">
                            {{ item.serviceName }}
                            <img class="label-icon" src="../../image/label.png" alt="">
                        </span>
                </el-col>
                <el-col :span="3" class="text-center flex-center">
                    <template v-if="isHaveData(item, 'serverType', 'unit_limit')">
                        <div
                            class="cost-box"
                            v-if="chengBenShow(item, 'serverType', 'unit_limit')"
                            :class="{'text-line-through': !item.serverType.unit_limit.specialEnable}">
                                <span class="server-type-cell-text number">
                                    {{ getChengBenData(item, 'serverType', 'unit_limit') }}
                                </span>
                            <span>成本</span>
                        </div>
                        <div
                            class="star-box"
                            v-if="starShow(item, 'serverType', 'unit_limit')"
                            :class="{'text-line-through': !item.serverType.unit_limit.levelEnable}">
                                <span class="server-type-cell-text number">
                                    {{ getStarData(item, 'serverType', 'unit_limit') }}
                                </span>
                            <span>星级</span>
                        </div>
                    </template>
                    <template v-else>
                        --
                    </template>
                </el-col>
                <el-col :span="3" class="text-center flex-center">
                    <template v-if="isHaveData(item, 'serverType', 'day_limit')">
                        <div
                            class="cost-box"
                            v-if="chengBenShow(item, 'serverType', 'day_limit')"
                            :class="{'text-line-through': !item.serverType.day_limit.specialEnable}">
                                <span class="server-type-cell-text number">
                                    {{ getChengBenData(item, 'serverType', 'day_limit') }}
                                </span>
                            <span>成本</span>
                        </div>
                        <div
                            class="star-box"
                            v-if="starShow(item, 'serverType', 'day_limit')"
                            :class="{'text-line-through': !item.serverType.day_limit.levelEnable}">
                                <span class="server-type-cell-text number">
                                    {{ getStarData(item, 'serverType', 'day_limit') }}
                                </span>
                            <span>星级</span>
                        </div>
                    </template>
                    <template v-else>
                        --
                    </template>
                </el-col>
                <el-col :span="3" class="text-center flex-center">
                    <template v-if="isHaveData(item, 'serverType', 'month_limit')">
                        <div
                            class="cost-box"
                            v-if="chengBenShow(item, 'serverType', 'month_limit')"
                            :class="{'text-line-through': !item.serverType.month_limit.specialEnable}">
                                <span class="server-type-cell-text number">
                                    {{ getChengBenData(item, 'serverType', 'month_limit') }}
                                </span>
                            <span>成本</span>
                        </div>
                        <div
                            class="star-box"
                            v-if="starShow(item, 'serverType', 'month_limit')"
                            :class="{'text-line-through': !item.serverType.month_limit.levelEnable}">
                                <span class="server-type-cell-text number">
                                    {{ getStarData(item, 'serverType', 'month_limit') }}
                                </span>
                            <span>星级</span>
                        </div>
                    </template>
                    <template v-else>
                        --
                    </template>
                </el-col>
                <el-col :span="3" class="text-center flex-center">
                    <template v-if="isHaveData(item, 'serverType', 'year_limit')">
                        <div
                            class="cost-box"
                            v-if="chengBenShow(item, 'serverType', 'year_limit')"
                            :class="{'text-line-through': !item.serverType.year_limit.specialEnable}">
                                <span class="server-type-cell-text number">
                                    {{ getChengBenData(item, 'serverType', 'year_limit') }}
                                </span>
                            <span>成本</span>
                        </div>
                        <div
                            class="star-box"
                            v-if="starShow(item, 'serverType', 'year_limit')"
                            :class="{'text-line-through': !item.serverType.year_limit.levelEnable}">
                                <span class="server-type-cell-text number">
                                    {{ getStarData(item, 'serverType', 'year_limit') }}
                                </span>
                            <span>星级</span>
                        </div>
                    </template>
                    <template v-else>
                        --
                    </template>
                </el-col>
                <el-col :span="3" class="text-center flex-center">
                    &nbsp;
                </el-col>
                <el-col :span="3" class="text-center flex-center">
                    &nbsp;
                </el-col>
            </el-row>
        </div>
        <w-pop ref="WPop" @reload="getListData" :company-id="companyId"></w-pop>
    </div>
</template>

<script>
    import {get, post} from "../../store/api";
    import WPop from './limitRulePop'

    export default {
        name: "limitRule",
        components: {
            WPop
        },
        props: {
            option: {
                type: Boolean,
                default: false
            },
            companyId: {
                type: String | Number,
                default: ''
            }
        },
        data() {
            return {
                dataArr: [],
                isShow: true
            }
        },
        methods: {
            // 是否有数据
            isHaveData(item, pKey, key) {
                const cellData = item[pKey][key]
                return !!cellData
            },
            // 星级是否显示
            starShow(item, pKey, key) {
                const cellData = item[pKey][key]
                return !!cellData.refuseAmount
            },
            // 成本是否显示
            chengBenShow(item, pKey, key) {
                const cellData = item[pKey][key]
                return !!cellData.specialRefuseAmount
            },
            // 获取星级数据
            getStarData(item, pKey, key) {
                const cellData = item[pKey][key]
                return cellData.refuseAmount
            },
            // 获取成本数据
            getChengBenData(item, pKey, key) {
                const cellData = item[pKey][key]
                return cellData.specialRefuseAmount
            },
            // 获取发放限额列表
            getListData() {
                get('/api/console-dlv/risk-level/get-company-risk-rule-info', {
                    companyId: this.companyId
                }).then((data) => {
                    data.forEach((item) => {
                        item.serviceTypeOptionsDTOList.forEach((item1) => {
                            item1.serverType = item.serviceType2RiskRuleInfoMap[item1.serviceId]
                        })
                    })
                    this.dataArr = data
                }).catch(() => {
                })
            },
            // 删除按钮点击
            removeBtnClick(item) {
                this.$confirm('是否删除该条成本限额?', '删除提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    post('/api/console-dlv/risk-special/risk-special-pack-delete', {
                        "customerCompanyId": this.companyId,
                        "serviceCompanyId": item.serviceCompanyId
                    }).then((data) => {
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                        this.getListData()
                    }).catch(() => {
                    })
                }).catch(() => {
                });
            },
            editBtnClick(item) {
                this.$refs.WPop.show(item)
            }
        },
        mounted() {
            this.getListData()
        },
        watch: {
            companyId() {
                this.getListData()
            }
        }
    }
</script>

<style lang="scss" scoped>
    .limit-rule {
        padding-left: 30px;

        .title {
            margin: 0;
        }
    }

    .table-title {
        .text {
            color: rgba(16, 16, 16, 1);
            font-size: 16px;
            line-height: 50px;
        }
    }

    .gongsi-cell-text {
        color: rgba(0, 0, 0, 1);
        font-size: 16px;
        line-height: 40px;
    }

    .server-type-cell-text {
        font-size: 16px;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .server-type-cell-title-text {
        height: 52px;
        padding-left: 20px;
        margin-left: 40px;
        border-left: 3px solid #ddd;
        justify-content: flex-start !important;
        position: relative;

        .label-icon {
            position: absolute;
            left: -10px;
            top: 22px;
            width: 20px;
        }
    }

    .text-center {
        text-align: center;
    }

    .table-view-cell {
        padding-bottom: 20px;
    }

    .table-view-cell:last-child {
        padding-bottom: 0px;
    }

    .label {
        font-size: 12px;
        border-radius: 4px;
        padding: 0 3px;
    }

    .star-label {
        color: rgba(29, 124, 238, 1);
        border: 1px solid rgba(29, 124, 238, 1);
    }

    .cost-label {
        color: rgba(26, 179, 148, 1);
        border: 1px solid rgba(26, 179, 148, 1);
    }

    .text-line-through {
        color: #aaa;

        .number {
            color: #aaa;
            text-decoration: line-through;
        }
    }

    .server-type-cell {
        height: 52px;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .flex-center {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 52px;
    }

    .star-box {
        padding-left: 5px;
    }
</style>