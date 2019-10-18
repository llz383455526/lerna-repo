<template>
  <div class="tag_container" v-loading="isReady">
    <div class="tag_hd_tab">
      <div style="margin-bottom:30px;" class="tag_tt">公司标签管理</div>
      <el-tabs v-model="activeTab" @tab-click="handleTabClick">
        <el-tab-pane label="客户公司" name="first"></el-tab-pane>
        <el-tab-pane label="渠道/代理商" name="second"></el-tab-pane>
        <el-tab-pane label="服务商公司" name="third"></el-tab-pane>
      </el-tabs>
      <el-form :inline="true" :model="formSearch" ref="formSearch">
        <el-form-item label="创建时间" size="small">
          <el-date-picker
            v-model="dateValue"
            type="daterange"
            :unlink-panels="true"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="getTime"
            value-format="yyyy-MM-dd">
          </el-date-picker>
        </el-form-item>

        <el-form-item label="客户公司" size="small" prop="companyName" v-if="activeTab === 'first'">
          <el-input v-model.trim="formSearch.companyName" placeholder="请输入" @keyup.enter.native="search(url)"></el-input>
        </el-form-item>
        <el-form-item label="渠道/代理商" size="small" prop="companyName" v-if="activeTab === 'second'">
          <el-input v-model.trim="formSearch.companyName" placeholder="请输入" @keyup.enter.native="search(url)"></el-input>
        </el-form-item>
        <el-form-item label="服务商公司" size="small" prop="companyName" v-if="activeTab === 'third'">
          <el-input v-model.trim="formSearch.companyName" placeholder="请输入" @keyup.enter.native="search(url)"></el-input>
        </el-form-item>



        <el-form-item label="标签名称:" size="small">
          <el-select v-model="formSearch.tagIds" multiple collapse-tags filterable>
            <el-option v-for="item in tagGroupsList" :label="item.tagName" :value="item.tagId" :key="item.tagId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item style="display:block;">
          <el-button type="primary" @click="search(url)" size="small" :class="{disable: isHandle}">查询</el-button>
          <el-button size="small" @click="resetForm('formSearch')">清空</el-button>
        </el-form-item>
      </el-form>
      <!-- <p>formSearch:{{formSearch}}</p>
      <p>url:{{url}}</p> -->
    </div>
    <div class="tab_container">
      <div class="handle_batch" v-if="multipleSelection.length">
        <div class="batch_left">
          <span class="choose">已选择<i class="num">{{multipleSelection.length}}</i>条</span>
          <span class="btnch_s" @click="handleBatchTags('add')">批量添加标签</span>
          <span class="btnch_s" @click="handleBatchTags('remove')">批量移除标签</span>
        </div>
        <div class="ico_close" @click="toggleSelection()"><i class="el-icon-close"></i></div>
      </div>
      <el-table
        ref="multipleTable"
        :data="tableList"
        @selection-change="handleSelectionChange"
        :header-cell-style="{background:'#FAFAFA',height: 54, color:'rgba(0,0,0,0.85)',fontWeight: 600}">
          <el-table-column type="selection" width="55" />
          <el-table-column prop="companyName" label="客户公司" />
          <el-table-column prop="createAt" label="创建时间" />
          <el-table-column prop="tagList" label="标签名称" >
            <template slot-scope="scope">
              <span class="tag_list_cell" v-for="(item, index) in scope.row.tagList" :key="index">{{ item.tagName }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="100">
            <template slot-scope="scope">
              <el-button
                @click="editRow(scope.row)"
                type="text"
                size="medium"
                style="padding:0;">编辑</el-button>
            </template>
          </el-table-column>
      </el-table>
      <!-- 分页 -->
      <ayg-pagination
        v-if="total"
        :total="total"
        @handleSizeChange="handleSizeChange"
        :currentSize="pageSize"
        @handleCurrentChange="handleCurrentChange"
        :currentPage="formSearch.page" />
    </div>
    
  <!-- 标签管理 -->
  <el-dialog :title="dialogTitle"  :visible.sync="tagLibrayManager" width="840px" top="189px">
    <div class="dialog_manage">
      <div class="left">
        <p>{{leftTitle}}</p>
        <div class="custom-tree-container">
          <!-- <el-input v-model="filterText" placeholder="请输入关键词" class="dia_f_input"></el-input> -->
          <!-- <el-form :inline="true" :model="searchTagLibray" ref="searchTagLibray">
            <el-form-item label="标签名" size="small" prop="searchLibrayTag">
              <el-input v-model="filterText" placeholder="输入关键字进行过滤" class="dia_f_input" @keyup.enter.native="searchLibray"></el-input>
            </el-form-item>
            <el-form-item style="margin-top: -4px">
              <el-button type="primary" @click="searchLibray" size="small">查询</el-button>
            </el-form-item>
          </el-form> -->
          <el-form :inline="true" :model="searchTagLibray" ref="searchTagLibray">
            <el-form-item label="标签名" size="small" prop="searchLibrayTag">
              <el-input v-model="filterText" placeholder="输入关键字进行过滤" class="dia_f_input"></el-input>
            </el-form-item>
          </el-form>
          <div class="fix_tree_search">
            <el-tree
              class="filter-tree"
              :filter-node-method="filterNode"
              :data="soloTagMangerList" 
              node-key="tagId" 
              :default-expanded-keys="expandedkeys" 
              @node-click="handleNodeClick"
              ref="tree2"
              :expand-on-click-node="true">
                <span class="custom-tree-node" slot-scope="{ node, data }">
                  <span class="tree_node_h"><i :class="data.group ? 'tag_files': 'tag_file'"></i>{{ data.tagName }} {{data.children.length ? `(${data.children.length})`: ''}}</span>
                </span>
              </el-tree>
            </div>
        </div>
      </div>
      <div class="left">
        <p>{{rightTitle}}</p>
        <div class="custom_tag_show">
          <template v-for="(item, index) in waitingHandleTags">
            <div :key="item.id" class="hand_r_tag">
              <p class="r_text">{{item.tagName}}</p>
              <div class="r_close" @click="removeCurrentTag(index)"><i class="el-icon-close"></i></div>
            </div>
          </template>
        </div>
      </div>
    </div>
    <!-- <p>batchTagsForm: {{batchTagsForm}}</p>
    <p>batchUrl: {{batchUrl}}</p> -->
    <span class="form_footer" slot="footer">
      <el-button @click="sure" type="primary">保存</el-button>
      <el-button @click="tagLibrayManager = false">关闭</el-button>
    </span>
  </el-dialog>
  </div>

</template>

<script>
	import { post, get } from "../../store/api"
	import _ from 'lodash'
	import { showNotify } from '../../plugin/utils-notify'
  import { formatTime } from '../../plugin/utils-functions'
  import { tags } from "../../api/tags"

	export default {
  data() {
    let t = formatTime(new Date().getTime(), 'yyyy-MM-dd');
    return {
      formSearch: {
        tagIds: [],
        companyName: '',
        createStartAt: '',
        createEndAt: '',
        page: 1,
        pageSize: 10
      },
      total: 0, // 统计数据
      activeTab: 'first',
      isReady: true,
      dateValue: '',//,[t, t],
      currentPage: 1,
      pageSize: 10,
      tagGroupsList: [], // 标签组名称
      multipleSelection: [], // 多选数据
      url: tags.tagsCustom,
      soloTagMangerList: [],
      tagLibrayManager: false, // 标签管理弹框展示
      dialogTitle: '',
      leftTitle: '',
      rightTitle: '',
      batchTagsForm: {
        companyIds: [],
        companyType: 'client', // client-客户公司，channel-渠道商，service-服务商
        tagIds: []
      },
      batchUrl: '',
      waitingHandleTags: [], // 等待处理的标签 批量添加，或者删除
      handleCompanies: [],
      tableList: [],
      filterText: '',
      searchTagLibray: {
        searchLibrayTag: ''
      },
      isHandle: false,
      expandedkeys: [], // tree默认展开节点数

    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree2.filter(val)
    },
    waitingHandleTags(val){
      this.batchTagsForm.tagIds = this.waitingHandleTags.map(val => val.tagId)
    },
    multipleSelection(val){
      this.batchTagsForm.companyIds = this.multipleSelection.map(val => val.companyId)
    },
  },
  created() {
    this.getTagsNameList() // 获取标签组数据
    this.search(this.url)
    this.getTagsTree()
    this.isReady = false
  },
  mounted() {
    // Object.assign(this.formSearch, this.$route.query)
    // this.getTime()
  },
  methods: {
    // 获取标签树
    async getTagsTree(){
      const result = await get(tags.tagsTree, {hide: true}) // true 不展示标签库中，隐藏的数据 false 展示所有数据
      // console.log(`标签树： ${JSON.stringify(result)}`)
      this.soloTagMangerList = result.children
      if(this.soloTagMangerList.length > 0) {
        this.expandedkeys.push(this.soloTagMangerList[0].tagId)
      }

    },
    removeCurrentTag(index) {
      this.waitingHandleTags.splice(index, 1)
      // console.log(`移除等待处理的数组中某个元素，剩下的集合：${JSON.stringify(this.waitingHandleTags)}`)
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.tagName.indexOf(value) !== -1;
    },
    handleNodeClick(data) {
      // console.log(`添加标签点击当前line：${JSON.stringify(data)}`)
      if (!data.group) {
        // 放之前，需要去重
        let isInArray = this.waitingHandleTags.some(item=>{
        if(item.tagId === data.tagId){
          return true 
        } 
        })
        if(isInArray){ // 如果存在
          showNotify('warning', '标签已存在，请勿重复添加');
        } else {
          this.waitingHandleTags.push(data)
        }
      }
      // console.log(`当前等待处理的数组集合：${JSON.stringify(this.waitingHandleTags)}`)
    },
    async sure() {
      this.resetForm('formSearch')
      const result = await post(this.batchUrl, this.batchTagsForm)
      // console.log(`批量处理标签: ${JSON.stringify(result)}`)
      this.tagLibrayManager = false;
      this.search(this.url, this.currentPage);
      this.batchTagsForm.companyIds = []
      this.batchTagsForm.tagIds = []
      this.filterText = ''
    },
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    // 处理批量操作
    handleBatchTags(e) {
      this.filterText = ''
      this.waitingHandleTags = []
      this.dialogTitle = `批量${e === 'add' ? '添加': '移除'}标签`
      this.leftTitle = `选择需要批量${e === 'add' ? '添加': '移除'}的标签`
      this.rightTitle = `批量${e === 'add' ? '添加': '移除'}的标签`
      this.batchUrl = e === 'add' ? tags.tagsCompanyBind: tags.tagsCompanyRemove
      this.tagLibrayManager = true;

    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
      // console.log(`选择行数：${JSON.stringify(this.multipleSelection)}`)
    },
    // 编辑当前行
    editRow(row) {
      this.filterText = ''
      this.waitingHandleTags = []
      this.waitingHandleTags = row.tagList
      this.batchTagsForm.companyId = row.companyId
      this.batchUrl = tags.tagsCompanyUpdate
      // console.log(`编辑当前行：${JSON.stringify(row)}`)
      this.dialogTitle = '编辑'
      this.leftTitle = '选择需要添加的标签'
      this.rightTitle = '公司已有标签'
      this.tagLibrayManager = true;
    },
    // 搜索
    async search(url,page) {
      this.formSearch.page = page || 1
      this.formSearch.pageSize = this.pageSize
      // console.log(`输入是的form内容：${JSON.stringify(this.formSearch)}`)
      console.log(`url${JSON.stringify(url)}`)
      const result = await post(url, this.formSearch)
      // console.log(`搜索后的数据：${JSON.stringify(result)}`)
      this.tableList = result.list
      this.total = result.total
    },
    handleSizeChange(value) {
      this.formSearch.page = 1;
      this.pageSize = value;
      this.search(this.url);
    },
    handleCurrentChange(value) {
      this.formSearch.page = value
      this.currentPage = value;
      this.search(this.url, value)
    },
    getTime() {
      if(this.dateValue && this.dateValue.length) {
        this.formSearch.createStartAt = this.dateValue[0]
        this.formSearch.createEndAt = this.dateValue[1]
      } else {
        this.formSearch.createStartAt = ''
        this.formSearch.createEndAt = ''
      }
    },
    // 获取标签名称数组
    async getTagsNameList() {
      const result = await get(tags.tagsLibOptions, {})
      // console.log(`标签组的下拉： ${JSON.stringify(result)}`)
      this.tagGroupsList = result
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.dateValue = ''
      this.getTime()
      this.formSearch.tagIds = []
    },
    handleTabClick(tab, event) {
      console.log(tab);
      let _tab = tab.name
      switch (_tab) {
        case 'first':
          this.url = tags.tagsCustom
          break
        case 'second':
          this.url = tags.tagsChannel
          this.batchTagsForm.companyType = 'channel'
          break
        case 'third':
          this.url = tags.tagsServiceuery
          this.batchTagsForm.companyType = 'service'
          break
        default:
      }
      this.resetForm('formSearch')
      this.search(this.url)
    },
	}
	}
</script>

<style lang="scss" scoped>
  .tag_container {
    .tag_hd_tab {
      padding:40px 30px 15px 30px;
      background-color: #fff;
    }
    .dia_f_input {
      width: 260px;
    } 
    .tag_list_cell {
      display: inline-block;
      vertical-align: middle;
      margin-right: 10px;
      margin-bottom: 6px;
      padding: 2px 8px;
      border: 1px solid #3F9EFF;
      border-radius: 3px;
      font-size: 14px;
      color: #3F9EFF;
    }
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
    /deep/ .el-tabs__nav-wrap::after {
      display: none;
    }
    /deep/ .el-tabs__item{
      font-size: 16px;
      font-weight: 600;
    }
    .tab_container {
      padding:30px 30px 15px 30px;
      width: 100%;
      margin-top: 20px;
      background-color: #fff;
      .handle_batch {
        margin-bottom: 6px;
        height: 46px;
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 14px;
        padding: 0 20px;
        background: #E6F7FF;
        .ico_close {
          cursor: pointer;
        }
        span {
          display: inline-block;
          vertical-align: middle;
          color: rgba(0,0,0,0.65);
          &.choose {
            font-weight: 500;
            margin-right: 25px;
          }
          .num {
            padding: 0 5px;
            color: #0486FE;
          }
          &.btnch_s {
            cursor: pointer;
            margin-right: 6px;
            padding: 6px 20px;
            color: #666;
            background: #FFFFFF;
            border: 1px solid #DBDEE3;
            border-radius: 4px;
            &:hover {
              font-weight: 600;
            }
          }
        }
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
      }
      .tree_node_opea {
        width: 220px;
        text-align: right;
      }
    }
    .dialog_manage {
      flex: 1;
      display: flex;
      align-items: left;
      justify-content: space-between;
      .left {
      width: 390px;
      }
    }
    .custom_tag_show {
      padding: 10px 10px;
      height: 470px;
      border: 1px solid #DCDCDC;
      overflow-y: auto;
      .hand_r_tag {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 20px;
        font-size: 14px;
        color: #333;
      }
      .r_text {
        margin-bottom: 20px;
      }
      .r_close {
        cursor: pointer;
      }
    }
    .custom-tree-container {
      padding: 20px 10px;
      width: 390px;
      height: 470px;
      border: 1px solid #DCDCDC;
      .fix_tree_search {
        height: 380px;
        overflow-y: auto;
      }
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
  }
</style>