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
                    <div :class="['content', postListStatus[index][i].content && 'close']" v-html="item.description"></div>
                    <el-button type="text" size="mini"
                        v-if="item.description && item.description.length > 30"
                        @click="expandContent(index, i)">{{postListStatus[index][i].content ? '展开' : '收起'}}</el-button>
                </td>
                <td>
                    <div :class="['content', postListStatus[index][i].rule && 'close']" v-html="item.performance"></div>
                    <el-button type="text" size="mini"
                        v-if="item.performance && item.performance.length > 30"
                        @click="expandRule(index, i)">{{postListStatus[index][i].rule ? '展开' : '收起'}}</el-button>
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
                    <el-button type="text" size="mini" v-if="item.posName" @click="remove(index, i)">删除</el-button>
                </td>
            </tr>
        </template>
    </table>
    <!-- <pre>{{serviceList}}</pre> -->
    <!-- <pre>{{postListStatus}}</pre> -->
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
      postListStatus: [], // 展开关闭
      serviceList: [], // 岗位模板列表
      serviceIndex: 0 // 选中的服务类型下标
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
        this.initDepth(this.serviceList)
      },
      deep: true
    }
  },
  created() {
    this.serviceList = this.servicePosList;
    this.initDepth(this.serviceList)
  },
  methods: {
    download() {
        this.$emit('download')
    },
    addServicePost(data) {
      this.$emit("change", this.index, this.serviceIndex, data);
    },
    addPost(index) {
      this.postDialog = true;
      this.serviceIndex = index;
    },
    remove(index, i) {
        // if (this.postListStatus[index][i].length > 0) {
        //     this.postListStatus[index].splice(i, 1)
        // }
        this.$emit("remove", this.index, index, i);
        // this.initDepth(this.serviceList)
    },
    downFile(attachment) {
      window.open(
        `${baseUrl}/api/contract-web/file/download?downloadCode=${attachment.downloadCode}`
      );
    },
    expandContent(index, i) {
        this.postListStatus[index][i].content = !this.postListStatus[index][i].content
        this.$forceUpdate()
    },
    expandRule(index, i) {
        this.postListStatus[index][i].rule = !this.postListStatus[index][i].rule
        this.$forceUpdate()
    },
    // 初始化岗位模板信息展开/关闭状态
    initDepth(list) {
        this.postListStatus = []
        list.forEach((item, key) => {
            this.postListStatus[key] = []
            item.positions.forEach((row) => {
                this.postListStatus[key].push({
                    content: true,
                    rule: true,
                })
            })
        })
    },
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
.close {
    height: 42px;
    overflow: hidden;
}
</style>