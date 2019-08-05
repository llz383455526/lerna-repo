<template>
  <div>
    <div style="width: 850px; overflow-x: auto;">
    <table class="post-table">
        <tr>
        <th width="150">附件协议文档</th>
        <th width="120">服务类型</th>
        <th width="150">岗位名称</th>
        <th width="250">工作内容(岗位描述)</th>
        <th width="250">绩效费结算规则</th>
        <th width="150">绩效费结算明细模板</th>
        </tr>
        <template v-for="(list, index) in serviceList">
        <tr :key="index">
            <td :rowspan="serviceList.length" v-if="index === 0" align="center">
            <div class="content">《绩效规则-协议》</div>
            <el-button type="text">下载</el-button>
            </td>
            <td align="center">
            <div class="content">{{list.serviceName}}</div>
            <el-button
                type="text"
                icon="el-icon-plus"
                size="mini"
                @click="addPost(index)"
            >添加岗位</el-button>
            </td>
            <td align="center">
            <div class="content">{{list.posName}}</div>
            </td>
            <td>
            <div class="content">{{list.description}}</div>
            </td>
            <td>
            <div class="content">{{list.performance}}</div>
            </td>
            <td align="center">
            <div class="content">
                <el-button
                type="text"
                size="mini"
                @click="downFile(list.attachment)"
                >{{list.attachment.displayname}}</el-button>
            </div>
            </td>
        </tr>
        </template>
    </table>
    </div>
    <pre>{{serviceList}}</pre>
    <post v-model="postDialog" @addServicePost="addServicePost"></post>
  </div>
</template>

<script>
import post from "./post/post";
import { baseUrl } from "../../../config/address";

export default {
  name: "performanceRules",
  components: { post },
  props: {
    positions: {
      type: Array,
      default() {
        return [];
      }
    },
    index: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      postDialog: false, // 添加岗位弹框
      serviceList: [], // 岗位模板列表
      serviceIndex: 0, // 选中的服务类型下标
      // currentServiceId: 0 // 选中的服务类型
    };
  },
  computed: {
  },
  watch: {
    positions: {
      handler(val) {
        this.serviceList = val;
      },
      deep: true
    }
  },
  created() {
      this.serviceList = this.positions;
  },
  methods: {
    addServicePost(data) {
        // const obj = this.serviceList[this.serviceIndex]
        // this.serviceList.splice(this.serviceIndex + 1, 0, {
        //     ...obj,
        //     ...data
        // })
      this.$emit("change", this.index, this.serviceIndex, data);
    },
    addPost(index) {
      this.postDialog = true;
      this.serviceIndex = index;
    },
    downFile(attachment) {
      window.open(
        `${baseUrl}/api/contract-web/file/download?downloadCode=${attachment.downloadCode}`
      );
    }
  }
};
</script>

<style scope>
.post-table {
  color: #606266;
  width: 1080px;
  border-collapse: collapse;
  border-left: 1px solid #ebeef5;
  border-top: 1px solid #ebeef5;
}
.post-table tr th {
  background: #fafafa;
}
.post-table tr th,
.post-table tr td {
  padding: 0 5px;
  border-right: 1px solid #ebeef5;
  border-bottom: 1px solid #ebeef5;
}
.content {
  line-height: 1.5;
}
</style>