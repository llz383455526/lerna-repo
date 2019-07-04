<template>
    <div class="content-box">
        <div class="up-file-box"
             v-if="model.companyRiskRateDTO.uploadServiceCompanyList && model.companyRiskRateDTO.uploadServiceCompanyList.length > 0">
            <i class="icon el-icon-plus" style="cursor: pointer;" @click="popShowClick"></i>
            <span class="text">上传附件</span>
        </div>
        <div class="gongsi-box">
            <div class="wait-gongsi" v-if="model.companyRiskRateDTO.uploadServiceCompanyList.length > 0">
                <p class="wait-title">待上传落地公司</p>
                <ul class="gongsi-list">
                    <li class="cell" v-for="item in model.companyRiskRateDTO.uploadServiceCompanyList">{{ item.name }}</li>
                </ul>
            </div>
            <ul class="rule-list" v-if="model.companyRiskRateDTO.companyRiskRateServiceDetailDTOList">
                <li class="cell" v-for="item in model.companyRiskRateDTO.companyRiskRateServiceDetailDTOList">
                    <el-row :gutter="20">
                        <el-col class="gongsi" :span="12">{{ item.cuserBalanceStandardFileName }}</el-col>
                        <el-col :span="6">
                            <span class="yulan" @click="previewClick(item)">下载</span>
                            &nbsp;&nbsp;&nbsp;
                            <span class="audit-state">{{ item.cuserBalanceStandardStateName }}</span>
                        </el-col>
                        <el-col class="time" :span="6">{{ item.cuserBalanceStandardUpdateTime }}</el-col>
                    </el-row>
                </li>
            </ul>
        </div>
        <w-pop
            @reload="$emit('reload')"
            :file-format="['.pdf', '.xls', '.xlsx', '.doc', '.docx', '.txt', '.csv']"
            :file-size="32"
            title="C端绩效计算规则"
            url="/risk-level-approve/cuser-balance-standard-upload"
            file-suffix="计算规则"
            attachment-key="cuserBalanceStandardAttachmentId"
            ref="WPop"/>
    </div>
</template>

<script>
    import WPop from './pop'

    export default {
        name: "cRule",
        props: ['model'],
        components: {
            WPop
        },
        methods: {
            popShowClick() {
                this.$refs.WPop.show({
                    servers: this.model.companyRiskRateDTO.uploadServiceCompanyList
                })
            },
            previewClick(item) {
                window.open('/api/sysmgr-web/file/download?downloadCode=' + item.cuserBalanceStandardDownloadCode)
            }
        }
    }
</script>

<style scoped lang="scss">
    .content-box {
        position: relative;

        .up-file-box {
            position: absolute;
            left: 20px;
            top: 20px;
            flex: 1 0 auto;
            width: 100px;
            display: flex;
            align-items: center;
            flex-direction: column;

            .icon {
                width: 60px;
                height: 60px;
                display: flex;
                justify-content: center;
                align-items: center;
                border: 1px solid rgba(187, 187, 187, 1);
                font-size: 24px;
                color: rgba(187, 187, 187, 1);
            }

            .text {
                color: rgba(187, 187, 187, 1);
                font-size: 16px;
            }
        }

        .gongsi-box {
            padding-left: 150px;
            width: 100%;

            .wait-gongsi {
                position: relative;
                padding-left: 140px;

                .wait-title {
                    position: absolute;
                    left: 0;
                    top: 5px;
                    color: rgba(16, 16, 16, 1);
                    font-size: 16px;
                    width: 140px;
                    margin: 0;
                }

                .gongsi-list {
                    list-style: none;
                    margin: 0;
                    padding: 0;
                    display: flex;
                    flex-wrap: wrap;

                    .cell {
                        line-height: 20px;
                        color: rgba(204, 204, 204, 1);
                        font-size: 14px;
                        border: 1px dashed rgba(204, 204, 204, 1);
                        padding: 5px 8px;
                        margin-left: 10px;
                        margin-bottom: 10px;
                    }
                }
            }
        }
    }

    .rule-list {
        list-style: none;
        margin: 0;
        padding: 0;

        .cell {
            padding: 5px 0;

            .gongsi {
                color: rgba(0, 0, 0, 1);
                font-size: 18px;
            }

            .yulan {
                color: rgba(29, 124, 238, 1);
                font-size: 18px;
                cursor: pointer;
            }

            .audit-state {
                color: rgba(26, 179, 148, 1);
                font-size: 18px;
            }

            .time {
                color: rgba(187, 187, 187, 1);
                font-size: 18px;
            }
        }
    }
</style>
