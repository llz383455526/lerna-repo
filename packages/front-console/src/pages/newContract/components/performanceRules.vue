<template>
  <div>
    <el-form-item label="C端绩效计算规则">
      <div style="width: 700px">
        <el-table
          :data="tableData"
          :span-method="spanMethod"
          border
          stripe
          size="mini"
          style="width: 100%"
        >
          <el-table-column prop="file" label="附件协议文档" width="120">
            <template slot-scope="scope">
              <span>{{ scope.row.file }}</span>
              <el-button type="text">下载</el-button>
            </template>
          </el-table-column>
          <el-table-column prop="type" label="服务类型" width="120">
            <template slot-scope="scope">
              <span>{{ scope.row.type }}</span>
              <el-button type="text" icon="el-icon-plus" size="mini" @click="postDialog = true">添加岗位</el-button>
            </template>
          </el-table-column>
          <el-table-column prop="postName" label="岗位名称" width="150"></el-table-column>
          <el-table-column prop="content" label="工作内容(岗位描述)" width="250"></el-table-column>
          <el-table-column prop="rules" label="绩效费结算规则" width="250"></el-table-column>
          <el-table-column prop="temp" label="绩效费结算明细模板" width="150">
            <template slot-scope="scope">
              <el-button type="text" size="mini">{{ scope.row.temp }}</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-form-item>
    <post v-model="postDialog"></post>
  </div>
</template>

<script>
import post from './post/post'

export default {
  name: "performanceRules",
  components: { post },
  props: {
    value: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  data() {
    return {
      tableData: [
        {
          id: 1,
          file: "《绩效规则-协议》",
          type: "市场推广",
          postName: "工程师",
          content: "士大夫似的士大夫士大夫但是",
          rules: "一天200，月结",
          temp: "开发工程师_绩效明细模板.xlsx",
          count: 3
        },
        {
          id: 2,
          file: "绩效规则",
          type: "市场推广",
          postName: "开发工程师",
          content: "幸福的地方我",
          rules: "一天200，月结",
          temp: "开发工程师_绩效明细模板.xlsx"
        },
        {
          id: 3,
          file: "绩效规则",
          type: "市场推广",
          postName: "工程师",
          content: "幸福的地方我",
          rules: "一天200，月结",
          temp: "开发工程师_绩效明细模板.xlsx"
        },
        {
          id: 4,
          file: "绩效规则",
          type: "软件服务",
          postName: "工程师",
          content: "幸福的地方我",
          rules: "一天200，月结",
          temp: "开发工程师_绩效明细模板.xlsx",
          count: 2
        },
        {
          id: 5,
          file: "绩效规则",
          type: "软件服务",
          postName: "工程师",
          content: "幸福的地方我",
          rules: "一天200，月结",
          temp: "开发工程师_绩效明细模板.xlsx"
        }
      ],
      postDialog: false, // 添加岗位弹框
      contracts: []
    };
  },
  computed: {
    filterTable() {
      return [];
    }
  },
  watch: {
    value: {
      handler(val) {
        this.contracts = val;
      },
      deep: true
    }
  },
  methods: {
    // 合并表格
    spanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 1) {
        return {
          rowspan: row.count || 0,
          colspan: row.count ? 1 : 0
        };
      } else if (columnIndex === 0) {
        return {
          rowspan: rowIndex === 0 ? this.tableData.length : 0,
          colspan: rowIndex === 0 ? 1 : 0
        };
      }
    }
  }
};
</script>

<style scope>
</style>