<template>
  <div>
    <h3 class="green">
      请添加落地公司
      <el-button
        size="small"
        type="primary"
        @click="dialogVisible = true"
      >
        添加
      </el-button>
    </h3>
    <!-- 
      v-for="(formItem,index) in form.datas.agentContract.serviceCompanyFeeContentList"
      :key="index" -->
    <div
      class="widget-box"
      style="margin-bottom: 20px;"
    >
      <div class="widget-header">
        <h4
          class="widget-title"
          style="margin-right: 25px;"
        >
          <!--  {{ formItem.taxLandingName }} / {{ formItem.serviceCompanyName || '落地公司名称' }} -->
          落地公司名称
        </h4>
        <div class="widget-toolbar">
          <el-button
            @click="deleteForm(index)"
            type="text"
            size="medium"
            v-if="!showDelBtn"
          >
            删除
          </el-button>
        </div>
      </div>
      <div class="widget-main">
        <!-- 
          v-for="(item, index) in form.datas.agentContract.serviceCompanyFeeContentList"
          :key="index"
          :settlement-rate-info="item" -->
          <!-- 这里是服务合同的细节 -->
        <settlement-rate />
      </div>
    </div>
    <el-dialog
      title="添加公司信息"
      :visible.sync="dialogVisible"
      width="700px"
    >
      <el-form
        :inline="true"
        :model="appForm"
        label-width="150px"
        ref="appForm"
      >
        <el-form-item label="服务商名称">
          <el-select
            v-model="appForm.serviceCompanyId"
            filterable
            placeholder="请选择"
            style="width: 450px;"
          >
            <el-option
              v-for="(item,key) in filterList"
              :key="key"
              :label="item.name"
              :value="item.companyId" 
            />
          </el-select>
        </el-form-item>
        <el-form-item style="margin-left: 150px;">
          <el-button
            type="primary"
            @click="formAdd"
          >
            保存
          </el-button>
          <el-button @click="dialogVisible = false">
            取消
          </el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import settlementRate from 'src/pageComponent/settlementRate'

export default {
    components: {settlementRate},
    props: {
        form: {
            type: Object,
            default() {
                return {}
            }
        }
    },
    data() {
        return {
            dialogVisible: false,
            appForm: {
                serviceCompanyId: ''
            }
        }
    },
    computed: {
        filterList() {
            return this.$store.getters.serviceCompaniesList
        }
    },
    methods: {
        formAdd() {}
    },
    created() {
        this.$store.dispatch('getServiceCompaniesList')
    }
}
</script>
