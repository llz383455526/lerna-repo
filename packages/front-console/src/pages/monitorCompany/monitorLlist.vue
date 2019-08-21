<template>
  <div class="monitor-company-list-container">
		<div class="section header">
      <p style="display: inline-block;">企业监控</p>
      <el-button
				style="float: right; margin-top: 5px;"
				icon="el-icon-upload"
				@click="$router.push('/main/companyBlack/companyBlackImport')">添加企业</el-button>
		</div>
		<div class="count-table">
			<div class="section category-total">
				<p>监控变更统计</p>
        <div class="category-list">
          <div class="category-item" v-for="(item, index) in resentEventCount.events" :key="index" @click="go2secondList(item)">
            <p class="item-desc">{{ item.first_dimension_name }}</p>
            <p class="item-count">{{ item.count }}</p>
            <span class="rank">周</span>
          </div>
        </div>
			</div>
			<div class="section">
				<p>监控企业统计</p>
        <div class="category-item" v-if="resentEventCount.company_count">
          <p class="item-desc">入库企业数量</p>
          <p class="item-count">{{ resentEventCount.company_count }}</p>
        </div>
			</div>
		</div>
		<div class="section">

			<div class="table-header">
				<p>监控动态</p>
				<el-input
					v-model.trim="form.company_name"
					size="small"
					style="width: 200px;"
					placeholder="请输入企业名称">
					<el-button
						slot="append"
						icon="el-icon-search"
						@click="getCompanyEventCountList"
					></el-button>
				</el-input>
				<div class="header-btn-warp">
						<el-button type="text" @click="showDialog" icon="el-icon-setting">监控维度设置</el-button>
						<!-- <el-button type="text" icon="el-icon-bell">消息通知设置</el-button> -->
					</div>
			</div>
			<el-form ref="formSearch" :model="form" size="small" style="margin-top: 25px;">
				<el-form-item label="时间选择">
					<el-date-picker type="daterange" v-model="dataValue" value-format="yyyy-MM-dd HH:mm:ss" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions">
					</el-date-picker>
				</el-form-item>
				<el-form-item label="维度选择" prop="second_dimension_ids">
					<div class="select-list-wrap">
						<div class="select-list">
							<div class="list-item" v-for="pItem of dimensionList" :key="pItem.id">
								<el-checkbox :ref="`checkAll${pItem.id}`" :indeterminate="dimesionIndeterminate[pItem.id]" v-model="dimesionCheckAll[pItem.id]" @change="changeAll(pItem, $event)">
									{{ pItem.dimension_name }}
								</el-checkbox>
								<el-checkbox-group v-show="showSuboptions" v-model="form.second_dimension_ids" @change="listChange(pItem, $event)">
									<el-checkbox v-for="item in pItem.second_dimensions" :key="item.id" :label="item.id">{{ item.dimension_name }}</el-checkbox>
								</el-checkbox-group>
							</div>
						</div>
						<div class="list-option">
							<el-button type="text" @click="showSuboptions = !showSuboptions">
								<template v-if="showSuboptions">
									收起 <i class="el-select__caret el-input__icon el-icon-arrow-up"></i>
								</template>
								<template v-else>
									展开更多 <i class="el-select__caret el-input__icon el-icon-arrow-down"></i>
								</template>
							</el-button>
						</div>
					</div>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="getCompanyEventCountList">查询</el-button>
					<el-button @click="resetForm">清空</el-button>
				</el-form-item>
			</el-form>
			<el-table :data="companyEventCountList.results">
				<el-table-column prop="company_name" label="企业名称">
					<template slot-scope="scope">
						<el-button type="text" @click="go2NoticeDetail(scope.row)">{{ scope.row.company_name }}</el-button>
					</template>
				</el-table-column>
				<!-- <el-table-column prop="parentCategory" label="风险等级">
				</el-table-column> -->
				<el-table-column prop="first_dimension_name" label="最新变化">
				</el-table-column>
				<el-table-column prop="second_dimensions" label="监控事件">
					<template slot-scope="scope">
						<span>{{ scope.row.second_dimensions }}</span>
					</template>
				</el-table-column>
				<!-- <el-table-column prop="newDownloadDate" label="变动时间">
				</el-table-column> -->
				<el-table-column prop="action" label="操作">
					<template slot-scope="scope">
						<el-button type="text" @click="handleRemove(scope.row)">移除监控</el-button>
						<el-button type="text" @click="handleAddBlack(scope.row)">加入黑名单</el-button>
					</template>
				</el-table-column>
			</el-table>
			<ayg-pagination
				v-if="companyEventCountList.total"
				:total="companyEventCountList.total"
				:current-page="form.page_no"
				@handleSizeChange="sizeChange"
				@handleCurrentChange="getCompanyEventCountList" />
		</div>
    <monitor-set-dialog
      v-if="showMonitorSetDialog"
      :dimensionList="dimensionList"
      @close="showMonitorSetDialog = false"
      ref="monitorSetDialog">
    </monitor-set-dialog>
  </div>
</template>

<script>
import {post, get} from '../../store/api'
import {
  formatTime,
  getCurrentWeek,
  getLastWeek,
  getCurrentMonth,
  getLastMonth,
  deleteEmptyProperty
  } from '../../plugin/utils-functions'
import monitorSetDialog from './monitorSetDialog'
import { monitor } from '../../api/monitor'

const currentWeek = getCurrentWeek()
const firstDay = formatTime(currentWeek[0])
const lastDay = formatTime(currentWeek[1])

export default {
  components: {
    monitorSetDialog,
  },
  data() {
    return {
      form: {
        company_name: '',
        start_time: '',
        end_time: '',
        page_no: 1,
        page_size: 10,
        // 维度
        second_dimension_ids: [],
      },
      // 不确定状态
      dimesionIndeterminate: {},
      // 全选
      dimesionCheckAll: {},
      dataValue: [firstDay, lastDay],
      pickerOptions: {
        shortcuts: [
          {
            text: '本周',
            onClick(picker) {
              const range = getCurrentWeek()
              const start = range[0]
              const end = range[1]
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '上周',
            onClick(picker) {
              const range = getLastWeek()
              const start = range[0]
              const end = range[1]
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '本月',
            onClick(picker) {
              const range = getCurrentMonth()
              const start = range[0]
              const end = range[1]
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '上月',
            onClick(picker) {
              const range = getLastMonth()
              const start = range[0]
              const end = range[1]
              picker.$emit('pick', [start, end])
            }
          },
        ]
      },
      // 展示二级选项
      showSuboptions: false,
      showMonitorSetDialog: false,
      dimensionList: {},
      // 一周统计
      resentEventCount: {
        company_count: 0,
        start_time: '',
        end_time: '',
        events: [],
      },
      // 公司事件统计列表
      companyEventCountList: {
        total: 0,
        results: [],
      },
    }
  },
  mounted() {
    this.getCompanyDimension()
    this.getResentEventCount()
    this.getCompanyEventCountList()
  },
  methods: {
    // 获取事件统计列表
    getCompanyEventCountList(page) {
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
      post(monitor.EventCountByCriteria, {
        data
      }).then(res => {
        this.companyEventCountList = res
      })
    },
    sizeChange(size) {
      this.form.page_size = size
      this.getCompanyEventCountList()
    },

    // 获取一周统计
    getResentEventCount() {
      post(monitor.resentEventCount).then(data => {
        this.resentEventCount = Object.assign({}, data)
      })
    },

    // 获取维度数据
    getCompanyDimension() {
      get(monitor.getCompanyDimension).then(data => {
        this.dimensionList = Object.assign({}, data)
        this.initDimesionIndeterminate()
      })
    },

    initDimesionIndeterminate() {
      const obj = {}
      Object.keys(this.dimensionList).forEach(key => {
        obj[key] = false
      })
      this.dimesionIndeterminate = Object.assign({}, obj)
      this.dimesionCheckAll = Object.assign({}, obj)
    },

    // 清空按钮
    resetForm() {
      this.$refs.formSearch.resetFields()
      this.dataValue = [firstDay, lastDay]
      this.form.start_time = firstDay
      this.form.end_time = lastDay
      this.initDimesionIndeterminate()
    },
    showDialog() {
      this.showMonitorSetDialog = true
      this.$nextTick(() => {
        this.$refs.monitorSetDialog.dialogVisible = true
      })
    },
    changeAll(item, isAll) {
      const { second_dimension_ids } = this.form
      if (isAll) {
        item.second_dimensions.forEach(item => {
          const index = second_dimension_ids.indexOf(item.id)
          if (index <= -1) {
            second_dimension_ids.push(item.id)
          }
        })
      } else {
        item.second_dimensions.forEach(item => {
          const index = second_dimension_ids.indexOf(item.id)
          if (index > -1) {
            second_dimension_ids.splice(index, 1)
          }
        })
      }
      this.dimesionIndeterminate[item.id] = false
    },
    listChange(item, value) {
      const { second_dimension_ids } = this.form
      let count = 0
      item.second_dimensions.forEach(item => {
        if (second_dimension_ids.indexOf(item.id) > -1) {
          count += 1
        }
      })
      this.dimesionCheckAll[item.id] = count === item.second_dimensions.length
      this.dimesionIndeterminate[item.id] = count > 0 && count < item.second_dimensions.length
    },
    // 移除监控
    handleRemove(row) {
      post(monitor.monitorCompanyOperation, {
        operation_type: 'D',
        data: {id: row.company_id},
      }).then(data => {
        this.$message({
          type: 'success',
          message: '移除成功',
        })
        this.getCompanyEventCountList()
				this.getResentEventCount()
      })
    },
    handleAddBlack(row) {
      post(monitor.addCompanyBlack, {
        companyName: row.company_name,
      }).then(() => {
        this.$message({
          type: 'success',
          message: '加入黑名单成功',
        })
        this.getCompanyEventCountList()
				this.getResentEventCount()
      })
    },
    go2secondList(item) {
      const {end_time, start_time} = this.resentEventCount
      const { first_dimension_id } = item
      this.$router.push({
        path: '/main/monitorCompany/eventCountList',
        query: {
          first_dimension_id,
          end_time,
          start_time,
        },
      })
    },
    go2NoticeDetail(item) {
      const { company_name, first_dimension_id } = item
      this.$router.push({
        path: '/main/monitorCompany/noticeDetail',
        query: {
          company_name,
          first_dimension_id,
        }
      })
    }
  },
}
</script>


<style lang="scss" scoped>
.monitor-company-list-container {
	.section {
		padding: 15px;
		background: white;
		margin-bottom: 10px;
	}

	.count-table {
		display: flex;
		flex-direction: row;
		justify-content: space-between;

		.category-total {
			margin-right: 10px;
			flex: 1;
		}
	}

	.category-list {
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		align-items: stretch;
		flex-wrap: wrap;
	}
	.category-item {
		position: relative;
		padding: 20px;
		border: 4px;
		background-color: #f9f9f9;
		border-radius: 4px;
		width: 220px;
		margin-right: 30px;
		margin-bottom: 20px;
		cursor: pointer;

		.rank {
			position: absolute;
			top: 20px;
			right: 20px;
			background-color: #6fd5cc;
			color: white;
			padding: 5px 10px;
			border-radius: 4px;
		}
	}
	.select-list-wrap {
		position: relative;

		.select-list {
			width: calc(100% - 300px);
			display: inline-flex;
			flex-direction: row;
			justify-content: flex-start;

			.list-item {
				display: inline-block;

				div.el-checkbox-group {
					margin-left: 25px;
				}

				label.el-checkbox {
					display: block;
				}
			}
		}

		.list-option {
			display: inline-block;
			width: 120px;
		}
	}

	.table-header {
		padding-bottom: 15px;
		border-bottom: 1px solid #F2F2F2;

		p {
			display: inline-block;
		}
		
		p + .el-input {
			margin-left: 10px;
		}

		.header-btn-warp {
			float: right;
			margin-top: 5px;
		}
	}
}

</style>
