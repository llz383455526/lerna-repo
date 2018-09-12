<template>

    <div class="main-container">
        <div style="margin: 0 0 20px;">项目跟进负责人设置</div>

        <el-form :model="formList" ref="formList" :inline="true">
            <div v-for="(item, index) in userSetting">
                <el-form-item :label="item.name" :prop="item.key" :key="item.key">
                    <el-select v-model="userSetting[index].user" placeholder="请选择" style="width:100%;" @change="setUser(item)" :disabled="status > index + 1">
                        <el-option v-for="item in editUsers" :key="item.id" :label="item.name"
                                   :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
            </div>
        </el-form>
    </div>

</template>

<script>
    import { get, post } from '../../store/api'

    import _ from 'lodash'

    import { showNotify } from '../../plugin/utils-notify'

	export default {
		created() {
			this.projectId = this.$route.query.id

            this.status = this.$route.query.status

			this.getUsers()
            this.getProjectUsers()
		},
        data() {
			return {
				projectId: '',
				editUsers: [],
                userSetting: [{
					name: '审核',
                    key: 'audit',
                    user: ''
                },{
	                name: '谈判',
	                key: 'negotiation',
	                user: ''
                },{
	                name: '来访',
	                key: 'visit',
	                user: ''
                },{
	                name: '签约',
	                key: 'sign',
	                user: ''
                }],
                formList: {},
                status: 0
            }
        },
        methods: {
	        getUsers() {
		        get('/api/salemgt/config/users', {})
                    .then(result => {
                    	this.editUsers = result
                    })
	        },
            getProjectUsers() {
	        	let url = this.projectId ? `/api/salemgt/taxlanding/stage_directors/${this.projectId}` : '/api/salemgt/taxlanding/director_list'
	        	get(url)
                    .then(result => {
                        _.forEach(this.userSetting, item => {
                        	let step = result[item.key]
                        	item.user = step ? step.id : ''
                        })
                    })
            },
            setUser(stage) {
	        	let param = {
			        stage: stage.key,
			        directorId: stage.user
                }
                if(this.projectId) param.infoId = this.projectId


	        	post(`/api/salemgt/taxlanding/set${this.projectId ? '' : '_default'}_stage_director`, param)
                    .then(result => {
                        showNotify('success', '设置成功')
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
        margin-bottom: 50px;
    }

</style>





















