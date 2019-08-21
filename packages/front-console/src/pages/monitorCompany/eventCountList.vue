<template>
  <div class="monitor-event-count-container" v-loading="loading">
    <div class="section header">
      <p style="display: inline-block;">企业监控</p>
      <div style="float: right; margin-top: 7px;">
        <el-input
          v-model.trim="form.company_name"
          size="small"
          placeholder="请输入企业名称"
          style="width: 250px;"
        >
					<el-button
						slot="append"
						icon="el-icon-search"
						@click="getEventCountList"
					></el-button>
				</el-input>
        <!-- <el-button size="small" type="primary">导出xls</el-button> -->
        <el-button size="small" @click="$router.push('/main/monitorCompany/monitorList')">返回</el-button>
      </div>
    </div>
		<div class="section">
			<el-form ref="formSearch" :model="form" :rules="formRules" size="small" :inline="true">
				<el-form-item label="风控维度" prop="second_dimension_ids">
					<el-select
						v-model="firstDimension"
						placeholder="一级维度"
						@change="handleFirstDimesionChange"
						style="width: 120px;">
						<el-option
							v-for="pItem of dimensionList"
							:key="pItem.id"
							:label="pItem.dimension_name"
							:value="pItem.id">
						</el-option>
					</el-select>
					<el-select
						v-model="form.second_dimension_ids"
						multiple
						collapse-tags
						placeholder="二级维度">
						<el-option
							v-for="item of currentSecondDimesionList"
							:key="item.id"
							:label="item.dimension_name"
							:value="item.id">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="变动日期">
					<el-date-picker
						type="daterange"
						v-model="dataValue"
						value-format="yyyy-MM-dd HH:mm:ss"
						range-separator="至"
						start-placeholder="开始日期"
						end-placeholder="结束日期"
						:picker-options="pickerOptions"
					>
					</el-date-picker>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="getEventCountList">查询</el-button>
					<el-button @click="resetForm">清空</el-button>
				</el-form-item>
			</el-form>
			<el-table :data="eventCountList.details" ref="noticeTable">
				<el-table-column prop="company_name" label="企业名称"></el-table-column>
				<el-table-column prop="second_dimension_name" label="风险维度"></el-table-column>
				<el-table-column prop="event_detail" label="风险内容" width="600">
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
      v-if="eventCountList.total"
      :total="eventCountList.total"
      :current-page="form.page_no"
      @handleSizeChange="sizeChange"
      @handleCurrentChange="getEventCountList" />
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
        second_dimension_ids: [],
        company_name: '',
        start_time: '',
        end_time: '',
        page_no: 1,
        page_size: 10,
      },
      formRules: {
          second_dimension_ids: [
              { required: true, message: '二级维度不能为空' },
          ],
      },
      dimensionList: {},
      dataValue: '',
      firstDimension: '',
      eventCountList: {
        details: [],
        total: 0,
      },
      loading: false,
    }
  },
  computed: {
    currentSecondDimesionList() {
      if(!this.firstDimension) {
        return []
      } else if(!this.dimensionList[this.firstDimension]) {
        return []
      }
      return this.dimensionList[this.firstDimension].second_dimensions
    }
  },
  created() {
    const { first_dimension_id, start_time, end_time } = this.$route.query
    this.firstDimension = first_dimension_id
    this.dataValue = [start_time, end_time]
    this.form = Object.assign(this.form, {
      start_time,
      end_time,
    })
  },
  mounted() {
    this.getCompanyDimension()
    this.getEventCountList()
  },
  methods: {
    // 获取维度数据
    getCompanyDimension() {
      get(monitor.getCompanyDimension).then(data => {
        this.dimensionList = Object.assign({}, data)
        // 初始化选项
        const { second_dimensions } = this.dimensionList[this.firstDimension]
        this.form.second_dimension_ids = second_dimensions.map(item => item.id)
        // // 先这么写吧，有bug的
        this.getEventCountList()
      })
    },
    // 获取统计详情
    getEventCountList(page) {
      let validRes = true
      this.$refs.formSearch.validate((valid) => {
        validRes = valid
      })
      // 表单校验
      if(!validRes) {
        return
      }

      if(isNaN(page)) {
        page = 1
      }

      this.form.page_no = page

      if(this.dataValue) {
        this.form.start_time = this.dataValue[0]
        this.form.end_time = this.dataValue[1]
      } else {
        this.form.start_time = ''
        this.form.end_time = ''
      }
      let data = JSON.parse(JSON.stringify(this.form))
      data = deleteEmptyProperty(data)

      post(monitor.EventDetailByCriteria, {
        data,
      }).then(res => {
        this.eventCountList = res
      })
    },
    sizeChange(size) {
      this.form.page_size = size
      this.getEventCountList()
    },
    // 清空按钮
    resetForm() {
      this.dataValue = ''
      this.form.start_time = ''
      this.form.end_time = ''
      this.form.second_dimension_ids = []
    },
    // 一级维度变化处理
    handleFirstDimesionChange() {
      this.form.second_dimension_ids = []
    }
  }
}
</script>

<style lang="scss">
.monitor-event-count-container {
	.section {
		padding: 15px;
		background: white;
		margin-bottom: 10px;
	}

}

.cus-event-detail {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
