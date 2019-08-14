<template>
  <div>
    <table class="post-table">
        <tr>
            <th width="150">附件协议文档</th>
            <th width="120">服务类型</th>
            <th width="150">岗位名称</th>
            <th width="250">工作内容(岗位描述)</th>
            <th width="250">绩效费结算规则</th>
            <th width="150">绩效费结算明细模板</th>
            <th width="60">操作</th>
        </tr>
        <template v-for="(list, index) in serviceList">
            <tr v-for="(item, i) in list.positions" :key="`${index}-${i}`">
                <td align="center" :rowspan="rows" v-if="index === 0 && i === 0">
                    <div class="content">《绩效规则-协议》</div>
                    <el-button type="text" @click="download">下载</el-button>
                </td>
                <td align="center" :rowspan="list.positions.length" v-if="i === 0">
                <div class="content">{{list.serviceName}}</div>
                    <el-button type="text" icon="el-icon-plus" size="mini" @click="addPost(index)">添加岗位</el-button>
                </td>
                <td align="center">
                    <div class="content">{{item.posName}}</div>
                </td>
                <td>
                    <div class="content">{{item.description}}</div>
                </td>
                <td>
                    <div class="content">{{item.performance}}</div>
                </td>
                <td align="center">
                    <div class="content">
                        <el-button
                        type="text"
                        size="mini"
                        v-if="item.attachment"
                        @click="downFile(item.attachment)"
                        >{{item.attachment.displayname}}</el-button>
                    </div>
                </td>
                <td>
                    <el-button type="text" size="mini" @click="remove(index, i)">删除</el-button>
                </td>
            </tr>
        </template>
    </table>
    <!-- <pre>{{serviceList}}</pre> -->
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
    servicePosList: {
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
      serviceIndex: 0 // 选中的服务类型下标
      // currentServiceId: 0 // 选中的服务类型
    };
  },
  computed: {
      rows() {
          let len = 0
          this.serviceList.forEach((item) => {
              len += item.positions.length
          })
          return len
      }
  },
  watch: {
    servicePosList: {
      handler(val) {
        this.serviceList = val;
      },
      deep: true
    }
  },
  created() {
    this.serviceList = this.servicePosList;
  },
  methods: {
      download() {
          this.$emit('download')
      },
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
    remove(index, i) {
      this.$emit("remove", this.index, index, i);
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
  border-left: 1px solid #b4bccc;
  border-top: 1px solid #b4bccc;
}
.post-table tr th {
  background: #f5f7fa;
}
.post-table tr th,
.post-table tr td {
  padding: 0 5px;
  border-right: 1px solid #b4bccc;
  border-bottom: 1px solid #b4bccc;
}
.content {
  line-height: 1.5;
}
</style>