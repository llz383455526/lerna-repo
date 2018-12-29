<template>

  <div class="main-container">
    <div style="margin: 0 0 20px;">税优地信息管理</div>

    <el-form :inline="true" :model="formSearch" ref="formSearch">
      <el-form-item label="税优地名称:" size="small" prop="location">
        <el-input v-model="formSearch.name"></el-input>
      </el-form-item>

      <el-form-item label="跟进人:" size="small" prop="location">
        <el-input v-model="formSearch.chargePerson"></el-input>
      </el-form-item>

      <el-form-item label="新增时间:" size="small" prop="location">
        <el-date-picker
          v-model="formSearch.date"
          type="daterange"
          range-separator="至"
          value-format="yyyy-MM-dd"
          format="yyyy-MM-dd"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
      </el-form-item>

      <el-form-item style="margin-top: -4px">
        <el-button type="primary" @click="search" size="small">查询</el-button>
        <el-button size="small" @click="resetForm">清除</el-button>
      </el-form-item>
    </el-form>

    <el-button size="small" @click="$router.push('step1?state=0')">新建税优地</el-button>

    <div class="table-container">
      <el-table
        :data="tableList.list">
        <el-table-column prop="name" label="税优地名称" width="150"></el-table-column>
        <el-table-column label="三万免征">
          <template slot-scope="scope">{{scope.row.isExempted ? (scope.row.isExempted === 'true' ? '是' : '否') : ''}}</template>
        </el-table-column>
        <el-table-column prop="createdByName" label="提交人">
        </el-table-column>
        <el-table-column prop="chargePerson" label="负责人">
        </el-table-column>
        <el-table-column prop="updatedAt" label="变更时间">
        </el-table-column>
        <el-table-column prop="createdAt" label="新增时间">
        </el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <span>{{scope.row.lockStatus ? '已锁定' : '未锁定'}}</span>
            |
            <span>{{scope.row.enableStatus ? '已生效' : '未生效'}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="240">
          <template slot-scope="scope">
            <el-tag @click.native="editBtnClick(scope.row, '2')" style="cursor: pointer"
                    v-if="scope.row.lockStatus" type="success">详情
            </el-tag>
            <el-tag @click.native="editBtnClick(scope.row, '1')" style="cursor: pointer" v-else type="info">编辑
            </el-tag>
            <template v-if="scope.row.complete">
              <el-tag v-if="scope.row.lockStatus && checkUnlock" @click.native="lockClick(scope.row)" style="cursor: pointer"
                      type="warning">解锁
              </el-tag>
              <el-tag v-else-if="!scope.row.lockStatus && checkLock" @click.native="lockClick(scope.row)" style="cursor: pointer"
                      type="warning">锁定
              </el-tag>
            </template>
            <el-tag @click.native="removeClick(scope.row)" style="cursor: pointer" v-if="!scope.row.lockStatus"
                    type="danger">删除
            </el-tag>
            <router-link :to="`attachmentList?id=${scope.row.id}`">
              <el-tag style="cursor: pointer" type="success">脱敏附件</el-tag>
            </router-link>
          </template>
        </el-table-column>

      </el-table>
    </div>
    <ayg-pagination v-if="tableList.total" :total="tableList.total"
                    v-on:handleSizeChange="handleSizeChange" :currentSize="pageSize"
                    v-on:handleCurrentChange="handleCurrentChange" :currentPage="pageIndex"></ayg-pagination>

  </div>

</template>

<script>
  import {get, post} from '../../store/api'
  import { mapGetters } from 'vuex'

  export default {
    created() {
      this.getList()
    },
    data() {
      return {
        formSearch: {
          name: null,
          chargePerson: null,
          date: null,
          startTime: null,
          endTime: null
        },
        tableList: {},
        pageSize: 10,
        pageIndex: 1,
      }
    },
    watch: {
      'formSearch.date'() {
        if (this.formSearch.date) {
          this.formSearch.startTime = this.formSearch.date[0]
          this.formSearch.endTime = this.formSearch.date[1]
        } else {
          this.formSearch.startTime = null
          this.formSearch.endTime = null
        }
      }
    },
    computed: {
      // 权限校验
      checkLock() {
        return this.checkRight(this.permissions, 'salemgt:/taxLanding/tax/lock')
      },
      checkUnlock() {
        return this.checkRight(this.permissions, 'salemgt:/taxLanding/tax/unlock')
      },
      ...mapGetters({
        permissions: 'permissions'
      }),
    },
    methods: {
      resetForm() {
        this.formSearch = {
          name: null,
          chargePerson: null,
          date: null,
          startTime: null,
          endTime: null
        }
      },
      search() {
        this.pageIndex = 1
        this.getList()
      },
      handleSizeChange(value) {
        this.pageSize = value
        this.pageIndex = 1
        this.getList()
      },
      handleCurrentChange(value) {
        this.pageIndex = value
        this.getList()
      },
      getList() {
        let options = {
          pageNo: this.pageIndex,
          pageSize: this.pageSize
        }
        if (this.formSearch.name) {
          options.name = this.formSearch.name
        }
        if (this.formSearch.chargePerson) {
          options.chargePerson = this.formSearch.chargePerson
        }
        if (this.formSearch.startTime) {
          options.startTime = this.formSearch.startTime
        }
        if (this.formSearch.endTime) {
          options.endTime = this.formSearch.endTime
        }
        post('/api/salemgt/taxLanding/tax/page', options).then((result) => {
          this.tableList = result
        }).catch(() => {
        })
      },
      // 锁定
      lockClick(item) {
        const url = item.lockStatus ? '/api/salemgt/taxLanding/tax/unlock' : '/api/salemgt/taxLanding/tax/lock'
        get(url, {
          taxLandingId: item.id
        }).then(result => {
          this.$message({
            message: '操作成功',
            type: 'success'
          });
          this.getList()
        }).catch(() => {
          this.$message.error('操作失败');
        })
      },
      // 删除接口
      removeClick(item) {
        this.$confirm('此操作将永久删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          get('/api/salemgt/taxLanding/tax/delete', {
            taxLandingId: item.id
          }).then(result => {
            this.$message({
              message: '删除成功',
              type: 'success'
            });
            this.getList()
          }).catch(() => {
          })
        }).catch(() => {
        });
      },
      // 编辑按钮点击
      editBtnClick(e, state) {
        this.$router.push(`/main/taxDiscount/step1?id=${e.id}&state=${state}`)
      }
    }
  }
</script>

<style lang="scss" scoped>

  .main-container {
    margin-top: 15px;
    background-color: #fff;
    padding: 15px;
    margin-bottom: 20px;
  }

</style>




















