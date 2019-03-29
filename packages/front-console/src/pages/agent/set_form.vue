<template lang="html">
  <div>
    <div class="bg-white p15 mb15">
      <div class="edit-box">
        <h3 class="edit-title mb30">基本信息</h3>
        <div class="info">企业名称：</div>
        <div class="info">开户名称：</div>
        <div class="info">税号：</div>
        <div class="info">开户银行：</div>
        <div class="info">单位地址：</div>
        <div class="info">银行账号：</div>
        <div class="info">电话：</div>
      </div>
    </div>
    <div class="bg-white p15 mb15">
      <div class="edit-box">
        <h3 class="edit-title mb30">系统展示信息 <a class="edit-btn" href="#" @click="dialogVisible=true">修改</a> </h3>
        <div class="info">系统名称：乐蜂财税企业服务平台</div>
        <div class="info">系统展示logo：乐蜂财税企业服务平台</div>
        <div class="info">客户登陆页面：乐蜂财税企业服务平台</div>
      </div>
    </div>
    <div class="bg-white p15 mb15">
      <div class="edit-box">
        <h3 class="edit-title">专属域名 <a class="edit-btn" href="#" @click="ipVisible=true">修改</a> </h3>
        <el-table :data="tableData" style="width: 100%">
          <el-table-column prop="date" label="类型" width="180"></el-table-column>
          <el-table-column prop="name" label="专属域名" width="180"></el-table-column>
          <el-table-column prop="address" label="备案号"></el-table-column>
          <el-table-column prop="address" label="状态"></el-table-column>
        </el-table>
      </div>
    </div>
    <div class="bg-white p15 mb15">
      <div class="edit-box">
        <h3 class="edit-title">短信签名 <a class="edit-btn" href="#" @click="smsVisible=true">修改</a></h3>
        <div>短信签名名称：乐蜂财税</div>
      </div>
    </div>

    <el-dialog title="修改系统展示信息" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
      <el-form ref="form" :model="form" label-position="top">
        <el-form-item label="企业简称：（限10个汉字）">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <div class="dbox">
            <div class="ditem">
                <div>下载模板文件：</div>
                <div>
                    <a class="abtn" :href="uploadDowload || '/api/sysmgr-web/client-user/download-client-user-import-template'" :download="uploadTitle+'.xlsx'" target="_blank">下载模板</a>
                    <div>请先下载{{uploadTitle || 'C端客户导入模版'}}</div>
                </div>
            </div>
            <div class="ditem">
                <div>上传文件导入：</div>
                <div>
                    <el-upload
                        class="form_input"
                        action=""
                        :auto-upload="false"
                        :on-change="upload"
                        :multiple="false"
                        :show-file-list="false"
                        accept=".xlsx, .xls">
                        <div class="up_icon">
                            <div>点击这里上传</div>
                            <div>请上传小于5M的xls或xlsx格式文件</div>
                        </div>
                    </el-upload>
                     <div class="pro_box">
              <div :style="{ 'width': `${pro}%` }"></div>
            </div>
                  <span>{{pro}}%</span>
                </div>
            </div>
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="绑定专属域名" :visible.sync="ipVisible" width="30%" :before-close="handleClose">
      <el-form ref="form" :model="form" label-position="top">
        <el-form-item label="1. 请复制记录值，在第三方域名提供商中，添加A记录类型：">
          <el-table :data="tableData" style="width: 100%">
            <el-table-column prop="address" label="记录类型"></el-table-column>
            <el-table-column prop="address" label="记录值（选1个绑定即可）">
              <template slot-scope="scope">
                {{scope.row.address}}
                <el-button size="small" type="text" @click="getVModal(scope.row.id)">复制</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item label="2. 请输入已添加A记录值的域名进行绑定：">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="3. 请填写域名备案号：">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="ipVisible = false">取 消</el-button>
        <el-button type="primary" @click="ipVisible = false">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="修改短信签名" :visible.sync="smsVisible" width="30%" :before-close="handleClose">
      <el-form ref="form" :model="form" label-position="top">
        <el-form-item label="短信签名（最多6个汉字）">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="smsVisible = false">取 消</el-button>
        <el-button type="primary" @click="smsVisible = false">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
export default {
  data() {
    return {
      tableData: [{
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-04',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1517 弄'
      }, {
        date: '2016-05-01',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1519 弄'
      }, {
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1516 弄'
      }],
      dialogVisible: false,
      ipVisible: false,
      smsVisible: false,
      form: {
        name: '',
      },
      show: true,
      uploadTitle: '发放流水导入模版',
      uploadDowload: '/api/console-dlv/pay-order-filter/download-pay-order-filter-import-template',
      targetType: 'dlv-pay-order-item-filter-import',
    }
  },
  methods: {
    query(a) {
        if (isNaN(a)) {
             a = 1
        }
        this.searchForm.page = a
        const url = '/api/console-dlv/pay-order-filter/list'
        const param = this.searchForm
        post(url, param).then(res => {
            this.list = res.list
            this.listData = res
        })
    },
  },
}
</script>

<style lang="css" scoped>
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
.info {
  width: 49%;
  display: inline-block;
  margin-bottom: 20px;
}
.dbox {
    font-size: 14px;
    color: #666666;
}
.ditem {
    overflow: hidden;
    margin-bottom: 35px;
}
.ditem > div {
    float: left;
}
.abtn {
    display: inline-block;
    width: 80px;
    height: 22px;
    font-size: 12px;
    color: #666666;
    text-decoration: none;
    background-image: url(../../image/download.png);
    background-size: 10px 10px;
    background-repeat: no-repeat;
    background-position: 7px center;
    border: 1px solid #D9D9D9;
    border-radius: 4px;
    text-indent: 22px;
    line-height: 20px;
}
.abtn + div {
    font-size: 12px;
    color: #999;
    margin-top: 5px;
}
.up_icon {
    width: 228px;
    height: 124px;
    background-image: url(../../image/upload.png);
    background-size: 41px 33px;
    background-position: center 20px;
    background-repeat: no-repeat;
    padding-top: 70px;
    border: 1px solid #D9D9D9;
}
.up_icon > div:nth-child(1) {
    text-align: center;
    font-size: 12px;
    color: #666666;
}
.up_icon > div:nth-child(2) {
    font-size: 12px;
    color: #999;
    margin-top: 5px;
}
.pro_box {
	position: relative;
	display: inline-block;
	width: 193px;
	height: 10px;
	border: 1px solid #E9E9E9;
	border-radius: 5px;
	margin-top: 6px;
}
.pro_box > div {
	position: absolute;
	top: 1px;
	left: 0;
	height: 8px;
	border-radius: 4px;
	background-color: #108EE9;
}
.pro_box + span {
	margin-top: 6px;
	font-size: 12px;
	color: #999999;
}
</style>
