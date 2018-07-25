<template>
  <div class="r_main">
    <el-form :inline="true" label-width="80px">
        <el-form-item label="服务类型">
            <el-input v-model="searchForm.serviceName" class="in_input" placeholder="请输入名称"></el-input>
            <span style="padding-left :20px;" >
                <el-button type="primary" @click="search">查询</el-button><el-button type="warning" @click="clear">清除</el-button>
            </span>
        </el-form-item>
     
    </el-form>

    <el-button size="small" @click="add">新增</el-button>

    <el-table :data="page.list" style="width: 100%;margin-top: 20px;">
        <el-table-column prop="id" label="ID" ></el-table-column>
        <el-table-column prop="serviceName" label="服务类型"></el-table-column>
        <el-table-column prop="serviceContent" label="服务类型内容"></el-table-column>
        <el-table-column label="开票类目">
            <template slot-scope="scope">
                <template v-for="(item, index) in scope.row.subjects">
                    <div> {{ item.subjectName }}</div>
                </template>
            </template>
        </el-table-column>
		<el-table-column align="center" label="操作" width="160">
			<template slot-scope="scope">
				<el-button @click="edit(scope.row)" type="text" size="medium" style="padding:0;">修改</el-button>
                <el-button @click="remove(scope.row.id)" type="text" size="medium" style="padding:0;">删除</el-button>
            </template>
		</el-table-column>
    </el-table>

    <ayg-pagination v-if="page.total" 
        :total="page.total"
        v-on:handleSizeChange="handleSizeChange"
        v-on:handleCurrentChange="handleCurrentChange" 
        :currentPage="currentPage">
    </ayg-pagination>

    <el-dialog :title="editFormTitle"  :visible.sync="editFormShow" width="70%">
        <el-form label-width="120px" :rules="rules" :model="editForm">
            <el-form-item label="服务类型" prop="serviceName">
                <el-input v-model="editForm.serviceName" class="f_input"></el-input>
            </el-form-item>
            <el-form-item label="备注：" prop="serviceContent">
				<el-input type="textarea" :rows="5" placeholder="请输入内容" v-model="editForm.serviceContent">
				</el-input>
			</el-form-item>
            
            <el-form-item label="开票类目" prop="inv">
            <el-select
                v-model="editSubjects"
                multiple
                filterable
                style="width: 500px"
                placeholder="请选择开票类目">
                <el-option
                    v-for="item in subjects"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                >
                </el-option>
            </el-select>
            </el-form-item>
        </el-form>
          <span class="form_footer" slot="footer">
              <el-button @click="sure" type="primary">保存</el-button>
              <el-button @click="editFormShow = false" type="warning">关闭</el-button>
          </span>
      </el-dialog>
  </div>
</template>
<script>
import { get, post, formPost, postButNoErrorToast } from "../../store/api";
import {showNotify} from '../../plugin/utils-notify'
export default {
    data() {
        return {
            searchForm: {
                serviceName: '',
                page: 1,
                pageSize: 10
            },
            page: [],
            subjects: [],
            editFormTitle:'',
            editFormShow: false,
            editForm: {
                serviceId: '',
                serviceName: '',
                serviceContent: '',
                subjects: [],
            },
            editSubjects:[],
            currentPage: 1,
            pageSize: 10,
        }
    },

    created() {
        this.search()
    },

    mounted() {
        let url = '/api/invoice-web/custom-invoice-subject/qry';
        let param = {
            name: '',
            orderBy: '',
            page: 0,
            pageSize: 0
        };
        let self = this;
        post(url, param).then(data => {
            self.subjects = data.list;
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
            this.editForm.subjects = [];
        },
        edit(model){
            this.editFormShow = true;
            this.editFormTitle = '服务类型修改';
            let tmp = [];
            model.subjects.forEach((value, key)=>{
                tmp.push(value['subjectId'])
            })
            this.editSubjects = tmp;
            this.editForm.serviceId = model.id;
            this.editForm.serviceName = model.serviceName;
            this.editForm.serviceContent = model.serviceContent;
        },
        remove(id){
            let param = {
                serviceId: id,
            };
            this.$confirm('是否确定要删除?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                let url = "/api/contract-web/service-mgr/delete-service-type";
                let selt = this;
                post(url, param).then(data => {
                    showNotify('success','操作成功！')
                    selt.search();
                })
            })
        },
        sure(){
            let editSubjects = this.editSubjects;
            let tmp = [];
            let index = 'id';
            this.subjects.forEach((value, key)=>{
                if(editSubjects.indexOf(value[index]) > -1){
                    let obj = {"subjectId": value['id'],"subjectName":value['name']};
                    tmp.push(obj);
                }
            })
            this.editForm.subjects = tmp;
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
        },

        clear() {
          this.searchForm.serviceName = ''
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
</style>

