<template lang="html">
  <div>
    <div class="bg-white p15 mb15">
      <div class="edit-box">
        <h3 class="edit-title mb30">基本信息</h3>
        <div class="edit-content">企业名称：{{ detail.agentName || '无' }}</div>
        <div class="edit-content">开户名称：{{ detail.bankAccountName || '无' }}</div>
        <div class="edit-content">税号：{{ detail.taxIdcd || '无' }}</div>
        <div class="edit-content">开户银行：{{ detail.depositBank || '无' }}</div>
        <div class="edit-content">单位地址：{{ detail.areaName || '无' }}</div>
        <div class="edit-content">银行账号：{{ detail.bankAccount || '无' }}</div>
        <div class="edit-content">电话：{{ detail.phone || '无' }}</div>
      </div>
    </div>
    <div class="bg-white p15 mb15">
      <div class="edit-box">
        <h3 class="edit-title mb30">系统展示信息 <a class="edit-btn" href="#" @click="dialogVisible=true">修改</a> </h3>
        <div class="edit-content" style="width:100%;">系统名称：{{ detail.platformName || '无' }}</div>
        <div class="edit-content">
          <span>系统展示logo： <br> 建议尺寸60×60 </span>
          <span v-if="! detail.logoCode">'无'</span>
          <img :src="logo_url||`/api/sysmgr-web/file/oem-agent-scan?targetType=oem_logo&targetExt=${detail.domain}&targetId=${agentId}&zoomImage=true`" alt="" v-if="detail.logoCode" style="width: 200px;">
        </div>
        <div class="edit-content">
          <span>客户登陆页面： <br> 建议尺寸1920×1080 </span>
          <span v-if="!detail.homeCode">无</span>
          <img :src="home_url||`/api/sysmgr-web/file/oem-agent-scan?targetType=oem_home&targetExt=${detail.domain}&targetId=${agentId}&zoomImage=true`" alt="" v-if="detail.homeCode" style="width: 200px;">
        </div>
      </div>
    </div>
    <div class="bg-white p15 mb15">
      <div class="edit-box">
        <h3 class="edit-title">专属域名 <a class="edit-btn" href="#" @click="ipVisible=true">修改</a> </h3>
        <div class="edit-content">类型：客户登陆</div>
        <div class="edit-content">专属域名：{{ detail.domain || '无' }}</div>
        <div class="edit-content">备案号：{{ detail.icp || '无' }}</div>
      </div>
    </div>
    <div class="bg-white p15 mb15">
      <div class="edit-box">
        <h3 class="edit-title">短信签名 <a class="edit-btn" href="#" @click="smsVisible=true">修改</a></h3>
        <div>短信签名名称：{{ detail.smsSign || '无' }}</div>
      </div>
    </div>

    <el-dialog title="修改系统展示信息" :visible.sync="dialogVisible" width="40%" :before-close="handleClose">
      <el-form ref="platForm" :model="platForm" :rules="platRules" label-position="top">
        <el-form-item label="系统名称：（限10个汉字）" prop="platformName">
          <el-input v-model="platForm.platformName"></el-input>
        </el-form-item>
        <el-form-item label="系统展示logo：(建议尺寸60×60)" prop="logoCode">
          <upload :targetId="agentId" targetType="oem_logo" :targetExt="detail.domain" @success="successLogo" v-if="!detail.logoCode"></upload>
          <img :src="logo_url||`/api/sysmgr-web/file/oem-agent-scan?targetType=oem_logo&targetExt=${detail.domain}&targetId=${agentId}&zoomImage=true`" alt="" v-if="detail.logoCode" style="max-width: 100%;">
          <el-button type="text" size="small" v-if="detail.logoCode" @click="detail.logoCode=''">删除</el-button>
        </el-form-item>
        <el-form-item label="客户登陆页面：(建议尺寸1920×1080)" prop="homeCode">
          <upload :targetId="agentId" targetType="oem_home" :targetExt="detail.domain" @success="successHome" v-if="!detail.homeCode"></upload>
          <img :src="home_url||`/api/sysmgr-web/file/oem-agent-scan?targetType=oem_home&targetExt=${detail.domain}&targetId=${agentId}&zoomImage=true`" alt="" v-if="detail.homeCode" style="max-width: 100%;">
          <el-button type="text" size="small" v-if="detail.homeCode" @click="detail.homeCode=''">删除</el-button>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="platSubmit">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="绑定专属域名" :visible.sync="ipVisible" width="40%" :before-close="handleClose">
      <el-form ref="domainForm" :model="domainForm" :rules="domainRules" label-position="top">
        <el-form-item label="1. 请复制记录值，在第三方域名提供商中，添加A记录类型：">
          <el-table :data="tableData" style="width: 100%">
            <el-table-column prop="recordType" label="记录类型" width="150"></el-table-column>
            <el-table-column prop="recordValue" label="记录值（选1个绑定即可）">
              <template slot-scope="scope">
                <input class="copy-input" readonly type="text" :value="scope.row.recordValue" :id="scope.row.id">
                <el-button size="small" type="text" @click="Copy(scope.row.id)">复制</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item label="2. 请输入已添加A记录值的域名进行绑定：" prop="domain">
          <el-input v-model="domainForm.domain"></el-input>
        </el-form-item>
        <el-form-item label="3. 请填写域名备案号：" prop="icp">
          <el-input v-model="domainForm.icp"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="ipVisible = false">取 消</el-button>
        <el-button type="primary" @click="domainSubmit">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="修改短信签名" :visible.sync="smsVisible" width="30%" :before-close="handleClose">
      <el-form ref="smsForm" :model="smsForm" :rules="smsRules" label-position="top">
        <el-form-item label="短信签名（最多6个汉字）" prop="smsSign">
          <el-input v-model="smsForm.smsSign"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="smsVisible = false">取 消</el-button>
        <el-button type="primary" @click="smsSubmit">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import { get, post, formPost } from "../../store/api";
import upload from './component/upload.vue'
import { showNotify } from "../../plugin/utils-notify";
import _ from 'lodash';

export default {
  components: { upload },
  data() {
    return {
      tableData: [],
      dialogVisible: false,
      ipVisible: false,
      smsVisible: false,
      agentId: '',
      detail: '',
      platForm: {
        agentId: '',
        homeCode: '',
        logoCode: '',
        platformName: '',
      },
      platRules: {
        platformName: [
          { required: true, message: '请输入系统名称', trigger: 'blur' },
        ],
        homeCode: [
          { required: true, message: '请上传代理商平台主页背景', trigger: 'blur' },
        ],
        logoCode: [
          { required: true, message: '请上传代理商平台LOGO', trigger: 'blur' },
        ],
      },
      domainForm: {
        agentId: '',
        domain: '',
        icp: '',
      },
      domainRules: {
        domain: [
          { required: true, message: '请输入已添加A记录值的域名进行绑定', trigger: 'blur' },
        ],
        icp: [
          { required: true, message: '请填写域名备案号', trigger: 'blur' },
        ],
      },
      smsForm: {
        agentId: '',
        smsSign: '',
      },
      smsRules: {
        smsSign: [
          { required: true, message: '请输入短信签名', trigger: 'blur' },
        ],
      },
      logo_url: '',
      home_url: '',
    }
  },
  methods: {
    query() {
        const url = '/api/sysmgr-web/agent-oem/agent-detail'
        const param = {
          agentId: this.agentId
        }
        get(url, param).then(res => {
            this.detail = res
        })
    },
    successLogo(ev, file) {
      this.platForm.logoCode = ev.downloadCode
      this.detail.logoCode = ev.downloadCode
      this.logo_url = URL.createObjectURL(file.raw)
      this.$refs.platForm.validateField('logoCode')
    },
    successHome(ev, file) {
      this.platForm.homeCode = ev.downloadCode
      this.detail.homeCode = ev.downloadCode
      this.home_url = URL.createObjectURL(file.raw)
      this.$refs.platForm.validateField('homeCode')
    },
    platSubmit() {
      this.$refs['platForm'].validate(valid => {
        if (valid) {
          let url = '/api/sysmgr-web/agent-oem/update-platform';
          let param = _.assign({}, this.platForm, {
            agentId: this.agentId,
          });
          post(url, param).then(data => {
            showNotify('success', '操作成功!');
            this.query();
            this.dialogVisible = false;
          })
        }
      })
    },
    domainSubmit() {
      this.$refs['domainForm'].validate(valid => {
        if (valid) {
          let url = '/api/sysmgr-web/agent-oem/update-domain-info';
          let param = _.assign({}, this.domainForm, {
            agentId: this.agentId,
          });
          post(url, param).then(data => {
            showNotify('success', '操作成功!');
            this.query();
            this.ipVisible = false;
          })
        }
      })
    },
    smsSubmit() {
      this.$refs['smsForm'].validate(valid => {
        if (valid) {
          let url = '/api/sysmgr-web/agent-oem/update-sms-sign';
          let param = _.assign({}, this.smsForm, {
            agentId: this.agentId,
          });
          post(url, param).then(data => {
            showNotify('success', '操作成功!');
            this.query();
            this.smsVisible = false;
          })
        }
      })
    },
    Copy(id) {
      //获取input对象
      var obj = document.getElementById(id);
      console.log(obj)
      //选择当前对象
      obj.select();
      try {
        //进行复制到剪切板
        if (document.execCommand("Copy","false",null)) {
          //如果复制成功
          alert("复制成功！");
        } else {
          //如果复制失败
          alert("复制失败！");
        }
      } catch (err) {
        //如果报错
        alert("复制错误！")
      }
    },
    getTable() {
      let url = '/api/sysmgr-web/commom/ayg-domain-config';
      get(url).then(data => {
        this.tableData = data
      })
    }
  },
  mounted () {
    this.agentId = this.$route.query.agentId
    this.query()
    this.getTable()
  },
}
</script>

<style lang="scss" scoped>
.edit-box {
  margin-bottom: 30px;
}
.edit-title {
  border-left: 3px solid #3794ff;
  padding-left: 10px;
}
.edit-btn {
  color: #409EFF;
  font-size: 16px;
  margin-left: 10px;
  text-decoration: none;
}
.edit-content {
  width: 49%;
  display: inline-block;
  margin-bottom: 20px;
  vertical-align: top;
  span {
    vertical-align: top;
    display: inline-block;
    margin-right: 20px;
  }
}
.copy-input {
  border: none;
  background: none;
  font-size: 14px;
  color: #606266;
  outline: none;
  width: 210px;
}
</style>
