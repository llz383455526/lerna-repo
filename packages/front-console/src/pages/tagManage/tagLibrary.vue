<template>
<div class="tag_container">
  <div style="margin-bottom:30px;" class="tag_tt">标签库管理</div>
  <el-form :inline="true" :model="searchForm" ref="searchForm" v-if="tagMangerList.length">
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
        <el-button type="primary" @click="search" size="small">查询</el-button>
        <el-button size="small" @click="resetForm('searchForm')">清空</el-button>
      </el-form-item>
    </el-form>
    <p>标签库管理搜索字段：{{searchForm}}</p>

  <el-button type="primary" size="medium" @click="addGroup">添加标签组</el-button>

  <div class="tab_container custom-tree-container" v-if="tagMangerList.length">
    <div class="tree_tab_hd">
      <div class="tab_tt_txt">标签名称</div>
      <div class="tab_tt_middle">标签描述</div>
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
          <span class="tree_node_opea">
            <el-button v-show="data.group" @click="addChildTag(node,data)" type="text" size="medium" style="padding:0;">添加子标签<i class="opera_gap"></i></el-button>
            <el-button v-show="data.group" @click="editTagLibrayManager(data)" type="text" size="medium" style="padding:0;">标签管理<i class="opera_gap"></i></el-button>
            <el-button @click="ModifyTagName(node, data)" type="text" size="medium" style="padding:0;">编辑</el-button>
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
    <p>标签编辑的editForm表单信息： {{editForm}}</p>
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
        <el-form-item style="margin-top: -4px">
          <el-button type="primary" @click="searchLibray" size="small">查询</el-button>
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
            <span class="tree_node_h"><i :class="data.icon"></i>{{ data.label }} {{data.children ? `(${data.children.length})`: ''}}</span>
            <span class="tree_node_h">
              <el-radio v-model="data.radio" label="1" @change="showNode(data)">显示</el-radio>
              <el-radio v-model="data.radio" label="2">隐藏</el-radio>
            </span>
          </span>
        </el-tree>
    </div>
    管理当前的标签<p>{{soloTagMangerList}}</p>
    <span class="form_footer" slot="footer">
      <el-button @click="sure" type="primary">保存</el-button>
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

    const treeData = [{
    id: 1,
    label: '一级 1',
    radio: '1',
    icon:'tag_files',
    desc:'你想要的，就是我想给的',
    children: [{
      id: 400001,
      label: '二级 1-1',
      radio: '2',
      icon:'tag_file',
      desc:'你想要的，就是我想给的',
    },{
      id: 400002,
      label: '二级 1-2',
      radio: '2',
      icon:'tag_file',
      desc:'你想要的，就是我想给的',
    },{
      id: 400003,
      label: '二级 1-3',
      radio: '1',
      icon:'tag_file',
      desc:'你想要的，就是我想给的',
    }]
  }, {
    id: 2,
    label: '一级 2',
    radio: '1',
    icon:'tag_files',
    desc:'你想要的，就是我想给的',
    children: [{
      id: 5,
      label: '二级 2-1',
      radio: '2',
      icon:'tag_file',
      desc:'你想要的，就是我想给的',
    }, {
      id: 6,
      label: '二级 2-2',
      radio: '2',
      icon:'tag_file',
      desc:'你想要的，就是我想给的',
    }]
  }, {
    id: 3,
    label: '一级 3',
    radio: '2',
    icon:'tag_files',
    desc:'你想要的，就是我想给的',
    children: [{
      id: 7,
      label: '二级 3-1',
      radio: '1',
      icon:'tag_file',
      desc:'你想要的，就是我想给的',
    }, {
      id: 8,
      label: '二级 3-2',
      radio: '1',
      icon:'tag_file',
      desc:'你想要的，就是我想给的',
    }]
  }]


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
      rules: {
        tagName: [
          { required: true, message: '请填写标签组名', trigger: 'blur' },
          { min: 0, max: 10, message: '长度在 0 到 10 个字', trigger: 'blur' },
          // { required: true, validator: validateTagName, trigger: 'blur' }
        ],
        tagName: [
          { required: true, message: '请填写标签名称', trigger: 'blur' },
          { min: 0, max: 10, message: '长度在 0 到 10 个字', trigger: 'blur' },
          // { required: true, validator: validateTagName, trigger: 'blur' }
        ],
      },
      currentPage: 1,
      pageSize: 10,
    }
  },
  created() {
    // this.getOptionServiceCompanies()
    // this.tagMangerList.push(...treeData)
    // 初始化页面，请求数据
    this.search()
    // this.tagMangerList.push()
  },
  watch: {
    filterText(val) {
      this.$refs.tree2.filter(val);
    }
  },
  mounted() {
    // this.search()
  },
  methods: {
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
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
      console.log(node)
    },
    searchLibray() {},
    async search() {
      this.searchForm.page = this.currentPage
      this.searchForm.pageSize = this.pageSize
      console.log(`搜索前，表单输入的数据： ${JSON.stringify(this.searchForm)}`)
      try {
        const result = await post(tags.tagsQuery, this.searchForm)
        console.log(`返回结果${JSON.stringify(result)}`)
        this.tagMangerList = result.list
        this.tagsLibrarys = result
        } catch (error) {
          console.log(`返回结果${JSON.stringify(error)}`)
        }
      // .then(data => {
      //   this.page = data
      //   // this.tagMangerList.push(...treeData)
      // })
    },
    // 清空表单
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    handleSizeChange(value) {
      this.currentPage = 1
      this.pageSize = value
      this.search()
    },
    handleCurrentChange(value) {
      this.currentPage = value
      this.search()
    },
    // 添加标签组
    addGroup() {
      this.editFormShow = true
      this.editFormTitle = '添加标签组'
      this.notEditGroupName = false
      this.showTagName = false
    },
    // 添加子标签
    addChildTag(e,data) {
      console.log(e)
      console.log(`当前点击的tree数据data ${JSON.stringify(data)}`)
      this.editFormShow = true;
      this.editFormTitle = '添加子标签';
      this.showTagName = true
      this.notEditGroupName = true
      this.editForm.editTagGroupName = data.tagName
      this.editForm.group = false
      this.editForm.parentId = data.tagId
    },
    // 修改
    ModifyTagName(e, d){
      this.type = 'updated'
      console.log(e)
      console.log(`当前点击的tree数据data ${JSON.stringify(d)}`)
      this.editFormShow = true
      this.editFormTitle = '编辑'
      if(d.children) { // 修改标签组的命名
        this.showTagName = false
        this.notEditGroupName = false
        this.editForm.tagName = d.tagName
        this.editForm.description = d.description
        this.editForm.tagId = d.tagId
      } else { // 修改子标签的命名
        this.notEditGroupName = true
        this.showTagName = true
        this.editForm.editTagGroupName = e.parent.tagName
        this.editForm.tagName = d.tagName
        this.editForm.description = d.description
        this.editForm.parentId = data.tagId
        this.editForm.group = false
      }
    },
    // 标签管理
    editTagLibrayManager(data){
      console.log(`当前点击的tree数据data ${JSON.stringify(data)}`)
      this.tagLibrayManager = true
      this.soloTagMangerList.push(...[data])
      // this.soloTagMangerList.push(...data.childNodes)
      console.log(`获取的tree数据data ${JSON.stringify(this.soloTagMangerList)}`)
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
          console.log(`返回结果${JSON.stringify(result)}`)
          this.editFormShow = false;
          this.search()
          this.editForm.tagName = ''
          this.editForm.description = ''
        } catch (error) {
          console.log(`返回结果${JSON.stringify(error)}`)
        }
      }
      })
    },
    sure(){
      this.$refs['editForm'].validate(valid => {
      if(valid) {
        let selt = this
        let url = ''
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
  align-items: left;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
  .tree_node_h {
    display: inline-block;
    vertical-align: middle;
    flex: 1;
  }
  .tree_node_middle {
    width: 500px;
    white-space: normal;
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

