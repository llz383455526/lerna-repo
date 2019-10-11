<template>
<div class="tag_container">
  <div style="margin-bottom:30px;" class="tag_tt">标签库管理</div>
  <el-form :inline="true" :model="searchForm" ref="searchForm" v-if="page.list">
      <el-form-item label="标签组" size="small" prop="searchTagGroup">
        <el-input v-model="searchForm.searchTagGroup" placeholder="请输入关键词"></el-input>
      </el-form-item>
      <el-form-item label="标签名称" size="small" prop="searchTagName">
        <el-input v-model="searchForm.searchTagName" placeholder="请输入关键词"></el-input>
      </el-form-item>
      <el-form-item style="margin-top: -4px">
        <el-button type="primary" @click="search" size="small">查询</el-button>
        <el-button size="small" @click="resetForm('searchForm')">清空</el-button>
      </el-form-item>
    </el-form>

  <el-button type="primary" size="medium" @click="addGroup">添加标签组</el-button>

  <div class="tab_container">
    <el-table :data="page.list" :header-cell-style="{background:'#FAFAFA',color:'rgba(0,0,0,0.85)',fontWeight: 600}">
      <el-table-column prop="serviceName" label="标签名称"></el-table-column>
      <el-table-column prop="serviceContent" label="标签描述"></el-table-column>
      <el-table-column align="center" label="操作" width="400">
        <template slot-scope="scope">
          <el-button @click="addChildTag(scope.row)" type="text" size="medium" style="padding:0;">添加子标签</el-button>
          <span class="opera_gap"></span>
          <el-button @click="editTagLibrayManager(scope.row)" type="text" size="medium" style="padding:0;">标签管理</el-button>
          <span class="opera_gap"></span>
          <el-button @click="edit(scope.row)" type="text" size="medium" style="padding:0;">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>

    <ayg-pagination
      v-if="page.total" 
      :total="page.total"
      @handleSizeChange="handleSizeChange"
      @handleCurrentChange="handleCurrentChange" 
      :currentPage="currentPage" />

  </div>
  <!-- 编辑，标签添加 添加子标签 -->
  <el-dialog :title="editFormTitle"  :visible.sync="editFormShow" :before-close="clearForm" width="558px" top="339px">
    <el-form label-width="100px" :rules="rules" :model="editForm" ref="editForm">
      <div class="not_edit_group_wrap" v-if="notEditGroupName">
        <p class="not_edit_label">标签组名：</p>
        <p class="not_edit_group_name">{{editForm.editTagGroupName}}</p>
      </div>
      <el-form-item label="标签组名：" prop="editTagGroupName" v-else>
        <el-input v-model="editForm.editTagGroupName" class="dia_f_input" placeholder="建议不要超过10个字"></el-input>
      </el-form-item>
      <el-form-item label="标签名称：" prop="editTagName" v-if="showTagName">
        <el-input v-model="editForm.editTagName" class="dia_f_input" placeholder="建议不要超过10个字"></el-input>
      </el-form-item>
      <el-form-item label="标签描述：" prop="serviceContent">
        <el-input type="textarea" :rows="5" placeholder="建议不要超过50个字" v-model="editForm.serviceContent"></el-input>
      </el-form-item>
    </el-form>
    <span class="form_footer" slot="footer">
      <el-button @click="sure" type="primary">保存</el-button>
      <el-button @click="editFormShow = false">关闭</el-button>
    </span>
  </el-dialog>
  
  <!-- 标签管理 -->
  <el-dialog title="标签管理"  :visible.sync="tagLibrayManager" width="558px" top="339px">
    <div class="custom-tree-container">
      <el-form :inline="true" :model="searchTagLibray" ref="searchTagLibray">
        <el-form-item label="标签名" size="small" prop="searchLibrayTag">
          <el-input v-model="searchTagLibray.searchLibrayTag" placeholder="输入关键字进行过滤" class="dia_f_input"></el-input>
        </el-form-item>
        <el-form-item style="margin-top: -4px">
          <el-button type="primary" @click="searchLibray" size="small">查询</el-button>
        </el-form-item>
      </el-form>
      <el-tree
        :data="tagMangerList" 
        node-key="id" 
        :default-expanded-keys="[1]" 
        :expand-on-click-node="false">
          <span class="custom-tree-node" slot-scope="{ node, data }">
            <span class="tree_node_h"><i :class="data.icon"></i>{{ data.label }} {{data.children ? `(${data.children.length})`: ''}}</span>
            <span class="tree_node_h">
              <el-radio v-model="data.radio" label="1" @change="showNode(data)">显示</el-radio>
              <el-radio v-model="data.radio" label="2">隐藏</el-radio>
            </span>
          </span>
        </el-tree>
    </div>
    <span class="form_footer" slot="footer">
      <el-button @click="sure" type="primary">保存</el-button>
      <el-button @click="tagLibrayManager = false">关闭</el-button>
    </span>
  </el-dialog>
</div>
</template>

<script>
  import { get, post } from "../../store/api";
  import {showNotify} from '../../plugin/utils-notify'
  import { valid } from 'semver';
  let id = 1000;
    const treeData = [{
    id: 1,
    label: '一级 1',
    radio: '1',
    icon:'tag_files',
    children: [{
      id: 4,
      label: '二级 1-1',
      radio: '2',
      icon:'tag_file',
    }]
  }, {
    id: 2,
    label: '一级 2',
    radio: '1',
    icon:'tag_files',
    children: [{
      id: 5,
      label: '二级 2-1',
      radio: '2',
      icon:'tag_file',
    }, {
      id: 6,
      label: '二级 2-2',
      radio: '2',
      icon:'tag_file',
    }]
  }, {
    id: 3,
    label: '一级 3',
    radio: '2',
    icon:'tag_files',
    children: [{
      id: 7,
      label: '二级 3-1',
      radio: '1',
      icon:'tag_file',
    }, {
      id: 8,
      label: '二级 3-2',
      radio: '1',
      icon:'tag_file',
    }]
  }]


  export default {
    data() {
      var checkNo = (rule, value, callback) => {
        if(!/^[0-9]+$/.test(value)) {
          return callback(new Error('必须为整数'))
        }
        if(value.length > 3) {
          return callback(new Error('最多三位'));
        }
        return callback()
      }
    return {
      tagMangerList:  [],//JSON.parse(JSON.stringify(treeData)),
      searchForm: {
        searchTagGroup: '',
        searchTagName: '',
        page: 1,
        pageSize: 10
      },
      searchTagLibray: {
        searchLibrayTag: ''
      },
      page: [],
      editFormTitle:'',
      editFormShow: false, // 标签编辑弹框展示
      tagLibrayManager: false, // 标签管理弹框展示
      showTagName: false, // 显示标签名称
      notEditGroupName: false, // 不容许编辑标签组名
      editForm: {
        serviceId: '',
        editTagGroupName: '',
        editTagName: '',
        serviceContent: '',
      },
      rules: {
        editTagGroupName: [
          { required: true, message: '请填写标签组名', trigger: 'blur' },
          { min: 0, max: 10, message: '长度在 0 到 10 个字', trigger: 'blur' }
        ],
        editTagName: [
          { required: true, message: '请填写标签名称', trigger: 'blur' },
          { min: 0, max: 10, message: '长度在 0 到 10 个字', trigger: 'blur' }
        ],
      },
      currentPage: 1,
      pageSize: 10,
    }
  },
  created() {
    this.tagMangerList.push(...treeData)
  },
  mounted() {
    let url = '/api/invoice-web/custom-invoice-subject/qry';
    let param = {
      name: '',
      orderBy: '',
      page: 0,
      pageSize: 0,
      status: 1
    };
    let self = this;
    post(url, param).then(data => {
      self.subjects = data.list;
      })
      this.search()
  },
  methods: {
    showNode(node) {
      console.log(node)
    },
    searchLibray() {},
    search() {
      this.searchForm.page = this.currentPage;
      this.searchForm.pageSize = this.pageSize;
      let url = '/api/contract-web/service-mgr/query-service-types';
      post(url, this.searchForm).then(data => {
        this.page = data;
        })
    },
    handleSizeChange(value) {
      this.currentPage = 1;
      this.pageSize = value;
      this.search();
    },
    handleCurrentChange(value) {
      this.currentPage = value;
      this.search();
    },
    // 添加标签组
    addGroup() {
      this.editFormShow = true;
      this.editFormTitle = '添加标签组';
      this.editForm.editTagGroupName = '';
      this.editTagName = '';
      this.editForm.serviceContent = '';
    },
    // 添加子标签
    addChildTag(model) {
      this.editFormShow = true;
      this.editFormTitle = '添加子标签';
      this.showTagName = true
      this.notEditGroupName = true
      this.editForm.editTagGroupName = model.serviceName;
      this.editTagName = '';
      this.editForm.serviceContent = '';
    },
    // 编辑
    edit(model){
      this.editFormShow = true;
      this.editFormTitle = '编辑';
      this.editForm.editTagGroupName = model.serviceName;
      this.editForm.editTagName = model.id;
      this.editForm.serviceContent = model.serviceContent;
    },
    // 标签管理
    editTagLibrayManager(model){
      this.tagLibrayManager = true;
      this.editForm.editTagGroupName = model.serviceName;
      this.editForm.editTagName = model.id;
      this.editForm.serviceContent = model.serviceContent;
    },
    clearForm(next) {
      this.$refs['editForm'].clearValidate()
      next()
    },
    sure(){
      this.$refs['editForm'].validate(valid => {
        if(valid) {
          let selt = this;
          let url = '';
          if(this.editForm.serviceId){
          url = "/api/contract-web/service-mgr/update-service-type";
          }else{
          url = "/api/contract-web/service-mgr/create-service-type";
          }
          post(url, this.editForm).then(
            function(data){
              showNotify('success','操作成功！');
              selt.editFormShow = false;
              selt.search();
            }
          );
      }
      })
    },
    clear() {
      this.searchForm.searchTagGroup = ''
      this.searchForm.searchTagName = ''
      },
    }
  }
</script>
<style lang="scss" scoped>
.tag_container {
  padding:40px 15px 15px;
  background-color: #fff;
  .opera_gap {
    display: inline-block;
    vertical-align: middle;
    height: 15px;
    width: 1px;
    margin: 0 8px;
    background: #E8E8E8;
  }
}
.tag_tt {
  font-size: 18px;
  font-weight: 600;
}
.tab_container {
  width: 100%;
  margin-top: 20px;
}
.dia_f_input {
  width: 260px;
} 
.not_edit_group_wrap {
  margin-bottom: 20px;
  p {
    display: inline-block;
    vertical-align: middle;
  }
  .not_edit_label {
    width: 100px;
    padding-left: 10px;
  }
  .not_edit_group_name {
    color: #333;
  }
}
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
.custom-tree-container {
  /deep/ .el-tree-node__content {
    padding: 25px 0;
    border-bottom: 1px solid #F2F2F2;
  }
  .tag_files {
    display: inline-block;
    vertical-align: middle;
    margin-right: 6px;
    width: 22px;
    height: 20px;
    background: url('../../image/tag_files.png') no-repeat center;
    background-size: 22px 20px;
  }
  .tag_file {
    display: inline-block;
    vertical-align: middle;
    margin-right: 6px;
    width: 14px;
    height: 14px;
    background: url('../../image/tag_file.png') no-repeat center;
    background-size: 14px 14px;
  }
}
</style>

