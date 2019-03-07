<template>
    <div class="main">
        <div class="title">C端客户管理</div>
        <el-form :model="form" :inline="true" size="small" ref="form">
            <el-form-item label="姓名" prop="name">
                <el-input v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item label="手机" prop="mobile">
                <el-input v-model="form.mobile"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="query">查询</el-button>
            </el-form-item>
        </el-form>
        <router-link to="addConsumer">
            <el-button type="primary">新增</el-button>
        </router-link>
        <el-button type="primary" @click="show = true">导入</el-button>
        <el-table :data="tableList.list">
            <el-table-column label="ID" prop="id"></el-table-column>
            <el-table-column label="姓名" prop="name"></el-table-column>
            <el-table-column label="电话" prop="mobile"></el-table-column>
            <el-table-column label="状态" prop="stateName"></el-table-column>
            <el-table-column label="来源" prop="customSource"></el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <router-link class="c0283fb" :to="`addConsumer?id=${scope.row.id}`" tag="span">编辑</router-link>
                    <el-button type="text" @click="deleteConsumer(scope.row.id)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <ayg-pagination
            v-if="tableList.total"
            :total="tableList.total"
            v-on:handleSizeChange="sizeChange"
            v-on:handleCurrentChange="query"
            :currentPage="currentPage">
        </ayg-pagination>
        <el-dialog title="导入" :visible.sync="show" @open="pro = 0" width="800px">
            <div class="dbox">
                <div class="ditem">
                    <div>下载模板文件：</div>
                    <div>
                        <a class="abtn" href="/api/sysmgr-web/client-user/download-client-user-import-template" download="C端客户导入模版.xlsx" target="_blank">下载模板</a>
                        <div>请先下载C端客户导入模版</div>
                    </div>
                </div>
                <div class="ditem">
                    <div>上传文件导入：</div>
                    <div>
                        <el-upload
                            class="form_input"
                            action=""
                            :auto-upload="false"
                            :on-change="upload"
                            :multiple="false"
                            :show-file-list="false"
                            accept=".xlsx, .xls">
                            <div class="up_icon">
                                <div>点击这里上传</div>
                                <div>请上传小于5M的xls或xlsx格式文件</div>
                            </div>
                        </el-upload>
                         <div class="pro_box">
					        <div :style="{ 'width': `${pro}%` }"></div>
				        </div>
        	            <span>{{pro}}%</span>
                    </div>
                </div>
            </div>
            <span slot="footer">
                <el-button size="small" @click="show = false">关闭</el-button>
                <el-button type="primary" size="small" @click="show = false">确定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import { get, post, postWithErrorCallback, formPost } from "../../store/api";
export default {
    data() {
        return {
            form: {
                mobile: '',
                name: '',
                page: 1,
                pageSize: 10
            },
            tableList: {},
            show: false,
            pro: 0,
            frame: '',
            isEnd: true,
            date: 0
        }
    },
    mounted() {
        this.query()
    },
    methods: {
        upload(a) {
            var form = new FormData();
            form.append('fileName', a.name);
            form.append('file', a.raw);
            form.append('targetId', '18')
            form.append('targetType', 'sysmgr-client-user-import')
            formPost('/api/sysmgr-web/file/upload', form).then(data => {
                this.referId = data.referId
                this.progress()
            });
        },
        progress() {
            this.frame = requestAnimationFrame(this.progress)
            if(this.isEnd && (!this.date || this.date < new Date().getTime() - 1000)) {
                this.isEnd = false
                post('/api/sysmgr-web/file/progress', {
                    id: this.referId
                }, true).then(data => {
                    this.isEnd = true
                    this.date = new Date().getTime()
                    this.pro = data.progress
                    if (this.pro == 100) {
                        cancelAnimationFrame(this.frame)
                        if(data.state == 30 || data.state == 20) {
                            this.form.taskId = data.taskId
                            this.show = false
                            if(data.failCount) {
                                this.$alert(data.desc, '错误提示', {
                                    confirmButtonText: '确定',
                                    type: 'warning',
                                    callback: () => {
                                        this.query()
                                    }
                                })
                            }
                            else {
                                this.query()
                            }
                        }
                        if(data.state == 40) {
                            this.$message.error(data.desc)
                        }
                    }
                })
            }
        },
        query(a) {
            if(isNaN(a)) {
                a = 1
            }
            this.form.page = a
            post('/api/sysmgr-web/client-user/list', this.form).then(data => {
                this.tableList = data
            })
        },
        sizeChange(a) {
            this.form.pageSize = a
            this.query()
        },
        deleteConsumer(id) {
            this.$confirm('是否确定要删除此客户?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                post('/api/sysmgr-web/client-user/delete', { id }).then(data => {
                    this.$message({
                        type: 'success',
                        message: '删除客户成功！'
                    })
                    this.query()
                })
            }).catch(() => {})
        }
    }
}
</script>
<style scoped>
.main {
    margin: 15px;
    padding: 15px;
    background-color: #fff;
}
.title {
    margin-bottom: 20px;
}
.dbox {
    font-size: 14px;
    color: #666666;
}
.ditem {
    overflow: hidden;
    margin-bottom: 35px;
}
.ditem > div {
    float: left;
}
.abtn {
    display: inline-block;
    width: 80px;
    height: 22px;
    font-size: 12px;
    color: #666666;
    text-decoration: none;
    background-image: url(../../image/download.png);
    background-size: 10px 10px;
    background-repeat: no-repeat;
    background-position: 7px center;
    border: 1px solid #D9D9D9;
    border-radius: 4px;
    text-indent: 22px;
    line-height: 20px;
}
.abtn + div {
    font-size: 12px;
    color: #999;
    margin-top: 5px;
}
.up_icon {
    width: 228px;
    height: 124px;
    background-image: url(../../image/upload.png);
    background-size: 41px 33px;
    background-position: center 20px;
    background-repeat: no-repeat;
    padding-top: 70px;
    border: 1px solid #D9D9D9;
}
.up_icon > div:nth-child(1) {
    text-align: center;
    font-size: 12px;
    color: #666666;
}
.up_icon > div:nth-child(2) {
    font-size: 12px;
    color: #999;
    margin-top: 5px;
}
.pro_box {
	position: relative;
	display: inline-block;
	width: 193px;
	height: 10px;
	border: 1px solid #E9E9E9;
	border-radius: 5px;
	margin-top: 6px;
}
.pro_box > div {
	position: absolute;
	top: 1px;
	left: 0;
	height: 8px;
	border-radius: 4px;
	background-color: #108EE9;
}
.pro_box + span {
	margin-top: 6px;
	font-size: 12px;
	color: #999999;
}
.c0283fb {
    color: #0283fb;
    cursor: pointer;
}
</style>
