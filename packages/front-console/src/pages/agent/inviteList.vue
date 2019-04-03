<template>
  <div class="bg-white p15">
    <div class="mb30">邀请客户注册</div>
    <el-form :inline="true" :model="searchForm" :rules="searchForm" ref="searchForm">
      <el-form-item label="代理商名称" size="small" prop="agentName">
        <el-input v-model="searchForm.agentName"></el-input>
      </el-form-item>
      <el-form-item label="企业名称" size="small" prop="companyName">
        <el-input v-model="searchForm.companyName"></el-input>
      </el-form-item>
      <el-form-item label="邀请状态" size="small" prop="state">
        <el-select size="small" filterable v-model="searchForm.state">
          <el-option label="全部" value=""></el-option>
          <el-option v-for="(item,key) in invitationStateList" :value="item.value" :label="item.text" :key="key"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item style="margin-top: -4px">
        <el-button size="small" type="primary" @click="search">查询</el-button>
        <el-button size="small" @click="resetForm('searchForm')">清除</el-button>
        <el-button size="small" type="primary" @click="inviteForm.inviteId='',inviteVisible=true">邀请客户注册</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="tableData.list">
      <el-table-column prop="inviteNo" label="邀请编号"></el-table-column>
      <el-table-column prop="agentName" label="代理商"></el-table-column>
      <el-table-column prop="companyName" label="企业名称"></el-table-column>
      <el-table-column prop="companyPhone" label="手机号"></el-table-column>
      <el-table-column prop="inviteByName" label="邀请人"></el-table-column>
      <el-table-column prop="inviteAt" label="邀请时间"></el-table-column>
      <el-table-column prop="stateName" label="邀请状态"></el-table-column>
      <el-table-column label="操作" width="200">
        <template slot-scope="scope">
          <input type="text" :value="scope.row.shortUrl" readonly :id="scope.row.shortUrl" class="copy-input">
          <div class="" v-if="scope.row.stateName !== '已失效' && scope.row.stateName !== '已提交'">
            <el-button size="small" type="text" @click="copyHandle(scope.row.shortUrl)">复制链接</el-button>
            <el-button size="small" type="text" @click="resend(scope.row.id)">重发</el-button>
            <el-button size="small" type="text" @click="invalidateHandle(scope.row.id)">失效</el-button>
          </div>
          <el-button size="small" type="text" @click="deleteHandle(scope.row.id)" v-if="scope.row.stateName === '已失效'">删除</el-button>
          <span v-if="scope.row.stateName === '已提交'">已创建合同草稿</span>
        </template>
      </el-table-column>
    </el-table>
    <ayg-pagination v-if="tableData.total" :total="tableData.total"
                    v-on:handleSizeChange="handleSizeChange"
                    v-on:handleCurrentChange="handleCurrentChange" :currentPage="currentPage"></ayg-pagination>
    <vmodal :prevList="prevList" :showVModal="showVModal" @clickSelf="showVModal = false"></vmodal>

    <el-dialog title="邀请客户注册" :visible.sync="inviteVisible" width="40%">
      <div style="margin-bottom: 30px;">系统将会发送一条邀请链接到客户手机，客户填写相关企业信息，您再补全其他信息后即可生成客户合同</div>
      <el-form ref="inviteForm" :model="inviteForm" :rules="inviteRules" label-position="top">
        <el-form-item label="企业名称" prop="companyName">
          <el-input v-model="inviteForm.companyName"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="companyPhone">
          <el-input v-model="inviteForm.companyPhone" :maxLength="11"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="inviteVisible = false">取 消</el-button>
        <el-button type="primary" @click="inviteSubmit">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="绑定专属域名" :visible.sync="inviteIdVisible" width="40%">
      <el-form ref="inviteForm" :model="inviteForm" :rules="inviteRules" label-position="top">
        <el-form-item label="企业名称：" prop="companyName">
          <el-input v-model="inviteForm.companyName"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="companyPhone">
          <el-input v-model="inviteForm.companyPhone" :maxLength="11"></el-input>
        </el-form-item>
        <el-form-item label="发送记录">
          <el-table :data="historyList" style="width: 100%">
            <el-table-column prop="createAt" label="邀请时间"></el-table-column>
            <el-table-column prop="companyPhone" label="手机号"></el-table-column>
          </el-table>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="inviteIdVisible = false">取 消</el-button>
        <el-button type="primary" @click="inviteSubmit">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import _ from 'lodash';
import { get, post, formPost } from "../../store/api";
import { showNotify } from '../../plugin/utils-notify';
import vmodal from '../../pageComponent/v-modal.vue';
import { mapGetters } from 'vuex';

export default {
  components: { vmodal },
  computed: {
    ...mapGetters({
      invitationStateList: 'invitationStateList',
    }),
  },
  data() {
    return {
      pageSize: 10,
      tableData: [],
      searchForm: {
          agentId: '',
          agentName: '',
          companyName: '',
          companyPhone: '',
          orderBy: '',
          state: '',
      },
      inviteForm: {
        companyName: '',
        companyPhone: '',
        inviteId: '',
      },
      inviteRules: {
        companyName: [
          { required: true, message: '请输入企业名称', trigger: 'blur' },
        ],
        companyPhone: [
          { required: true, message: '请填写正确的电话号码', trigger: 'blur', pattern: /^1\d{10}$/ },
        ],
      },
      prevList: [],
      showVModal: false,
      inviteVisible: false,
      inviteIdVisible: false,
      historyList: [],
    }
  },
  methods: {
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    search() {
      this.currentPage = 1;
      this.requestAction({
        page: 1,
        pageSize: this.pageSize,
      });
    },
    edit(agentId) {
      this.$router.push({
        path: '/main/agent/oemSet',
        query: {
          agentId: agentId,
        },
      })
    },
    handleSizeChange(value) {
      this.pageSize = value;
      this.currentPage = 1;
      this.requestAction({
          page: this.currentPage,
          pageSize: value,
      });
    },
    handleCurrentChange(value) {
      this.currentPage = value;
      if (this.currentChangeBySetting) {
          this.currentChangeBySetting = false;
          return;
      }
      this.requestAction({
          page: value,
          pageSize: this.pageSize,
      });
    },
    requestAction(pageInfo) {
      let url = '/api/contract-web/agent-invite/query-invitation-list';
      let param = _.assign({}, pageInfo, this.searchForm);
      post(url, param).then(data => {
          this.tableData = data;
      })
    },
    inviteSubmit() {
      this.$refs['inviteForm'].validate(valid => {
        if (valid) {
          let url = '/api/contract-web/agent-invite/send-invitation';
          let param = this.inviteForm;
          post(url, param).then(data => {
            showNotify('success', '邀请成功!');
            this.requestAction({
                page: 1,
                pageSize: this.pageSize,
            });
            this.inviteVisible = false;
            this.inviteIdVisible = false;
          })
        }
      })
    },
    resend(id) {
      this.inviteForm.inviteId = id;
      this.inviteIdVisible = true;
      let url = '/api/contract-web/agent-invite/invite-history-info';
      let param = { inviteId: id };
      get(url, param).then(res => {
        this.historyList = res.historyList;
      })
    },
    invalidateHandle(id) {
      this.$confirm('客户收到的邀请链接将失效', '确定要失效该注册失效吗？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let url = '/api/contract-web/agent-invite/invalidate-invitation';
        let param = {
          inviteId: id,
        };
        post(url, param).then(data => {
          this.$message({
            type: 'success',
            message: '失效成功!'
          });
          this.requestAction({
              page: 1,
              pageSize: this.pageSize,
          });
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消失效'
        });
      });
    },
    deleteHandle(id) {
      this.$confirm('客户收到的邀请链接将删除', '确定要失效该注册删除吗？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let url = '/api/contract-web/agent-invite/delete-invitation';
        let param = {
          inviteId: id,
        };
        post(url, param).then(data => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          this.requestAction({
              page: 1,
              pageSize: this.pageSize,
          });
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    copyHandle(id) {
      //获取input对象
      var obj = document.getElementById(id);
      console.log(obj)
      //选择当前对象
      obj.select();
      try {
        //进行复制到剪切板
        if (document.execCommand("Copy","false",null)) {
          //如果复制成功
          this.$message({
            message: '复制成功！',
            duration: 2000,
          })
        } else {
          //如果复制失败
          this.$message({
            message: '复制失败！',
            duration: 2000,
          })
        }
      } catch (err) {
        //如果报错
        this.$message({
          message: '复制错误！',
          duration: 2000,
        })
      }
    },
  },
  created() {
    this.requestAction({
      page: 1,
      pageSize: this.pageSize,
    });
    this.$store.dispatch('getInvitationStateList')
  }
}
</script>

<style scoped>
.copy-input {
  border: none;
  background: none;
  font-size: 14px;
  color: #606266;
  outline: none;
  position: absolute;
  top: -9999px;
  right: -9999px;
}
</style>
