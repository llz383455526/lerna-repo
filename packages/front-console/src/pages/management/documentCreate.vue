<template>

    <div class="bg-white p15">
        <el-form :model="documentForm" :rules="rules" ref="documentForm" label-width="200px" class="demo-contractForm">
            <el-form-item label="标题" prop="title">
                <el-input class="input-container" v-model="documentForm.title"></el-input>
            </el-form-item>

            <el-form-item label="是否显示" prop="display">
                <el-select class="input-container" v-model="documentForm.display" placeholder="请选择">
                    <el-option label="是" value="1"></el-option>
                    <el-option label="否" value="0"></el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="优先级" prop="orderSeq">
                <el-input class="input-container" v-model="documentForm.orderSeq"></el-input>
            </el-form-item>

            <el-form-item label="正文" prop="content">
                <el-input class="input-container" v-model="documentForm.content"></el-input>
            </el-form-item>

            <!--<el-form-item label="正文" prop="content">
                <div class="editor">
                    <quill-editor
                        v-model="documentForm.content"
                        ref="myQuillEditor"
                        :options="editorOption">
                    </quill-editor>
                </div>
            </el-form-item>-->

            <el-form-item>
                <el-button type="primary" @click="submitForm('documentForm')">保存</el-button>
                <el-button @click="backToList">取消</el-button>
            </el-form-item>

        </el-form>

    </div>

</template>

<script>
	/*import 'quill/dist/quill.core.css'
	import 'quill/dist/quill.snow.css'
	import 'quill/dist/quill.bubble.css'

	import { quillEditor } from 'vue-quill-editor'*/

    import { post, get } from "../../store/api";

	import { showNotify } from '../../plugin/utils-notify'

    import _ from 'lodash'

    export default {
    	created() {
            let documentId = this.$route.query.id

            if(documentId) {
            	this.documentId = documentId
                this.getDetail(documentId)
            }else {
            	this.documentForm.orderSeq = '100'
            }
        },
	    /*components: {
		    quillEditor
	    },*/
        data() {
    		return {
			    documentId: '',
                documentForm: {
	                title: '',
	                display: '',
	                orderSeq: '',
	                content: ''
                },
			    rules: {
				    title: [
					    {required: true, message: '请填写标题', trigger: 'blur'}
				    ],
				    display: [
					    {required: true, message: '请选择是否显示', trigger: 'change'}
				    ],
				    orderSeq: [
					    {required: true, message: '请填写优先级', trigger: 'blur'}
				    ],
				    content: [
					    {required: true, message: '请填写正文', trigger: 'blur'}
				    ],
                },
			    editorOption: {

                }
            }
        },
        methods: {
	        backToList() {
		        this.$router.push('documentList')
	        },
            getDetail(id) {
	            get('/api/sysmgr-web/helpful-document/get-helpful-document-detail', {
		            documentId: id
	            }).then(result => {
		            this.documentForm = {
			            title: result.title,
                        display: result.display,
                        orderSeq: result.orderSeq,
                        content: result.content
		            }
	            })
            },
	        submitForm(formName) {
		        this.$refs[formName].validate(valid => {
			        if (valid) {
			        	let url
                        url = this.documentId ? '/api/sysmgr-web/helpful-document/update-helpful-document' : '/api/sysmgr-web/helpful-document/add-helpful-document'

                        let documentForm = _.cloneDeep(this.documentForm)
                        if(this.documentId) documentForm.documentId = this.documentId

                        post(url, documentForm)
                            .then(result => {
	                            showNotify('success', this.documentId ? '编辑成功！' : '创建成功！')
                                this.backToList()
                            })
			        }else {
				        showNotify('error', '请检查输入项错误！')
			        }
		        })
            }
        }
    }
</script>

<style lang="scss" scoped>

    .main-container {
        background-color:#fff;
        padding:15px;
    }

    .input-container {
        width: 600px;
        margin-bottom: 0;
    }

    .editor {
        line-height: initial;
    }

</style>
















