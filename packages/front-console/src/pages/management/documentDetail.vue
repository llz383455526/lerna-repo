<template>
  <div class="detail-wrapper">
    <!--<el-breadcrumb separator="/">
      <el-breadcrumb-item to='/'>首页</el-breadcrumb-item>
      <el-breadcrumb-item to='/document'>帮助文档</el-breadcrumb-item>
      <el-breadcrumb-item>帮助文档详情</el-breadcrumb-item>
    </el-breadcrumb>-->
    <div class="notice-content">
      <p class="title">{{documentDetail.title}}</p>
      <div class="content" v-html="documentDetail.content">

      </div>
      <p class="createtime">发布时间：{{documentDetail.createTime | formatTime('yyyy-MM-dd hh:mm')}}</p>
    </div>
  </div>
</template>

<script>
	import { get, post } from "../../store/api";
	
	import { showNotify } from "../../plugin/utils-notify";
	
	export default {
		created() {
			let documentId = this.$route.query.id
			this.getDetail(documentId)
		},
		data() {
			return {
				documentDetail: {}
			}
		},
		methods: {
			getDetail(id) {
				get('/api/sysmgr-web/helpful-document/get-helpful-document-detail', {
					documentId: id
				}).then(result => {
					this.documentDetail = result
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
.notice-content{
  padding: 35px 46px;
  background: #fff;
  margin-top: 13px;
  .title{
    font-size: 16px;
    font-weight: bold;
    line-height: 22px;
    color: #333333;
    margin-bottom: 46px;
    text-align: center;
  }
  .content{
    font-size: 14px;
    color: #666666;
    line-height: 31px;
  }
  .createtime{
    font-size: 14px;
    color: #999999;
    text-align: right;
    margin-top: 17px;
  }
}
</style>