<template>

    <div class="main-container">
        <div style="margin: 0 0 20px;">税优地开拓管理</div>

        <el-form :inline="true" :model="formSearch" ref="formSearch">
            <el-form-item label="税优地名称:" size="small" prop="location">
                <el-input v-model="formSearch.location"></el-input>
            </el-form-item>

            <el-form-item label="所属省份:" size="small" prop="provinceId">
                <el-select v-model="formSearch.provinceId" placeholder="请选择" style="width:100%;">
                    <el-option v-for="item in provinceList" :key="item.id" :label="item.name"
                               :value="item.id"></el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="所属城市:" size="small" prop="cityId" >
                <el-select v-model="formSearch.cityId" placeholder="请选择" style="width:100%;">
                    <el-option v-for="item in cityList" :key="item.id" :label="item.name"
                               :value="item.id"></el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="项目状态:" size="small" prop="status" >
                <el-select v-model="formSearch.status" placeholder="请选择" style="width:100%;">
                    <el-option v-for="item in taxStatusList" :key="item.id" :label="item.name"
                               :value="item.id"></el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="当前阶段:" size="small" prop="stage" >
                <el-select v-model="formSearch.stage" placeholder="请选择" style="width:100%;">
                    <el-option v-for="item in taxStageList" :key="item.id" :label="item.name"
                               :value="item.id"></el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="签约时间:" size="small" prop="signDate" >
                <el-date-picker
                        v-model="formSearch.signDate"
                        type="date"
                        value-format="yyyy-MM-dd"
                        placeholder="选择日期">
                </el-date-picker>
            </el-form-item>

            <el-form-item style="margin-top: -4px">
                <el-button type="primary" @click="search" size="small">查询</el-button>
                <el-button size="small" @click="resetForm('formSearch')">清除</el-button>
            </el-form-item>
        </el-form>

        <el-button size="small" @click="$router.push('detail')">新建税优地</el-button>

        <div class="table-container">
            <el-table
                    :data="tableList.data">
                <el-table-column prop="landRegion" label="税优地名称" width="150"></el-table-column>
                <el-table-column prop="landBizTypes" label="业务类型" width="120"></el-table-column>
                <el-table-column prop="statusName" label="项目状态" width="100">
                    <!--<template slot-scope="scope">{{taxStatusList[scope.row.status].name}}</template>-->
                </el-table-column>
                <el-table-column prop="" label="留存比例" width="200">
                    <template slot-scope="scope">
                        <!--<span v-if="typeof scope.row.retainRatio === 'object'">营改增项目增值税{{scope.row.retainRatio[0]}}% 企业所得税{{scope.row.retainRatio[1]}}% 个人所得税企业所得税{{scope.row.retainRatio[2]}}%</span>
                        <span v-else>{{scope.row.retainRatio}}</span>-->
                        <p>营改增项目增值税{{scope.row.newValueTaxRetain || scope.row.valueTaxRetain || 0}}%</p>
                        <p>企业所得税{{scope.row.newCorporateTaxRetain || scope.row.corporateTaxRetain || 0}}%</p>
                        <p>个人所得税{{scope.row.newPersonalTaxRetain || scope.row.personalTaxRetain || 0}}%</p>
                    </template>
                </el-table-column>
                <el-table-column prop="" label="返还比例" width="200">
                    <template slot-scope="scope">
                        <p>营改增项目增值税{{scope.row.newValueTaxReturn || scope.row.valueTaxReturn || 0}}%</p>
                        <p>企业所得税{{scope.row.newCorporateTaxReturn || scope.row.corporateTaxReturn || 0}}%</p>
                        <p>个人所得税{{scope.row.newPersonalTaxReturn || scope.row.personalTaxReturn || 0}}%</p>
                    </template>
                </el-table-column>
                <el-table-column prop="remitTaxUnder30000" label="三万免征" width="100">
                    <template slot-scope="scope">
                        <span>{{scope.row.newRemitTaxUnder30000 || scope.row.remitTaxUnder30000}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="costOver30000" label="三万以上" width="100"></el-table-column>
                <el-table-column prop="processBy" label="跟进人" width="100"></el-table-column>
                <el-table-column prop="landDirector" label="负责人" width="100"></el-table-column>
                <el-table-column prop="updateDate" label="变更时间" width="100">
                    <template slot-scope="scope">{{scope.row.updateDate}}</template>
                </el-table-column>
                <el-table-column prop="stageName" label="项目进度" width="100">
                    <!--<template slot-scope="scope">{{taxStageList[scope.row.stage].name}}</template>-->
                </el-table-column>
                <el-table-column prop="createDate" label="发起时间" width="100">
                    <template slot-scope="scope">{{scope.row.createDate}}</template>
                </el-table-column>
                <el-table-column prop="signDate" label="签约时间" width="100">
                    <template slot-scope="scope">{{scope.row.signDate}}</template>
                </el-table-column>

                <el-table-column label="操作" width="120" fixed="right">
                    <template slot-scope="scope">
                        <el-button @click="toDetail(scope.row.id)" type="text" size="medium" style="padding:0;">详情</el-button>
                    </template>
                </el-table-column>

            </el-table>
        </div>
        <ayg-pagination v-if="tableList.total" :total="tableList.total"
                        v-on:handleSizeChange="handleSizeChange" :currentSize="pageSize"
                        v-on:handleCurrentChange="handleCurrentChange" :currentPage="pageIndex"></ayg-pagination>

    </div>

</template>

<script>
	import { get, post } from '../../store/api'

    import _ from 'lodash'

    import { mapGetters } from 'vuex'

	export default {
		created() {
            if(_.isEmpty(this.provinceList)) {
            	this.$store.dispatch('getProvince')
                this.$store.dispatch('getTaxStageList')
	            this.$store.dispatch('getTaxStatusList')
            }

			this.getList()
        },
		data() {
			return {
				formSearch: {
					location: '',
					provinceId: '',
					cityId: '',
					status: '',
					stage: '',
					signDate: ''
                },
				tableList: [],
				pageSize: 10,
				pageIndex: 1,
            }
        },
        computed: {
            ...mapGetters({
	            provinceList: 'provinceList',
	            taxStageList: 'taxStageList',
	            taxStatusList: 'taxStatusList'
            }),
	        cityList() {
            	let provinceId = this.formSearch.provinceId

                return provinceId ? this.provinceList[provinceId].citys : []
            }
        },
        methods: {
	        resetForm(formName) {
		        this.$refs[formName].resetFields()
	        },
	        search() {
		        this.pageIndex = 1
		        this.getList()
	        },
	        handleSizeChange(value) {
		        this.pageSize = value
		        this.pageIndex = 1
		        this.getList()
	        },
	        handleCurrentChange(value) {
		        this.pageIndex = value
		        this.getList()
	        },
	        getList() {
		        let formSearch = _.cloneDeep(this.formSearch)
		        let options = _.assign(formSearch, {
			        pageNo: this.pageIndex,
			        pageSize: this.pageSize
		        })

		        post('/api/salemgt/taxlanding/list', options)
			        .then(result => {
			        	let tableList = result

                        _.forEach(tableList.data, item => {
	                        if(item.retainRatio) item.retainRatio = item.retainRatio.split('|')
                            if(item.landBizTypes) item.landBizTypes = item.landBizTypes.join(',')
                        })

				        this.tableList = tableList
                        // console.log(tableList)

				        /*this.$router.replace({
					        path: 'templateList',
					        query: {
						        page: this.pageIndex,
						        pageSize: this.pageSize,
						        param: JSON.stringify(this.formSearch)
					        }
				        })*/
			        })
            },
            toDetail(id) {
	        	this.$router.push({
                    path: 'detail',
                    query: {
                    	id: id
                    }
                })
            }
        }
    }
</script>

<style lang="scss" scoped>

    .main-container {
        margin-top: 15px;
        background-color: #fff;
        padding: 15px;
        margin-bottom: 20px;
    }

    .table-container p {
        margin: 5px 0;
    }

</style>




















