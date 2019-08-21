<template>
  <div class="monitor-motice-detail">
		<div class="section">
			<div>
				<p style="display: inline-block;">{{this.form.company_name}}</p>
				<div style="float: right; margin-top: 7px;">
					<el-button size="small" @click="$router.push('/main/monitorCompany/monitorList')">返回</el-button>
				</div>
			</div>
			<el-form :model="form" size="small">
				<el-form-item label="阅读状态">
					<el-radio-group v-model="form.is_readed" @change="getCompanyEventDetailList()">
						<el-radio-button label="N">未读</el-radio-button>
						<el-radio-button label="Y">已读</el-radio-button>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="维度选择">
					<el-radio-group v-model="first_dimension_id" @change="getCompanyEventDetailList()">
						<el-radio-button v-for="item of dimensionList" :key="item.id" :label="item.id">{{item.dimension_name}}</el-radio-button>
					</el-radio-group>
				</el-form-item>
			</el-form>
		</div>
		<div class="section">
			<div class="title-wrap">
				<div>动态事件</div>
				<div class="btn-group">
					<el-button
						:disabled="form.is_readed === 'Y'"
						type="primary"
						size="small"
						@click="readBtn">标为已读</el-button>
					<!-- <el-button type="primary" size="small">数据导出</el-button> -->
				</div>
			</div>
			<el-table :data="companyEventDetailList.details" ref="noticeTable" @selection-change="handleSelectionChange">
				<el-table-column type="selection" width="45">
				</el-table-column>
				<el-table-column prop="second_dimension_name" label="事件类型"></el-table-column>
				<el-table-column prop="event_detail" label="事件内容" width="600">
					<template slot-scope="scope">
						<el-popover
							placement="top"
							width="500"
							trigger="hover">
							<p>{{scope.row.event_detail.content_summary}}</p>
							<div slot="reference" class="cus-event-detail">{{scope.row.event_detail.content_summary}}</div>
						</el-popover>
					</template>
				</el-table-column>
				<el-table-column prop="update_time" label="变动时间"></el-table-column>
			</el-table>
			<ayg-pagination
				v-if="companyEventDetailList.total"
				:total="companyEventDetailList.total"
				:current-page="form.page_no"
				@handleSizeChange="sizeChange"
				@handleCurrentChange="getCompanyEventDetailList" />
		</div>
  </div>
</template>

<script>
import {post, get} from '../../store/api'
import { monitor } from '../../api/monitor'
import { deleteEmptyProperty } from '../../plugin/utils-functions'

export default {
  data() {
    return {
      form: {
        is_readed: 'N',
        second_dimension_ids: [],
        company_name: '',
        page_no: 1,
        page_size: 10,
      },
      first_dimension_id: '',
      dimensionList: [],
      companyEventDetailList: {
        details: [],
        total: 0,
      },
      multipleSelection: [],
    }
  },
  created() {
    const {first_dimension_id, company_name} = this.$route.query
    this.first_dimension_id = first_dimension_id
    this.form.company_name = company_name
  },
  mounted() {
    this.getCompanyDimension()
    // this.getCompanyEventDetailList()
  },
  methods: {
    // 获取维度数据
    getCompanyDimension() {
      get(monitor.getCompanyDimension).then(data => {
        this.dimensionList = Object.assign({}, data)

        this.getCompanyEventDetailList()
      })
    },

    getCompanyEventDetailList(page) {
      if(isNaN(page)) {
        page = 1
      }
      this.form.page_no = page
      this.getSecondDimension()
      let data = JSON.parse(JSON.stringify(this.form))
      data = deleteEmptyProperty(data)
      post(monitor.EventDetailByCriteria, {
        data
      }).then(res => {
        this.companyEventDetailList = res
        // 清空多选
        this.clearSelection()
      })
    },
    sizeChange(size) {
      this.form.page_size = size
      this.getCompanyEventDetailList()
    },
    readBtn() {
      if(!this.multipleSelection.length) {
        this.$message({
          type: 'warning',
          message: '请勾选未读信息',
        })
        return
      }

      this.upEventsIsRead()
    },

    upEventsIsRead() {
      const event_ids = this.multipleSelection.map(item => item.id)
      
      post(monitor.EventStatusOperation, {
        event_ids,
      }).then(() => {
        this.$message({
          type: 'success',
          message: '操作成功',
        })
        this.getCompanyEventDetailList()
      })
    },

    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    clearSelection() {
      this.$refs.noticeTable.clearSelection()
    },
    getSecondDimension() {
      if (this.first_dimension_id) {
        const { second_dimensions } = this.dimensionList[this.first_dimension_id]
        this.form.second_dimension_ids = second_dimensions.map(item => item.id)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.monitor-motice-detail {
	.section {
		padding: 15px;
		background: white;
		margin-bottom: 10px;
	}
}

.title-wrap {
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}
.cus-event-detail {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
