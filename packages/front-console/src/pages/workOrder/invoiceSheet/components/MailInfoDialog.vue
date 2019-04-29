<template>
    <el-dialog
        title="编辑邮寄信息"
        :visible.sync="showSync"
        :close-on-click-modal="false"
        width="800px"
    >
        <el-form
            ref="mailInfo"
            label-width="200px"
            class="mail-form"
            :model="mailInfo"
        >
            <el-form-item 
                label="收票人"
                prop="name"
            >
                 <el-input
                    v-model="mailInfo.collector"
                ></el-input>
            </el-form-item>
            <el-form-item 
                label="收票人电话"
                prop="taxIdcd"
            >
                <el-input
                    v-model="mailInfo.collectorPhone"
                ></el-input>
            </el-form-item>
            <el-form-item
                label="收票人地址"
                prop="addr"
            >
                <el-input
                    v-model="mailInfo.collectorAddr"
                ></el-input>
            </el-form-item>
            <el-form-item>
                <el-button @click="$emit('update:show', false)">取消</el-button>
                <el-button
                    type="primary"
                    @click="onSubmit('mailInfo')"
                >确定</el-button>
            </el-form-item>
        </el-form>
    </el-dialog>
</template>

<script>
import {invoiceApi} from 'src/api'
import { get, post, importPost } from "src/store/api";

export default {
    props: {
        show: {
            type:Boolean
        },
        info: {
            type: Object
        }
    },
    data() {
        return {
        }
    },
    computed: {
        showSync: {
            get: function() {
                return this.show
            },
            set: function(newValue) {
                console.log(newValue)
                this.$emit('update:show', newValue)
            }
        },
        mailInfo() {
            return JSON.parse(JSON.stringify(this.info))
        }
    },
    methods: {
        onSubmit(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    // 去掉前后空格
                    for(let k in this.mailInfo) {
                        let val = this.mailInfo[k]
                        this.mailInfo[k] = (val && val.trim) ? val.trim() : val
                    }
                    post(invoiceApi.editCustomerInfo,this.mailInfo).then(res => {
                        this.$emit('update:show', false)
                        this.$emit('changeInfo', this.mailInfo)
                    })
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
            
        }
    }
}
</script>

<style lang="scss" scoped>
.el-form-item{
    margin-bottom: 22px;
}
</style>
