<template>
  <div class="performance-manager-performance">
    <el-table
      :data="model.companyRiskRateDataDTOList"
      style="width: 100%">
      <el-table-column
        prop="date"
        label="月份"
        width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.year }}年{{scope.row.month}}月</span>
        </template>
      </el-table-column>
      <el-table-column
        label="数据状态"
        width="180">
        <template slot-scope="scope">
          <span v-if="!scope.row.uploadServiceCompanyList || scope.row.uploadServiceCompanyList.length === 0">已上传</span>
          <span @click="upFileClick(scope.row)" style="color: rgb(26, 179, 148); cursor: pointer;" v-else-if="!scope.row.riskRateDataServiceDetailDTOList || scope.row.riskRateDataServiceDetailDTOList.length === 0">未上传 <i class="el-icon-upload2"></i></span>
          <span @click="upFileClick(scope.row)" style="color: rgb(26, 179, 148); cursor: pointer;" v-else>可上传 <i class="el-icon-upload2"></i></span>

        </template>
      </el-table-column>
      <el-table-column
        label="落地公司">
        <template slot-scope="scope">
          <ul class="can-upload-companys" v-if="scope.row.uploadServiceCompanyList && scope.row.uploadServiceCompanyList.length > 0">
            <li class="item" v-for="(v, k) in scope.row.uploadServiceCompanyList" :key="k">{{v.name}}</li>
          </ul>
          <ul class="already-upload-companys" v-if="scope.row .riskRateDataServiceDetailDTOList && scope.row.riskRateDataServiceDetailDTOList.length > 0">
            <li class="item" v-for="(v, k) in scope.row.riskRateDataServiceDetailDTOList" :key="k">
              <el-row :gutter="20">
                <el-col :span="10" class="name">{{ v.cuserPerformanceFileName }}</el-col>
                <el-col :span="2">
                  <span class="preview" @click="previewClick(v)">下载</span>
                </el-col>
                <el-col :span="12" class="status">
                  <span class="yes"  v-if="v.cuserPerformanceState.indexOf('fail') === -1">{{ v.cuserPerformanceStateName }}</span>
                  <span class="no" v-else>{{ v.cuserPerformanceStateName }}</span>
                </el-col>
              </el-row>
            </li>
          </ul>
        </template>
      </el-table-column>
    </el-table>
    <w-pop
      url="/risk-level-approve/cuser-performance-upload"
      @reload="$emit('reload')"
      title="C端绩费计算明细"
      file-suffix="计算明细"
      attachment-key="cuserPerformanceAttachmentId"
      ref="WPop" />
  </div>
</template>

<script>
  import WPop from './pop'
  export default {
    name: "PerformanceManagerPerformance",
    props: ['model'],
    components: {
      WPop
    },
    data() {
      return {}
    },
    methods: {
      upFileClick(item) {
        this.$refs.WPop.show({
          servers: item.uploadServiceCompanyList,
          otherParams: {
            year: item.year,
            month: item.month
          }
        })
      },
      previewClick(item) {
        window.open('/api/sysmgr-web/file/download?downloadCode=' + item.cuserPerformanceDownloadCode)
      }
    }
  }
</script>

<style scoped lang="scss">
.performance-manager-performance {
  .can-upload-companys {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-wrap: wrap;
    .item {
      color: rgba(204, 204, 204, 1);
      font-size: 14px;
      border: 1px dashed rgba(204, 204, 204, 1);
      margin-right: 10px;
      margin-bottom: 10px;
      padding: 3px 5px;
    }
  }
  .already-upload-companys {
    list-style: none;
    padding: 0;
    margin: 0;
    .item {
      margin: 15px 0;
      .name {
        color: rgba(0, 0, 0, 1);
        font-size: 18px;
      }
      .preview {
        color: rgba(29, 124, 238, 1);
        font-size: 18px;
        cursor: pointer;
      }
      .status {
        font-size: 18px;
        .yes {
          color: rgba(26, 179, 148, 1);
        }
        .no {
          color: rgba(232, 87, 92, 1);
        }
      }
    }
  }
}
</style>
<style lang="scss">
  .performance-manager-performance {
    .step-box {
      background-color: rgba(0,0,0,0);
      padding: 0;
    }
    .el-step__head {
      display: none;
    }
  }
</style>
