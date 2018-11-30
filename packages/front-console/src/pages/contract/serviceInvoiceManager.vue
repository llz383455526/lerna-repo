<template>
  <div class="r_main">
    <el-form :inline="true" size="small">
        <el-form-item label="服务类型">
            <el-input v-model="searchForm.serviceName" class="in_input" placeholder="请输入名称"></el-input>
        </el-form-item>
        <el-form-item label="状态">
            <el-select v-model="searchForm.status">
                <el-option v-for="e in statusList" :key="e.value" :value="e.value" :label="e.text"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item>
            <span style="padding-left :20px;" >
                <el-button type="primary" @click="currentPage = 1; search()">查询</el-button><el-button @click="clear">清除</el-button>
            </span>
        </el-form-item>
    </el-form>

    <el-button class="mr20" size="small" type="primary" @click="add">新增</el-button>
    <router-link to="/main/infoManager/categoryManager">
        <el-button size="small" type="primary">开票类目管理</el-button>
    </router-link>

    <el-table :data="page.list" style="width: 100%;margin-top: 20px;">
        <el-table-column prop="seqNo" label="序号"></el-table-column>
        <el-table-column prop="serviceName" label="服务类型"></el-table-column>
        <el-table-column prop="serviceContent" label="服务类型内容"></el-table-column>
        <el-table-column label="开票类目">
            <template slot-scope="scope">
                <template v-for="(item, index) in scope.row.subjects">
                    <div> {{ item.subjectName }}</div>
                </template>
            </template>
        </el-table-column>
        <el-table-column prop="statusName" label="状态"></el-table-column>
		<el-table-column align="center" label="操作" width="160">
			<template slot-scope="scope">
				<el-button @click="edit(scope.row)" type="text" size="medium" style="padding:0;">修改</el-button>
                <el-button @click="toggle(scope.row)" type="text" size="medium" style="padding:0;">{{scope.row.status == 1 ? '禁用' : '启用'}}</el-button>
            </template>
		</el-table-column>
    </el-table>

    <ayg-pagination v-if="page.total" 
        :total="page.total"
        v-on:handleSizeChange="handleSizeChange"
        v-on:handleCurrentChange="handleCurrentChange" 
        :currentPage="currentPage">
    </ayg-pagination>

    <el-dialog :title="editFormTitle"  :visible.sync="editFormShow" :before-close="clearForm" width="70%">
        <el-form label-width="150px" :rules="rules" :model="editForm" ref="editForm">
            <el-form-item label="服务类型：" prop="serviceName">
                <el-input v-model="editForm.serviceName" class="f_input"></el-input>
            </el-form-item>
            <el-form-item label="序号：" prop="seqNo">
				<el-input v-model="editForm.seqNo"></el-input>
			</el-form-item>
            <el-form-item label="备注：" prop="serviceContent">
				<el-input type="textarea" :rows="5" placeholder="请输入内容" v-model="editForm.serviceContent"></el-input>
			</el-form-item>
            <el-form-item label="开票类目：" prop="subjects">
                <el-select v-model="editSubjects" multiple filterable style="width: 500px" placeholder="请选择开票类目" @change="getSubjects">
                    <el-option v-for="item in subjects" :key="item.id" :label="item.fullName" :value="item.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="是否需要商业保险：" prop="vciStatus" required>
				<el-radio v-model="editForm.vciStatus" v-for="e in vciStatusList" :key="e.value" :label="e.value">{{e.text}}</el-radio>
			</el-form-item>
        </el-form>
          <span class="form_footer" slot="footer">
              <el-button @click="sure" type="primary">保存</el-button>
              <el-button @click="editFormShow = false">关闭</el-button>
          </span>
      </el-dialog>
  </div>
</template>
<script>
import { get, post, formPost, postButNoErrorToast } from "../../store/api";
import {showNotify} from '../../plugin/utils-notify'
import { valid } from 'semver';
export default {
    data() {
        var checkNo = (rule, value, callback) => {
            if(!/^[0-9]+$/.test(value)) {
                return callback(new Error('必须为整数'))
            }
            if(value.length > 3) {
                return callback(new Error('最多三位'));
            }
            return callback()
        }
        return {
            searchForm: {
                serviceName: '',
                status: '',
                page: 1,
                pageSize: 10
            },
            page: [],
            subjects: [],
            editFormTitle:'',
            editFormShow: false,
            editForm: {
                serviceId: '',
                seqNo: '',
                serviceName: '',
                serviceContent: '',
                subjects: [],
                vciStatus: 0
            },
            rules: {
                serviceName: [
                    { required: true, message: '请填写服务类型', trigger: 'blur' }
                ],
                seqNo: [
                    { required: true, message: '请填写序号', trigger: 'blur' },
                    { validator: checkNo, trigger: 'blur'}
                ],
                subjects: [
                    { required: true, message: '请选择开票类目', trigger: 'blur' }
                ]
            },
            editSubjects:[],
            currentPage: 1,
            pageSize: 10,
            statusList: [],
            vciStatusList: [
                {
                    text: '是',
                    value: 1
                },
                {
                    text: '否',
                    value: 0
                }
            ]
        }
    },
    mounted() {
        let url = '/api/invoice-web/custom-invoice-subject/qry';
        let param = {
            name: '',
            orderBy: '',
            page: 0,
            pageSize: 0,
            status: 1
        };
        let self = this;
        post(url, param).then(data => {
            self.subjects = data.list;
        })
        get('/api/contract-web/commom/option?enumType=Status').then(data => {
            this.statusList = data
            this.searchForm.status = data[0].value
            this.search()
        })
    },
    methods: {
        search() {
            this.searchForm.page = this.currentPage;
            this.searchForm.pageSize = this.pageSize;
            let url = '/api/contract-web/service-mgr/query-service-types';
            post(url, this.searchForm).then(function(data){
                this.page = data;
            }.bind(this));
        },
        handleSizeChange(value) {
            this.currentPage = 1;
            this.pageSize = value;
            this.search();
        },
        handleCurrentChange(value) {
            this.currentPage = value;
            this.search();
        },
        add() {
            this.editFormShow = true;
            this.editFormTitle = '服务类型新增';
            this.editSubjects = [];
            this.editForm.id = '';
            this.editForm.serviceName = '';
            this.editForm.serviceContent = '';
            this.editForm.seqNo = ''
            this.editForm.subjects = [];
            this.editForm.serviceId = ''
            this.editForm.vciStatus = 0
        },
        edit(model){
            this.editFormShow = true;
            this.editFormTitle = '服务类型修改';
            let tmp = [];
            model.subjects.forEach((value, key)=>{
                tmp.push(value['subjectId'])
            })
            this.editForm.seqNo = model.seqNo
            this.editSubjects = tmp;
            this.editForm.serviceId = model.id;
            this.editForm.serviceName = model.serviceName;
            this.editForm.serviceContent = model.serviceContent;
            this.editForm.vciStatus = model.vciStatus == '1' ? 1 : 0
            this.getSubjects()
        },
        clearForm(next) {
            this.$refs['editForm'].clearValidate()
            next()
        },
        getSubjects() {
            let editSubjects = this.editSubjects;
            let tmp = [];
            let index = 'id';
            this.subjects.forEach((value, key)=>{
                if(editSubjects.indexOf(value[index]) > -1){
                    let obj = {"subjectId": value['id'],"subjectName":value['fullName']};
                    tmp.push(obj);
                }
            })
            this.editForm.subjects = tmp;
        },
        // remove(id){
        //     let param = {
        //         serviceId: id,
        //     };
        //     this.$confirm('是否确定要删除?', '提示', {
        //         confirmButtonText: '确定',
        //         cancelButtonText: '取消',
        //         type: 'warning'
        //     }).then(() => {
        //         let url = "/api/contract-web/service-mgr/delete-service-type";
        //         let selt = this;
        //         post(url, param).then(data => {
        //             showNotify('success','操作成功！')
        //             selt.search();
        //         })
        //     })
        // },
        toggle(a) {
            this.$confirm(`是否确定要${a.status == 1 ? '禁用' : '启用'}?`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                post('/api/contract-web/service-mgr/swich-service-type-status', {
                    serviceId: a.id
                }).then(data => {
                    this.search()
                })
            })
        },
        sure(){
            this.$refs['editForm'].validate(valid => {
                if(valid) {
                    // let editSubjects = this.editSubjects;
                    // let tmp = [];
                    // let index = 'id';
                    // this.subjects.forEach((value, key)=>{
                    //     if(editSubjects.indexOf(value[index]) > -1){
                    //         let obj = {"subjectId": value['id'],"subjectName":value['name']};
                    //         tmp.push(obj);
                    //     }
                    // })
                    // this.editForm.subjects = tmp;
                    let selt = this;
                    let url = '';
                    if(this.editForm.serviceId){
                        url = "/api/contract-web/service-mgr/update-service-type";
                    }else{
                        url = "/api/contract-web/service-mgr/create-service-type";
                    }
                    post(url, this.editForm).then(
                        function(data){
                            showNotify('success','操作成功！');
                            selt.editFormShow = false;
                            selt.search();
                        }
                    );
                }
            })
        },
        clear() {
          this.searchForm.serviceName = ''
          this.searchForm.status = ''
        },
     }
}
</script>
<style scoped>
.r_main {
  padding: 30px 10px;
  background-color: #fff;
}
.form {
  margin-top: 20px;
}

.in_input{
    width: 200px;
}
.form_foot {
  display: block;
  padding: 50px 0 0 820px;
}
.form_foot button {
  margin: 0 30px 0;
}
.form_head {
  margin-top: 20px;
  font-size: 24px;
  color: #333;
}
.table {
  margin-top: 20px;
}
.page{
  margin-top: 30px;
  display: flex;
  justify-content: space-around;
}
.dpage{
    margin-top: 30px;
}
.mr20 {
    margin-right: 20px;
}
</style>

