<template>
  <div class="main">
    <div class="mb20">用户签约记录</div>
    <el-form :model="form" :inline="true" ref="form" size="small">
      <el-form-item label="生成时间">
        <el-date-picker
          v-model="range"
          type="daterange"
          range-separator="至"
          placeholder="选择日期"
          value-format="yyyy-MM-dd"
          size="small"
          @change="getTime">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="商户" prop="extrSystemIds">
        <el-select class="form_input_short" v-model="form.extrSystemIds" multiple filterable>
          <el-option v-for="item in extrSystemOptions" :label="item.extrSystemName" :value="item.extrSystemId" :key="item.extrSystemId"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="合同模板" prop="templateName">
        <el-input class="form_input_short" v-model="form.templateName"></el-input>
      </el-form-item>
      <el-form-item label="合同模板组" prop="templateGroupName">
        <el-input class="form_input_short" v-model="form.templateGroupName"></el-input>
      </el-form-item>
      <el-form-item label="签约服务商" prop="partyaUserId">
        <el-select
            v-model="form.partyaUserId"
            filterable
            remote
            reserve-keyword
            placeholder="请输入关键词"
            :remote-method="remoteObject"
            :loading="loading"
            size="small">
            <el-option
                v-for="e in objects"
                :key="e.userId"
                :label="e.name"
                :value="e.userId">
            </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="签约订单号" prop="orderId">
        <el-input v-model="form.orderId"></el-input>
      </el-form-item>
      <el-form-item label="姓名" prop="personalName">
        <el-input v-model="form.personalName"></el-input>
      </el-form-item>
      <el-form-item label="证件号" prop="personalIdentity">
        <el-input v-model="form.personalIdentity"></el-input>
      </el-form-item>
      <!-- <el-form-item label="手机号" prop="personalMobile">
        <el-input v-model="form.personalMobile"></el-input>
      </el-form-item> -->
      <el-form-item label="签约状态:" prop="signState">
        <el-select v-model="form.signState">
          <el-option v-for="item in sighStateList" :label="item.value" :value="item.key" :key="item.key"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="签约方式" prop="manufacturer">
        <el-select v-model="form.manufacturer">
          <el-option v-for="item in modeList" :label="item.text" :value="item.value" :key="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="query" size="small" :class="{disable: isHandle}">查询</el-button>
        <el-button size="small" @click="reset">清除</el-button>
        <!-- <el-button size="small" @click="download" class="btn">导出xls</el-button> -->
      </el-form-item>
    </el-form>
    <el-button type="primary" size="small" @click="derive(0)">导出当前报税列表</el-button>
    <el-button type="primary" size="small" @click="derive(1)">导出当前报税证照</el-button>
    <el-button type="primary" size="small" @click="derive(2)">导出当前报税合同</el-button>
    <el-button type="primary" size="small" @click="$router.push('downList')">下载列表</el-button>
    <div class="table-container">
      <el-table :data="data.data" ref="table">
        <el-table-column label="生成时间">
          <template slot-scope="scope">
            <span>{{scope.row.createTimeDesc | formatTime('yyyy-MM-dd hh:mm:ss')}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="orderId" label="签约订单号"></el-table-column>
        <el-table-column prop="extrSystemName" label="商户名称"></el-table-column>
        <el-table-column prop="templateName" label="合同模板名称"></el-table-column>
        <el-table-column prop="serverName" label="签约服务商"></el-table-column>
        <el-table-column prop="personalName" label="姓名"></el-table-column>
        <el-table-column prop="personalIdentity" label="证件号"></el-table-column>
        <!-- <el-table-column prop="personalMobile" label="手机号"></el-table-column> -->
        <el-table-column prop="signStateDesc" label="状态"></el-table-column>
        <el-table-column prop="manufacturerDesc" label="签约来源"></el-table-column>
        <el-table-column label="身份证照片">
            <template slot-scope="scope">
                <a :href="`/api/econtract/contract/download-identity-pdf?orderId=${scope.row.orderId}`" v-if="scope.row.certState == 2" target="_bank">证件照下载</a>
                <span v-else>暂无数据</span>
            </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <template v-if="scope.row.manufacturer != 1">
              <el-button class="ml0" v-if="scope.row.orderState === 'SIGNING' || scope.row.orderState === 'AUTHING'" type="text" size="small" @click="cancleOrder(scope.row)">取消签约</el-button>
                <el-button class="ml0" v-if="isRe.indexOf(scope.row.orderState) > -1" type="text" size="small" @click="reCall(scope.row)">
                    重发通知
                </el-button>
                <a v-if="scope.row.downloadUrl" target="_blank" :href="`/api/econtract/contract/download?orderId=${scope.row.orderId}`">
                    <el-button class="ml0" type="text" size="small">合同下载</el-button>
                </a>
            </template>
            <template v-else>
              <a target="_blank" :href="`${baseUrl}/api/econtract/contract/download?orderId=${scope.row.orderId}`">
                <el-button class="ml0" type="text" size="small">下载{{scope.row.orderState == 'CLOSED' ? '已签' : '待签'}}合同</el-button>
              </a>
              <el-button type="text" @click="show = true; currId = scope.row.orderId">{{scope.row.orderState == 'CLOSED' ? '重新' : ''}}上传合同</el-button>
            </template>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <ayg-pagination
      :total="data.total"
      v-on:handleSizeChange="setSize"
      :currentSize="form.pageSize"
      v-on:handleCurrentChange="query"
      :currentPage="form.pageNo">
    </ayg-pagination>
    <el-dialog title="上传" :visible.sync="show">
      <el-upload
        class="form_input center"
        :drag="true"
        :action="`${baseUrl}/api/econtract/template/parsefile`"
        :auto-upload="false"
        :on-change="upload"
        :on-remove="remove"
        :multiple="false"
        accept=".pdf"
        :show-file-list="false">
        <template>
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            <div class="el-upload__tip" slot="tip">请上传pdf格式文件。</div>
        </template>
      </el-upload>
    </el-dialog>
  </div>
</template>
<script>
import { post, get, importPost } from '../../store/api';
import { baseUrl } from "../../config/address.js"
import { econtract } from 'src/api'
export default {
  data() {
    var time = new Date()
    var t = `${time.getFullYear()}-${time.getMonth() + 1 > 9 ? time.getMonth() + 1 : '0' + (time.getMonth() + 1)}-${time.getDate()}`
    return {
      form: {
        startTime: '',
        endTime: '',
        extrSystemIds: '',
        templateName: '',
        templateGroupName: '',
        partyaUserId: '',
        personalName: '',
        personalIdentity: '',
        personalMobile: '',
        orderId: '',
        signState: '',
        pageSize: 10,
        pageNo: 1,
        manufacturer: ''
      },
      range: [t, t],
      extrSystemOptions: [],
      sighStateList: [],
      data: {},
      show: false,
      fileList: [],
      currId: '',
      baseUrl: '',
      modeList: [
        {
          text: '线上签约',
          value: '0'
        },
        {
          text: '线下签约',
          value: '1'
        }
      ],
      isRe: ['SIGNING', 'CREATE_ERR', 'AUTH_ERR', 'NOTIFY_ERR', 'SIGN_ERR', 'CLOSE_ERR', 'EXPIRED', 'REJECTED', 'AUTHING'],
      objects: []
    }
  },
  mounted() {
    get('/api/econtract/inner/clientqry', {}).then(result => {
			this.extrSystemOptions = result
    })
    get('/api/econtract/inner/nonsafety/signstatelist', {}).then(result => {
			this.sighStateList = result
    })
    Object.assign(this.form, this.$route.query)
    this.getTime()
    this.query()
  },
  methods: {
    remoteObject(a) {
        if(a !== '') {
            post('/api/econtract/user/company/qrylist', {
                name: a,
                pageNo: 1,
                pageSize: 10
            }).then(data => {
                this.objects = data.data
            })
        }
    },
    getTime() {
      this.form.startTime = this.range && this.range.length ? this.range[0] : ''
      this.form.endTime = this.range && this.range.length ? this.range[1] : ''
    },
    query(a) {
      if(isNaN(a)) {
        a = 1
      }
      this.form.pageNo = a
      post('/api/econtract/inner/user-sign-qry', this.form).then(data => {
        this.data = data
      })
    },
    setSize(a) {
      this.form.pageSize = a
      this.query()
    },
    reset() {
      this.$refs.form.resetFields()
      this.range = []
      this.getTime()
    },
    toStr(a) {
        var url = '', isFirst = true
        for(var k in a) {
            if(isFirst) {
                isFirst = false
                url += `?${k}=${a[k]}`
            }
            else {
                url += `&${k}=${a[k]}`
            }
        }
        return url
    },
    derive(a) {
        let url
        switch (a) {
            case 0:
                url = 'usercertExport'
                break;
            case 1:
                url = 'usercertDownloadBatches'
                break;
            case 2:
                url = 'contractDownloadBatches'
                break;
            default:
                break;
        }
        if(a == 0) {
            window.open(`${econtract[url]}${this.toStr(this.form)}`)
        }
        else {
            get(`${econtract[url]}${this.toStr(this.form)}`).then(data => {
                this.$confirm('生成中，请进入“下载列表”中进行下载', '提示', {
                    confirmButtonText: '进入下载列表',
                    cancelButtonText: '关闭',
                    type: 'success'
                }).then(() => {
                    this.$router.push('downList')
                }).catch(() => {})
            })
        }
    },
    download() {
      window.open(`/api/econtract/inner/export${this.toStr(this.form)}`)
    },
    upload(a) {
      this.fileList.shift()
      var formData = new FormData()
      formData.append('orderId', this.currId)
      // formData.append('fileName', a.name)
      formData.append('file', a.raw)
      importPost('/api/econtract/order/upload', formData).then(data => {
        this.fileList.push({
          name: a.name,
          url: a.templateId
        })
        this.show = false
        this.query()
        this.$message({
          type: 'success',
          message: '上传成功！'
        })
      })
    },
    remove() {
      this.fileList.length = 0
    },
    cancleOrder(a) {
      post(`/api/econtract/order/cancelsign?orderId=${a.orderId}`).then(data => {
        this.$message({
          type: 'success',
          message: '已取消签约！'
        })
        this.query()
      })
    },
    reCall(a) {
      this.$confirm(`最近通知时间 ${a.lastNotifyTimeDesc} 确认重新发送通知吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        post(`/api/econtract/order/reSubmit?orderId=${a.orderId}&repeatFlag=RENOTIFYING`).then(data => {
          this.$message({
            type: 'success',
            message: '已重发通知！'
          })
          if(a.orderState == 'EXPIRED') {
              this.pageIndex = 1
          }
          this.query()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消！'
        })
      })
    }
  }
}
</script>
<style scoped>
.main {
    margin: 15px;
    padding: 15px;
    background-color: #fff;
}
.mb20 {
    margin-bottom: 20px;
}
.form_input_short {
    width: 200px;
}
.center {
  margin: 0 calc(50% - 200px);
}
</style>
