<template>
    <div>
        <div class="widget-box mb20" v-for="(formItem,index) in serviceCompanyFeeContentList" :key="index">
            <div class="widget-header">
                <!-- 落地公司名称 -->
                <h4 class="widget-title mr25">{{ formItem.taxLandingName }} / {{ formItem.serviceCompanyName || '落地公司名称' }}</h4>
                <div class="widget-toolbar">
                    <el-button @click="formDel(index)" type="text" size="medium" v-if="!showDelBtn">删除</el-button>
                </div>
            </div>
            <div class="widget-main">
                <agentDate ref="agentDate" :serviceCompanyFeeContent="formItem" v-if="operateEnum == '3'"></agentDate>
                <!-- 这里是服务合同的细节 -->
                <settlement-rate ref="serviceCompanyFeeContent" :serviceCompanyFeeContent="formItem"></settlement-rate>
            </div>
        </div>
    </div>
</template>

<script>
import settlementRate from 'src/pageComponent/settlementRate'
import agentDate from './agentDate'

export default {
    components: { settlementRate, agentDate },
    props: {
        serviceCompanyFeeContentList: {
            type: Array
        }
    },
    data() {
        return {
            list: [],
            operateEnum: ''
        }
    },
    methods: {
        validate() {
            let result = [] // 储存遍历每个验证结果
            let check = false // 最后输出
            console.log(this.$refs['agentDate'])
            this.$refs['agentDate'] && this.$refs['agentDate'].forEach((item) => {
                item.validate((res) => {
                    result.push(res)
                })
            })
            this.$refs['serviceCompanyFeeContent'].forEach((item) => {
                item.validate((res) => {
                    result.push(res)
                })
            })
            check = result.length === 0 || result.indexOf(false) > -1 ? false : true // 判断所有验证是否通过
            return check === false ? check : this.list
        },
        formDel(index) {
            this.$emit('formDel', index)
        }
    },
    created() {
        this.operateEnum = this.$route.query.operateEnum
    }
}
</script>

