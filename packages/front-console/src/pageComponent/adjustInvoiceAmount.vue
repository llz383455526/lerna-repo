<template>
  <el-dialog
    title="调整票量"
    :visible="show"
    @close="closeDialog"
    width="600px"
  >
    <el-form
      :rules="rulesAdd"
      :model="formAdd"
      ref="formAdd"
      label-width="120px"
    >
      <el-form-item
        label="发票类型"
        prop="invoiceType"
      >
        <el-select
          v-model="formAdd.invoiceType"
          placeholder="请选择"
        >
          <el-option
            label="增值税专用发票"
            value="ZP"
          />
          <el-option
            label="增值税普通发票"
            value="PP" 
          />
        </el-select>
      </el-form-item>
      <el-form-item
        label="票量调整类型"
        prop="operate"
      >
        <el-select
          v-model="formAdd.operate"
          placeholder="请选择"
        >
          <el-option
            label="添加"
            value="add"
          />
          <el-option
            label="减少"
            value="sub" 
          />
        </el-select>
      </el-form-item>
      <el-form-item
        label="调整数量"
        prop="addNum"
      >
        <el-input
          placeholder="请输入调整数量"
          v-model="formAdd.addNum"
        />
      </el-form-item>
      <el-form-item
        label="调整原因"
        prop="remark"
      >
        <el-input
          placeholder="请输入调整原因"
          type="textarea"
          v-model="formAdd.remark"
        />
      </el-form-item>
    </el-form>
    <div
      slot="footer"
      class="dialog-footer"
    >
      <el-button
        @click="closeDialog"
        size="small"
      >
        取 消
      </el-button>
      <el-button
        type="primary"
        @click="addInvoice('formAdd')"
        size="small"
      >
        确 定
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import {post} from '../store/api';
import {showNotify} from '../plugin/utils-notify';

export default {
    props: ['show', 'id'],
    data() {
        var numReg = /^[1-9]\d*$/;
        var validatenumber = (rule, value, callback) => {
            if(value == ''){
                callback(new Error('请填写票量数量'))
            }else if(!numReg.test(value)) {
                callback(new Error('票量数量必须为正整数'))
            } else if(value > 1000){
                callback(new Error('票量数量不能大于1000'))
            }else{
                callback()
            }
        };
        return {
            formAdd: {
                invoiceType: '',
                operate: '',
                addNum: '',
                remark: ''
            },
            rulesAdd: {
                invoiceType: [
                    {
                        required: true,
                        message: "请选择发票类型",
                        trigger: "change"
                    }
                ],
                operate: [
                    {
                        required: true,
                        message: "请选择发票操作类型",
                        trigger: "change"
                    }
                ],
                addNum: [
                    {
                        required: true,
                        validator: validatenumber,
                        trigger: "blur"
                    }
                ],
                remark: [
                    {
                        required: true,
                        message: "请填写备注",
                        trigger: "blur"
                    }
                ]
            },
        }
    },
    methods: {
        addInvoice() {
            this.$refs['formAdd'].validate(valid => {
                if (valid) {
                    this.formAdd.id =  this.id
                    let formAdd = JSON.parse(JSON.stringify(this.formAdd))
                    // formAdd.month = parseInt(formAdd.month)
                    post('/api/invoice-web/service-company/add-num', formAdd).then(data => {
                        showNotify('success', data);
                        this.$refs['formAdd'].resetFields()
                        this.$emit('success')
                    })
                }
            })      
        },
        closeDialog() {
            this.$emit('update:show', false)
        }
    }
}
</script>
