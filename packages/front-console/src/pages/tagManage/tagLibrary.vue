<template>
<div class="tag_container">
  <div style="margin-bottom:30px;" class="tag_tt">标签库管理</div>
  <el-form :inline="true" :model="searchForm" ref="searchForm" v-if="tagMangerList.length && showTab">
      <el-form-item label="标签组" size="small" prop="searchTagGroup">
        <el-input v-model="searchForm.tagName" placeholder="请输入关键词"></el-input>
      </el-form-item>
      <!-- <el-form-item label="标签名称" size="small" prop="searchTagName">
        <el-input v-model="searchForm.searchTagName" placeholder="请输入关键词"></el-input>
        <el-autocomplete
          class="inline-input"
          v-model="searchForm.searchTagName"
          :fetch-suggestions="querySearch"
          placeholder="请输入关键词"
          @blur="calcuCompanyId"
          @select="handleSelect"
        />
      </el-form-item> -->
      <el-form-item style="margin-top: -4px">
        <el-button type="primary" @click="search()" size="small">查询</el-button>
        <el-button size="small" @click="resetForm('searchForm')">清空</el-button>
      </el-form-item>
    </el-form>
    <!-- <p>标签库管理搜索字段searchForm：{{searchForm}}</p> -->

  <el-button type="primary" size="medium" @click="addGroup">添加标签组</el-button>

  <div class="tab_container custom-tree-container" v-if="tagMangerList.length && showTab">
    <div class="tree_tab_hd">
      <div class="tab_tt_txt">标签名称</div>
      <div class="tab_tt_middle">标签描述</div>
      <div class="tab_tt_status">状态</div>
      <div class="tab_tt_opea ">操作</div>
    </div>
    <el-tree
      :data="tagMangerList" 
      node-key="id" 
      :default-expanded-keys="[0, 1]" 
      :expand-on-click-node="false">
        <span class="custom-tree-node" slot-scope="{ node, data }">
          <span class="tree_node_h"><i :class="data.group ? 'tag_files': 'tag_file'" ></i>{{ data.tagName }} {{data.children.length ? `(${data.children.length})`: ''}}</span>
          <span class="tree_node_middle">{{data.description}}</span>
          <span class="tree_node_status">{{data.display ? '显示': '隐藏'}}</span>
          <span class="tree_node_opea">
            <el-button v-show="data.group" @click="addChildTag(data)" type="text" size="medium" style="padding:0;">添加子标签<i class="opera_gap"></i></el-button>
            <el-button v-show="data.group" @click="editTagLibrayManager(data)" type="text" size="medium" style="padding:0;">标签管理<i class="opera_gap"></i></el-button>
            <el-button @click="ModifyTagName(data)" type="text" size="medium" style="padding:0;">编辑</el-button>
          </span>
        </span>
      </el-tree>
    <ayg-pagination
      v-if="tagsLibrarys.total" 
      :total="tagsLibrarys.total"
      @handleSizeChange="handleSizeChange"
      @handleCurrentChange="handleCurrentChange" 
      :currentPage="currentPage" />
  </div>
  <!-- 无数据状态 -->
  <div class="tag_no_data" v-if="!tagMangerList.length">
    <p>暂无标签</p>
  </div>
  <!-- 编辑，标签添加 添加子标签 -->
  <el-dialog :title="editFormTitle"  :visible.sync="editFormShow" :before-close="clearForm" width="558px" top="339px">
    <el-form label-width="100px" :rules="rules" :model="editForm" ref="editForm">
      <div class="not_edit_group_wrap" v-if="notEditGroupName">
        <p class="not_edit_label">标签组名：</p>
        <p class="not_edit_group_name">{{editForm.editTagGroupName}}</p>
      </div>
      <el-form-item label="标签组名：" prop="tagName" v-else>
        <el-input v-model="editForm.tagName" class="dia_f_input" placeholder="建议不要超过10个字"></el-input>
      </el-form-item>
      <el-form-item label="标签名称：" prop="tagName" v-if="showTagName">
        <el-input v-model="editForm.tagName" class="dia_f_input" placeholder="建议不要超过10个字"></el-input>
      </el-form-item>
      <el-form-item label="标签描述：" prop="description">
        <el-input type="textarea" :rows="5" placeholder="建议不要超过50个字" v-model="editForm.description"></el-input>
      </el-form-item>
    </el-form>
    <!-- <p>标签编辑的editForm表单信息： {{editForm}}</p>
    <p>提交地址： {{type === 'add' ? 'tags.tagCreate': 'tags.tagUpdate'}}</p>
    <p>tagDetail {{tagDetail}}</p> -->
    <span class="form_footer" slot="footer">
      <el-button @click="sureCreatedTag" type="primary">保存</el-button>
      <el-button @click="editFormShow = false">关闭</el-button>
    </span>
  </el-dialog>
  
  <!-- 标签管理 -->
  <el-dialog title="标签管理"  :visible.sync="tagLibrayManager" width="558px" top="339px">
    <div class="custom-tree-container">
      <el-form :inline="true" :model="searchTagLibray" ref="searchTagLibray">
        <el-form-item label="标签名" size="small" prop="searchLibrayTag">
          <el-input v-model="filterText" placeholder="输入关键字进行过滤" class="dia_f_input"></el-input>
        </el-form-item>
      </el-form>
      <el-tree
        class="filter-tree"
        ref="tree2"
        :data="soloTagMangerList"
        :filter-node-method="filterNode"
        node-key="id" 
        :default-expanded-keys="[1]" 
        :expand-on-click-node="false">
          <span class="custom-tree-node" slot-scope="{ node, data }">
            <span class="tree_node_h"><i :class="data.group ? 'tag_files': 'tag_file'"></i>{{ data.tagName }} {{data.children.length ? `(${data.children.length})`: ''}}</span>
            <span class="tree_node_h200">
              <el-radio-group v-model="data.display" size="small">
              <el-radio :label="true">显示</el-radio>
              <el-radio :label="false">隐藏</el-radio>
            </el-radio-group>
              <!-- <el-radio v-model="data.display" :label="data.display" @change="showNode(data)">显示</el-radio>
              <el-radio v-model="data.display" :label="!data.display">隐藏</el-radio> -->
            </span>
          </span>
        </el-tree>
    </div>
    <!-- 修理后的标签displayTag:<p>{{displayTag}}</p> -->
    <span class="form_footer" slot="footer">
      <el-button @click="isShowTags" type="primary">保存</el-button>
      <el-button @click="tagLibrayManager = false">关闭</el-button>
    </span>
  </el-dialog>
</div>
</template>

<script>
  import { get, post } from "../../store/api"
  import { tags } from "../../api/tags"
  import {showNotify} from '../../plugin/utils-notify'
  import _ from 'lodash'

  export default {
    data() {
    // 校验标签名
    const validateTagName = (rule, value, callback) => {
      if(!value) {
        return callback(new Error('请填写标签组名'))
      }
      // 异步校验
      post(tags.postDetail, value).then(data => {
        if(data.status !== 200) {
          return callback(new Error('名称已存在，请重命名'))
        } else {
          return callback()
        }
        })
    }
    return {
      soloTagMangerList: [],
      tagMangerList:  [],//JSON.parse(JSON.stringify(treeData)),
      searchForm: {
        orderBy: '',
        tagName: '',
        page: 1,
        pageSize: 10
      },
      showTab:true,
      tagsLibrarys: '',
      restaurants: [], // 获取到的标签名称数组
      serviceCompaniesList: [],
      searchTagLibray: {
        searchLibrayTag: ''
      },
      editFormTitle:'',
      editFormShow: false, // 标签编辑弹框展示
      tagLibrayManager: false, // 标签管理弹框展示
      showTagName: false, // 显示标签名称
      notEditGroupName: false, // 不容许编辑标签组名
      editForm: {
        editTagGroupName: '',
        tagId:0,
        tagName: '',
        description: '',
        group: true, // true-标签组，false-标签
        parentId: 0,
      },
      type: 'add', // add 添加 updated 更新
      filterText: '',
      tagDetail: '',
      tagDisplayList: [], // 标签管理，是否显示
      displayTag: {
        displayList: []
      },
      rules: {
        tagName: [
          { required: true, message: '请填写标签组名', trigger: 'blur' },
          { min: 0, max: 10, message: '长度在 0 到 10 个字', trigger: 'blur' },
          // { required: true, validator: validateTagName, trigger: 'blur' }
        ],
        description: [
          { min: 1, max: 50, message: '建议不要超过50个字', trigger: 'blur' },
          // { required: true, validator: validateTagName, trigger: 'blur' }
        ],
      },
      currentPage: 1,
      pageSize: 10,
    }
  },
  created() {
    this.search()
  },
  watch: {
    filterText(val) {
      this.$refs.tree2.filter(val);
    },
    soloTagMangerList(val){
      this.tagDisplayList = this.soloTagMangerList
    },
  },
  mounted() {
    // this.search()
  },
  methods: {
    filterNode(value, data) {
      if (!value) return true;
      return data.tagName.indexOf(value) !== -1;
    },
    // 获取所有标签名
    getOptionServiceCompanies() {
      let self = this;
      get (tags.tagsList).then (data => {
        self.serviceCompaniesList = data
        // console.log(`拿到的标签数据 ${JSON.stringify(data)}`)
        _.foreach (data, function (value, key) {
          self.restaurants[key] = {
            "value": value['companyName']
          }
        })
        // console.log(`当前处理后的格式 ${JSON.stringify(self.restaurants)}`)
      })
    },
    handleSelect(item) {
      // console.log(`当前选取的item ${JSON.stringify(item)}`)
      this.calcuCompanyId (item);
    },
    calcuCompanyId(item) {
      let self = this
      _.foreach (this.serviceCompaniesList, function (value) {
        if (value['companyName'] !== self.searchForm.searchTagName) {
          self.searchForm.tagId = value['companyId']
          return false
        } else {
          self.searchForm.tagId = ''
        }
      })
    },
    querySearch(queryString, cb) {
      var restaurants = this.restaurants;
      var results = queryString ? restaurants.filter (this.createFilter (queryString)) : restaurants;
      // 调用 callback 返回建议列表的数据
      cb (results);
    },
    createFilter(queryString) {
      return (restaurant) => {
        return (restaurant.value.toLowerCase ().indexOf (queryString.toLowerCase ()) === 0);
      };
    },
    showNode(node) {
      console.log(`点击的显示隐藏： ${JSON.stringify(node)}`)
    },
    async search(page) {
      this.searchForm.page = page || 1
      this.searchForm.pageSize = this.pageSize
      // console.log(`搜索前，表单输入的数据： ${JSON.stringify(this.searchForm)}`)
      try {
        const result = await post(tags.tagsQuery, this.searchForm)
        // console.log(`返回结果${JSON.stringify(result)}`)
        this.tagMangerList = result.list
        this.showTab = true
        this.tagsLibrarys = result
        } catch (error) {
          console.log(`返回结果${JSON.stringify(error)}`)
        }
    },
    // 清空表单
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.searchForm.tagName = ''
      this.searchForm.page = 1
      this.currentPage = 1
      this.searchForm.pageSize = 10
    },
    handleSizeChange(value) {
      this.currentPage = 1
      this.pageSize = value
      this.search()
    },
    handleCurrentChange(value) {
      this.currentPage = value
      this.search(value)
    },
    // 添加标签组
    addGroup() {
      this.editFormShow = true
      this.editFormTitle = '添加标签组'
      this.notEditGroupName = false
      this.showTagName = false
    },
    // 添加子标签
    addChildTag(data) {
      // console.log(`当前点击的tree数据data ${JSON.stringify(data)}`)
      this.editFormShow = true;
      this.editFormTitle = '添加子标签';
      this.showTagName = true
      this.notEditGroupName = true
      this.editForm.tagName = ''
      this.editForm.description = ''
      this.editForm.editTagGroupName = data.tagName
      this.editForm.group = false
      this.editForm.tagId = 0
      this.editForm.parentId = data.tagId
    },
    // 修改
    async ModifyTagName(d){
      const result = await get(tags.tagDetail, {tagId: d.tagId})
      this.type = 'updated'
      this.editFormShow = true
      this.editFormTitle = '编辑'
      if(d.group) { // 修改标签组的命名
        this.showTagName = false
        this.notEditGroupName = false
        this.editForm.tagName = result.tagName
        this.editForm.description = result.description
        this.editForm.tagId = result.tagId
        this.editForm.parentId = 0
        this.editForm.group = true
      } else { // 修改子标签的命名
        this.notEditGroupName = true
        this.showTagName = true
        this.editForm.editTagGroupName = result.parentName
        this.editForm.tagName = result.tagName
        this.editForm.description = result.description
        this.editForm.tagId = result.tagId
        this.editForm.group = false
      }
    },
    
    // 获取标签的详情
    async getTagDetail(id){
      const result = await get(tags.tagDetail, {tagId: id})
      // console.log(`拿到特定id标签的详情： ${JSON.stringify(result)}`)
      this.tagDetail = result
    },
    // 标签管理
    async editTagLibrayManager(data){
      this.displayTag.displayList = []
      this.filterText = ''
      // console.log(`当前点击的tree数据data ${JSON.stringify(data)}`)
      const result = await get(tags.tagsTree, {tagId: data.tagId})
      // console.log(`拿到特定id标签树 ${JSON.stringify(result)}`)
      this.soloTagMangerList = [result]
      this.tagLibrayManager = true
    },
    // 获取标签树
    async getTagsTree(tagId){
      const result = await get(tags.tagsTree, {tagId})
      // console.log(`拿到特定id标签树 ${JSON.stringify(result)}`)
      this.soloTagMangerList = result.children
    },
    clearForm(next) {
      this.$refs['editForm'].clearValidate()
      next()
    },
    sureCreatedTag(){
      let url = this.type === 'add' ? tags.tagCreate: tags.tagUpdate
      this.$refs['editForm'].validate(async valid => {
      if(valid) {
        try {
          const result = await post(url, this.editForm)
          // console.log(`返回结果${JSON.stringify(result)}`)
          this.editFormShow = false;
          this.search()
          this.editForm.tagName = ''
          this.editForm.description = ''
        } catch (error) {
          console.log(`返回error结果${JSON.stringify(error)}`)
        }
      }
      })
    },
    fun(arr) {
      for(let i = 0; i< arr.length; i++) {
        if(arr[i].children.length > 1) {
          this.displayTag.displayList.push(arr[i])
          this.fun(arr[i].children)
        } else {
          this.displayTag.displayList.push(arr[i])
        }
      }
    },
    async isShowTags(){
      this.fun(this.tagDisplayList)
      // console.log(`修改：${JSON.stringify(this.displayTag)}`)
      const result = await post(tags.tagsDisplay, this.displayTag)
      // console.log(`显示隐藏标签成功：${JSON.stringify(result)}`)
      this.search()
      this.tagLibrayManager = false
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
  .tag_tt {
    font-size: 18px;
    font-weight: 600;
  }
  .opera_gap {
    display: inline-block;
    vertical-align: middle;
    height: 14px;
    width: 1px;
    margin-left: 11px;
    background: #E8E8E8;
  }
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
  .tree_node_h {
    display: inline-block;
    vertical-align: middle;
    flex: 1;
  }
  .tree_node_h200 {
    width: 200px;
  }
  .tree_node_middle {
    padding-right: 20px;
    width: 500px;
    white-space: normal;
  }
  .tree_node_status {
    cursor: default;
    color: #0283FB;
    width: 50px;
  }
  .tree_node_opea {
    width: 220px;
    text-align: right;
  }
}
.custom-tree-container {
  /deep/ .el-tree-node__content {
    padding: 25px 0;
    border-bottom: 1px solid #F2F2F2;
  }
    /deep/ .el-tree {
    // padding-left: 15px;
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
.tree_tab_hd {
  height: 54px;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  color: rgba(0,0,0,0.85);
  font-weight: 600;
  padding-right: 8px;
  background: #FAFAFA;
  .tab_tt_txt {
    flex: 1;
    padding-left: 10px;
  }
  .tab_tt_middle {
    width: 500px;
  }
  .tab_tt_status {
    width: 50px;
  }
  .tab_tt_opea {
    width: 220px;
    text-align: center;
  }
}
.tag_no_data {
  min-height: 560px;
  text-align: center;
  background: url('../../image/no_data.png') no-repeat center;
  background-size: 88px 57px;
  p {
    padding-top: 320px;
    font-size: 14px;
    color: #333333;
  }
}
</style>

